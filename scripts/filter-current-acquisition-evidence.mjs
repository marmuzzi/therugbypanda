import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const PACKAGE_SIZE = 5;
const batchPath = process.env.CURRENT_ACQUISITION_BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const reportPath = process.env.CURRENT_EVIDENCE_SUFFICIENCY_REPORT || "data/editorial-acquisition/current-evidence-sufficiency.json";
const raw = JSON.parse(await fs.readFile(path.resolve(batchPath), "utf8"));
if (raw?.schemaVersion !== "1.0" || !Array.isArray(raw.candidates)) throw new Error("Concrete evidence gate fail-closed: invalid current acquisition batch.");

const TEAM_OR_COMPETITION = new Set(["All Blacks","New Zealand","Springboks","South Africa","Wallabies","Australia","Ireland","Ireland Women","Leinster","Munster","Ulster","Connacht","England","Scotland","Wales","France","Italy","Argentina","Pumas","Fiji","Japan","Samoa","Tonga","United Rugby Championship","Six Nations","Champions Cup","Challenge Cup","World Cup","Rugby Championship","Red Roses","WXV Global","WXV Global Series","Global Series","Western Force"]);
const NON_PERSON_NAMES = new Set(["Planet Rugby","Irish Rugby","Rugby Pass","RugbyPass Ireland","Business Post","The Irish Times","United Rugby","Rugby Football","Football Union","United Rugby Championship","Irish Independent","Connacht Rugby","Munster Rugby","Leinster Rugby","Ulster Rugby","England Rugby","Red Roses","WXV Global","WXV Global Series","Global Series","Wallaroos Global","Western Force","Force Force","Roster Confirmed","ROSTER CONFIRMED","WXV Match","WXV Series","Two-time Olympic"]);
const GENERIC_PERSON_PARTS = new Set(["rugby","fixture","fixtures","news","world","nations","championship","live","union","super","first","captain","team","teams","table","tables","results","result","sport","sports","returning","former","current","latest","irish","ireland","times","independent","examiner","mirror","bbc","rte","connacht","munster","leinster","ulster","england","scotland","wales","france","australia","brumbies","waratahs","chiefs","global","series","wxv","wallaroos","western","force","roster","confirmed","match","matches","olympic","canada","fiji","for"]);
const MONTH = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
const MATCHISH = /\b(?:match|test|round|fixture|final|semi-final|quarter-final|beat|defeat|win|won|loss|lost|draw|score|kick-?off|team named|selection|selected|bench|line-up|lineup|starting (?:xv|line-up|lineup)|starts? (?:at|in the (?:team|side|xv)|on the bench))\b/i;
const COMPLETED_MATCH = /\b(?:beat|defeat(?:ed)?|won|loss|lost|draw|victory|overpower(?:ed)?|edged|thrashed)\b/i;
const SQUAD_SELECTION = /\b(?:squads?|selection|selected|named|line-?up|team named|uncapped|retained|roster)\b/i;
const FINAL_SCORE = /\b\d{1,3}\s*[-–:]\s*\d{1,3}\b/;
const CONCRETE_RUGBY = /\b(?:prop|hooker|lock|flanker|number ?8|scrum-?half|fly-?half|out-?half|centre|wing(?:er)?|full-?back|tighthead|loosehead|front row|back row|captain|coach|head coach|assistant coach|academy|debut|caps?|appearances?|tries?|points?|minutes?|weeks?|months?|years?)\b/i;
const VENUE_WORDS = /\b(?:stadium|park|ground|arena|sportsground|aviva|thomond|kingspan|dexcom|rds|croke park|eden park|cape town|auckland|dublin|limerick|belfast|galway|cork|soweto|osaka|hanazono|exeter)\b/i;
const SCORE_OR_NUMBER = /(?:\b\d{1,3}\s*[-–]\s*\d{1,3}\b|\b\d{1,3}\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\b)/i;
const QUOTED = /[“”"'‘’][^“”"'‘’]{5,}[“”"'‘’]/;
const NON_NEWS_EVIDENCE = /\b(?:replica\s+(?:shirt|jersey)|away\s+replica|home\s+replica|kids(?:'|’)?\s+(?:shirt|jersey)|merchandise|gift\s*card|buy\s+now|add\s+to\s+cart|product\s+page)\b/i;
const GENERIC_TEAM_INDEX = /\brugby\s+team\s*\|.*\bnews,?\s+players\s*&\s*stats\b/i;
const GENERIC_FIXTURE_INDEX = /(?:\brugby fixtures? for\b|\brugb?y fixtures? today\b|\blive rugby union fixtures\b|\btables?,\s*fixtures?,\s*results?\b)/i;
const RETAINED_NON_EDITORIAL_USAGE = /\b(?:fixture listing|live match page|placeholder live|tables?,?\s*fixtures?,?\s*results?|replica|product page|merchandise)\b/i;
function clean(value = "") { return String(value ?? "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function normalise(value = "") { return clean(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
function operationalDate() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
function personNames(value = "") {
  const matches = clean(value).match(/\b(?:(?:Sir|Dame)\s+)?[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}(?:\s+(?:van|de|der|von|di|da))?\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\b/g) ?? [];
  return [...new Set(matches.map(clean).filter((name) => {
    if (TEAM_OR_COMPETITION.has(name) || NON_PERSON_NAMES.has(name)) return false;
    const parts = normalise(name).split(/\s+/).filter(Boolean);
    if (parts.length < 2 || parts.some((part) => GENERIC_PERSON_PARTS.has(part))) return false;
    // Possessive team constructions such as "Lancaster's Connacht" are not people.
    if (/[’'][sS]\s+[A-Z]/.test(name)) return false;
    return true;
  }))];
}
function canonicalPerson(name="") { const parts=normalise(name).split(/\s+/).filter(Boolean); if (["sir","dame"].includes(parts[0])) parts.shift(); return { first:parts[0]||"", last:parts.at(-1)||"", full:parts.join(" ") }; }
function hasPersonCollision(titleEvidence, factEvidence) { const primary=personNames(titleEvidence).map(canonicalPerson); const facts=personNames(factEvidence).map(canonicalPerson); return primary.some((p)=>p.last&&facts.some((f)=>f.last===p.last&&f.first&&p.first&&f.first!==p.first)); }
function isEditorialEvidenceSource(source) { const text = [source?.title, source?.excerpt, source?.bodyText].map(clean).filter(Boolean).join(" "); return Boolean(text) && !NON_NEWS_EVIDENCE.test(text) && !GENERIC_TEAM_INDEX.test(text) && !GENERIC_FIXTURE_INDEX.test(text); }
function sourceMentionsPerson(source, person) { const text = normalise([source?.title, source?.excerpt, source?.bodyText].map(clean).filter(Boolean).join(" ")); const p=canonicalPerson(person); return Boolean(text && p.full && text.includes(p.full)); }
function retainedDraftHasCurrentEvidence(draft) { const notes = Array.isArray(draft?.sourceNotes) ? draft.sourceNotes : []; if (notes.length < 2) return false; const valid = notes.filter((note) => { const publisher=clean(note?.publisher), url=clean(note?.url), usage=clean(note?.usage); return publisher && /^https?:\/\//i.test(url) && usage && !RETAINED_NON_EDITORIAL_USAGE.test(usage) && !NON_NEWS_EVIDENCE.test(usage) && !GENERIC_FIXTURE_INDEX.test(usage); }); return valid.length === notes.length && new Set(valid.map((note)=>clean(note.publisher).toLowerCase())).size >= 2; }
async function countStrictRetainedDrafts() {
  const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim(), dataset=process.env.NEXT_PUBLIC_SANITY_DATASET?.trim()||"production", apiVersion=process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim()||"2025-01-01", token=process.env.SANITY_API_TOKEN?.trim();
  if(!projectId||!token) return {count:0,ids:[],reason:"sanity-credentials-unavailable-default-to-five-fresh"};
  const packageDate=raw.packageDate||operationalDate(), prefix=`current-${packageDate}-*`; const client=createClient({projectId,dataset,apiVersion,token,useCdn:false,perspective:"raw"});
  const drafts=await client.fetch(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && coalesce(automationContentClass, "production") == "production" && editorialInputId match $prefix && (!defined(workflowStatus) || workflowStatus in ["draft", "submitted", "in-review", "review", "under-review", "approved"])] | order(coalesce(editorialGeneratedAt, _createdAt) asc) {_id, editorialInputId, sourceNotes}`,{prefix});
  const strict=(Array.isArray(drafts)?drafts:[]).filter(retainedDraftHasCurrentEvidence).slice(0,PACKAGE_SIZE); return {count:strict.length,ids:strict.map((d)=>d.editorialInputId||d._id),reason:"strict-retained-current-package-evidence"};
}
function assess(candidate) {
  const sources=Array.isArray(candidate.sourceRecords)?candidate.sourceRecords:[], editorialSources=sources.filter(isEditorialEvidenceSource), facts=Array.isArray(candidate.facts)?candidate.facts.map(clean).filter(Boolean):[];
  const distinctFacts=[...new Map(facts.map((fact)=>[normalise(fact),fact])).values()].filter(Boolean), factEvidence=distinctFacts.join(" ");
  const sourceText=editorialSources.flatMap((s)=>[s.title,s.excerpt,s.bodyText]).map(clean).filter(Boolean), evidence=[candidate.title,candidate.summary,candidate.editorialPosition?.subject,candidate.editorialPosition?.development,...distinctFacts,...sourceText].map(clean).filter(Boolean).join(" "), titleEvidence=[candidate.title,candidate.editorialPosition?.subject,candidate.editorialPosition?.development].map(clean).filter(Boolean).join(" ");
  const names=personNames(evidence), directNames=personNames(titleEvidence), corroboratedPeople=names.filter((name)=>editorialSources.filter((source)=>sourceMentionsPerson(source,name)).length>=2), distinctPublishers=new Set(editorialSources.map((s)=>clean(s.publisher||s.name).toLowerCase()).filter(Boolean));
  const hasConcreteMarker=SCORE_OR_NUMBER.test(evidence)||MONTH.test(evidence)||CONCRETE_RUGBY.test(evidence)||VENUE_WORDS.test(evidence)||QUOTED.test(evidence), matchLike=MATCHISH.test(titleEvidence), hasMatchContext=!matchLike||SCORE_OR_NUMBER.test(evidence)||MONTH.test(evidence)||VENUE_WORDS.test(evidence)||/\b(?:first|second|third|fourth) test\b/i.test(evidence), completedMatch=COMPLETED_MATCH.test(titleEvidence), squadSelection=SQUAD_SELECTION.test(titleEvidence), factPeople=personNames(factEvidence);
  const reasons=[];
  if(editorialSources.length<2||distinctPublishers.size<2) reasons.push("fewer-than-two-independent-news-sources");
  if(editorialSources.length!==sources.length) reasons.push("catalog-generic-team-or-fixture-index-source-present");
  if(distinctFacts.length<2) reasons.push("fewer-than-two-distinct-substantive-facts");
  if(names.length<1) reasons.push("no-named-person-in-evidence");
  if(names.length>=1&&corroboratedPeople.length<1) reasons.push("no-person-identity-corroborated-across-sources");
  if(!hasConcreteMarker) reasons.push("no-concrete-rugby-marker");
  if(!hasMatchContext) reasons.push("match-like-story-lacks-date-score-venue-or-test-context");
  if(completedMatch&&!FINAL_SCORE.test(factEvidence)) reasons.push("completed-match-fact-ledger-lacks-final-score");
  if(squadSelection&&factPeople.length<2) reasons.push("squad-selection-fact-ledger-lacks-two-named-people");
  if(hasPersonCollision(titleEvidence,factEvidence)) reasons.push("same-surname-different-person-evidence-collision");
  const evidenceScore=Math.min(4,distinctPublishers.size)*5+Math.min(8,distinctFacts.length)*2+Math.min(4,directNames.length)*4+Math.min(3,corroboratedPeople.length)*4+(FINAL_SCORE.test(factEvidence)?4:0)+(MONTH.test(evidence)?2:0)+(VENUE_WORDS.test(evidence)?2:0)+(CONCRETE_RUGBY.test(evidence)?3:0);
  return {passed:reasons.length===0,reasons,namedPeople:names.slice(0,8),directNamedPeople:directNames.slice(0,8),corroboratedPeople:corroboratedPeople.slice(0,8),sourceCount:sources.length,editorialNewsSourceCount:editorialSources.length,distinctPublisherCount:distinctPublishers.size,factCount:facts.length,distinctFactCount:distinctFacts.length,hasConcreteMarker,matchLike,hasMatchContext,completedMatch,squadSelection,factNamedPeople:factPeople.slice(0,8),evidenceScore};
}
const assessed=raw.candidates.map((candidate,index)=>({candidate,index,assessment:assess(candidate)}));
const acceptedAssessments=assessed.filter(({assessment})=>assessment.passed).sort((a,b)=>b.assessment.evidenceScore-a.assessment.evidenceScore||a.index-b.index), accepted=acceptedAssessments.map(({candidate})=>candidate), rejected=assessed.filter(({assessment})=>!assessment.passed).map(({candidate,assessment})=>({id:candidate.id,title:candidate.title,...assessment}));
const retained=await countStrictRetainedDrafts(), requiredFreshCandidates=Math.max(1,PACKAGE_SIZE-Math.min(PACKAGE_SIZE,retained.count));
const report={generatedAt:new Date().toISOString(),packageDate:raw.packageDate??null,inputCandidates:raw.candidates.length,acceptedCandidates:accepted.length,rejectedCandidates:rejected.length,retainedEligibleCount:retained.count,retainedEligibleIds:retained.ids,requiredFreshCandidates,retainedEvidenceReason:retained.reason,acceptedPriority:acceptedAssessments.map(({candidate,assessment})=>({id:candidate.id,title:candidate.title,evidenceScore:assessment.evidenceScore,directNamedPeople:assessment.directNamedPeople,corroboratedPeople:assessment.corroboratedPeople,distinctPublisherCount:assessment.distinctPublisherCount,distinctFactCount:assessment.distinctFactCount})),rejected,contract:"P0 coherent editorial-news + story-type generation-ready evidence before OpenAI generation",failClosed:true};
await fs.mkdir(path.dirname(path.resolve(reportPath)),{recursive:true}); await fs.writeFile(path.resolve(reportPath),`${JSON.stringify(report,null,2)}\n`);
if(accepted.length<requiredFreshCandidates){console.error(JSON.stringify(report,null,2));throw new Error(`Concrete evidence gate fail-closed before model spend: ${retained.count} strict retained + ${accepted.length} fresh generation-ready candidates is insufficient for ${PACKAGE_SIZE}; ${requiredFreshCandidates} fresh candidates are required.`);}
raw.candidates=accepted; raw.provenance={...(raw.provenance??{}),concreteEvidenceGate:{inputCandidates:assessed.length,acceptedCandidates:accepted.length,rejectedCandidates:rejected.length,retainedEligibleCount:retained.count,retainedEligibleIds:retained.ids,requiredFreshCandidates,reportPath,priority:"evidence-strength-desc",sourceBoundary:"news-editorial+exact-person-corroboration+story-type-generation-ready"}};
await fs.writeFile(path.resolve(batchPath),`${JSON.stringify(raw,null,2)}\n`);
console.log(JSON.stringify({concreteEvidenceGate:"passed",inputCandidates:assessed.length,acceptedCandidates:accepted.length,rejectedCandidates:rejected.length,retainedEligibleCount:retained.count,requiredFreshCandidates,priority:"evidence-strength-desc",batchPath,reportPath},null,2));
