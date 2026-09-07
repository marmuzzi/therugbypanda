import assert from "node:assert/strict";

const IRISH_PRIMARY = /\b(?:ireland|irish|irfu|leinster|munster|ulster|connacht)\b/i;
const IRISH_CATEGORY = new Set(["Ireland", "Leinster", "Munster", "Ulster", "Connacht"]);
function text(c){ return [c.title,c.summary,c.subject,c.development,c.editorialAngle,c.editorialPosition?.subject,c.editorialPosition?.development,c.editorialPosition?.angle].filter(Boolean).join(" "); }
function isIrish(c){ return IRISH_CATEGORY.has(c.suggestedCategory) || IRISH_PRIMARY.test(text(c)); }
function irelandFirst(candidates){ return [...candidates.filter(isIrish),...candidates.filter((c)=>!isIrish(c))]; }

const dominated=[
  {id:"erasmus",title:"Rassie Erasmus plots Springbok changes",suggestedCategory:"URC"},
  {id:"all-blacks",title:"All Blacks alter their pack",suggestedCategory:"URC"},
  {id:"wallabies",title:"Wallabies prepare for next Test",suggestedCategory:"URC"},
  {id:"leinster",title:"Leinster confirm academy changes",suggestedCategory:"Leinster"},
  {id:"munster",title:"Munster update their squad",suggestedCategory:"Munster"},
  {id:"irish-abroad",title:"Irish coach takes new role abroad",suggestedCategory:"Europe"},
  {id:"ulster",title:"Ulster prepare for URC opener",suggestedCategory:"Ulster"},
];
const ordered=irelandFirst(dominated);
assert.deepEqual(ordered.slice(0,4).map((c)=>c.id),["leinster","munster","irish-abroad","ulster"]);
// Simulate one Irish candidate failing Publication Review: the next attempt must still be Irish.
const successful=[];
for(const candidate of ordered){ if(candidate.id==="leinster") continue; successful.push(candidate); if(successful.length===5) break; }
assert.ok(successful.slice(0,3).every(isIrish),"one failed Irish candidate must be replaced by another Irish candidate before international-only slots are used");
assert.ok(successful.filter(isIrish).length>=3,"five-story package must contain at least three Irish-connected stories");
assert.ok(successful.filter((c)=>!isIrish(c)).length<=2,"five-story package must contain at most two international-only stories");
console.log("Ireland-first package selection regression: passed");