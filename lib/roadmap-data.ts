export type Risk =
  | 'status-safe'
  | 'danger'
  | 'deathbank'
  | 'conditional'
  | 'wilderness'
  | 'noncombat'
  | 'mixed'
  | 'planned';

export type GoalCategory =
  | 'Quest'
  | 'Skill'
  | 'Slayer'
  | 'Boss'
  | 'Raid'
  | 'Gear'
  | 'Safety';

export type Goal = {
  id: string;
  title: string;
  detail: string;
  payoff: string;
  category: GoalCategory;
  risk: Risk;
  optional?: boolean;
  auto?: 'moons';
  source?: string;
};

export type Phase = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  exitGate: string;
  accent: 'moon' | 'gold' | 'green' | 'cyan' | 'red' | 'violet' | 'slate';
  goals: Goal[];
};

export type GearItem = {
  id: string;
  name: string;
  style: 'Current' | 'Melee' | 'Ranged' | 'Magic' | 'Utility' | 'Raid reward';
  source: string;
  priority: 'Owned' | 'Now' | 'Core' | 'Later' | 'Optional';
  risk: Risk;
  note: string;
  url?: string;
};

export const moonsItems: GearItem[] = [
  {
    id: 'moon-blood-helm',
    name: 'Blood moon helm',
    style: 'Melee',
    source: 'Lunar Chest · Blood Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: '1 of 4 Blood set pieces; defensive melee bridge.',
  },
  {
    id: 'moon-blood-body',
    name: 'Blood moon chestplate',
    style: 'Melee',
    source: 'Lunar Chest · Blood Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Useful, but your fighter torso already covers offensive melee.',
  },
  {
    id: 'moon-blood-legs',
    name: 'Blood moon tassets',
    style: 'Melee',
    source: 'Lunar Chest · Blood Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Strong melee legs before Bandos becomes worth the risk.',
  },
  {
    id: 'moon-macuahuitl',
    name: 'Dual macuahuitl',
    style: 'Melee',
    source: 'Lunar Chest · Blood Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Fast crush option; your zombie axe remains the dependable anchor.',
  },
  {
    id: 'moon-blue-helm',
    name: 'Blue moon helm',
    style: 'Magic',
    source: 'Lunar Chest · Blue Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Magic-accuracy upgrade over mystic.',
  },
  {
    id: 'moon-blue-body',
    name: 'Blue moon chestplate',
    style: 'Magic',
    source: 'Lunar Chest · Blue Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Removes the need to force an Ahrim grind before raids.',
  },
  {
    id: 'moon-blue-legs',
    name: 'Blue moon tassets',
    style: 'Magic',
    source: 'Lunar Chest · Blue Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Comfortable early CoX/ToA magic legs.',
  },
  {
    id: 'moon-blue-spear',
    name: 'Blue moon spear',
    style: 'Magic',
    source: 'Lunar Chest · Blue Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Log piece; powered staff progression matters more for raids.',
  },
  {
    id: 'moon-eclipse-helm',
    name: 'Eclipse moon helm',
    style: 'Ranged',
    source: 'Lunar Chest · Eclipse Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: "Part of the upgrade that solves the current green d'hide gap.",
  },
  {
    id: 'moon-eclipse-body',
    name: 'Eclipse moon chestplate',
    style: 'Ranged',
    source: 'Lunar Chest · Eclipse Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Immediate early-raid ranged armour at 75 Ranged.',
  },
  {
    id: 'moon-eclipse-legs',
    name: 'Eclipse moon tassets',
    style: 'Ranged',
    source: 'Lunar Chest · Eclipse Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'Completes the practical ranged armour bridge.',
  },
  {
    id: 'moon-atlatl',
    name: 'Eclipse atlatl',
    style: 'Ranged',
    source: 'Lunar Chest · Eclipse Moon roll',
    priority: 'Now',
    risk: 'danger',
    note: 'High-value three-tick bridge for early CoX and ToA; needs 75 Ranged.',
  },
  {
    id: 'moon-atlatl-dart',
    name: 'Atlatl dart',
    style: 'Ranged',
    source: 'Lunar Chest',
    priority: 'Now',
    risk: 'danger',
    note: 'The 13th collection-log slot; the other 12 are equipment uniques.',
  },
];

export const phases: Phase[] = [
  {
    id: 'moonlit-arsenal',
    number: '01',
    eyebrow: 'Right now',
    title: 'Moonlit Arsenal',
    summary:
      'Finish the green log you care about while locking in the cheapest guaranteed raid power. Your defender, Neitiznot helm and imbued Slayer helm are already banked; the live gap is ranged setup plus the remaining Moon pieces.',
    exitGate:
      '75 Ranged, 13/13 Moons log, Fire Cape, and core untradeables verified.',
    accent: 'moon',
    goals: [
      {
        id: 'skill-range-75',
        title: 'Raise Ranged 72 → 75',
        detail:
          'Do this before judging the Eclipse set. The armour and atlatl require 75 Ranged, and the atlatl scales well with your already-strong 82 Strength.',
        payoff:
          'Equips the full Eclipse package and unlocks your best immediate ranged bridge.',
        category: 'Skill',
        risk: 'noncombat',
        source: 'https://oldschool.runescape.wiki/w/Eclipse_atlatl',
      },
      {
        id: 'moons-preflight',
        title: 'Standardize the Moons danger preflight',
        detail:
          'High-defence armour, tested teleport, deathbank empty, stable world, full charges, and an abort threshold based on the next possible damage—not a generic HP percentage.',
        payoff:
          'Makes every remaining chest repeatable instead of casual risk creep.',
        category: 'Safety',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Moons_of_Peril/Strategies',
      },
      {
        id: 'moons-green-log',
        title: 'Complete the 13-slot Moons collection log',
        detail:
          'Track 12 equipment uniques plus the atlatl dart below. Duplicate protection applies within each four-piece set. Once one set is complete, skip that Moon if green-log speed is the only objective.',
        payoff:
          'Eclipse ranged bridge, Blue Moon magic bridge, Blood Moon melee options.',
        category: 'Gear',
        risk: 'danger',
        auto: 'moons',
        source: 'https://oldschool.runescape.wiki/w/Lunar_Chest',
      },
      {
        id: 'gear-dragon-defender',
        title: 'Verify dragon defender (already owned)',
        detail:
          'You confirmed this is already owned. Keep it in the default zombie-axe setup and leave the Warriors’ Guild grind off the route.',
        payoff:
          'Large, guaranteed melee accuracy and strength upgrade with the zombie axe.',
        category: 'Gear',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Dragon_defender',
      },
      {
        id: 'gear-fire-cape',
        title: 'Complete Fight Caves for Fire Cape',
        detail:
          'Fight Caves is explicitly HC-status-safe for a standard solo HCIM. Use it to practice prayer discipline and movement under pressure.',
        payoff:
          'Best immediate melee cape and a genuine no-status-risk mechanics school.',
        category: 'Boss',
        risk: 'status-safe',
        source: 'https://oldschool.runescape.wiki/w/TzHaar_Fight_Cave',
      },
      {
        id: 'gear-black-mask',
        title: 'Verify imbued Slayer helm (already owned)',
        detail:
          'You confirmed an imbued Slayer helm. This is already the correct task and bossing head slot; keep the checkbox as a bank audit rather than a future grind.',
        payoff: 'Turns Slayer into the combat-stat and raid-gear engine.',
        category: 'Slayer',
        risk: 'mixed',
        source: 'https://oldschool.runescape.wiki/w/Black_mask',
      },
      {
        id: 'gear-rune-pouch',
        title: 'Obtain or verify rune pouch',
        detail:
          'LMS is HC-status-safe and avoids spending the Slayer points that accelerate unlocks and task management.',
        payoff:
          'Required inventory compression for thralls, raids, and bursting.',
        category: 'Gear',
        risk: 'status-safe',
        source: 'https://oldschool.runescape.wiki/w/Rune_pouch',
      },
      {
        id: 'gear-barrows-gloves',
        title: 'Buy/verify Barrows gloves',
        detail:
          'You reported Recipe for Disaster complete. Buy the gloves if the quest is fully finished; do not let an already-unlocked item remain a hidden gap.',
        payoff: 'One slot that works across all three raid styles.',
        category: 'Gear',
        risk: 'noncombat',
        source: 'https://oldschool.runescape.wiki/w/Barrows_gloves',
      },
      {
        id: 'gear-neitiznot',
        title: 'Verify helm of Neitiznot (already owned)',
        detail:
          'You confirmed this is already owned. Keep the helm as the dependable melee fallback when the Slayer helm bonus is not active.',
        payoff: 'Reliable melee head slot until later upgrades.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/The_Fremennik_Isles',
      },
      {
        id: 'royal-titans-audit',
        title: 'Continue Royal Titans duo for missing scrolls',
        detail:
          'You have 10 KC, no reported luck, and a reliable duo you already trust. Audit the bank and log first, then schedule deliberate duo sessions for Deadeye, Mystic Vigour, crown pieces and Twinflame—not as a hard CoX gate.',
        payoff:
          'Turns a comfortable team into a controlled prayer-scroll and staff upgrade branch.',
        category: 'Boss',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Royal_Titans',
      },
    ],
  },
  {
    id: 'prayer-spellbook',
    number: '02',
    eyebrow: 'Guaranteed power',
    title: 'Prayer & Spellbook Engine',
    summary:
      'Take quest rewards that multiply every later grind: powered spellcasting, greater thralls, Piety, Lunar utility, and ToA access without entering the raid yet.',
    exitGate:
      '70 Prayer/Piety, greater thralls, Lunar utility, warped sceptre, and Beneath Cursed Sands complete.',
    accent: 'gold',
    goals: [
      {
        id: 'quest-path-glouphrie',
        title: 'Verify The Path of Glouphrie (already complete)',
        detail:
          'You confirmed this quest is complete. Leave the quest step checked and use its warped-creature unlock only if you ever need a replacement sceptre.',
        payoff:
          'Inventory-friendly powered-staff bridge for movement-heavy PvM.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/The_Path_of_Glouphrie',
      },
      {
        id: 'gear-warped-sceptre',
        title: 'Verify warped sceptre (already owned)',
        detail:
          'You confirmed the sceptre is already owned. It is enough for prepared early CoX magic and remains a useful movement-casting bridge until trident.',
        payoff: 'Cast-and-move magic without occupying the standard spellbook.',
        category: 'Slayer',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Warped_sceptre',
      },
      {
        id: 'quest-kingdom-divided',
        title: 'Complete A Kingdom Divided',
        detail:
          'Your visible skills meet the listed requirements. Finish the Kourend quest line and collect the Book of the Dead.',
        payoff:
          'Unlocks thralls—one of the largest guaranteed PvM damage upgrades.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/A_Kingdom_Divided',
      },
      {
        id: 'skill-magic-76',
        title: 'Raise Magic 75 → 76',
        detail:
          'One level unlocks Greater Resurrection once A Kingdom Divided is complete.',
        payoff: 'Greater thralls for bosses and raids.',
        category: 'Skill',
        risk: 'noncombat',
      },
      {
        id: 'skill-crafting-61',
        title: 'Raise Crafting 60 → 61',
        detail:
          'This is the only visible skill gap for Lunar Diplomacy. Keep seaweed/sand running because Crafting soon gates MM2 and zenytes too.',
        payoff: 'Unlocks the Lunar quest chain efficiently.',
        category: 'Skill',
        risk: 'noncombat',
      },
      {
        id: 'quest-lunar-diplomacy',
        title: 'Complete Lunar Diplomacy',
        detail:
          'Then immediately follow with Dream Mentor while the quest chain is warm.',
        payoff:
          'Lunar spellbook, Vengeance path, and WGS prerequisite progress.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Lunar_Diplomacy',
      },
      {
        id: 'quest-dream-mentor',
        title: 'Complete Dream Mentor',
        detail:
          'You are already above its combat requirement. Treat the quest boss as dangerous and bring a tested exit.',
        payoff:
          'WGS and Dragon Slayer II prerequisite progress plus Lunar utility.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Dream_Mentor',
      },
      {
        id: 'quest-kings-ransom',
        title: 'King’s Ransom + Knight Waves',
        detail:
          'The quest combat is dangerous; Knight Waves itself is HC-status-safe. Finish the training ground after the quest.',
        payoff: 'Unlocks Piety once Prayer reaches 70.',
        category: 'Quest',
        risk: 'mixed',
        source: 'https://oldschool.runescape.wiki/w/King%27s_Ransom',
      },
      {
        id: 'skill-prayer-70',
        title: 'Raise Prayer 66 → 70',
        detail:
          'Prefer banked bone shards and lower-risk methods. The Wilderness Chaos Altar is efficient XP, but it is not required for an efficient account route.',
        payoff: 'Piety, a larger prayer pool, and safer bossing.',
        category: 'Skill',
        risk: 'noncombat',
        source: 'https://oldschool.runescape.wiki/w/Ironman_Guide/Prayer',
      },
      {
        id: 'quest-beneath-cursed-sands',
        title: 'Complete Beneath Cursed Sands',
        detail:
          'This opens Tombs of Amascut. Access is not readiness—do not enter live-HC ToA just because the door is open.',
        payoff: 'Removes the raid quest gate for later controlled progression.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Beneath_Cursed_Sands',
      },
      {
        id: 'quest-desert-treasure',
        title: 'Complete Desert Treasure I',
        detail:
          'Not needed for first CoX, but Ancient Magicks becomes important for Slayer and eventual ToB utility.',
        payoff: 'Burst/barrage training and later raid utility.',
        category: 'Quest',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Desert_Treasure_I',
      },
    ],
  },
  {
    id: 'guthix-ready',
    number: '03',
    eyebrow: '2026 leverage',
    title: 'Guthix Ready',
    summary:
      'Shadytron is unusually close to While Guthix Sleeps. Finish the short visible skill gaps and prerequisite chain, then choose the Tormented Demons/Royal Titans branches as parallel upgrades—not prerequisites for your first HCIM CoX.',
    exitGate:
      'While Guthix Sleeps complete; demonbane and Royal Titans upgrades remain deliberate parallel branches.',
    accent: 'green',
    goals: [
      {
        id: 'skill-herblore-65',
        title: 'Raise Herblore 57 → 65',
        detail:
          'Run contracts, herb runs and Kingdom continuously; send quest lamps here. This is both the WGS gap and the start of the long 78 Herblore raid target.',
        payoff: 'Clears the WGS skill gate and improves supply independence.',
        category: 'Skill',
        risk: 'noncombat',
      },
      {
        id: 'skill-agility-66',
        title: 'Raise Agility 62 → 66',
        detail:
          'Only four visible levels separate the account from this WGS requirement. Keep 70 as the next sweep for Song of the Elves.',
        payoff: 'Clears the WGS gate and improves run-energy quality of life.',
        category: 'Skill',
        risk: 'noncombat',
      },
      {
        id: 'quest-wgs-prereqs',
        title: 'Finish 180 QP + WGS prerequisite chain',
        detail:
          'Include Defender of Varrock, Dream Mentor and every remaining prerequisite. Path of Glouphrie is already complete on your account; audit the quest journal instead of assuming hiscores can see it.',
        payoff: 'Opens While Guthix Sleeps cleanly.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/While_Guthix_Sleeps',
      },
      {
        id: 'quest-wgs',
        title: 'Complete While Guthix Sleeps',
        detail:
          'Use a boss-specific dangerous-content preflight. This quest unlocks Tormented Demons and is the announced quest gate for the planned Fractured Archive raid.',
        payoff:
          'Tormented Demon weapons now; future-proofs the account for Raids 4.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/While_Guthix_Sleeps',
      },
      {
        id: 'skill-range-77',
        title: 'Raise Ranged 75 → 77',
        detail:
          'Optional demonbane breakpoint for the Scorching bow. It is useful for Tormented Demons/K’ril, but it does not hold back prepared HCIM CoX.',
        payoff: 'Demonbane ranged option and next combat breakpoint.',
        category: 'Skill',
        risk: 'noncombat',
        optional: true,
      },
      {
        id: 'skill-fletching-74',
        title: 'Reach 70 Fletching + pie boost, or 74',
        detail:
          'Optional only if you choose the Scorching bow branch: a +4 dragonfruit-pie boost from 70 can make it, or train directly to 74 for zero boost friction.',
        payoff: 'Lets the first synapse become a Scorching bow.',
        category: 'Skill',
        risk: 'noncombat',
        optional: true,
      },
      {
        id: 'boss-tormented-demons',
        title: 'Begin Tormented Demons',
        detail:
          'Dangerous ordinary deaths. Practice the shield cycles and switches elsewhere if possible, then use fixed entry/abort rules on Shadytron.',
        payoff: 'Tormented synapse and optional burning claws.',
        category: 'Boss',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Tormented_Demon/Strategies',
      },
      {
        id: 'gear-scorching-bow',
        title: 'Create Scorching bow from first synapse',
        detail:
          'Recommended first because its demonbane damage and binding special make K’ril more controlled. The synapse can later be reclaimed by reversing the weapon.',
        payoff: 'Safer Zamorakian spear path and strong demon tasks.',
        category: 'Gear',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Scorching_bow',
      },
      {
        id: 'gear-deadeye',
        title: 'Optional: continue Royal Titans for Deadeye',
        detail:
          'You have 10 KC and a reliable duo. Audit the bank/log, then continue only when the team and abort rules are ready; this prayer is a bridge, not a CoX gate.',
        payoff: 'Strong ranged-prayer bridge before Rigour.',
        category: 'Boss',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Royal_Titans',
      },
      {
        id: 'gear-mystic-vigour',
        title: 'Optional: continue Royal Titans for Mystic Vigour',
        detail:
          'Same duo and audit rule. Mystic Vigour is a useful bridge before Augury, but your existing CoX experience and safe team route do not require it first.',
        payoff: 'Strong magic-prayer bridge before Augury.',
        category: 'Boss',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Royal_Titans',
      },
    ],
  },
  {
    id: 'safe-raider',
    number: '04',
    eyebrow: 'First raid',
    title: 'Safe Raider',
    summary:
      'You already have roughly 300 CoX completions on your main. Treat this as an HCIM calibration phase: learn Shadytron’s supplies, disconnect plan and conservative exits while using the raid experience you already own.',
    exitGate:
      '10 comfortable HCIM CoX completions, stable supplies, and a proven status-safe team protocol—not a first-time raid curriculum.',
    accent: 'cyan',
    goals: [
      {
        id: 'skill-cox-combats',
        title: 'Reach 80 Attack / 85 Strength / 80 Defence',
        detail:
          'Current visible levels are 75 / 82 / 75. These are comfort floors, not a reason to delay your first HCIM CoX; train primarily through Slayer so combat XP also advances whip, trident and task-only drops.',
        payoff: 'Comfortable melee contribution and HC damage margin.',
        category: 'Skill',
        risk: 'mixed',
      },
      {
        id: 'skill-range-magic-80',
        title: 'Reach 80 Ranged and 80 Magic',
        detail:
          'Current visible levels are 72 and 75. Get 75 Ranged for Eclipse/atlatl first; 80/80 is a comfortable contribution floor, not a hard requirement for an experienced CoX player.',
        payoff: 'Reliable three-style raid accuracy.',
        category: 'Skill',
        risk: 'mixed',
      },
      {
        id: 'skill-herblore-78',
        title: 'Raise Herblore toward 78',
        detail:
          '78 supports strong CoX raid potions. A prepared team can cover early learners, so this should progress in parallel—not delay the first raid forever.',
        payoff: 'Self-sufficient raid prep and long-term potion access.',
        category: 'Skill',
        risk: 'noncombat',
        optional: true,
      },
      {
        id: 'raid-cox-preflight',
        title: 'Assemble the starter CoX switch',
        detail:
          'Melee: torso/Blood Moon + zombie axe or macuahuitl + dragon defender. Ranged: Eclipse/atlatl with RCB backup. Magic: Blue Moon/Ahrim’s + warped sceptre. Bring your imbued Slayer helm, Barrows gloves, glory/fury, rune pouch and thralls; agree on HC-aware exits with the team.',
        payoff:
          'A functional HCIM kit without waiting for Bowfa, DWH, or 87 Slayer.',
        category: 'Raid',
        risk: 'status-safe',
        source:
          'https://oldschool.runescape.wiki/w/Chambers_of_Xeric/Strategies',
      },
      {
        id: 'raid-cox-1',
        title: 'Complete first HCIM CoX calibration run',
        detail:
          'Use your existing CoX experience, but make the first Shadytron run intentionally conservative: known team, no speed pressure, fixed teleport slot and an abort call before supplies become critical. Death costs points and supplies but not standard solo-HCIM status.',
        payoff:
          'Measures the account’s real HCIM margins without relearning raid mechanics.',
        category: 'Raid',
        risk: 'status-safe',
        source: 'https://oldschool.runescape.wiki/w/Chambers_of_Xeric',
      },
      {
        id: 'raid-cox-10',
        title: 'Reach 10 comfortable HCIM CoX completions',
        detail:
          'Use the streak to validate supplies, disconnect handling, partner selection and conservative exits. Your main-account mechanics are already established; the goal is repeatable Hardcore execution.',
        payoff:
          'A measured launchpad for scroll hunts and later dangerous raids.',
        category: 'Raid',
        risk: 'status-safe',
      },
      {
        id: 'raid-cox-dex',
        title: 'Begin Dexterous scroll hunt',
        detail:
          'Do not make Rigour a prerequisite for raiding; let status-safe CoX be the place you earn it. Raise Prayer to 74 when the scroll arrives.',
        payoff: 'Rigour, the largest conventional ranged-prayer upgrade.',
        category: 'Raid',
        risk: 'status-safe',
        optional: true,
      },
      {
        id: 'raid-cox-arcane',
        title: 'Add Arcane scroll when it comes',
        detail:
          'Raise Prayer to 77 to use Augury. Mystic Vigour is the bridge while loot luck catches up.',
        payoff: 'Augury and full offensive-prayer coverage.',
        category: 'Raid',
        risk: 'status-safe',
        optional: true,
      },
    ],
  },
  {
    id: 'dangerous-upgrades',
    number: '05',
    eyebrow: 'Upgrade loop',
    title: 'Measured Danger',
    summary:
      'Keep CoX running while Slayer and questing open the high-value dangerous bosses. Take guaranteed or high-impact upgrades; skip prestige grinds that do not materially move the raids plan.',
    exitGate:
      'Trident-class magic, credible stab weapon, stronger ranged package, and practiced dangerous-boss routines.',
    accent: 'red',
    goals: [
      {
        id: 'skill-slayer-69',
        title: 'Raise Slayer 66 → 69',
        detail:
          'Only three levels from the Monkey Madness II Slayer requirement. Keep broader Slayer unlocks and block list efficiency in mind.',
        payoff: 'Starts the MM2/zenyte branch.',
        category: 'Slayer',
        risk: 'danger',
      },
      {
        id: 'skill-crafting-70',
        title: 'Raise Crafting 61 → 70',
        detail:
          'Monkey Madness II needs 70 Crafting. This same seaweed-and-sand engine ultimately supplies fury and zenyte jewellery.',
        payoff: 'Clears MM2 and advances the jewellery pipeline.',
        category: 'Skill',
        risk: 'noncombat',
      },
      {
        id: 'quest-mm2',
        title: 'Complete Monkey Madness II',
        detail:
          'Dangerous quest combat. Confirm 69 Slayer, 70 Crafting and the full prerequisite chain before staging supplies.',
        payoff: 'Demonic gorillas and zenyte jewellery.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Monkey_Madness_II',
      },
      {
        id: 'skill-smithing-70',
        title: 'Raise Smithing 67 → 70',
        detail:
          'Use Giant’s Foundry for the short visible gap. Pair with Crafting 62 and 200 Quest Points for Dragon Slayer II.',
        payoff: 'Dragon Slayer II and Song of the Elves progress.',
        category: 'Skill',
        risk: 'noncombat',
      },
      {
        id: 'quest-ds2',
        title: 'Complete Dragon Slayer II',
        detail:
          'Quest Vorkath and Galvek are dangerous. Treat this as a full boss-prep session, not routine quest cleanup.',
        payoff: 'Vorkath access and Ava’s assembler path.',
        category: 'Quest',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Dragon_Slayer_II',
      },
      {
        id: 'gear-assembler',
        title: 'Obtain Vorkath’s head → Ava’s assembler',
        detail:
          'Wait for roughly 85+ Ranged, strong antifire/supply coverage, and external mechanics practice. Vorkath uses a deathbank: reclaim immediately.',
        payoff: 'Major ranged cape-slot upgrade.',
        category: 'Boss',
        risk: 'deathbank',
        source: 'https://oldschool.runescape.wiki/w/Vorkath/Strategies',
      },
      {
        id: 'skill-slayer-85',
        title: 'Raise Slayer to 85 → abyssal whip',
        detail:
          'The whip is a strong general weapon, but do not delay first CoX for it. Continue the same task engine to 87.',
        payoff: 'Reliable fast melee weapon and ToB stepping stone.',
        category: 'Slayer',
        risk: 'danger',
      },
      {
        id: 'gear-trident',
        title: 'Raise Slayer to 87 → trident of the seas',
        detail:
          'This is the strongest “comfortable raids” Slayer milestone. It is not required for the first CoX learners, but it is a core ToA gate.',
        payoff: 'Real powered-staff DPS and easy movement casting.',
        category: 'Slayer',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Trident_of_the_seas',
      },
      {
        id: 'gear-zenyte-first',
        title: 'Obtain first zenyte from demonic gorillas',
        detail:
          'Dangerous, mechanically busy combat. Suffering is the HC-safety choice; anguish is the direct ranged DPS choice. Decide before crafting.',
        payoff:
          'Either broad defensive safety or immediate raid ranged damage.',
        category: 'Boss',
        risk: 'danger',
        source: 'https://oldschool.runescape.wiki/w/Demonic_gorilla/Strategies',
      },
      {
        id: 'gear-zammy-hasta',
        title: 'Scorching bow K’ril → Zamorakian hasta',
        detail:
          'Attempt only after controlled external practice, 85+ Ranged and 80 Defence. The Scorching bow bind makes the encounter more controlled; ordinary deaths remain fatal to status.',
        payoff: 'Credible ToA stab weapon until fang.',
        category: 'Boss',
        risk: 'danger',
        source:
          'https://oldschool.runescape.wiki/w/K%27ril_Tsutsaroth/Strategies',
      },
      {
        id: 'gear-dwh',
        title: 'Add Dragon Warhammer',
        detail:
          'Shamans now drop it at 1/3,000. Kourend hard makes the Slayer helmet provide protection. Let teammates cover defence reduction in early CoX; do not delay raiding for this.',
        payoff: 'Better small-team and solo CoX defence reduction.',
        category: 'Slayer',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Dragon_warhammer',
      },
      {
        id: 'quest-sote',
        title: 'Complete Song of the Elves',
        detail:
          'Current visible gaps: Agility +8, Construction +19, Farming +1, Herblore +13, Smithing +3; Hunter/Mining/Woodcutting already meet 70. Quest and Gauntlet deaths are dangerous.',
        payoff: 'Prifddinas and optional Bowfa branch.',
        category: 'Quest',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Song_of_the_Elves',
      },
      {
        id: 'gear-bowfa',
        title: 'Optional: Bowfa + six armour seeds',
        detail:
          'Learn Gauntlet outside the live Hardcore first. CG is dangerous. Bowfa is transformative, but it is not a mandatory prison before learner CoX or low-invocation ToA.',
        payoff: 'Enduring ranged package for raids and bosses.',
        category: 'Boss',
        risk: 'danger',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/The_Gauntlet',
      },
      {
        id: 'gear-zulrah-kit',
        title: 'Optional: Zulrah → blowpipe + magic fang',
        detail:
          'Danger plus deathbank. Western Elite offers one conditional daily resurrection; if it procs, teleport immediately. Do not treat that as permission for a second attempt.',
        payoff: 'Fast ranged weapon and toxic trident upgrade.',
        category: 'Boss',
        risk: 'conditional',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/Zulrah',
      },
      {
        id: 'gear-bgs',
        title: 'Later: Graardor → Bandos godsword',
        detail:
          'BGS is the meaningful raid upgrade. Bandos armour is lower urgency because fighter torso and Moon pieces already cover the role.',
        payoff: 'Defence-reduction special for ToA and team PvM.',
        category: 'Boss',
        risk: 'danger',
        optional: true,
        source:
          'https://oldschool.runescape.wiki/w/General_Graardor/Strategies',
      },
    ],
  },
  {
    id: 'desert-raider',
    number: '06',
    eyebrow: 'Second raid',
    title: 'Desert Raider',
    summary:
      'Tombs of Amascut is dangerous from the first death—even at raid level 0. Enter only after external practice, a complete abort plan, and the gear/stat gates below.',
    exitGate:
      'Repeatable 150 normals with no timers, no heroic recovery attempts, and a disciplined invocation ladder.',
    accent: 'gold',
    goals: [
      {
        id: 'skill-toa-combats',
        title: 'Reach 80+ Attack/Defence, 85+ Strength/Ranged/Magic',
        detail:
          'Prefer 85+ Hitpoints as well. These are conservative live-HC comfort floors, not entry requirements.',
        payoff: 'Damage consistency and room for one mistake without panic.',
        category: 'Skill',
        risk: 'mixed',
      },
      {
        id: 'raid-toa-kit',
        title: 'Assemble the live-HC ToA kit',
        detail:
          'Hasta/credible stab, Eclipse atlatl plus RCB with ruby/diamond bolts, trident, Keris partisan, DDS or bone dagger/BGS, thralls, rune pouch, brews/restores and antipoison.',
        payoff: 'Every room has a credible style and an exit reserve.',
        category: 'Gear',
        risk: 'deathbank',
      },
      {
        id: 'raid-toa-practice',
        title: 'Learn ToA mechanics away from Shadytron',
        detail:
          'Use a non-HC account, trusted coaching, or another practice environment. Never combine first live exposure with timers, Hardcore Run, Insanity, Mind the Gap or stacked Akkha mechanics.',
        payoff: 'Separates learning deaths from the one life that matters.',
        category: 'Safety',
        risk: 'deathbank',
      },
      {
        id: 'raid-toa-preflight',
        title: 'Lock the ToA escape protocol',
        detail:
          'Carry a one-click teleport and escape crystal. Configure a conservative inactivity trigger. Logging out with the crystal can preserve status, but it cannot stop an already-lethal hit.',
        payoff: 'A defined response to lag, disconnects, and resource desync.',
        category: 'Safety',
        risk: 'deathbank',
        source: 'https://oldschool.runescape.wiki/w/Escape_crystal',
      },
      {
        id: 'raid-toa-0',
        title: 'Complete a deathless 0-invocation raid',
        detail:
          'Unlimited attempts do not protect Hardcore status. The very first death is status loss.',
        payoff: 'Validates the live setup at the lowest complexity.',
        category: 'Raid',
        risk: 'deathbank',
        source: 'https://oldschool.runescape.wiki/w/Tombs_of_Amascut',
      },
      {
        id: 'raid-toa-50',
        title: 'Complete three consecutive deathless 50s',
        detail:
          'Reset the streak after any control failure, even if you survived. Only raise difficulty when the current level feels routine.',
        payoff: 'Proves repeatability, not luck.',
        category: 'Raid',
        risk: 'deathbank',
      },
      {
        id: 'raid-toa-100',
        title: 'Complete five consecutive clean 100s',
        detail:
          'Use forgiving invocations. Keep timers, Hardcore Run, Insanity, Mind the Gap and stacked Akkha mechanics off.',
        payoff: 'Earns the right to test normal-mode difficulty.',
        category: 'Raid',
        risk: 'deathbank',
      },
      {
        id: 'raid-toa-150',
        title: 'Make 150s repeatable',
        detail:
          'Aim for 5–10 flawless 100s before the first 150. Increase toward 200–250 only when supplies and mechanics remain boringly stable.',
        payoff: 'Normal-mode unique table with controlled risk.',
        category: 'Raid',
        risk: 'deathbank',
      },
      {
        id: 'gear-thread',
        title: 'Obtain Thread of elidinis',
        detail:
          'Immediate inventory convenience. Treat it as a welcome early unlock, not a reason to raise invocation too quickly.',
        payoff: 'Four-rune pouch capacity.',
        category: 'Raid',
        risk: 'deathbank',
      },
      {
        id: 'gear-fang',
        title: 'Obtain Osmumten’s fang',
        detail:
          'The major melee/account prize from controlled ToA progression.',
        payoff: 'Excellent stab accuracy and broad boss utility.',
        category: 'Raid',
        risk: 'deathbank',
      },
      {
        id: 'gear-lightbearer',
        title: 'Obtain Lightbearer',
        detail:
          'Strong special-attack utility. Keep it in the target list without assuming drop order.',
        payoff: 'More frequent defence reduction and damage specials.',
        category: 'Raid',
        risk: 'deathbank',
        optional: true,
      },
    ],
  },
  {
    id: 'theatre-apprentice',
    number: '07',
    eyebrow: 'Last raid',
    title: 'Theatre Apprentice',
    summary:
      'Theatre of Blood comes after comfortable CoX and repeatable ToA—not as an early equipment shortcut. Entry Mode is still dangerous to Hardcore status on the first death.',
    exitGate:
      'External deathless practice, a coached HC-aware team, 90s combat, complete switches, and escape crystal discipline.',
    accent: 'violet',
    goals: [
      {
        id: 'quest-tob-chain',
        title: 'Complete A Taste of Hope → A Night at the Theatre',
        detail:
          'Entry Mode attempts are not status-safe. Practice externally before completing the live-HC quest run, then continue to Sins of the Father.',
        payoff: 'Quest completion and the Morytania endgame chain.',
        category: 'Quest',
        risk: 'deathbank',
        source: 'https://oldschool.runescape.wiki/w/A_Night_at_the_Theatre',
      },
      {
        id: 'skill-tob-combats',
        title: 'Reach 90–95 melee, 90+ Ranged, 94 Magic, 77 Prayer',
        detail:
          'Also target 85–90 Defence. Ice Barrage, all offensive prayers, and a large HP margin are conservative live-HC gates.',
        payoff: 'Removes avoidable stat pressure from punishing rooms.',
        category: 'Skill',
        risk: 'mixed',
      },
      {
        id: 'gear-tob-kit',
        title: 'Assemble Theatre-standard switches',
        detail:
          'Elite Void with all helms, tentacle/fang/noxious halberd, blowpipe/Bowfa-level ranged, trident-class staff, Salve (e), team DWH/BGS coverage, damage spec and barrage runes.',
        payoff:
          'A role-complete kit that does not rely on the team rescuing missing basics.',
        category: 'Gear',
        risk: 'deathbank',
      },
      {
        id: 'raid-tob-practice',
        title: 'Log external deathless Entry and Normal practice',
        detail:
          'Use a non-HC environment until deaths are no longer part of learning. Normal teleports do not work inside ToB; configure the escape crystal.',
        payoff: 'Converts room knowledge into automatic execution.',
        category: 'Safety',
        risk: 'deathbank',
      },
      {
        id: 'raid-tob-team',
        title: 'Build an experienced HC-aware team',
        detail:
          'The team should explicitly accept a conservative learner pace, role assignments, escape rules and no surprise speed strategies.',
        payoff: 'Reduces human coordination risk before the first live run.',
        category: 'Raid',
        risk: 'deathbank',
      },
      {
        id: 'raid-tob-first',
        title: 'Complete first controlled Theatre',
        detail:
          'Disconnecting during combat can count as death. Stable connection, crystal, team coverage and external practice are all hard gates.',
        payoff: 'Opens sustainable Theatre progression.',
        category: 'Raid',
        risk: 'deathbank',
        source:
          'https://oldschool.runescape.wiki/w/Theatre_of_Blood/Strategies',
      },
      {
        id: 'gear-avernic',
        title: 'Obtain Avernic defender hilt',
        detail:
          'First major Theatre target; later weapons and armour are progression, not readiness assumptions.',
        payoff: 'Permanent melee off-hand upgrade.',
        category: 'Raid',
        risk: 'deathbank',
      },
    ],
  },
  {
    id: 'future-horizon',
    number: '08',
    eyebrow: 'Verify later',
    title: 'Future Horizon',
    summary:
      'Keep upcoming 2026 content visible without pretending unreleased death rules or rewards are final.',
    exitGate: 'No gate—reassess against live release notes.',
    accent: 'slate',
    goals: [
      {
        id: 'future-fractured-archive',
        title: 'Fractured Archive — verify on release',
        detail:
          'Planned for late 2026 with While Guthix Sleeps expected as a quest gate. Final HC death rules and rewards are not established.',
        payoff:
          'WGS keeps the account positioned without guessing at unreleased mechanics.',
        category: 'Raid',
        risk: 'planned',
        optional: true,
        source: 'https://oldschool.runescape.wiki/w/The_Fractured_Archive',
      },
      {
        id: 'skill-sailing-62',
        title: 'Optional: Sailing 46 → 62 for Wyrmscraig',
        detail:
          'Useful 2026 content and multi-target Slayer access, but not a released raid gate. Schedule it around enjoyable unlocks, not ahead of Piety/thralls/WGS.',
        payoff: 'Hallowfell and broader account variety.',
        category: 'Skill',
        risk: 'noncombat',
        optional: true,
        source: 'https://oldschool.runescape.com/polls/2026/1760',
      },
      {
        id: 'quest-blood-moon-rises',
        title: 'Optional: The Blood Moon Rises chain',
        detail:
          'A later ranged-necklace/endgame branch behind A Night at the Theatre and Sins of the Father—not an early-raid prerequisite.',
        payoff: 'Future ranged progression after core raids are established.',
        category: 'Quest',
        risk: 'danger',
        optional: true,
      },
    ],
  },
];

export type GrindLane = 'Questing' | 'Skilling' | 'Slayer' | 'Bossing';

export type GrindBreaker = {
  id: string;
  grind: 'Moons of Peril' | 'Dragon warhammer' | 'Skill training';
  trigger: string;
  title: string;
  lane: GrindLane;
  duration: string;
  risk: Risk;
  action: string;
  payoff: string;
  feeds: string[];
  source?: string;
};

export const grindBreakers: GrindBreaker[] = [
  {
    id: 'pivot-moons-royals',
    grind: 'Moons of Peril',
    trigger: 'After 3 dry chests or the first “I’m forcing it” session',
    title: 'Royal Titans duo reset',
    lane: 'Bossing',
    duration: '4–8 KC cap',
    risk: 'danger',
    action:
      'Use the reliable duo you already trust. Set a hard KC cap before the trip, audit the bank first, and stop at the cap even if the scrolls do not appear.',
    payoff:
      'A different boss rhythm with real shots at Deadeye, Mystic Vigour, crown pieces and Twinflame upgrades.',
    feeds: ['Prayer bridge', 'Team bossing reps', 'Future ToA/CoX switches'],
    source: 'https://oldschool.runescape.wiki/w/Royal_Titans',
  },
  {
    id: 'pivot-moons-quests',
    grind: 'Moons of Peril',
    trigger: 'When the log starts feeling like a second job',
    title: 'Quest sprint: thralls or desert access',
    lane: 'Questing',
    duration: '1 quest chunk',
    risk: 'danger',
    action:
      'Take one clean questing session: A Kingdom Divided → Dream Mentor, Lunar Diplomacy, or Beneath Cursed Sands. Stop after the quest reward and bank the supplies.',
    payoff:
      'Every break deposits raid value: greater thralls, Lunar utility, WGS progress or the ToA access gate.',
    feeds: ['Greater thralls', 'WGS prerequisite chain', 'ToA access'],
    source: 'https://oldschool.runescape.wiki/w/A_Kingdom_Divided',
  },
  {
    id: 'pivot-moons-slayer',
    grind: 'Moons of Peril',
    trigger: 'When you want combat without another chest room',
    title: 'One-task Slayer detour',
    lane: 'Slayer',
    duration: '1 task only',
    risk: 'mixed',
    action:
      'Take one task, prioritize useful unlocks and supplies, then bank. Do not let a “refresh” silently become an all-night Slayer marathon.',
    payoff:
      'Moves the same 66 → 69 → 85 → 87 engine that supplies MM2, whip and trident milestones.',
    feeds: ['MM2 access', 'Whip/trident path', 'Zenyte branch'],
  },
  {
    id: 'pivot-dwh-herblore',
    grind: 'Dragon warhammer',
    trigger: 'After a defined shaman kill block feels mentally flat',
    title: 'Herblore lab + Kingdom loop',
    lane: 'Skilling',
    duration: '45–90 minutes',
    risk: 'noncombat',
    action:
      'Do a farm run, collect Kingdom resources, process secondaries and finish one potion batch. End with the next run planted so the loop keeps paying later.',
    payoff:
      'Directly closes the Herblore 57 → 65 WGS gap and builds toward the 78 raid-potion target.',
    feeds: ['WGS Herblore gate', 'Raid potion bank', 'Long-term supply safety'],
    source: 'https://oldschool.runescape.wiki/w/Ironman_Guide/Herblore',
  },
  {
    id: 'pivot-dwh-royals',
    grind: 'Dragon warhammer',
    trigger: 'When you want PvM variety, not another shaman room',
    title: 'Royal Titans team block',
    lane: 'Bossing',
    duration: '4–8 KC cap',
    risk: 'danger',
    action:
      'Swap shamans for the trusted Royal Titans duo. Bring the same fixed abort rules, agree on the cap and bank immediately when the session ends.',
    payoff:
      'A meaningful prayer/staff upgrade lane that still improves team communication for raids.',
    feeds: [
      'Deadeye/Mystic Vigour',
      'Team call discipline',
      'CoX/ToA prayer coverage',
    ],
    source: 'https://oldschool.runescape.wiki/w/Royal_Titans',
  },
  {
    id: 'pivot-dwh-quest',
    grind: 'Dragon warhammer',
    trigger: 'When the DWH rate is stealing your momentum',
    title: 'One quest prerequisite cleared',
    lane: 'Questing',
    duration: '1 quest chunk',
    risk: 'danger',
    action:
      'Clear exactly one WGS, Lunar/Dream Mentor, or Beneath Cursed Sands step. Treat the boss room as its own preflighted session, not a casual add-on.',
    payoff:
      'Converts a dry boss day into a permanent route unlock toward thralls, WGS or ToA.',
    feeds: ['WGS access', 'Thralls', 'ToA gate'],
    source: 'https://oldschool.runescape.wiki/w/While_Guthix_Sleeps',
  },
  {
    id: 'pivot-skills-fight-caves',
    grind: 'Skill training',
    trigger: 'After two straight bank-standing or lap sessions',
    title: 'Fight Caves mechanics deposit',
    lane: 'Bossing',
    duration: '1 prep + 1 attempt',
    risk: 'status-safe',
    action:
      'Turn a combat-stat day into one focused cape attempt. Rehearse the wave plan, keep the exit rules explicit and stop after the attempt—win or reset cleanly.',
    payoff:
      'Fire Cape progress plus prayer discipline that improves every future dangerous room.',
    feeds: ['Fire Cape', 'Prayer confidence', 'HCIM mechanics'],
    source: 'https://oldschool.runescape.wiki/w/TzHaar_Fight_Cave',
  },
  {
    id: 'pivot-skills-quests',
    grind: 'Skill training',
    trigger: 'When XP tracking starts replacing actual progress',
    title: 'Quest reward sprint',
    lane: 'Questing',
    duration: '1 quest reward',
    risk: 'danger',
    action:
      'Pick the highest-value unfinished quest in the current phase and finish only that one. Bank the reward, update the checklist and stop before decision fatigue returns.',
    payoff:
      'Progresses WGS, thralls, Lunar utility, prayer or ToA access without adding another repetitive training block.',
    feeds: ['Quest gates', 'Future boss access', 'Raid readiness'],
    source: 'https://oldschool.runescape.wiki/w/Optimal_quest_guide',
  },
  {
    id: 'pivot-skills-moons',
    grind: 'Skill training',
    trigger: 'When you want a boss session with a finite endpoint',
    title: 'Moon set mini-hunt',
    lane: 'Bossing',
    duration: '2–4 chests',
    risk: 'danger',
    action:
      'Return to Moons with one set target chosen in advance. Stop at the chest cap even if the log stays dry; the win is a bounded boss session, not a forced green log.',
    payoff:
      'Keeps the green-log goal alive while supplying Eclipse, Blue Moon and Blood Moon upgrades for raids.',
    feeds: ['13-slot Moons log', 'Three-style raid kit', 'Early CoX/ToA gear'],
    source: 'https://oldschool.runescape.wiki/w/Moons_of_Peril/Strategies',
  },
];

export type TrainingMethod = {
  id: string;
  name: string;
  xpPerHour: number;
  gpPerXp: number;
  risk: Risk;
  recommended?: boolean;
  detail: string;
  routeValue: string;
};

export type SkillPlan = {
  id: string;
  name: string;
  current: number;
  target: number;
  targetLabel: string;
  gate: string;
  pivotNote: string;
  methods: TrainingMethod[];
};

export const skillPlans: SkillPlan[] = [
  {
    id: 'ranged',
    name: 'Ranged',
    current: 72,
    target: 75,
    targetLabel: 'Eclipse + atlatl',
    gate: '75 equips the Moon ranged package; 80 is the comfortable CoX contribution floor.',
    pivotNote:
      'If ranged training gets stale, swap to a one-task Slayer detour or a bounded Moons mini-hunt.',
    methods: [
      {
        id: 'ranged-slayer',
        name: 'Ranged Slayer tasks',
        xpPerHour: 42000,
        gpPerXp: 1,
        risk: 'mixed',
        recommended: true,
        detail:
          'Use safe task layouts and let combat XP advance the Slayer engine at the same time.',
        routeValue: 'Slayer progress + ranged XP',
      },
      {
        id: 'ranged-crabs',
        name: 'Ammonite crabs + broad bolts',
        xpPerHour: 55000,
        gpPerXp: 4,
        risk: 'noncombat',
        detail:
          'Low-attention fallback when you want predictable XP and no boss risk.',
        routeValue: 'Fast 75 breakpoint',
      },
    ],
  },
  {
    id: 'attack',
    name: 'Attack',
    current: 75,
    target: 80,
    targetLabel: 'CoX comfort floor',
    gate: '80 is a comfort floor for consistent melee accuracy; it is not a hard first-CoX requirement.',
    pivotNote:
      'Use melee Slayer tasks as the default so the level also advances whip, trident and boss-task access.',
    methods: [
      {
        id: 'attack-slayer',
        name: 'Melee Slayer tasks',
        xpPerHour: 35000,
        gpPerXp: 0,
        risk: 'mixed',
        recommended: true,
        detail:
          'Train Attack on tasks where the drop table or task unlock matters; switch styles only for a defined reason.',
        routeValue: 'Melee XP + Slayer drops',
      },
      {
        id: 'attack-nmz',
        name: 'NMZ absorption sessions',
        xpPerHour: 70000,
        gpPerXp: 2,
        risk: 'status-safe',
        detail:
          'Fast, low-attention combat XP when you need a short level push without a live Hardcore death roll.',
        routeValue: 'Fast comfort floor',
      },
    ],
  },
  {
    id: 'strength',
    name: 'Strength',
    current: 82,
    target: 85,
    targetLabel: 'CoX comfort floor',
    gate: '85 improves melee damage for CoX and later ToA; your 82 already supports early team raids.',
    pivotNote:
      'A single Slayer task is the healthiest detour; avoid turning a small combat gap into an endless NMZ block.',
    methods: [
      {
        id: 'strength-slayer',
        name: 'Strength-focused Slayer',
        xpPerHour: 35000,
        gpPerXp: 0,
        risk: 'mixed',
        recommended: true,
        detail:
          'Keep the account’s core task engine moving while adding the last few melee damage levels.',
        routeValue: 'Strength + Slayer milestones',
      },
      {
        id: 'strength-nmz',
        name: 'NMZ absorption sessions',
        xpPerHour: 70000,
        gpPerXp: 2,
        risk: 'status-safe',
        detail:
          'Efficient catch-up when you explicitly want XP and nothing else from the session.',
        routeValue: 'Fast damage floor',
      },
    ],
  },
  {
    id: 'defence',
    name: 'Defence',
    current: 75,
    target: 80,
    targetLabel: 'HCIM comfort floor',
    gate: '80 adds defensive margin for CoX, Royal Titans and future dangerous bosses.',
    pivotNote:
      'Defensive Slayer or a short NMZ block is enough; keep the route focused on supplies and boss readiness.',
    methods: [
      {
        id: 'defence-slayer',
        name: 'Defence Slayer tasks',
        xpPerHour: 35000,
        gpPerXp: 0,
        risk: 'mixed',
        recommended: true,
        detail:
          'Pair the level with useful tasks and drops so the account keeps moving toward 85/87 Slayer.',
        routeValue: 'Defence + Slayer milestones',
      },
      {
        id: 'defence-nmz',
        name: 'NMZ absorption sessions',
        xpPerHour: 70000,
        gpPerXp: 2,
        risk: 'status-safe',
        detail:
          'Safe, predictable catch-up XP for a defined number of absorption runs.',
        routeValue: 'Fast defensive floor',
      },
    ],
  },
  {
    id: 'prayer',
    name: 'Prayer',
    current: 66,
    target: 70,
    targetLabel: 'Piety',
    gate: '70 unlocks Piety and improves every future dangerous-content margin.',
    pivotNote:
      'Break up bone processing with a quest sprint or a status-safe Fight Caves attempt.',
    methods: [
      {
        id: 'prayer-gilded',
        name: 'Banked bones at Gilded altar',
        xpPerHour: 230000,
        gpPerXp: 6,
        risk: 'noncombat',
        recommended: true,
        detail:
          'The safer high-value route when you want to protect Hardcore status and keep the cost predictable.',
        routeValue: 'Safe Piety unlock',
      },
      {
        id: 'prayer-chaos',
        name: 'Chaos Altar (Wilderness)',
        xpPerHour: 350000,
        gpPerXp: 1,
        risk: 'wilderness',
        detail:
          'Best direct value, but the saved GP comes with player-killer and inventory risk.',
        routeValue: 'Cheapest XP, highest risk',
      },
    ],
  },
  {
    id: 'herblore',
    name: 'Herblore',
    current: 57,
    target: 65,
    targetLabel: 'WGS requirement',
    gate: '65 clears the visible WGS gap; 78 later improves CoX potion independence.',
    pivotNote:
      'This is the ideal anti-burnout pivot from DWH: farm run, Kingdom, secondaries, then one potion batch.',
    methods: [
      {
        id: 'herb-runs',
        name: 'Herb runs + quest lamps',
        xpPerHour: 18000,
        gpPerXp: 0,
        risk: 'noncombat',
        recommended: true,
        detail:
          'Lowest direct cost; treat the “hour” as a weekly loop rather than a single sitting.',
        routeValue: 'WGS XP at almost no GP cost',
      },
      {
        id: 'herblore-potions',
        name: 'Efficient potion batches',
        xpPerHour: 30000,
        gpPerXp: 7,
        risk: 'noncombat',
        detail:
          'Process banked herbs and secondaries in defined batches so the skill cannot consume the whole session.',
        routeValue: 'XP + raid supply bank',
      },
    ],
  },
  {
    id: 'farming',
    name: 'Farming',
    current: 69,
    target: 70,
    targetLabel: 'SotE branch',
    gate: '70 is the last visible Farming point for the optional Song of the Elves branch.',
    pivotNote:
      'Use a low-pressure herb/fruit-tree run as the reset between any two dangerous sessions.',
    methods: [
      {
        id: 'farming-runs',
        name: 'Herb + tree runs',
        xpPerHour: 28000,
        gpPerXp: 0,
        risk: 'noncombat',
        recommended: true,
        detail:
          'The account-friendly method: XP arrives in short loops while producing the herbs that power Herblore.',
        routeValue: 'SotE gap + herb bank',
      },
      {
        id: 'farming-contracts',
        name: 'Farming contracts',
        xpPerHour: 42000,
        gpPerXp: 0,
        risk: 'noncombat',
        detail:
          'Stack contracts with regular runs when you want more active planning and seed variety.',
        routeValue: 'XP + seed pipeline',
      },
    ],
  },
  {
    id: 'agility',
    name: 'Agility',
    current: 62,
    target: 66,
    targetLabel: 'WGS requirement',
    gate: '66 clears WGS; 70 is the next account-wide quality-of-life sweep for Song of the Elves.',
    pivotNote:
      'After two lap sessions, use one quest reward or Fight Caves attempt as a bounded change of pace.',
    methods: [
      {
        id: 'agility-rooftops',
        name: 'Seers’ Village rooftops',
        xpPerHour: 52000,
        gpPerXp: 0,
        risk: 'noncombat',
        recommended: true,
        detail:
          'Reliable, cheap laps with marks of grace; ideal for a short 66 push.',
        routeValue: 'WGS gap + graceful supplies',
      },
      {
        id: 'agility-hallowed',
        name: 'Hallowed Sepulchre floors',
        xpPerHour: 65000,
        gpPerXp: 0,
        risk: 'danger',
        detail:
          'Higher focus and better long-term rewards; only use on the live HCIM after the floors are rehearsed.',
        routeValue: 'XP + future stamina/loot',
      },
    ],
  },
  {
    id: 'crafting',
    name: 'Crafting',
    current: 60,
    target: 61,
    targetLabel: 'Lunar Diplomacy',
    gate: '61 opens Lunar Diplomacy; 70 later clears MM2 and starts the zenyte pipeline.',
    pivotNote:
      'A great noncombat reset from any boss grind: make one seaweed/sand batch, then stop.',
    methods: [
      {
        id: 'crafting-glass',
        name: 'Superglass Make + glassblowing',
        xpPerHour: 85000,
        gpPerXp: 5,
        risk: 'noncombat',
        recommended: true,
        detail:
          'Best iron-friendly mix of speed, cost and future utility; banked giant seaweed keeps it sustainable.',
        routeValue: 'Lunar gate + zenyte runway',
      },
      {
        id: 'crafting-jewellery',
        name: 'Cut gems / jewellery batches',
        xpPerHour: 65000,
        gpPerXp: 2,
        risk: 'noncombat',
        detail:
          'Use excess gems for a cheap, low-focus session that also supplies future jewellery.',
        routeValue: 'XP + jewellery stock',
      },
    ],
  },
  {
    id: 'magic',
    name: 'Magic',
    current: 75,
    target: 76,
    targetLabel: 'Greater thralls',
    gate: '76 unlocks Greater Resurrection after A Kingdom Divided; 80 is the comfortable CoX floor.',
    pivotNote:
      'If casting becomes repetitive, turn the session into questing or a Slayer task instead of forcing another barrage block.',
    methods: [
      {
        id: 'magic-slayer',
        name: 'Bursting Slayer tasks',
        xpPerHour: 80000,
        gpPerXp: 24,
        risk: 'danger',
        recommended: true,
        detail:
          'The expensive option is justified when the task also advances Slayer and future raid drops.',
        routeValue: 'Magic XP + Slayer engine',
      },
      {
        id: 'magic-superglass',
        name: 'Superglass Make sessions',
        xpPerHour: 70000,
        gpPerXp: 10,
        risk: 'noncombat',
        detail:
          'Cheaper utility training that stacks with the Crafting seaweed/sand pipeline.',
        routeValue: 'Magic XP + Crafting progress',
      },
    ],
  },
  {
    id: 'smithing',
    name: 'Smithing',
    current: 67,
    target: 70,
    targetLabel: 'Dragon Slayer II',
    gate: '70 is the short DS2 gap and supports the wider quest route.',
    pivotNote:
      'Use Giant’s Foundry as a finite contract-style session when combat grinds start to blur together.',
    methods: [
      {
        id: 'smithing-foundry',
        name: 'Giant’s Foundry contracts',
        xpPerHour: 65000,
        gpPerXp: 8,
        risk: 'noncombat',
        recommended: true,
        detail:
          'Low-to-moderate cost with useful mould unlocks and a clear start/stop point.',
        routeValue: 'DS2 gate + Foundry unlocks',
      },
      {
        id: 'smithing-balls',
        name: 'Cannonballs between tasks',
        xpPerHour: 18000,
        gpPerXp: 0,
        risk: 'noncombat',
        detail:
          'Very cheap AFK supply production; choose it when the goal is momentum rather than speed.',
        routeValue: 'Cannonball bank + slow XP',
      },
    ],
  },
  {
    id: 'fletching',
    name: 'Fletching',
    current: 64,
    target: 70,
    targetLabel: 'Scorching bow boost',
    gate: '70 plus a +4 pie boost makes the Scorching bow branch available; 74 removes boost friction.',
    pivotNote:
      'A clean bank-standing reset from Moons, shamans or Royal Titans—stop after one defined stack.',
    methods: [
      {
        id: 'fletching-maples',
        name: 'Maple/yew bow batches',
        xpPerHour: 90000,
        gpPerXp: 1,
        risk: 'noncombat',
        recommended: true,
        detail:
          'Cheap and sustainable with your existing logs; string only the quantity you intend to finish.',
        routeValue: 'Boost runway + alch stock',
      },
      {
        id: 'fletching-darts',
        name: 'Dart fletching',
        xpPerHour: 150000,
        gpPerXp: 5,
        risk: 'noncombat',
        detail:
          'Fastest clean push, but reserve bars and feathers so the cost does not erase the benefit.',
        routeValue: 'Fast optional bow branch',
      },
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    current: 51,
    target: 70,
    targetLabel: 'Song of the Elves branch',
    gate: '70 is the practical Song of the Elves comfort target; 83/84 later enables a premium house.',
    pivotNote:
      'Use Mahogany Homes between dangerous sessions when you want visible progress without another death roll.',
    methods: [
      {
        id: 'construction-homes',
        name: 'Mahogany Homes',
        xpPerHour: 115000,
        gpPerXp: 5,
        risk: 'noncombat',
        recommended: true,
        detail:
          'Best cost-conscious iron route with contracts, outfit progress and a natural session endpoint.',
        routeValue: 'SotE branch + house utility',
      },
      {
        id: 'construction-planks',
        name: 'Oak/mahogany furniture',
        xpPerHour: 220000,
        gpPerXp: 10,
        risk: 'noncombat',
        detail:
          'Use only when you have a deliberate cash and plank surplus; speed is not worth draining the bank casually.',
        routeValue: 'Fastest house levels',
      },
    ],
  },
  {
    id: 'slayer',
    name: 'Slayer',
    current: 66,
    target: 69,
    targetLabel: 'MM2 access',
    gate: '69 opens MM2; 85/87 later add whip and trident to the raid kit.',
    pivotNote:
      'Slayer itself is the best combat pivot: one task, a hard stop, and a drop/XP deposit every session.',
    methods: [
      {
        id: 'slayer-duradel',
        name: 'Duradel/Konar task engine',
        xpPerHour: 28000,
        gpPerXp: 0,
        risk: 'mixed',
        recommended: true,
        detail:
          'Best route value: task-only drops, combat XP and a steady line toward MM2, whip and trident.',
        routeValue: 'MM2 + whip + trident',
      },
      {
        id: 'slayer-burst',
        name: 'Burst high-value tasks',
        xpPerHour: 52000,
        gpPerXp: 20,
        risk: 'danger',
        detail:
          'Spend runes only on tasks that materially accelerate the next milestone; do not burst for XP alone.',
        routeValue: 'Fast Slayer levels + magic XP',
      },
    ],
  },
];

export const gearItems: GearItem[] = [
  {
    id: 'gear-fighter-torso',
    name: 'Fighter torso',
    style: 'Current',
    source: 'Barbarian Assault',
    priority: 'Owned',
    risk: 'status-safe',
    note: 'Confirmed by you; keeps Bandos armour low priority.',
  },
  {
    id: 'gear-zombie-axe',
    name: 'Zombie axe',
    style: 'Current',
    source: 'Armoured zombies',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; dependable melee anchor.',
  },
  {
    id: 'gear-mystic',
    name: 'Mystic robes',
    style: 'Current',
    source: 'Shops / Slayer',
    priority: 'Owned',
    risk: 'mixed',
    note: 'Confirmed by you; Blue Moon is the immediate armour step.',
  },
  {
    id: 'gear-green-dhide',
    name: 'Green d’hide',
    style: 'Current',
    source: 'Crafting / shops',
    priority: 'Owned',
    risk: 'noncombat',
    note: 'Confirmed by you; Eclipse is the direct fix.',
  },
  {
    id: 'gear-rcb',
    name: 'Rune crossbow',
    style: 'Current',
    source: 'Ironman progression',
    priority: 'Owned',
    risk: 'mixed',
    note: 'Confirmed by you; remains useful with enchanted bolts.',
  },
  {
    id: 'gear-ahrims-helm',
    name: "Ahrim's hood",
    style: 'Current',
    source: 'Barrows chest',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; adds a stronger magic head option beside Mystic and Blue Moon.',
  },
  {
    id: 'gear-karils-helm',
    name: "Karil's coif",
    style: 'Current',
    source: 'Barrows chest',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; useful ranged defensive head slot while Eclipse is incomplete.',
  },
  {
    id: 'gear-veracs-helm',
    name: "Verac's helm",
    style: 'Current',
    source: 'Barrows chest',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; defensive melee option for dangerous content.',
  },
  {
    id: 'gear-veracs-brassard',
    name: "Verac's brassard",
    style: 'Current',
    source: 'Barrows chest',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; keep as a defensive body-slot option when torso DPS is not the priority.',
  },
  ...moonsItems,
  {
    id: 'gear-mixed-hide',
    name: 'Mixed hide set',
    style: 'Ranged',
    source: 'Hunter content',
    priority: 'Optional',
    risk: 'noncombat',
    note: 'Your 75 Hunter makes this a no-Crafting ranged sidegrade if Eclipse pieces lag.',
    url: 'https://oldschool.runescape.wiki/w/Mixed_hide_armour',
  },
  {
    id: 'gear-sunlight-crossbow',
    name: 'Hunter’s sunlight crossbow',
    style: 'Ranged',
    source: '74 Fletching (70 +4 boost)',
    priority: 'Optional',
    risk: 'noncombat',
    note: 'Fast ranged option; useful, not a raid gate.',
    url: 'https://oldschool.runescape.wiki/w/Hunters%27_sunlight_crossbow',
  },
  {
    id: 'gear-dragon-defender',
    name: 'Dragon defender',
    style: 'Melee',
    source: 'Warriors’ Guild',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; already pairs with the zombie axe for the default melee switch.',
  },
  {
    id: 'gear-fire-cape',
    name: 'Fire cape',
    style: 'Melee',
    source: 'Fight Caves',
    priority: 'Now',
    risk: 'status-safe',
    note: 'Status-safe solo-HC upgrade and mechanics practice.',
  },
  {
    id: 'gear-black-mask',
    name: 'Imbued Slayer helm',
    style: 'Utility',
    source: 'Black mask + Slayer helm (i)',
    priority: 'Owned',
    risk: 'mixed',
    note: 'Confirmed by you; already solves the task-boost head slot for Slayer and bossing.',
  },
  {
    id: 'gear-rune-pouch',
    name: 'Rune pouch',
    style: 'Utility',
    source: 'LMS or Slayer points',
    priority: 'Now',
    risk: 'status-safe',
    note: 'Use LMS to preserve Slayer points if comfortable.',
  },
  {
    id: 'gear-barrows-gloves',
    name: 'Barrows gloves',
    style: 'Utility',
    source: 'Recipe for Disaster',
    priority: 'Now',
    risk: 'noncombat',
    note: 'RFD reported complete; buy/verify them.',
  },
  {
    id: 'gear-neitiznot',
    name: 'Helm of Neitiznot',
    style: 'Melee',
    source: 'The Fremennik Isles',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; dependable melee fallback when the Slayer helm bonus is not active.',
  },
  {
    id: 'gear-warped-sceptre',
    name: 'Warped sceptre',
    style: 'Magic',
    source: 'Warped creatures',
    priority: 'Owned',
    risk: 'danger',
    note: 'Confirmed by you; ready for early CoX and useful until trident.',
  },
  {
    id: 'gear-deadeye',
    name: 'Deadeye prayer scroll',
    style: 'Ranged',
    source: 'Royal Titans',
    priority: 'Core',
    risk: 'danger',
    note: 'Audit the existing 10 KC first; bridge before Rigour.',
  },
  {
    id: 'gear-mystic-vigour',
    name: 'Mystic Vigour prayer scroll',
    style: 'Magic',
    source: 'Royal Titans',
    priority: 'Core',
    risk: 'danger',
    note: 'Audit the existing 10 KC first; bridge before Augury.',
  },
  {
    id: 'gear-scorching-bow',
    name: 'Scorching bow',
    style: 'Ranged',
    source: 'Tormented synapse',
    priority: 'Core',
    risk: 'danger',
    note: 'Recommended first synapse; controls K’ril with its bind special.',
  },
  {
    id: 'gear-trident',
    name: 'Trident of the seas',
    style: 'Magic',
    source: '87 Slayer · Kraken',
    priority: 'Core',
    risk: 'danger',
    note: 'Comfortable-raids milestone; not required for first CoX.',
  },
  {
    id: 'gear-zammy-hasta',
    name: 'Zamorakian hasta',
    style: 'Melee',
    source: 'K’ril Tsutsaroth',
    priority: 'Core',
    risk: 'danger',
    note: 'Controlled ToA stab bridge until fang.',
  },
  {
    id: 'gear-assembler',
    name: 'Ava’s assembler',
    style: 'Ranged',
    source: 'Vorkath’s head',
    priority: 'Core',
    risk: 'deathbank',
    note: 'Wait for practiced Vorkath and strong supplies.',
  },
  {
    id: 'gear-zenyte-first',
    name: 'First zenyte jewellery',
    style: 'Utility',
    source: 'Demonic gorillas + Crafting',
    priority: 'Later',
    risk: 'danger',
    note: 'Suffering for HC safety; anguish for direct raid DPS.',
  },
  {
    id: 'gear-dwh',
    name: 'Dragon warhammer',
    style: 'Melee',
    source: 'Lizardman shamans · 1/3,000',
    priority: 'Later',
    risk: 'danger',
    note: 'Useful for small-team/solo CoX; teammates can cover early.',
  },
  {
    id: 'gear-bowfa',
    name: 'Bowfa + crystal armour',
    style: 'Ranged',
    source: 'Corrupted Gauntlet',
    priority: 'Optional',
    risk: 'danger',
    note: 'Transformative, never mandatory before first raids.',
  },
  {
    id: 'gear-zulrah-kit',
    name: 'Blowpipe + magic fang',
    style: 'Utility',
    source: 'Zulrah',
    priority: 'Optional',
    risk: 'conditional',
    note: 'Danger + deathbank; Elite resurrection is one use per day.',
  },
  {
    id: 'gear-bgs',
    name: 'Bandos godsword',
    style: 'Melee',
    source: 'General Graardor',
    priority: 'Optional',
    risk: 'danger',
    note: 'More meaningful than Bandos armour for this route.',
  },
  {
    id: 'gear-thread',
    name: 'Thread of elidinis',
    style: 'Raid reward',
    source: 'Tombs of Amascut',
    priority: 'Later',
    risk: 'deathbank',
    note: 'Immediate four-rune-pouch convenience.',
  },
  {
    id: 'gear-fang',
    name: 'Osmumten’s fang',
    style: 'Raid reward',
    source: 'Tombs of Amascut',
    priority: 'Later',
    risk: 'deathbank',
    note: 'Major stab and general bossing upgrade.',
  },
  {
    id: 'gear-lightbearer',
    name: 'Lightbearer',
    style: 'Raid reward',
    source: 'Tombs of Amascut',
    priority: 'Optional',
    risk: 'deathbank',
    note: 'Strong special-attack utility.',
  },
  {
    id: 'gear-avernic',
    name: 'Avernic defender hilt',
    style: 'Raid reward',
    source: 'Theatre of Blood',
    priority: 'Later',
    risk: 'deathbank',
    note: 'First major Theatre target.',
  },
];

export const confirmedDefaults = [
  'gear-fighter-torso',
  'gear-zombie-axe',
  'gear-mystic',
  'gear-green-dhide',
  'gear-rcb',
  'gear-ahrims-helm',
  'gear-karils-helm',
  'gear-veracs-helm',
  'gear-veracs-brassard',
  'gear-dragon-defender',
  'gear-black-mask',
  'gear-neitiznot',
  'gear-warped-sceptre',
  'quest-rfd',
  'quest-ds1',
  'quest-mm1',
  'quest-path-glouphrie',
  'context-cox-experience',
];

export const accountStats = [
  ['Attack', 75],
  ['Strength', 82],
  ['Defence', 75],
  ['Hitpoints', 81],
  ['Ranged', 72],
  ['Magic', 75],
  ['Prayer', 66],
  ['Slayer', 66],
  ['Herblore', 57],
  ['Agility', 62],
  ['Crafting', 60],
  ['Smithing', 67],
  ['Construction', 51],
  ['Farming', 69],
  ['Hunter', 75],
  ['Sailing', 46],
] as const;

export const activitySnapshot = [
  ['Lunar Chests', '68'],
  ['Barrows Chests', '145'],
  ['Royal Titans', '10'],
  ['Shellbane Gryphon', '24'],
  ['Brutus', '560'],
  ['Collection slots', '105'],
] as const;

export const sources = [
  {
    label: 'Official HCIM hiscores · Shadytron',
    url: 'https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.json?player=Shadytron',
  },
  {
    label: 'Hardcore Ironman death rules',
    url: 'https://oldschool.runescape.wiki/w/Ironman_Mode#Hardcore',
  },
  {
    label: 'Moons of Peril strategy',
    url: 'https://oldschool.runescape.wiki/w/Moons_of_Peril/Strategies',
  },
  {
    label: 'Chambers of Xeric strategy',
    url: 'https://oldschool.runescape.wiki/w/Chambers_of_Xeric/Strategies',
  },
  {
    label: 'Tombs of Amascut strategy',
    url: 'https://oldschool.runescape.wiki/w/Tombs_of_Amascut/Strategies',
  },
  {
    label: 'Theatre of Blood strategy',
    url: 'https://oldschool.runescape.wiki/w/Theatre_of_Blood/Strategies',
  },
];

export const hardcorePreflight = [
  ['preflight-rule', 'Death rule verified from the current activity page'],
  ['preflight-bank', 'Deathbank empty; any prior reclaim fully resolved'],
  ['preflight-tele', 'One-click manual teleport in the fixed inventory slot'],
  [
    'preflight-crystal',
    'Escape crystal configured where supported (2s is conservative)',
  ],
  [
    'preflight-world',
    'Stable low-ping world; no update or six-hour log approaching',
  ],
  [
    'preflight-loadout',
    'Full HP/Prayer, charged gear, ammo/runes and status protection',
  ],
  ['preflight-combo', 'Two emergency combo eats reserved only for aborting'],
  [
    'preflight-restore',
    'One full prayer-restoration dose beyond projected need',
  ],
  ['preflight-exit', 'Exact exit path and abort trigger known before entry'],
  [
    'preflight-practice',
    'First-time mechanics rehearsed away from the live Hardcore',
  ],
] as const;

export const baselineClaims = [
  ['quest-rfd', 'Recipe for Disaster', 'Reported complete'],
  ['quest-ds1', 'Dragon Slayer I', 'Reported complete'],
  ['quest-mm1', 'Monkey Madness I', 'Reported complete'],
  ['quest-path-glouphrie', 'The Path of Glouphrie', 'Confirmed complete'],
  ['gear-fighter-torso', 'Fighter torso', 'Confirmed equipped/owned'],
  ['gear-zombie-axe', 'Zombie axe', 'Confirmed equipped/owned'],
  ['gear-mystic', 'Mystic set', 'Confirmed equipped/owned'],
  ['gear-green-dhide', 'Green d’hide', 'Confirmed current ranged armour'],
  ['gear-rcb', 'Rune crossbow', 'Confirmed equipped/owned'],
  ['gear-dragon-defender', 'Dragon defender', 'Confirmed owned'],
  ['gear-neitiznot', 'Helm of Neitiznot', 'Confirmed owned'],
  ['gear-black-mask', 'Imbued Slayer helm', 'Confirmed owned'],
  ['gear-warped-sceptre', 'Warped sceptre', 'Confirmed owned'],
  ['gear-ahrims-helm', "Ahrim's hood", 'Confirmed owned'],
  ['gear-karils-helm', "Karil's coif", 'Confirmed owned'],
  ['gear-veracs-helm', "Verac's helm", 'Confirmed owned'],
  ['gear-veracs-brassard', "Verac's brassard", 'Confirmed owned'],
  [
    'context-cox-experience',
    'CoX main-account experience',
    'Reported roughly 300 completions; use CoX as HCIM calibration, not first-time learning',
  ],
] as const;
