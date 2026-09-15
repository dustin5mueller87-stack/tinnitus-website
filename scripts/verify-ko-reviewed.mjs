import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reviewedRules, applyReviewed} from '../netlify/ko-reviewed-20260915.ts';
import {applyPathFixes} from '../netlify/edge-functions/korean-audit-fixes.ts';
const summary=[];
const errors=[];
const imgs=s=>[...s.matchAll(/(?:src|href)=["']([^"']+\.(?:webp|png|jpg|jpeg|svg|gif)(?:\?[^"']*)?)["']/g)].map(x=>x[0]);
for(const route of new Set(reviewedRules.map(r=>r.page))){
 const file=route==='/ko'?'ko/index.html':route.slice(1)+'.html';
 const raw=readFileSync(file,'utf8');
 const input=applyPathFixes(route,raw);
 const output=applyReviewed(route,input);
 const rr=reviewedRules.filter(r=>r.page===route);
 for(const r of rr){
  const count=input.split(r.old).length-1;
  if(count!==r.count && !(count===0 && r.new && input.includes(r.new))){
   const first=r.old.replace(/^alt="/,'').slice(0,18);
   const at=input.indexOf(first);
   errors.push({id:r.id,file,expected:r.count,actual:count,context:at<0?'Exact beginning not found':input.slice(Math.max(0,at-120),at+550)});
  }
 }
 assert.deepEqual(imgs(output.html),imgs(input),`Image locations changed: ${file}`);
 assert.equal(applyReviewed(route,output.html).html,output.html,`Not idempotent: ${file}`);
 if(route.includes('geschichte') || route==='/ko'){
  assert.equal((output.html.match(/75(?:%|퍼센트)/g)||[]).length,(input.match(/75(?:%|퍼센트)/g)||[]).length,`75 percent changed: ${file}`);
 }
 for(const other of ['/','/en/','/ja/','/nl/','/es/','/tr/','/hi/','/id/']) assert.equal(applyReviewed(other,input).html,input);
 summary.push({file,planned:rr.length,applied:output.applied.length,unmatched:output.unmatched});
}
console.log(JSON.stringify({rules:reviewedRules.length,pages:summary.length,summary,errors},null,2));
if(errors.length)process.exit(1);
console.log('All current Korean source clauses verified. No image or other-language changes.');
