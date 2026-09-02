const HISCORE_URL =
  'https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.json?player=Shadytron';

type HiscoreRow = {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
};

type HiscoreResponse = {
  name: string;
  skills: HiscoreRow[];
};

export async function GET() {
  try {
    const response = await fetch(HISCORE_URL, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return Response.json(
        { error: `Hiscores returned ${response.status}.` },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as HiscoreResponse;
    if (!payload?.name || !Array.isArray(payload.skills)) {
      return Response.json(
        { error: 'Hiscore response was missing skill data.' },
        { status: 502 },
      );
    }

    return Response.json(
      {
        name: payload.name,
        fetchedAt: new Date().toISOString(),
        skills: payload.skills.map(({ id, name, rank, level, xp }) => ({
          id,
          name,
          rank,
          level,
          xp,
        })),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch {
    return Response.json(
      { error: 'Unable to reach the Old School hiscores right now.' },
      { status: 502 },
    );
  }
}
