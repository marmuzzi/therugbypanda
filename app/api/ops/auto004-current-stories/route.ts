import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

type StoryKey = "munster" | "connacht" | "ulster" | "leinster" | "ireland-women";

type SourceRecord = {
  id: string;
  url: string;
  publisher: string;
  title: string;
  publishedAt?: string;
  excerpt: string;
  retrievedAt: string;
  isPrimarySource: boolean;
};

type StoryCase = {
  story: {
    id: string;
    title: string;
    summary: string;
    sourceRecords: SourceRecord[];
    discoveredAt: string;
    suggestedCategory: "Ireland" | "Leinster" | "Munster" | "Ulster" | "Connacht";
  };
  factLedger: {
    facts: Array<{
      id: string;
      claim: string;
      status: "confirmed";
      confidence: number;
      sourceIds: string[];
      usableInDraft: true;
    }>;
    unsupportedClaims: string[];
    conflicts: string[];
  };
};

function nowIso() {
  return new Date().toISOString();
}

function source(input: Omit<SourceRecord, "retrievedAt">): SourceRecord {
  return { ...input, retrievedAt: nowIso() };
}

function fact(id: string, claim: string, sourceIds: string[]) {
  return { id, claim, status: "confirmed" as const, confidence: 98, sourceIds, usableInDraft: true as const };
}

function buildStoryCases(): Record<StoryKey, StoryCase> {
  const discoveredAt = nowIso();

  return {
    munster: {
      story: {
        id: "auto004-current-munster-larochelle-20260817",
        title: "Munster’s La Rochelle trip puts the first pre-season marker down",
        summary: "Munster begin their 2026/27 pre-season away to La Rochelle before a home warm-up against Leicester Tigers.",
        discoveredAt,
        suggestedCategory: "Munster",
        sourceRecords: [
          source({
            id: "munster-preseason-2026",
            url: "https://www.munsterrugby.ie/2026/06/17/munster-to-face-la-rochelle-in-pre-season/",
            publisher: "Munster Rugby",
            title: "Munster To Face La Rochelle In Pre-Season",
            publishedAt: "2026-06-17T00:00:00Z",
            excerpt: "Munster confirmed La Rochelle away on 28 August and Leicester Tigers at home on 18 September as their two pre-season fixtures.",
            isPrimarySource: true,
          }),
          source({
            id: "munster-preseason-hpc-2026",
            url: "https://www.munsterrugby.ie/2026/07/27/squad-update-pre-season-begins-at-hpc/",
            publisher: "Munster Rugby",
            title: "Squad Update | Pre-Season Begins At HPC",
            publishedAt: "2026-07-27T00:00:00Z",
            excerpt: "Munster’s later pre-season update again lists the La Rochelle and Leicester fixtures.",
            isPrimarySource: true,
          }),
        ],
      },
      factLedger: {
        facts: [
          fact("munster-1", "Munster will play La Rochelle at Stade Marcel Deflandre on Friday 28 August 2026 at 7.30pm.", ["munster-preseason-2026", "munster-preseason-hpc-2026"]),
          fact("munster-2", "The La Rochelle match is Munster’s first pre-season fixture ahead of the 2026/27 season.", ["munster-preseason-2026"]),
          fact("munster-3", "Leicester Tigers will visit Virgin Media Park on Friday 18 September 2026 at 7.15pm for Munster’s second pre-season fixture.", ["munster-preseason-2026", "munster-preseason-hpc-2026"]),
          fact("munster-4", "Munster’s previous competitive meeting with La Rochelle was a 25-24 Champions Cup Round of 16 win in April 2025.", ["munster-preseason-2026"]),
          fact("munster-5", "Jack Crowley kicked a late drop goal in that 25-24 Munster win.", ["munster-preseason-2026"]),
        ],
        unsupportedClaims: [],
        conflicts: [],
      },
    },
    connacht: {
      story: {
        id: "auto004-current-connacht-preseason-20260817",
        title: "Connacht’s August 28 trip starts a two-game pre-season build-up",
        summary: "Connacht have two August/September pre-season fixtures listed before opening their URC campaign at Dexcom Stadium on 25 September.",
        discoveredAt,
        suggestedCategory: "Connacht",
        sourceRecords: [
          source({
            id: "connacht-matches-2026",
            url: "https://www.connachtrugby.ie/matches/3/",
            publisher: "Connacht Rugby",
            title: "Matches | Connacht Rugby",
            excerpt: "Connacht’s official match list shows pre-season fixtures on 28 August and 5 September, followed by the URC opener on 25 September.",
            isPrimarySource: true,
          }),
          source({
            id: "connacht-home-2026",
            url: "https://www.connachtrugby.ie/",
            publisher: "Connacht Rugby",
            title: "Home | Connacht Rugby",
            excerpt: "Connacht’s homepage lists the 28 August away pre-season friendly at Stade de la Rabine as the next match.",
            isPrimarySource: true,
          }),
        ],
      },
      factLedger: {
        facts: [
          fact("connacht-1", "Connacht’s official fixture list shows an away pre-season friendly at Stade de la Rabine on Friday 28 August 2026 at 7.00pm.", ["connacht-matches-2026", "connacht-home-2026"]),
          fact("connacht-2", "Connacht’s second listed pre-season friendly is at Dexcom Stadium on Saturday 5 September 2026 at 5.00pm.", ["connacht-matches-2026"]),
          fact("connacht-3", "Connacht’s first listed URC fixture is at Dexcom Stadium on Friday 25 September 2026 at 7.45pm.", ["connacht-matches-2026"]),
          fact("connacht-4", "The 28 August fixture is shown by Connacht as the club’s coming next match.", ["connacht-home-2026"]),
        ],
        unsupportedClaims: [],
        conflicts: [],
      },
    },
    ulster: {
      story: {
        id: "auto004-current-ulster-fixtures-20260817",
        title: "Ulster open the URC at home before an early Munster derby",
        summary: "Ulster begin the 2026/27 URC season at home to Edinburgh, then face Glasgow away and Munster at Affidea Stadium in the first three rounds.",
        discoveredAt,
        suggestedCategory: "Ulster",
        sourceRecords: [
          source({
            id: "ulster-urc-fixtures-2026",
            url: "https://www.ulster.rugby/content/ulsters-urc-fixtures-for-202627-confirmed",
            publisher: "Ulster Rugby",
            title: "Ulster's URC fixtures for 2026/27 confirmed",
            excerpt: "Ulster confirmed Edinburgh at home in Round 1, Glasgow away in Round 2 and Munster at home in Round 3, followed by a South African double-header.",
            isPrimarySource: true,
          }),
        ],
      },
      factLedger: {
        facts: [
          fact("ulster-1", "Ulster open their 2026/27 URC campaign at home to Edinburgh at Affidea Stadium on Friday 25 September 2026 at 7.45pm.", ["ulster-urc-fixtures-2026"]),
          fact("ulster-2", "Ulster travel to Glasgow Warriors for Round 2 on Saturday 3 October 2026 at 7.45pm.", ["ulster-urc-fixtures-2026"]),
          fact("ulster-3", "Munster are Ulster’s first interprovincial opponents of the season, at Affidea Stadium on Saturday 10 October 2026 at 5.30pm.", ["ulster-urc-fixtures-2026"]),
          fact("ulster-4", "Ulster then travel to South Africa to face the Bulls on 24 October and the Stormers on 31 October.", ["ulster-urc-fixtures-2026"]),
        ],
        unsupportedClaims: [],
        conflicts: [],
      },
    },
    leinster: {
      story: {
        id: "auto004-current-leinster-southafrica-20260817",
        title: "Leinster start the new URC season with back-to-back South African tests",
        summary: "Leinster’s first two listed URC fixtures are away to the Lions and Sharks before their first home match of the campaign.",
        discoveredAt,
        suggestedCategory: "Leinster",
        sourceRecords: [
          source({
            id: "leinster-urc-fixtures-2026",
            url: "https://www.leinsterrugby.ie/2026/05/19/2026-27-bkt-urc-fixtures-announced/",
            publisher: "Leinster Rugby",
            title: "2026/27 BKT URC fixtures confirmed",
            publishedAt: "2026-05-19T00:00:00Z",
            excerpt: "Leinster published the confirmed 2026/27 BKT URC fixture announcement.",
            isPrimarySource: true,
          }),
          source({
            id: "urc-match-centre-2026",
            url: "https://stats.unitedrugby.com/match-centre",
            publisher: "United Rugby Championship",
            title: "URC Match Centre - All Fixtures, Live Matches & Results",
            excerpt: "The official URC match centre lists Leinster away to the Lions on 26 September and away to the Sharks on 3 October.",
            isPrimarySource: true,
          }),
        ],
      },
      factLedger: {
        facts: [
          fact("leinster-1", "Leinster’s first listed 2026/27 URC match is away to the Lions at Ellis Park on Saturday 26 September 2026.", ["urc-match-centre-2026"]),
          fact("leinster-2", "Leinster’s second listed URC fixture is away to the Sharks on Saturday 3 October 2026.", ["urc-match-centre-2026"]),
          fact("leinster-3", "Leinster’s first two URC fixtures of the new season are therefore both in South Africa.", ["urc-match-centre-2026"]),
          fact("leinster-4", "Leinster published confirmation of the 2026/27 BKT URC fixture schedule on 19 May 2026.", ["leinster-urc-fixtures-2026"]),
        ],
        unsupportedClaims: [],
        conflicts: [],
      },
    },
    "ireland-women": {
      story: {
        id: "auto004-current-ireland-wxv-20260817",
        title: "Ireland Women’s WXV autumn begins with USA and Japan on home soil",
        summary: "Ireland Women will host USA and Japan in September before another Japan Test and a two-match WXV series away to South Africa in October.",
        discoveredAt,
        suggestedCategory: "Ireland",
        sourceRecords: [
          source({
            id: "irish-rugby-wxv-2026",
            url: "https://www.irishrugby.ie/news/ireland-kick-wxv-global-series-home-soil",
            publisher: "Irish Rugby",
            title: "Ireland Kick Off WXV Global Series On Home Soil",
            publishedAt: "2026-06-16T00:00:00Z",
            excerpt: "Irish Rugby confirmed home WXV fixtures against USA and Japan, a further Japan Test in Cork and two WXV Tests against South Africa in Cape Town.",
            isPrimarySource: true,
          }),
        ],
      },
      factLedger: {
        facts: [
          fact("ireland-women-1", "Ireland Women host USA at Tallaght Stadium on Sunday 20 September 2026 in the WXV Global Series.", ["irish-rugby-wxv-2026"]),
          fact("ireland-women-2", "Ireland Women host Japan at Dexcom Stadium on Sunday 27 September 2026 in the WXV Global Series.", ["irish-rugby-wxv-2026"]),
          fact("ireland-women-3", "Ireland also play Japan at Virgin Media Park on Saturday 3 October 2026 outside the WXV Global Series window.", ["irish-rugby-wxv-2026"]),
          fact("ireland-women-4", "Ireland then face South Africa at Athlone Stadium in Cape Town on 24 October and 31 October 2026.", ["irish-rugby-wxv-2026"]),
          fact("ireland-women-5", "The October matches are the first Women’s Test series between South Africa and Ireland.", ["irish-rugby-wxv-2026"]),
        ],
        unsupportedClaims: [],
        conflicts: [],
      },
    },
  };
}

function previewOnly() {
  return process.env.VERCEL_ENV === "preview";
}

function automationSecret() {
  return process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
}

async function callProduction(path: string, body?: unknown) {
  const secret = automationSecret();
  if (!secret) {
    return NextResponse.json({ error: "EDITORIAL_AUTOMATION_SECRET is unavailable in Preview." }, { status: 503 });
  }

  const response = await fetch(`https://therugbypanda.ie${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({ error: "Production returned a non-JSON response." }));
  return NextResponse.json(result, { status: response.status });
}

export async function POST(request: NextRequest) {
  if (!previewOnly()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string; storyKey?: StoryKey };

  if (body.action === "package") {
    return callProduction("/api/editorial/daily-package");
  }

  if (body.action !== "generate" || !body.storyKey) {
    return NextResponse.json({ error: "Use action=generate with a storyKey, or action=package." }, { status: 400 });
  }

  const storyCase = buildStoryCases()[body.storyKey];
  if (!storyCase) {
    return NextResponse.json({ error: "Unknown storyKey." }, { status: 400 });
  }

  return callProduction("/api/editorial/draft", {
    ...storyCase,
    createSanityDraft: true,
    qaMode: false,
  });
}
