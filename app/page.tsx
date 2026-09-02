'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Crosshair,
  Database,
  ExternalLink,
  Flag,
  Gauge,
  LockKeyhole,
  Map,
  PackageCheck,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Swords,
  Target,
  Telescope,
  TimerReset,
  Trophy,
  UserRound,
  WandSparkles,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  accountStats,
  activitySnapshot,
  baselineClaims,
  confirmedDefaults,
  gearItems,
  grindBreakers,
  hardcorePreflight,
  loadoutPlans,
  moonsItems,
  phases,
  skillPlans,
  slayerMasters,
  slayerTaskPlans,
  slayerUpgrades,
  supplyPlans,
  sources,
  type GearItem,
  type Goal,
  type Risk,
  type SlayerTaskVerdict,
} from '@/lib/roadmap-data';

const STORAGE_KEY = 'shadytron-roadbook-v1';
const HISCORE_CACHE_KEY = 'shadytron-roadbook-hiscores-v1';
const HISCORE_REFRESH_MS = 30 * 60 * 1000;
const HISCORE_VISIBILITY_REFRESH_MS = 5 * 60 * 1000;

type LiveHiscoreSkill = {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
};

type LiveHiscores = {
  name: string;
  fetchedAt: string;
  skills: LiveHiscoreSkill[];
};

type HiscoreStatus = 'idle' | 'refreshing' | 'ready' | 'error';

const riskMeta: Record<
  Risk,
  { label: string; className: string; short: string }
> = {
  'status-safe': {
    label: 'HC-status-safe',
    short: 'Status-safe',
    className: 'border-emerald-300/25 bg-emerald-300/8 text-emerald-200',
  },
  danger: {
    label: 'Dangerous',
    short: 'Danger',
    className: 'border-rose-300/25 bg-rose-300/8 text-rose-200',
  },
  deathbank: {
    label: 'Danger + deathbank',
    short: 'Deathbank',
    className: 'border-red-300/30 bg-red-300/10 text-red-200',
  },
  conditional: {
    label: 'Conditional protection',
    short: 'Conditional',
    className: 'border-orange-300/25 bg-orange-300/8 text-orange-200',
  },
  wilderness: {
    label: 'Wilderness',
    short: 'Wilderness',
    className: 'border-fuchsia-300/25 bg-fuchsia-300/8 text-fuchsia-200',
  },
  noncombat: {
    label: 'Non-combat',
    short: 'Non-combat',
    className: 'border-slate-300/20 bg-slate-300/7 text-slate-300',
  },
  mixed: {
    label: 'Mixed death rules',
    short: 'Mixed',
    className: 'border-amber-300/25 bg-amber-300/8 text-amber-200',
  },
  planned: {
    label: 'Planned · verify later',
    short: 'Planned',
    className: 'border-violet-300/25 bg-violet-300/8 text-violet-200',
  },
};

const gearFilters = [
  'All',
  'Current',
  'Melee',
  'Ranged',
  'Magic',
  'Utility',
  'Raid reward',
] as const;

const moonGroups = [
  {
    name: 'Blood Moon',
    tint: 'blood',
    items: moonsItems.slice(0, 4),
  },
  {
    name: 'Blue Moon',
    tint: 'blue',
    items: moonsItems.slice(4, 8),
  },
  {
    name: 'Eclipse Moon',
    tint: 'eclipse',
    items: moonsItems.slice(8, 12),
  },
] as const;

const pivotGrinds = [
  'Moons of Peril',
  'Dragon warhammer',
  'Skill training',
] as const;

const slayerVerdicts: SlayerTaskVerdict[] = ['Do', 'Extend', 'Block', 'Skip'];

const slayerVerdictMeta: Record<
  SlayerTaskVerdict,
  { className: string; detail: string }
> = {
  Do: {
    className: 'border-emerald-300/25 bg-emerald-300/8 text-emerald-200',
    detail: 'Run it for route value',
  },
  Extend: {
    className: 'border-primary/30 bg-primary/10 text-primary',
    detail: 'Spend points for more volume',
  },
  Block: {
    className: 'border-rose-300/25 bg-rose-300/8 text-rose-200',
    detail: 'Protect a block slot',
  },
  Skip: {
    className: 'border-slate-300/20 bg-slate-300/7 text-slate-300',
    detail: 'Cancel when it appears',
  },
};

const supplyCategories = [
  'All',
  'Herb',
  'Seed',
  'Log',
  'Secondary',
  'Food',
  'Rune',
  'Ammo',
] as const;

const raidGates = [
  {
    id: 'cox',
    order: 'FIRST',
    name: 'Chambers of Xeric',
    kicker: 'HCIM calibration',
    risk: 'status-safe' as Risk,
    summary:
      'No quest gate. You already know CoX from roughly 300 main-account completions; use prepared 3–5 player runs to calibrate Shadytron’s supplies and HC exits. Deaths cost points and supplies, but not standard solo-HCIM status.',
    needs: [
      'skill-range-75',
      'skill-prayer-70',
      'gear-fire-cape',
      'gear-dragon-defender',
      'gear-warped-sceptre',
      'context-cox-experience',
      'skill-cox-combats',
      'skill-range-magic-80',
      'raid-cox-preflight',
    ],
    target:
      'first HCIM calibration → 10 comfortable clears → prayer-scroll hunt',
  },
  {
    id: 'toa',
    order: 'SECOND',
    name: 'Tombs of Amascut',
    kicker: 'Controlled danger',
    risk: 'deathbank' as Risk,
    summary:
      'Dangerous on the first death at every invocation, including level 0. Access through Beneath Cursed Sands is not readiness.',
    needs: [
      'quest-beneath-cursed-sands',
      'gear-trident',
      'gear-zammy-hasta',
      'skill-toa-combats',
      'raid-toa-kit',
      'raid-toa-practice',
      'raid-toa-preflight',
    ],
    target: '0 → three clean 50s → five clean 100s → repeatable 150s',
  },
  {
    id: 'tob',
    order: 'LAST',
    name: 'Theatre of Blood',
    kicker: 'Team endgame',
    risk: 'deathbank' as Risk,
    summary:
      'Entry Mode is not status-safe. Arrive with external deathless practice, 90s combat, complete switches and an HC-aware team.',
    needs: [
      'quest-tob-chain',
      'skill-tob-combats',
      'gear-tob-kit',
      'raid-tob-practice',
      'raid-tob-team',
    ],
    target: 'Controlled Entry quest run → coached Normal → Avernic',
  },
  {
    id: 'fractured',
    order: 'FUTURE',
    name: 'Fractured Archive',
    kicker: 'Late 2026 · planned',
    risk: 'planned' as Risk,
    summary:
      'While Guthix Sleeps is the expected quest gate. Final HC death rules and rewards must be verified when the raid releases.',
    needs: ['quest-wgs'],
    target: 'Finish WGS now; make no safety assumptions before release.',
  },
];

function RiskBadge({
  risk,
  compact = false,
}: {
  risk: Risk;
  compact?: boolean;
}) {
  const meta = riskMeta[risk];
  return (
    <Badge
      variant="outline"
      className={`h-6 shrink-0 border font-mono text-[9px] uppercase tracking-[0.12em] ${meta.className}`}
    >
      {compact ? meta.short : meta.label}
    </Badge>
  );
}

function MiniProgress({ value }: { value: number }) {
  return (
    <div
      className="relative grid size-12 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${value}%, rgba(255,255,255,.07) 0)`,
      }}
    >
      <div className="grid size-9 place-items-center rounded-full bg-[#19221d] font-mono text-[9px] font-semibold text-foreground">
        {value}%
      </div>
    </div>
  );
}

function ItemCheckbox({
  id,
  checked,
  onToggle,
  label,
  disabled = false,
}: {
  id: string;
  checked: boolean;
  onToggle: (id: string, next?: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <Checkbox
      id={id}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next) => onToggle(id, Boolean(next))}
      aria-label={label}
      className="mt-0.5 size-[18px] rounded-[5px] border-white/15 data-checked:border-primary data-checked:bg-primary"
    />
  );
}

function GoalRow({
  goal,
  done,
  onToggle,
  onOpenTracker,
}: {
  goal: Goal;
  done: boolean;
  onToggle: (id: string, next?: boolean) => void;
  onOpenTracker: () => void;
}) {
  const automatic = goal.auto === 'moons';

  return (
    <article
      className={`group grid gap-3 border-b border-white/[.065] px-1 py-5 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] ${
        done ? 'opacity-65' : ''
      }`}
    >
      <ItemCheckbox
        id={`goal-${goal.id}`}
        checked={done}
        disabled={automatic}
        onToggle={(_, next) => onToggle(goal.id, next)}
        label={`Mark ${goal.title} ${done ? 'incomplete' : 'complete'}`}
      />

      <label
        htmlFor={automatic ? undefined : `goal-${goal.id}`}
        className={automatic ? '' : 'cursor-pointer'}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-semibold leading-5 ${done ? 'line-through decoration-white/30' : ''}`}
          >
            {goal.title}
          </span>
          <Badge
            variant="outline"
            className="h-5 border-white/10 bg-white/[.025] font-mono text-[8px] uppercase tracking-[0.13em] text-muted-foreground"
          >
            {goal.category}
          </Badge>
          {goal.optional && (
            <Badge
              variant="outline"
              className="h-5 border-violet-300/15 bg-violet-300/5 font-mono text-[8px] uppercase tracking-[0.13em] text-violet-200/80"
            >
              Optional
            </Badge>
          )}
        </div>
        <p className="mt-2 max-w-4xl text-[13px] leading-6 text-muted-foreground">
          {goal.detail}
        </p>
        <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-foreground/75">
          <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>{goal.payoff}</span>
        </p>
      </label>

      <div className="flex items-start gap-2 sm:flex-col sm:items-end">
        <RiskBadge risk={goal.risk} compact />
        {automatic ? (
          <Button
            variant="ghost"
            size="xs"
            onClick={onOpenTracker}
            className="h-6 px-2 text-[10px] text-primary"
          >
            Track drops <ChevronRight />
          </Button>
        ) : goal.source ? (
          <Button
            variant="ghost"
            size="icon-xs"
            nativeButton={false}
            render={<a href={goal.source} target="_blank" rel="noreferrer" />}
            aria-label={`Open source for ${goal.title}`}
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink />
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function GearCard({
  item,
  done,
  onToggle,
}: {
  item: GearItem;
  done: boolean;
  onToggle: (id: string, next?: boolean) => void;
}) {
  return (
    <article
      className={`group flex min-h-[164px] flex-col rounded-2xl border p-4 transition-all ${
        done
          ? 'border-emerald-300/15 bg-emerald-300/[.035]'
          : 'border-white/8 bg-white/[.022] hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[.035]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <ItemCheckbox
            id={`gear-${item.id}`}
            checked={done}
            onToggle={(_, next) => onToggle(item.id, next)}
            label={`Mark ${item.name} ${done ? 'not owned' : 'owned'}`}
          />
          <label htmlFor={`gear-${item.id}`} className="cursor-pointer">
            <h3
              className={`text-sm font-semibold leading-5 ${done ? 'text-emerald-100' : ''}`}
            >
              {item.name}
            </h3>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {item.source}
            </p>
          </label>
        </div>
        {done ? (
          <CheckCircle2 className="size-4 shrink-0 text-emerald-300" />
        ) : (
          <RiskBadge risk={item.risk} compact />
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {item.note}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <Badge
          variant="outline"
          className="h-5 border-white/10 bg-black/10 font-mono text-[8px] uppercase tracking-[0.12em] text-foreground/70"
        >
          {item.style}
        </Badge>
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.14em] ${
            item.priority === 'Now'
              ? 'text-primary'
              : item.priority === 'Owned'
                ? 'text-emerald-300'
                : 'text-muted-foreground'
          }`}
        >
          {done ? 'Owned' : item.priority}
        </span>
      </div>
    </article>
  );
}

function xpForLevel(level: number) {
  if (level <= 1) return 0;
  let points = 0;
  for (let index = 1; index < level; index += 1) {
    points += Math.floor(index + 300 * 2 ** (index / 7));
  }
  return Math.floor(points / 4);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    Math.max(0, value),
  );
}

function formatGpPerXp(value: number) {
  if (value === 0) return 'Low direct cost';
  return `≈ ${value} gp/xp`;
}

function formatSyncTime(timestamp: number | null) {
  if (!timestamp) return 'Waiting for first sync';
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp);
}

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(confirmedDefaults),
  );
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('route');
  const [gearFilter, setGearFilter] =
    useState<(typeof gearFilters)[number]>('All');
  const [pivotGrind, setPivotGrind] =
    useState<(typeof pivotGrinds)[number]>('Moons of Peril');
  const [queuedPivot, setQueuedPivot] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState(skillPlans[0].id);
  const [selectedSkillMethodId, setSelectedSkillMethodId] = useState(
    skillPlans[0].methods.find((method) => method.recommended)?.id ??
      skillPlans[0].methods[0].id,
  );
  const [skillTarget, setSkillTarget] = useState(skillPlans[0].target);
  const [slayerVerdict, setSlayerVerdict] =
    useState<SlayerTaskVerdict>('Block');
  const [slayerMasterId, setSlayerMasterId] = useState(slayerMasters[0].id);
  const [selectedLoadoutId, setSelectedLoadoutId] = useState(
    loadoutPlans[0].id,
  );
  const [supplyCategory, setSupplyCategory] =
    useState<(typeof supplyCategories)[number]>('All');
  const [liveHiscores, setLiveHiscores] = useState<LiveHiscores | null>(null);
  const [hiscoreLastFetchedAt, setHiscoreLastFetchedAt] = useState<number | null>(
    null,
  );
  const [hiscoreStatus, setHiscoreStatus] =
    useState<HiscoreStatus>('idle');
  const [hiscoreError, setHiscoreError] = useState<string | null>(null);
  const hiscoreLastFetchedAtRef = useRef<number | null>(null);

  const refreshHiscores = async () => {
    setHiscoreStatus('refreshing');
    setHiscoreError(null);

    try {
      const response = await fetch('/api/hiscores', { cache: 'no-store' });
      const payload = (await response.json()) as LiveHiscores & {
        error?: string;
      };

      if (!response.ok || !payload?.name || !Array.isArray(payload.skills)) {
        throw new Error(payload?.error ?? 'Hiscores are unavailable right now.');
      }

      const fetchedAt = Date.parse(payload.fetchedAt);
      setLiveHiscores(payload);
      const syncTime = Number.isFinite(fetchedAt) ? fetchedAt : Date.now();
      hiscoreLastFetchedAtRef.current = syncTime;
      setHiscoreLastFetchedAt(syncTime);
      setHiscoreStatus('ready');
      window.localStorage.setItem(
        HISCORE_CACHE_KEY,
        JSON.stringify({ payload, savedAt: Date.now() }),
      );
    } catch (error) {
      setHiscoreStatus('error');
      setHiscoreError(
        error instanceof Error ? error.message : 'Hiscores are unavailable right now.',
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    try {
      const cached = window.localStorage.getItem(HISCORE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          payload?: LiveHiscores;
          savedAt?: number;
        };
        if (
          parsed.payload?.name &&
          Array.isArray(parsed.payload.skills) &&
          typeof parsed.savedAt === 'number'
        ) {
          setLiveHiscores(parsed.payload);
          hiscoreLastFetchedAtRef.current = parsed.savedAt;
          setHiscoreLastFetchedAt(parsed.savedAt);
          setHiscoreStatus('ready');
        }
      }
    } catch {
      // A blocked/corrupt hiscore cache should never block the roadbook.
    }

    const sync = () => {
      if (!cancelled) void refreshHiscores();
    };

    sync();
    const interval = window.setInterval(sync, HISCORE_REFRESH_MS);
    const onVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        (!hiscoreLastFetchedAtRef.current ||
          Date.now() - hiscoreLastFetchedAtRef.current >
            HISCORE_VISIBILITY_REFRESH_MS)
      ) {
        sync();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
    // The refresh cadence is intentionally fixed for the lifetime of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          completed?: string[];
          pivotGrind?: (typeof pivotGrinds)[number];
          queuedPivot?: string | null;
          selectedSkillId?: string;
          selectedSkillMethodId?: string;
          skillTarget?: number;
          slayerVerdict?: SlayerTaskVerdict;
          slayerMasterId?: string;
          selectedLoadoutId?: string;
          supplyCategory?: (typeof supplyCategories)[number];
        };
        if (Array.isArray(parsed.completed)) {
          setCompleted(new Set([...confirmedDefaults, ...parsed.completed]));
        }
        if (
          pivotGrinds.includes(
            parsed.pivotGrind as (typeof pivotGrinds)[number],
          )
        ) {
          setPivotGrind(parsed.pivotGrind as (typeof pivotGrinds)[number]);
        }
        if (typeof parsed.queuedPivot === 'string') {
          setQueuedPivot(parsed.queuedPivot);
        }
        const savedSkill = skillPlans.find(
          (skill) => skill.id === parsed.selectedSkillId,
        );
        if (savedSkill) {
          setSelectedSkillId(savedSkill.id);
          setSkillTarget(
            typeof parsed.skillTarget === 'number'
              ? Math.min(99, Math.max(savedSkill.current, parsed.skillTarget))
              : savedSkill.target,
          );
          const savedMethod = savedSkill.methods.find(
            (method) => method.id === parsed.selectedSkillMethodId,
          );
          setSelectedSkillMethodId(
            savedMethod?.id ??
              savedSkill.methods.find((method) => method.recommended)?.id ??
              savedSkill.methods[0].id,
          );
        }
        if (
          slayerVerdicts.includes(parsed.slayerVerdict as SlayerTaskVerdict)
        ) {
          setSlayerVerdict(parsed.slayerVerdict as SlayerTaskVerdict);
        }
        if (
          slayerMasters.some((master) => master.id === parsed.slayerMasterId)
        ) {
          setSlayerMasterId(parsed.slayerMasterId as string);
        }
        if (
          loadoutPlans.some(
            (loadout) => loadout.id === parsed.selectedLoadoutId,
          )
        ) {
          setSelectedLoadoutId(parsed.selectedLoadoutId as string);
        }
        if (
          supplyCategories.includes(
            parsed.supplyCategory as (typeof supplyCategories)[number],
          )
        ) {
          setSupplyCategory(
            parsed.supplyCategory as (typeof supplyCategories)[number],
          );
        }
      }
    } catch {
      // A blocked/corrupt local store should never block the roadbook.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completed: Array.from(completed),
        pivotGrind,
        queuedPivot,
        selectedSkillId,
        selectedSkillMethodId,
        skillTarget,
        slayerVerdict,
        slayerMasterId,
        selectedLoadoutId,
        supplyCategory,
      }),
    );
  }, [
    completed,
    loaded,
    pivotGrind,
    queuedPivot,
    selectedSkillId,
    selectedSkillMethodId,
    skillTarget,
    slayerVerdict,
    slayerMasterId,
    selectedLoadoutId,
    supplyCategory,
  ]);

  const moonsComplete = moonsItems.every((item) => completed.has(item.id));

  const isDone = (goal: Goal) =>
    goal.auto === 'moons' ? moonsComplete : completed.has(goal.id);

  const toggle = (id: string, forced?: boolean) => {
    setCompleted((previous) => {
      const next = new Set(previous);
      const shouldAdd = forced ?? !next.has(id);
      if (shouldAdd) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const routeGoals = useMemo(
    () =>
      phases.flatMap((phase) => phase.goals.filter((goal) => !goal.optional)),
    [],
  );
  const completedRouteGoals = routeGoals.filter((goal) => isDone(goal)).length;
  const overallProgress = Math.round(
    (completedRouteGoals / Math.max(routeGoals.length, 1)) * 100,
  );

  const current = useMemo(() => {
    for (const phase of phases) {
      const goal = phase.goals.find((item) => !item.optional && !isDone(item));
      if (goal) return { phase, goal };
    }
    return null;
    // completed/moonsComplete intentionally drive this derived cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, moonsComplete]);

  const currentPhaseIndex = current
    ? phases.findIndex((phase) => phase.id === current.phase.id)
    : phases.length - 1;

  const filteredGear = gearItems
    .filter((item) => !moonsItems.some((moon) => moon.id === item.id))
    .filter((item) => gearFilter === 'All' || item.style === gearFilter);

  const liveLevelByName = useMemo(
    () =>
      new Map(
        (liveHiscores?.skills ?? []).map((skill) => [
          skill.name.toLowerCase(),
          skill.level,
        ]),
      ),
    [liveHiscores],
  );
  const liveSkillPlans = useMemo(
    () =>
      skillPlans.map((skill) => ({
        ...skill,
        current: liveLevelByName.get(skill.name.toLowerCase()) ?? skill.current,
      })),
    [liveLevelByName],
  );
  const selectedSkill =
    liveSkillPlans.find((skill) => skill.id === selectedSkillId) ??
    liveSkillPlans[0];
  const selectedSkillMethod =
    selectedSkill.methods.find(
      (method) => method.id === selectedSkillMethodId,
    ) ??
    selectedSkill.methods.find((method) => method.recommended) ??
    selectedSkill.methods[0];
  const effectiveSkillTarget = Math.max(
    selectedSkill.current,
    Math.min(99, skillTarget),
  );
  const skillXpRemaining = Math.max(
    0,
    xpForLevel(effectiveSkillTarget) - xpForLevel(selectedSkill.current),
  );
  const skillHours = skillXpRemaining / selectedSkillMethod.xpPerHour;
  const skillCost = skillXpRemaining * selectedSkillMethod.gpPerXp;
  const skillProgress = Math.min(
    100,
    Math.round(
      (xpForLevel(selectedSkill.current) /
        Math.max(xpForLevel(effectiveSkillTarget), 1)) *
        100,
    ),
  );
  const liveOverall = liveHiscores?.skills.find(
    (skill) => skill.name.toLowerCase() === 'overall',
  );
  const liveAccountStats = accountStats.map(([name, level]) => [
    name,
    liveLevelByName.get(name.toLowerCase()) ?? level,
  ] as const);
  const selectedSlayerMaster =
    slayerMasters.find((master) => master.id === slayerMasterId) ??
    slayerMasters[0];
  const filteredSlayerTasks = slayerTaskPlans.filter(
    (task) => task.verdict === slayerVerdict,
  );
  const selectedLoadout =
    loadoutPlans.find((loadout) => loadout.id === selectedLoadoutId) ??
    loadoutPlans[0];
  const filteredSupplies = supplyPlans.filter(
    (supply) => supplyCategory === 'All' || supply.category === supplyCategory,
  );

  const selectSkill = (id: string) => {
    const skill = liveSkillPlans.find((item) => item.id === id);
    if (!skill) return;
    setSelectedSkillId(skill.id);
    setSkillTarget(skill.target);
    setSelectedSkillMethodId(
      skill.methods.find((method) => method.recommended)?.id ??
        skill.methods[0].id,
    );
  };

  const openTab = (tab: string) => {
    setActiveTab(tab);
    window.setTimeout(() => {
      document.getElementById('roadbook-tabs')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  };

  const resetProgress = () => {
    setCompleted(new Set(confirmedDefaults));
    setPivotGrind('Moons of Peril');
    setQueuedPivot(null);
    selectSkill(skillPlans[0].id);
    setSlayerVerdict('Block');
    setSlayerMasterId(slayerMasters[0].id);
    setSelectedLoadoutId(loadoutPlans[0].id);
    setSupplyCategory('All');
    window.localStorage.removeItem(STORAGE_KEY);
    setActiveTab('route');
  };

  const pivotOptions = grindBreakers.filter(
    (pivot) => pivot.grind === pivotGrind,
  );

  const queuedPivotOption = queuedPivot
    ? grindBreakers.find((pivot) => pivot.id === queuedPivot)
    : undefined;

  const markCurrent = () => {
    if (!current) return;
    if (current.goal.auto === 'moons') openTab('arsenal');
    else toggle(current.goal.id, true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 field-grid opacity-35" />

      <header className="sticky top-0 z-40 border-b border-white/8 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-7">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left"
            aria-label="Return to the top of Shadytron's roadbook"
          >
            <span className="grid size-9 place-items-center rounded-lg border border-primary/35 bg-primary/10 text-primary shadow-[inset_0_0_18px_rgba(232,178,74,.08)]">
              <ShieldCheck className="size-5" />
            </span>
            <span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Hardcore roadbook
              </span>
              <span className="block text-sm font-semibold tracking-wide">
                SHADYTRON
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Route
              </span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-primary">
                {overallProgress}%
              </span>
            </div>
            <Badge
              variant="outline"
              className="h-7 border-rose-400/30 bg-rose-400/8 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-rose-300"
            >
              <span className="size-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,.8)]" />
              HCIM active
            </Badge>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 pb-4 pt-5 sm:px-7 sm:pt-7">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,.45fr)]">
          <figure className="cover-art relative min-h-[300px] overflow-hidden rounded-[26px] border border-white/10 shadow-2xl shadow-black/30 lg:min-h-[380px]">
            <img
              src="/og.png"
              alt="Original dark fantasy map with three moons and a golden route leading toward a distant raid horizon"
              className="absolute inset-0 size-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101712] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7">
              <div className="flex flex-wrap gap-2">
                <Badge className="h-6 bg-primary text-primary-foreground">
                  COMBAT 98
                </Badge>
                <Badge
                  variant="outline"
                  className="h-6 border-white/15 bg-black/35 text-white/85 backdrop-blur-md"
                >
                  {(liveOverall?.level ?? 1666).toLocaleString()} total
                </Badge>
                <Badge
                  variant="outline"
                  className="h-6 border-cyan-200/20 bg-cyan-950/35 text-cyan-100 backdrop-blur-md"
                >
                  68 Lunar Chests
                </Badge>
              </div>
              <p className="max-w-sm rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[11px] leading-5 text-white/70 backdrop-blur-md">
                {liveHiscores
                  ? `Live hiscores synced ${formatSyncTime(hiscoreLastFetchedAt)}. `
                  : 'Official snapshot is loading. '}
                Quests, bank and individual log slots remain manually tracked.
              </p>
            </div>
          </figure>

          <section className="quest-panel relative flex min-h-[300px] flex-col overflow-hidden rounded-[26px] border border-white/10 p-5 shadow-2xl shadow-black/25 sm:p-6 lg:min-h-[380px]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
                  Next best move
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
                  {current
                    ? `${current.phase.number} · ${current.phase.title}`
                    : 'Route complete'}
                </p>
              </div>
              <MiniProgress value={overallProgress} />
            </div>

            {current ? (
              <>
                <div className="mt-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <RiskBadge risk={current.goal.risk} compact />
                    <Badge
                      variant="outline"
                      className="h-6 border-white/10 bg-black/10 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {current.goal.category}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                    {current.goal.title}
                  </h1>
                  <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
                    {current.goal.detail}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <div className="mb-4 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/[.045] p-3 text-xs leading-5 text-foreground/80">
                    <Target className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{current.goal.payoff}</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <Button
                      onClick={markCurrent}
                      className="h-10 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      {current.goal.auto === 'moons'
                        ? 'Open drop tracker'
                        : 'Mark complete'}
                      {current.goal.auto === 'moons' ? (
                        <ArrowRight />
                      ) : (
                        <Check />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openTab('route')}
                      className="h-10 rounded-xl border-white/10 bg-white/[.025]"
                    >
                      View phase <Map />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center py-10 text-center">
                <div>
                  <Trophy className="mx-auto size-9 text-primary" />
                  <h1 className="mt-4 text-2xl font-semibold">
                    Roadbook complete
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Time to reassess against live updates and personal goals.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            {
              icon: Sparkles,
              label: 'Current log',
              value: `${moonsItems.filter((item) => completed.has(item.id)).length} / 13 Moons`,
              note: '12 gear + dart slot',
            },
            {
              icon: Crosshair,
              label: 'First HCIM raid',
              value: 'CoX calibration',
              note: '≈300 main KC · status-safe',
            },
            {
              icon: Gauge,
              label: 'Visible stat gaps',
              value: 'Ranged +3 · Prayer +4',
              note: 'Immediate breakpoints',
            },
            {
              icon: Telescope,
              label: '2026 leverage',
              value: 'WGS is close',
              note: 'Herblore +8 · Agility +4',
            },
          ].map((metric) => (
            <article
              key={metric.label}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.022] p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[.045] text-primary">
                <metric.icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                  {metric.label}
                </span>
                <span className="mt-1 block truncate text-sm font-semibold">
                  {metric.value}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                  {metric.note}
                </span>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        id="roadbook-tabs"
        className="relative z-10 scroll-mt-20 border-t border-white/8"
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(String(value))}
          className="mx-auto max-w-[1480px] px-4 py-7 sm:px-7 sm:py-10"
        >
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
                Working roadbook
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                Do the next useful thing. Know the risk.
              </h2>
            </div>
            <TabsList className="h-11 w-full justify-start overflow-x-auto rounded-xl border border-white/8 bg-white/[.035] p-1 lg:w-auto">
              <TabsTrigger value="route" className="h-9 min-w-24 px-3">
                <Map /> Route
              </TabsTrigger>
              <TabsTrigger value="pivots" className="h-9 min-w-24 px-3">
                <Shuffle /> Pivots
              </TabsTrigger>
              <TabsTrigger value="skills" className="h-9 min-w-24 px-3">
                <Gauge /> Skills
              </TabsTrigger>
              <TabsTrigger value="slayer" className="h-9 min-w-24 px-3">
                <Target /> Slayer
              </TabsTrigger>
              <TabsTrigger value="loadouts" className="h-9 min-w-24 px-3">
                <Crosshair /> Loadouts
              </TabsTrigger>
              <TabsTrigger value="arsenal" className="h-9 min-w-24 px-3">
                <PackageCheck /> Arsenal
              </TabsTrigger>
              <TabsTrigger value="raids" className="h-9 min-w-24 px-3">
                <Swords /> Raid gates
              </TabsTrigger>
              <TabsTrigger value="account" className="h-9 min-w-24 px-3">
                <UserRound /> Account
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="route">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <Accordion
                  defaultValue={['moonlit-arsenal']}
                  multiple
                  className="gap-3"
                >
                  {phases.map((phase, index) => {
                    const required = phase.goals.filter(
                      (goal) => !goal.optional,
                    );
                    const doneCount = required.filter((goal) =>
                      isDone(goal),
                    ).length;
                    const progress = Math.round(
                      (doneCount / Math.max(required.length, 1)) * 100,
                    );
                    const complete =
                      required.length > 0 && doneCount === required.length;
                    const active = index === currentPhaseIndex;
                    const queued = index > currentPhaseIndex;

                    return (
                      <AccordionItem
                        key={phase.id}
                        value={phase.id}
                        className={`phase-card phase-card--${phase.accent} overflow-hidden rounded-[22px] border bg-card/55 px-4 sm:px-6 ${
                          active
                            ? 'border-primary/28 shadow-[0_12px_36px_rgba(0,0,0,.18)]'
                            : 'border-white/8'
                        }`}
                      >
                        <AccordionTrigger className="gap-4 py-5 hover:no-underline sm:py-6">
                          <div className="grid w-full gap-4 text-left sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center">
                            <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-black/10 font-mono text-xs text-primary">
                              {phase.number}
                            </span>
                            <span>
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                                  {phase.eyebrow}
                                </span>
                                {complete && (
                                  <Badge className="h-5 bg-emerald-300/12 font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-200">
                                    Complete
                                  </Badge>
                                )}
                                {active && !complete && (
                                  <Badge className="h-5 bg-primary font-mono text-[8px] uppercase tracking-[0.12em] text-primary-foreground">
                                    Active
                                  </Badge>
                                )}
                                {queued && (
                                  <Badge
                                    variant="outline"
                                    className="h-5 border-white/10 bg-white/[.02] font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground"
                                  >
                                    <LockKeyhole /> Queued
                                  </Badge>
                                )}
                              </span>
                              <span className="mt-1 block text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                                {phase.title}
                              </span>
                              <span className="mt-1.5 block max-w-3xl text-xs leading-5 text-muted-foreground sm:text-[13px]">
                                {phase.summary}
                              </span>
                            </span>
                            <span className="mr-6 hidden items-center gap-3 sm:flex">
                              <span className="text-right">
                                <span className="block font-mono text-[9px] text-muted-foreground">
                                  {doneCount}/{required.length}
                                </span>
                                <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground/70">
                                  goals
                                </span>
                              </span>
                              <MiniProgress value={progress} />
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="mb-2 flex items-start gap-3 rounded-xl border border-primary/12 bg-primary/[.035] p-4">
                            <Flag className="mt-0.5 size-4 shrink-0 text-primary" />
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-primary">
                                Exit gate
                              </p>
                              <p className="mt-1 text-xs leading-5 text-foreground/80">
                                {phase.exitGate}
                              </p>
                            </div>
                          </div>
                          <div>
                            {phase.goals.map((goal) => (
                              <GoalRow
                                key={goal.id}
                                goal={goal}
                                done={isDone(goal)}
                                onToggle={toggle}
                                onOpenTracker={() => openTab('arsenal')}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
                <section className="rounded-[22px] border border-emerald-300/12 bg-emerald-300/[.035] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-emerald-200/70">
                        Route principle
                      </p>
                      <h3 className="mt-1 text-base font-semibold">
                        Raid before perfect gear.
                      </h3>
                    </div>
                    <WandSparkles className="size-5 text-emerald-300" />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Your main-account CoX experience means the first HCIM run is
                    a calibration exercise, not a mechanics lesson. Moons gear,
                    Piety, thralls, Fire Cape and 75–80-ish combats are enough
                    to start with a trusted team; Bowfa, DWH and 87 Slayer can
                    improve the experience without delaying it.
                  </p>
                </section>

                <section className="rounded-[22px] border border-white/8 bg-white/[.022] p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                    Parallel engines
                  </p>
                  <div className="mt-4 space-y-4">
                    {[
                      [
                        'Herblore',
                        'Contracts + herb runs + Kingdom + lamps',
                        '57 → 65 → 78',
                      ],
                      [
                        'Crafting',
                        'Seaweed + sand; never stop the pipeline',
                        '60 → 61 → 70 → 90+',
                      ],
                      [
                        'Construction',
                        'Mahogany Homes between combat grinds',
                        '51 → 70 → 83/84',
                      ],
                      [
                        'Slayer',
                        'Train combat through task-only upgrades',
                        '66 → 69 → 85 → 87',
                      ],
                    ].map(([name, method, target]) => (
                      <div
                        key={name}
                        className="border-b border-white/6 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold">{name}</span>
                          <span className="font-mono text-[9px] text-primary">
                            {target}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                          {method}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[22px] border border-rose-300/15 bg-rose-300/[.035] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-300" />
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-rose-300/80">
                        The red-line rule
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        A teaching boss is not automatically safe. Scurrius,
                        Royal Titans, Gauntlet, Vorkath, Zulrah, ToA Entry and
                        ToB Entry can all end the status. Every red card gets a
                        preflight.
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="pivots">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <section className="rounded-[26px] border border-primary/15 bg-primary/[.035] p-5 shadow-2xl shadow-black/15 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">
                          ANTI-BURNOUT CIRCUIT
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/[.025] text-muted-foreground"
                        >
                          Same destination · different lane
                        </Badge>
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                        Swap the activity. Keep the destination.
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                        When a grind starts feeling like a tax, take one bounded
                        pivot. Every card below changes the activity while still
                        paying into Shadytron’s raid route. Queue one for your
                        next session, then return to the main route when the
                        capsule is complete.
                      </p>
                    </div>
                    <Shuffle className="hidden size-8 shrink-0 text-primary sm:block" />
                  </div>

                  <div className="mt-6 flex max-w-full gap-2 overflow-x-auto pb-1">
                    {pivotGrinds.map((grind) => (
                      <Button
                        key={grind}
                        variant={pivotGrind === grind ? 'secondary' : 'outline'}
                        onClick={() => setPivotGrind(grind)}
                        className={`h-10 shrink-0 rounded-xl px-4 text-xs ${
                          pivotGrind === grind
                            ? 'border-primary/25 bg-primary/15 text-primary'
                            : 'border-white/10 bg-white/[.02]'
                        }`}
                      >
                        {grind}
                      </Button>
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    Current grind:{' '}
                    <span className="text-primary">{pivotGrind}</span>
                  </p>
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                  {pivotOptions.map((pivot) => {
                    const queued = queuedPivot === pivot.id;
                    return (
                      <article
                        key={pivot.id}
                        className={`flex min-h-[330px] flex-col rounded-[22px] border p-5 transition-all sm:p-6 ${
                          queued
                            ? 'border-primary/35 bg-primary/[.06] shadow-[0_14px_40px_rgba(0,0,0,.18)]'
                            : 'border-white/8 bg-card/55 hover:border-white/15 hover:bg-card/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className="h-6 border-white/10 bg-white/[.025] font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"
                            >
                              {pivot.lane}
                            </Badge>
                            <RiskBadge risk={pivot.risk} compact />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                            {pivot.duration}
                          </span>
                        </div>

                        <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                          {pivot.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-primary/85">
                          {pivot.trigger}
                        </p>
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          {pivot.action}
                        </p>

                        <div className="mt-4 rounded-xl border border-emerald-300/10 bg-emerald-300/[.035] p-3">
                          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-200/70">
                            Why it still counts
                          </p>
                          <p className="mt-1.5 text-xs leading-5 text-emerald-100/80">
                            {pivot.payoff}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {pivot.feeds.map((feed) => (
                            <span
                              key={feed}
                              className="rounded-full border border-white/8 bg-white/[.025] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground"
                            >
                              {feed}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                          <Button
                            variant={queued ? 'secondary' : 'outline'}
                            onClick={() =>
                              setQueuedPivot(queued ? null : pivot.id)
                            }
                            className={`h-9 rounded-xl text-xs ${
                              queued
                                ? 'bg-primary/15 text-primary hover:bg-primary/20'
                                : 'border-white/10 bg-white/[.025]'
                            }`}
                          >
                            {queued ? <Check /> : <Shuffle />}
                            {queued ? 'Queued next' : 'Queue this pivot'}
                          </Button>
                          {pivot.source && (
                            <a
                              href={pivot.source}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[.05] hover:text-primary"
                              aria-label={`Open source for ${pivot.title}`}
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                <section className="rounded-[22px] border border-cyan-200/12 bg-cyan-200/[.025] p-5">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <TimerReset className="size-4" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em]">
                      Queued next
                    </p>
                  </div>
                  {queuedPivotOption ? (
                    <>
                      <h3 className="mt-4 text-lg font-semibold">
                        {queuedPivotOption.title}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {queuedPivotOption.duration} · {queuedPivotOption.lane}
                      </p>
                      <p className="mt-3 text-xs leading-5 text-foreground/75">
                        Finish the capsule, bank, then return to the Route tab
                        with the new progress deposit.
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQueuedPivot(null)}
                        className="mt-3 h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                      >
                        Clear queue <RotateCcw />
                      </Button>
                    </>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      Nothing queued. Pick a grind above, then queue one finite
                      lane for the next time your main activity feels stale.
                    </p>
                  )}
                </section>

                <section className="rounded-[22px] border border-white/8 bg-white/[.022] p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                    The three-part rotation ritual
                  </p>
                  <div className="mt-4 space-y-4">
                    {[
                      [
                        '01',
                        'Set the cap',
                        'One task, one quest, 4–8 KC, or 45–90 minutes.',
                      ],
                      [
                        '02',
                        'Make a deposit',
                        'End with a drop, level, quest reward or supply batch.',
                      ],
                      [
                        '03',
                        'Return deliberately',
                        'Come back to the main grind only if it still feels fun.',
                      ],
                    ].map(([number, title, detail]) => (
                      <div key={number} className="flex gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-primary/15 bg-primary/[.04] font-mono text-[9px] text-primary">
                          {number}
                        </span>
                        <div>
                          <p className="text-xs font-semibold">{title}</p>
                          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                            {detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[22px] border border-rose-300/15 bg-rose-300/[.035] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-rose-300" />
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-rose-300/80">
                        HCIM guardrail
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        A pivot is a change of activity, not permission to take
                        a risk you have not rehearsed. Dangerous cards still
                        need the same preflight, abort call and empty deathbank.
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)_320px]">
              <section className="rounded-[24px] border border-white/9 bg-card/60 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-primary">
                      Skill map
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">
                      Route breakpoints
                    </h2>
                  </div>
                  <Gauge className="size-5 text-primary" />
                </div>
                <p className="mt-3 px-1 text-xs leading-5 text-muted-foreground">
                  Pick a skill to estimate the next useful level. Values are
                  planning ranges, not promises—rates change with attention,
                  gear and world conditions.
                </p>
                <div className="mt-5 space-y-1.5">
                  {liveSkillPlans.map((skill) => {
                    const active = selectedSkill.id === skill.id;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => selectSkill(skill.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? 'border-primary/30 bg-primary/[.08] text-primary'
                            : 'border-transparent bg-white/[.02] text-foreground/75 hover:border-white/10 hover:bg-white/[.045]'
                        }`}
                      >
                        <span className="text-xs font-semibold">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] tabular-nums">
                          {skill.current} → {skill.target}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[24px] border border-primary/15 bg-primary/[.03] p-5 shadow-2xl shadow-black/15 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        COST-CONSCIOUS CALCULATOR
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-white/[.025] text-muted-foreground"
                      >
                        {hiscoreStatus === 'ready'
                          ? `Live hiscores · ${formatSyncTime(hiscoreLastFetchedAt)}`
                          : 'Live hiscores · connecting'}
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => void refreshHiscores()}
                        disabled={hiscoreStatus === 'refreshing'}
                        className="h-6 rounded-lg border-white/10 bg-white/[.025] px-2 text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw
                          className={
                            hiscoreStatus === 'refreshing' ? 'animate-spin' : ''
                          }
                        />{' '}
                        Sync now
                      </Button>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                      {selectedSkill.name} training plan
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {selectedSkill.current} → {effectiveSkillTarget} ·{' '}
                      {selectedSkill.targetLabel}
                    </p>
                    <p
                      className={`mt-2 text-[10px] ${hiscoreStatus === 'error' ? 'text-amber-200' : 'text-muted-foreground'}`}
                      aria-live="polite"
                    >
                      {hiscoreStatus === 'error'
                        ? `Auto-sync paused: ${hiscoreError ?? 'try again shortly.'}`
                        : 'Auto-syncs every 30 minutes while this page is open.'}
                    </p>
                  </div>
                  <div className="grid size-16 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/[.06] font-mono text-xs text-primary">
                    {skillProgress}%
                  </div>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${skillProgress}%` }}
                  />
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-4">
                  {[
                    ['XP remaining', formatNumber(skillXpRemaining)],
                    [
                      'Est. hours',
                      skillHours < 0.1 ? '<0.1' : skillHours.toFixed(1),
                    ],
                    [
                      'Direct cost',
                      skillCost === 0 ? 'Low' : `${formatNumber(skillCost)} gp`,
                    ],
                    ['Selected lane', selectedSkillMethod.routeValue],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/8 bg-black/10 p-3"
                    >
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold tabular-nums">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                      Target level
                    </p>
                    <p className="mt-1 text-xs text-foreground/75">
                      Use the next gate by default, or model a higher comfort
                      target.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      selectedSkill.target,
                      Math.min(99, selectedSkill.target + 5),
                    ].map((target, index) => (
                      <Button
                        key={`${target}-${index}`}
                        variant={
                          effectiveSkillTarget === target ? 'secondary' : 'outline'
                        }
                        onClick={() => setSkillTarget(target)}
                        className={`h-9 rounded-xl px-3 text-xs ${
                          effectiveSkillTarget === target
                            ? 'bg-primary/15 text-primary hover:bg-primary/20'
                            : 'border-white/10 bg-white/[.025]'
                        }`}
                      >
                        {index === 0 ? 'Next gate' : 'Stretch'} · {target}
                      </Button>
                    ))}
                    <input
                      aria-label={`Custom ${selectedSkill.name} target level`}
                      type="number"
                      min={selectedSkill.current}
                      max={99}
                      value={effectiveSkillTarget}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isFinite(next)) {
                          setSkillTarget(
                            Math.min(99, Math.max(selectedSkill.current, next)),
                          );
                        }
                      }}
                      className="h-9 w-16 rounded-xl border border-white/10 bg-black/15 px-2 text-center font-mono text-xs text-foreground outline-none ring-primary/50 focus:ring-2"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-primary">
                        Choose the lane
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        Best value for this breakpoint
                      </h3>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {formatGpPerXp(selectedSkillMethod.gpPerXp)}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {selectedSkill.methods.map((method) => {
                      const active = selectedSkillMethod.id === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedSkillMethodId(method.id)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? 'border-primary/35 bg-primary/[.07] shadow-[0_10px_28px_rgba(0,0,0,.14)]'
                              : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/[.035]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-sm font-semibold">
                              {method.name}
                            </span>
                            {method.recommended && (
                              <Badge className="h-5 bg-emerald-300/12 font-mono text-[8px] uppercase tracking-[0.11em] text-emerald-200">
                                Best value
                              </Badge>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="font-mono text-[9px] text-primary">
                              {formatNumber(method.xpPerHour)} XP/h
                            </span>
                            <RiskBadge risk={method.risk} compact />
                            <span className="font-mono text-[9px] text-muted-foreground">
                              {formatGpPerXp(method.gpPerXp)}
                            </span>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-muted-foreground">
                            {method.detail}
                          </p>
                          <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-foreground/75">
                            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
                            <span>{method.routeValue}</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                <section className="rounded-[22px] border border-emerald-300/12 bg-emerald-300/[.035] p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-emerald-200/70">
                    Route deposit
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">
                    {selectedSkill.targetLabel}
                  </h3>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {selectedSkill.gate}
                  </p>
                </section>

                <section className="rounded-[22px] border border-primary/14 bg-primary/[.035] p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Shuffle className="size-4" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em]">
                      Anti-burnout tie-in
                    </p>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {selectedSkill.pivotNote}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => openTab('pivots')}
                    className="mt-4 h-9 rounded-xl border-white/10 bg-white/[.025] text-xs"
                  >
                    Open pivot deck <ChevronRight />
                  </Button>
                </section>

                <section className="rounded-[22px] border border-white/8 bg-white/[.022] p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                    How to read the estimate
                  </p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    XP/h is a realistic planning range. Direct cost is a rough
                    GP-per-XP lens, excluding drops, clue value, existing bank
                    supplies and opportunity cost. Prefer the recommended lane
                    when it also advances a quest, Slayer level or raid supply.
                  </p>
                </section>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="slayer">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="space-y-5">
                <section className="rounded-[26px] border border-primary/15 bg-primary/[.035] p-5 shadow-2xl shadow-black/15 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">
                          SLAYER COMMAND CENTER
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/[.025] text-muted-foreground"
                        >
                          Gear-aware task pool
                        </Badge>
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                        Turn every task into a raid deposit.
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                        This is the Slayer layer for Shadytron’s current kit:
                        imbued Slayer helm, zombie axe + dragon defender, RCB,
                        Mystic/Ahrim/Karil/Verac options and warped sceptre. The
                        verdicts assume 66 Slayer and combat ≈98, with no whip,
                        trident, DWH or Bowfa yet.
                      </p>
                    </div>
                    <Target className="hidden size-8 shrink-0 text-primary sm:block" />
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {slayerMasters.map((master) => {
                      const active = selectedSlayerMaster.id === master.id;
                      return (
                        <button
                          key={master.id}
                          type="button"
                          onClick={() => setSlayerMasterId(master.id)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? 'border-primary/35 bg-primary/[.08] shadow-[0_10px_28px_rgba(0,0,0,.14)]'
                              : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/[.035]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-sm font-semibold">
                              {master.name}
                            </span>
                            {active && (
                              <Check className="size-4 text-primary" />
                            )}
                          </div>
                          <p className="mt-2 font-mono text-[9px] uppercase tracking-[.12em] text-primary">
                            {master.status}
                          </p>
                          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                            {master.requirement}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/8 bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[.16em] text-primary">
                        Current master call
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedSlayerMaster.name} ·{' '}
                        {selectedSlayerMaster.status}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {selectedSlayerMaster.detail}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      nativeButton={false}
                      render={
                        <a
                          href={selectedSlayerMaster.source}
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                      aria-label={`Open source for ${selectedSlayerMaster.name}`}
                      className="self-start text-muted-foreground hover:text-primary sm:self-center"
                    >
                      <ExternalLink />
                    </Button>
                  </div>
                </section>

                <section className="rounded-[26px] border border-white/9 bg-card/60 p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[.18em] text-primary">
                        Task decisions
                      </p>
                      <h3 className="mt-1 text-xl font-semibold">
                        What to do when the streak rolls
                      </h3>
                      <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
                        Blocks are master-specific and should protect slots you
                        would cancel almost every time. Low-weight bad tasks are
                        cheaper to skip; keep your points for high-frequency
                        drains and revisit the list after MM2, WGS or major
                        weapon drops.
                      </p>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">
                      {filteredSlayerTasks.length} calls in this view
                    </span>
                  </div>

                  <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1">
                    {slayerVerdicts.map((verdict) => {
                      const active = slayerVerdict === verdict;
                      const meta = slayerVerdictMeta[verdict];
                      const count = slayerTaskPlans.filter(
                        (task) => task.verdict === verdict,
                      ).length;
                      return (
                        <Button
                          key={verdict}
                          variant={active ? 'secondary' : 'outline'}
                          onClick={() => setSlayerVerdict(verdict)}
                          className={`h-10 shrink-0 rounded-xl px-3 text-xs ${
                            active
                              ? 'border-primary/25 bg-primary/15 text-primary'
                              : 'border-white/10 bg-white/[.02]'
                          }`}
                        >
                          {verdict}
                          <span className="ml-1 font-mono text-[9px] opacity-60">
                            {count}
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {filteredSlayerTasks.map((task) => {
                      const meta = slayerVerdictMeta[task.verdict];
                      return (
                        <article
                          key={task.id}
                          className="rounded-2xl border border-white/8 bg-black/10 p-4 transition-colors hover:border-white/15 hover:bg-white/[.025]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold">
                                {task.task}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`h-5 border font-mono text-[8px] uppercase tracking-[.12em] ${meta.className}`}
                              >
                                {task.verdict}
                              </Badge>
                            </div>
                            {task.source && (
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                nativeButton={false}
                                render={
                                  <a
                                    href={task.source}
                                    target="_blank"
                                    rel="noreferrer"
                                  />
                                }
                                aria-label={`Open source for ${task.task}`}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <ExternalLink />
                              </Button>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <RiskBadge risk={task.risk} compact />
                            <span className="font-mono text-[9px] uppercase tracking-[.11em] text-muted-foreground">
                              {meta.detail}
                            </span>
                          </div>
                          <p className="mt-3 text-[11px] leading-5 text-primary/85">
                            {task.condition}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            {task.reason}
                          </p>
                          <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-foreground/75">
                            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
                            <span>{task.routeValue}</span>
                          </p>
                          <p className="mt-3 font-mono text-[8px] uppercase tracking-[.12em] text-muted-foreground/70">
                            {task.master}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                <section className="rounded-[22px] border border-primary/15 bg-primary/[.035] p-5">
                  <div className="flex items-start gap-3">
                    <Trophy className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[.18em] text-primary/80">
                        Point purchase order
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        Fund the route, then the comfort
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {slayerUpgrades.map((upgrade) => {
                      const done = completed.has(upgrade.id);
                      return (
                        <div
                          key={upgrade.id}
                          className={`rounded-xl border p-3 ${
                            done
                              ? 'border-emerald-300/15 bg-emerald-300/[.04]'
                              : upgrade.priority === 'Now'
                                ? 'border-primary/20 bg-primary/[.04]'
                                : 'border-white/8 bg-black/10'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <ItemCheckbox
                              id={`slayer-upgrade-${upgrade.id}`}
                              checked={done}
                              onToggle={(_, next) => toggle(upgrade.id, next)}
                              label={`Mark ${upgrade.name} ${done ? 'incomplete' : 'complete'}`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-semibold">
                                  {upgrade.name}
                                </p>
                                <span
                                  className={`font-mono text-[9px] uppercase tracking-[.1em] ${
                                    done
                                      ? 'text-emerald-300'
                                      : upgrade.priority === 'Now'
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                  }`}
                                >
                                  {done ? 'Owned' : upgrade.priority}
                                </span>
                              </div>
                              <p className="mt-1 font-mono text-[9px] text-primary/80">
                                {upgrade.cost} · {upgrade.requirement}
                              </p>
                              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                                {upgrade.detail}
                              </p>
                              <p className="mt-2 text-[10px] leading-4 text-foreground/75">
                                <span className="text-primary">→</span>{' '}
                                {upgrade.payoff}
                              </p>
                            </div>
                            {upgrade.source && (
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                nativeButton={false}
                                render={
                                  <a
                                    href={upgrade.source}
                                    target="_blank"
                                    rel="noreferrer"
                                  />
                                }
                                aria-label={`Open source for ${upgrade.name}`}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <ExternalLink />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[22px] border border-emerald-300/12 bg-emerald-300/[.035] p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[.18em] text-emerald-200/70">
                    Route handoff
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">
                    Nieve → 100 combat → Duradel/Kuradal
                  </h3>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Use Konar for point bursts, brimstone keys or a deliberately
                    useful location task. Keep ordinary XP on the default master
                    until your block list and skip bank are funded.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => openTab('skills')}
                    className="mt-4 h-9 rounded-xl border-white/10 bg-white/[.025] text-xs"
                  >
                    Open Slayer calculator <ChevronRight />
                  </Button>
                </section>

                <section className="rounded-[22px] border border-rose-300/15 bg-rose-300/[.035] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-rose-300" />
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[.16em] text-rose-300/80">
                        HCIM task rule
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        A “Do” verdict is a route recommendation, not a promise
                        that the room is safe. Keep food, prayer, escape and a
                        deathbank preflight on every dangerous assignment.
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="loadouts">
            <div className="space-y-6">
              <section className="rounded-[26px] border border-primary/15 bg-primary/[.035] p-5 shadow-2xl shadow-black/15 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        LOADOUT &amp; SUPPLY DECK
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-white/[.025] text-muted-foreground"
                      >
                        Checklist syncs with Arsenal
                      </Badge>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">
                      Stage the bank before you stage the boss.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                      Pick the encounter, tick the exact gear and inventory
                      pieces, then restock the shared supply bank below. Checked
                      owned gear is the same checklist used by Arsenal, so a
                      single update keeps the whole roadbook honest.
                    </p>
                  </div>
                  <Crosshair className="hidden size-8 shrink-0 text-primary sm:block" />
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {loadoutPlans.map((loadout) => {
                    const active = selectedLoadout.id === loadout.id;
                    const ready =
                      loadout.gear.filter(
                        (item) =>
                          item.checklistId && completed.has(item.checklistId),
                      ).length +
                      loadout.inventory.filter(
                        (item) =>
                          item.checklistId && completed.has(item.checklistId),
                      ).length;
                    const total =
                      loadout.gear.length + loadout.inventory.length;
                    return (
                      <button
                        key={loadout.id}
                        type="button"
                        onClick={() => setSelectedLoadoutId(loadout.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? 'border-primary/35 bg-primary/[.08] shadow-[0_10px_28px_rgba(0,0,0,.14)]'
                            : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/[.035]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold">
                            {loadout.name}
                          </span>
                          {active && <Check className="size-4 text-primary" />}
                        </div>
                        <p className="mt-2 font-mono text-[9px] uppercase tracking-[.12em] text-primary">
                          {loadout.eyebrow}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <RiskBadge risk={loadout.risk} compact />
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {ready}/{total} staged
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <section className="rounded-[26px] border border-white/9 bg-card/60 p-5 sm:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[.18em] text-primary">
                        {selectedLoadout.eyebrow}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-[-.03em]">
                        {selectedLoadout.name}
                      </h3>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {selectedLoadout.summary}
                      </p>
                    </div>
                    {selectedLoadout.source && (
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={
                          <a
                            href={selectedLoadout.source}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                        className="h-9 shrink-0 rounded-xl border-white/10 bg-white/[.025] text-xs"
                      >
                        Open encounter guide <ExternalLink />
                      </Button>
                    )}
                  </div>

                  <div className="mt-7 grid gap-6 lg:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-[.16em] text-primary">
                            Equipment check
                          </p>
                          <h4 className="mt-1 text-lg font-semibold">
                            Wear this
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {
                            selectedLoadout.gear.filter(
                              (item) =>
                                item.checklistId &&
                                completed.has(item.checklistId),
                            ).length
                          }{' '}
                          / {selectedLoadout.gear.length}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2">
                        {selectedLoadout.gear.map((item) => {
                          const checked = Boolean(
                            item.checklistId && completed.has(item.checklistId),
                          );
                          return (
                            <label
                              key={item.id}
                              htmlFor={`loadout-gear-${selectedLoadout.id}-${item.id}`}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                                checked
                                  ? 'border-emerald-300/15 bg-emerald-300/[.04]'
                                  : 'border-white/8 bg-black/10 hover:border-white/15'
                              }`}
                            >
                              <ItemCheckbox
                                id={`loadout-gear-${selectedLoadout.id}-${item.id}`}
                                checked={checked}
                                onToggle={(_, next) => {
                                  if (item.checklistId) {
                                    toggle(item.checklistId, next);
                                  }
                                }}
                                label={`Mark ${item.name} ${checked ? 'not ready' : 'ready'}`}
                              />
                              <span className="min-w-0">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-semibold">
                                    {item.name}
                                  </span>
                                  <span className="font-mono text-[8px] uppercase tracking-[.1em] text-primary/75">
                                    {item.slot}
                                  </span>
                                </span>
                                <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                                  {item.note}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-[.16em] text-primary">
                            Inventory check
                          </p>
                          <h4 className="mt-1 text-lg font-semibold">
                            Pack this
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {
                            selectedLoadout.inventory.filter(
                              (item) =>
                                item.checklistId &&
                                completed.has(item.checklistId),
                            ).length
                          }{' '}
                          / {selectedLoadout.inventory.length}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2">
                        {selectedLoadout.inventory.map((item) => {
                          const checked = Boolean(
                            item.checklistId && completed.has(item.checklistId),
                          );
                          return (
                            <label
                              key={item.id}
                              htmlFor={`loadout-inventory-${selectedLoadout.id}-${item.id}`}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                                checked
                                  ? 'border-emerald-300/15 bg-emerald-300/[.04]'
                                  : 'border-white/8 bg-black/10 hover:border-white/15'
                              }`}
                            >
                              <ItemCheckbox
                                id={`loadout-inventory-${selectedLoadout.id}-${item.id}`}
                                checked={checked}
                                onToggle={(_, next) => {
                                  if (item.checklistId) {
                                    toggle(item.checklistId, next);
                                  }
                                }}
                                label={`Mark ${item.name} ${checked ? 'not packed' : 'packed'}`}
                              />
                              <span className="min-w-0">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-semibold">
                                    {item.name}
                                  </span>
                                  {item.quantity && (
                                    <span className="rounded-full border border-primary/15 bg-primary/[.05] px-2 py-0.5 font-mono text-[8px] text-primary">
                                      {item.quantity}
                                    </span>
                                  )}
                                </span>
                                <span className="mt-1 block font-mono text-[8px] uppercase tracking-[.1em] text-primary/75">
                                  {item.slot}
                                </span>
                                <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                                  {item.note}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                  <section className="rounded-[22px] border border-emerald-300/12 bg-emerald-300/[.035] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[.18em] text-emerald-200/70">
                          Preflight
                        </p>
                        <h3 className="mt-1 text-lg font-semibold">
                          Exit gate
                        </h3>
                      </div>
                      <ShieldCheck className="size-5 text-emerald-300" />
                    </div>
                    <ul className="mt-4 space-y-3">
                      {selectedLoadout.requirements.map((requirement) => (
                        <li
                          key={requirement}
                          className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"
                        >
                          <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-300" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-[22px] border border-rose-300/15 bg-rose-300/[.035] p-5">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-300" />
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[.18em] text-rose-300/80">
                          Abort call
                        </p>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          {selectedLoadout.abort}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[22px] border border-white/8 bg-white/[.022] p-5">
                    <p className="font-mono text-[8px] uppercase tracking-[.18em] text-muted-foreground">
                      Why this order
                    </p>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      The loadouts deliberately use owned gear first. Moon sets,
                      Fire Cape, prayer scrolls, trident and Bowfa are upgrades
                      that raise comfort; none should be an excuse to bring an
                      untested inventory into dangerous content.
                    </p>
                  </section>
                </aside>
              </div>

              <section className="rounded-[26px] border border-white/9 bg-card/60 p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[.18em] text-primary">
                      Supply bank
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-[-.03em]">
                      Grow the inputs that make the route safe.
                    </h3>
                    <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
                      Use the best-source lane for routine restocking and the
                      backup lane for a bounded refresh. Ranarrs are
                      intentionally first-class here: farming contracts + herb
                      runs are the cheapest way to keep prayer potions ahead of
                      bossing.
                    </p>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">
                    {filteredSupplies.length} supply lanes
                  </span>
                </div>

                <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1">
                  {supplyCategories.map((category) => {
                    const active = supplyCategory === category;
                    const count =
                      category === 'All'
                        ? supplyPlans.length
                        : supplyPlans.filter(
                            (supply) => supply.category === category,
                          ).length;
                    return (
                      <Button
                        key={category}
                        variant={active ? 'secondary' : 'outline'}
                        onClick={() => setSupplyCategory(category)}
                        className={`h-9 shrink-0 rounded-xl px-3 text-xs ${
                          active
                            ? 'border-primary/25 bg-primary/15 text-primary'
                            : 'border-white/10 bg-white/[.02]'
                        }`}
                      >
                        {category}
                        <span className="ml-1 font-mono text-[9px] opacity-60">
                          {count}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {filteredSupplies.map((supply) => {
                    const done = completed.has(supply.checklistId);
                    return (
                      <article
                        key={supply.id}
                        className={`rounded-2xl border p-4 transition-colors ${
                          done
                            ? 'border-emerald-300/15 bg-emerald-300/[.04]'
                            : 'border-white/8 bg-black/10 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <ItemCheckbox
                            id={`supply-bank-${supply.id}`}
                            checked={done}
                            onToggle={(_, next) =>
                              toggle(supply.checklistId, next)
                            }
                            label={`Mark ${supply.name} ${done ? 'not stocked' : 'stocked'}`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold">
                                {supply.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`h-5 font-mono text-[8px] uppercase tracking-[.11em] ${
                                  supply.priority === 'Now'
                                    ? 'border-primary/25 bg-primary/[.06] text-primary'
                                    : supply.priority === 'Core'
                                      ? 'border-emerald-300/20 bg-emerald-300/[.04] text-emerald-200'
                                      : 'border-white/10 bg-white/[.02] text-muted-foreground'
                                }`}
                              >
                                {supply.priority}
                              </Badge>
                            </div>
                            <p className="mt-1 font-mono text-[8px] uppercase tracking-[.1em] text-primary/75">
                              {supply.category}
                            </p>
                            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                              {supply.use}
                            </p>
                            <div className="mt-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[.035] p-3">
                              <p className="font-mono text-[8px] uppercase tracking-[.12em] text-emerald-200/70">
                                Best source
                              </p>
                              <p className="mt-1 text-[10px] leading-4 text-emerald-100/80">
                                {supply.bestSource}
                              </p>
                            </div>
                            <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
                              <span className="text-primary">Backup:</span>{' '}
                              {supply.backupSource}
                            </p>
                            <p className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-foreground/75">
                              <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
                              <span>{supply.routeValue}</span>
                            </p>
                          </div>
                          {supply.source && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              nativeButton={false}
                              render={
                                <a
                                  href={supply.source}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              }
                              aria-label={`Open source for ${supply.name}`}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink />
                            </Button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="arsenal">
            <section className="moon-tracker overflow-hidden rounded-[26px] border border-white/10 p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-cyan-200 text-cyan-950">
                      ACTIVE LOG
                    </Badge>
                    <RiskBadge risk="danger" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    Moons of Peril · 13 slots
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    The public log only shows 68 Lunar Chests—not which drops
                    you own. Mark the 12 equipment uniques and atlatl dart here;
                    progress saves on this device.
                  </p>
                </div>
                <div className="min-w-[240px] rounded-2xl border border-white/10 bg-black/15 p-4">
                  <Progress
                    value={Math.round(
                      (moonsItems.filter((item) => completed.has(item.id))
                        .length /
                        13) *
                        100,
                    )}
                  >
                    <ProgressLabel>Green log</ProgressLabel>
                    <ProgressValue>
                      {() =>
                        `${moonsItems.filter((item) => completed.has(item.id)).length} / 13`
                      }
                    </ProgressValue>
                  </Progress>
                  <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                    Once a four-piece set is complete, skip that Moon if pure
                    green-log speed is the goal.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 lg:grid-cols-3">
                {moonGroups.map((group) => {
                  const count = group.items.filter((item) =>
                    completed.has(item.id),
                  ).length;
                  return (
                    <article
                      key={group.name}
                      className={`moon-set moon-set--${group.tint} rounded-2xl border border-white/8 bg-black/12 p-4`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                            Set progress
                          </p>
                          <h4 className="mt-1 text-sm font-semibold">
                            {group.name}
                          </h4>
                        </div>
                        <span className="grid size-9 place-items-center rounded-full border border-white/10 font-mono text-[10px]">
                          {count}/4
                        </span>
                      </div>
                      <div className="space-y-2">
                        {group.items.map((item) => {
                          const done = completed.has(item.id);
                          return (
                            <label
                              key={item.id}
                              htmlFor={`moon-${item.id}`}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-xs transition-colors ${
                                done
                                  ? 'border-emerald-300/14 bg-emerald-300/[.045] text-emerald-100'
                                  : 'border-white/6 bg-white/[.02] hover:bg-white/[.04]'
                              }`}
                            >
                              <ItemCheckbox
                                id={`moon-${item.id}`}
                                checked={done}
                                onToggle={(_, next) => toggle(item.id, next)}
                                label={`Mark ${item.name} ${done ? 'not owned' : 'owned'}`}
                              />
                              <span>{item.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>

              <label
                htmlFor="moon-moon-atlatl-dart"
                className={`mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                  completed.has('moon-atlatl-dart')
                    ? 'border-emerald-300/14 bg-emerald-300/[.045]'
                    : 'border-white/8 bg-black/10 hover:bg-white/[.025]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ItemCheckbox
                    id="moon-moon-atlatl-dart"
                    checked={completed.has('moon-atlatl-dart')}
                    onToggle={(_, next) => toggle('moon-atlatl-dart', next)}
                    label="Toggle Atlatl dart collection-log slot"
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      Atlatl dart
                    </span>
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      The 13th log slot; not one of the 12 equipment uniques.
                    </span>
                  </span>
                </span>
                <Sparkles className="size-4 text-cyan-200" />
              </label>
            </section>

            <section className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                    Boss & gear checklist
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Build three styles without dead-end grinds.
                  </h3>
                </div>
                <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/8 bg-white/[.025] p-1">
                  {gearFilters.map((filter) => (
                    <Button
                      key={filter}
                      variant={gearFilter === filter ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setGearFilter(filter)}
                      className={`shrink-0 px-3 ${gearFilter === filter ? 'bg-white/10' : ''}`}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGear.map((item) => (
                  <GearCard
                    key={item.id}
                    item={item}
                    done={completed.has(item.id)}
                    onToggle={toggle}
                  />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="raids">
            <section className="grid gap-4 lg:grid-cols-2">
              {raidGates.map((raid) => {
                const done = raid.needs.filter((id) =>
                  completed.has(id),
                ).length;
                const readiness = Math.round((done / raid.needs.length) * 100);
                return (
                  <article
                    key={raid.id}
                    className="raid-card relative overflow-hidden rounded-[24px] border border-white/9 bg-card/60 p-5 sm:p-6"
                  >
                    <div className="absolute right-0 top-0 h-px w-2/3 bg-gradient-to-l from-primary/50 to-transparent" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="h-6 bg-primary text-primary-foreground">
                            {raid.order}
                          </Badge>
                          <RiskBadge risk={raid.risk} compact />
                        </div>
                        <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                          {raid.kicker}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                          {raid.name}
                        </h3>
                      </div>
                      <MiniProgress value={readiness} />
                    </div>

                    <p className="mt-4 text-[13px] leading-6 text-muted-foreground">
                      {raid.summary}
                    </p>

                    <div className="mt-5 rounded-xl border border-white/8 bg-black/10 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground">
                          Tracked gates
                        </span>
                        <span className="font-mono text-[9px] text-primary">
                          {done}/{raid.needs.length}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {raid.needs.map((id) => (
                          <span
                            key={id}
                            title={id}
                            className={`h-1.5 flex-1 rounded-full ${
                              completed.has(id) ? 'bg-primary' : 'bg-white/8'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 border-t border-white/7 pt-4 text-xs leading-5 text-foreground/80">
                      <Flag className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{raid.target}</span>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-[24px] border border-rose-300/15 bg-rose-300/[.025] p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="size-5 text-rose-300" />
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-rose-200">
                        Dangerous-content preflight
                      </p>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                      Ten checks before one life enters.
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      This is a reusable checklist, not a claim that any
                      dangerous boss has become safe. Re-run it for Moons, quest
                      bosses, Vorkath, Zulrah, GWD, Gauntlet, ToA and ToB.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-7 border-rose-300/25 bg-rose-300/8 text-rose-200"
                  >
                    {
                      hardcorePreflight.filter(([id]) => completed.has(id))
                        .length
                    }
                    /10 ready
                  </Badge>
                </div>

                <div className="mt-6 grid gap-2 md:grid-cols-2">
                  {hardcorePreflight.map(([id, label]) => {
                    const done = completed.has(id);
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-xs leading-5 transition-colors ${
                          done
                            ? 'border-emerald-300/13 bg-emerald-300/[.04] text-emerald-100/90'
                            : 'border-white/7 bg-black/10 text-muted-foreground hover:bg-white/[.025]'
                        }`}
                      >
                        <ItemCheckbox
                          id={id}
                          checked={done}
                          onToggle={toggle}
                          label={`Toggle preflight item: ${label}`}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <aside className="space-y-4">
                <section className="rounded-[22px] border border-primary/14 bg-primary/[.035] p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Gauge className="size-4" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em]">
                      Panic HP formula
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6">
                    Largest damage before the next reliable eat/teleport + lag
                    margin
                  </p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Include already-launched projectiles, same-tick stacks,
                    poison/venom and environmental damage. Ring of life is only
                    a backup—it cannot teleport through a lethal hit.
                  </p>
                </section>

                <section className="rounded-[22px] border border-white/8 bg-white/[.022] p-5">
                  <div className="flex items-center gap-2">
                    <TimerReset className="size-4 text-primary" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                      Practice ladder
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      ['LMS', 'status-safe'],
                      ['Fight Caves', 'status-safe'],
                      ['CoX learners', 'status-safe'],
                      ['Royal Titans', 'danger'],
                      ['Regular Gauntlet', 'danger'],
                      ['Corrupted Gauntlet', 'danger'],
                      ['ToA 0 → 150+', 'deathbank'],
                      ['ToB Entry → Normal', 'deathbank'],
                    ].map(([label, risk], index) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="grid size-5 place-items-center rounded-full border border-white/10 font-mono text-[8px] text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-xs">{label}</span>
                        <RiskBadge risk={risk as Risk} compact />
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </section>
          </TabsContent>

          <TabsContent value="account">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-6">
                <section className="rounded-[24px] border border-white/9 bg-card/60 p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-rose-300 text-rose-950">
                          HCIM
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/[.025] text-muted-foreground"
                        >
                          {hiscoreStatus === 'ready'
                            ? `Live hiscores · ${formatSyncTime(hiscoreLastFetchedAt)}`
                            : 'Live hiscores · connecting'}
                        </Badge>
                      </div>
                      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                        Shadytron
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Combat 98 · Total level{' '}
                        {(liveOverall?.level ?? 1666).toLocaleString()} ·{' '}
                        {formatNumber(liveOverall?.xp ?? 27192499)} XP · HCIM
                        rank {formatNumber(liveOverall?.rank ?? 30735)}
                      </p>
                    </div>
                    <a
                      href="https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/hiscorepersonal?user1=Shadytron"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.025] px-3 text-xs font-medium transition-colors hover:bg-white/[.05]"
                    >
                      Open hiscores <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                    {liveAccountStats.map(([name, level]) => (
                      <div
                        key={name}
                        className="rounded-xl border border-white/7 bg-black/10 px-3 py-3 text-center"
                      >
                        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                          {name}
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                          {level}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        title: 'Immediate',
                        value: '75 Ranged · 70 Prayer',
                        note: '+3 and +4 visible levels',
                      },
                      {
                        title: 'WGS gaps',
                        value: '65 Herblore · 66 Agility',
                        note: '+8 and +4 visible levels',
                      },
                      {
                        title: 'SotE gaps',
                        value: 'Five skills remain below 70',
                        note: 'Optional high-risk Bowfa branch',
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-primary/10 bg-primary/[.03] p-4"
                      >
                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-primary">
                          {card.title}
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {card.value}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {card.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[24px] border border-white/9 bg-card/60 p-5 sm:p-7">
                  <div className="flex items-center gap-2">
                    <Database className="size-4 text-primary" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Visible activity
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {activitySnapshot.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/7 bg-black/10 p-4"
                      >
                        <p className="text-xl font-semibold tabular-nums">
                          {value}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                    No ranked Jad, Vorkath, Zulrah, Gauntlet or raid KC was
                    visible. That means “unranked,” not guaranteed literal zero.
                    Wise Old Man was materially stale, so this app uses Jagex’s
                    official snapshot.
                  </p>
                </section>

                <section className="rounded-[24px] border border-white/9 bg-card/60 p-5 sm:p-7">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                      Manual baseline
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">
                      What you told me is already seeded.
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Hiscores cannot see quests or bank items. Correct any
                      assumption here and the same item updates throughout the
                      roadbook.
                    </p>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {baselineClaims.map(([id, label, note]) => {
                      const done = completed.has(id);
                      return (
                        <label
                          key={id}
                          htmlFor={`baseline-${id}`}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                            done
                              ? 'border-emerald-300/13 bg-emerald-300/[.035]'
                              : 'border-white/7 bg-black/10'
                          }`}
                        >
                          <ItemCheckbox
                            id={`baseline-${id}`}
                            checked={done}
                            onToggle={(_, next) => toggle(id, next)}
                            label={`Toggle baseline claim: ${label}`}
                          />
                          <span>
                            <span className="block text-xs font-semibold">
                              {label}
                            </span>
                            <span className="mt-1 block text-[10px] text-muted-foreground">
                              {note}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="space-y-5">
                <section className="rounded-[22px] border border-cyan-200/12 bg-cyan-200/[.025] p-5">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <BookOpen className="size-4" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em]">
                      Source notes
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-xl border border-white/7 bg-black/10 px-3 py-3 text-xs text-muted-foreground transition-colors hover:bg-white/[.03] hover:text-foreground"
                      >
                        <span>{source.label}</span>
                        <ExternalLink className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] leading-4 text-muted-foreground/80">
                    Route checked 31 Aug 2026. Re-verify death rules and
                    unreleased content before acting; game updates can change
                    the risk model.
                  </p>
                </section>

                <section className="rounded-[22px] border border-white/8 bg-white/[.022] p-5">
                  <div className="flex items-center gap-2">
                    <CircleDot className="size-4 text-primary" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                      Storage
                    </p>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">
                    Progress stays on this device.
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    No login and no public account writes. Your checkboxes are
                    saved locally in this browser.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          className="mt-5 w-full border-rose-300/15 bg-rose-300/[.025] text-rose-200 hover:bg-rose-300/[.06]"
                        />
                      }
                    >
                      <RotateCcw /> Reset to Shadytron baseline
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-white/10 bg-popover">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-rose-300/10 text-rose-300">
                          <AlertTriangle />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                          Reset all tracked progress?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This clears every route, drop, gear and preflight
                          checkbox, then restores only the items and quests you
                          originally confirmed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep progress</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={resetProgress}
                          className="bg-rose-300 text-rose-950 hover:bg-rose-200"
                        >
                          Reset roadbook
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </section>

                <section className="rounded-[22px] border border-amber-300/12 bg-amber-300/[.025] p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber-200">
                        Assumption
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        This route assumes a standard solo Hardcore Ironman.
                        Hardcore Group Ironman death rules differ—most
                        activities listed as status-safe here are not safe for
                        HCGIM lives.
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <footer className="relative z-10 border-t border-white/8 px-4 py-8 sm:px-7">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 text-[10px] leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built for Shadytron · OSRS data and mechanics can change ·
            “Status-safe” never means consequence-free.
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">
            Readiness gates beat bravery.
          </p>
        </div>
      </footer>
    </main>
  );
}
