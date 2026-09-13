import fs from 'node:fs';

// Text is read from the author's revised Figma frames, never their stale names.
const source=JSON.parse(fs.readFileSync('docs/figma-source-2026-09-13.json','utf8'));
const clean=(i)=>source[i-1].texts.map(x=>x.text).filter(t=>!/^\d+\s*\/\s*\d+$/.test(t)&&!/^\d+$/.test(t)&&!['→','↗','↘','●','•'].includes(t));
const raw=i=>source[i-1].texts.map(x=>x.text);
const text=(i,id)=>source[i-1].texts.find(x=>x.id===id).text;
const chapters=['導入','考え方と型','Work1｜共通テーマ','提案後のアクション','UIカルタ・UI言語化講座','午後の振り返り・AI','Work2-1｜自プロダクトの提案','Work2-2｜提案の見直し','まとめ・実務へ持ち帰る'];
const chapter=i=>i<=8?0:i<=21?1:i<=29?2:i<=35?3:i<=37?4:i<=43?5:i<=53?6:i<=57?7:8;
const slides=[];
function add(i,kind,fields={}){const p=clean(i),c=chapter(i);let tag=p[0];if(/^\d+\s*\//.test(tag))tag=tag.replace(/^\d+/,String(c+1).padStart(2,'0'));if(c===6)tag=tag.replace(/WORK 2\s*·?/, 'WORK 2-1 ·').replace(/·\s*·/,'·');if(c===7)tag=tag.replace(/WORK 2\s*·?/, 'WORK 2-2 ·').replace(/·\s*·/,'·');slides.push({chapter:c,kind,title:p[1],tag,sourceId:source[i-1].id,note:'',...fields});}
const pairs=(a,n=2)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,i*n+n));
function cards(i,kind='standard',n=2,bottom=false){const p=clean(i);add(i,kind,{items:pairs(p.slice(2,bottom?-1:undefined),n),...(bottom?{bottom:p.at(-1)}:{})});}
function work(i){const p=clean(i),r=raw(i),at=r.indexOf('演習時間');const qs=p.slice(5);const items=qs.map(q=>[q]);if(items.at(-1)?.[0].startsWith('このデザインは'))items.at(-2).push(items.pop()[0]);add(i,'work',{time:Number(r[at+1]),mode:p[4],items});}
function compact(i,ai=false){const p=clean(i);add(i,'compact-template',{items:pairs(p.slice(2,10)),...(ai?{bottom:p[10],callout:p[11]}:{summary:p[11]})});}
function cover(i){const p=clean(i);add(i,'cover',{tag:undefined,title:i===1?p.slice(2,4).join(''):p[2],sub:i===1?p[4]:p[3],bottom:p.at(-2)});}

cover(1);
add(2,'opening-question');
for(const i of [3,4]){const p=clean(i);add(i,'conversation',{items:[[p[3],p[1],p[2]],[p[5],p[4]]],bottom:p[6]});}
{const p=clean(5);add(5,'conversation',{items:[[p[3],p[1],p[2]]],bottom:p[4]});}
cards(6,'judgment-gap',2,true);
cards(7,'goal',1);
add(8,'agenda');
cards(9,'design-layers',3,true);
{const p=clean(10);add(10,'role-perspectives',{items:pairs(p.slice(2,-1),3)});}
{const p=clean(11);add(11,'shared-understanding',{items:[p.slice(2,5),p.slice(5,7)],bottom:p[7]});}
cards(12,'steps-overview');
{const p=clean(13);add(13,'comic-aside',{title:p[2],sub:p[0],tag:undefined});}
compact(14);
add(15,'gherkin-example',{items:[['Given',text(15,'2:941')],['When',text(15,'2:951')],['Then',text(15,'2:961')]],bottom:text(15,'2:971')});
cards(16,'compare',3);
cards(17,'hypotheses',2,true);
cards(18,'compare',2,true);
cards(19,'compare',3,true);
compact(20);
add(21,'break',{tag:undefined,title:clean(21)[0],bottom:clean(21)[1],time:15,timerPlacement:'badge'});
add(22,'transition',{title:clean(22)[0],tag:'WORK 1',illustration:'concept'});
{const p=clean(23);add(23,'case',{items:[p.slice(2,4)],bottom:p[4]});}
{const p=clean(24);add(24,'case-profile',{items:p.slice(3,13).map(x=>[x]),bottom:p[14]});}
add(25,'reference-image',{callout:clean(25)[2]});
cards(26,'flow',1,true);
work(27);work(28);work(29);
cards(30,'flow',2,true);
{const p=clean(31);add(31,'evidence-check',{title:p[2],items:pairs(p.slice(3))});}
{const p=clean(32);add(32,'role-dialogue',{items:pairs(p.slice(2,6)),sub:p[6],bottom:p[7]});}
cards(33);
cards(34,'standard',2,true);
{const p=clean(35);add(35,'break',{title:p[1],sub:p[2],bottom:p[3]});}
add(36,'karuta',{time:30});
add(37,'guest',{time:25});
cards(38,'standard',2,true);
cards(39,'hypotheses',2,true);
cards(40,'compare',2,true);
cards(41,'compare',3,true);
cards(42);
compact(43,true);
add(44,'transition',{title:clean(44)[0],tag:'WORK 2',illustration:'concept'});
cards(45,'standard',2,true);
work(46);work(47);work(48);work(49);
cards(50,'flow',2,true);
cards(51,'standard',2,true);
cards(52,'flow',2,true);
{const p=clean(53);add(53,'break',{title:p[1],sub:p[2],bottom:p[3],time:15,timerPlacement:'badge'});}
work(54);
add(55,'transition',{illustration:'concept',tag:'WORK 2-2 · 席替え'});
work(56);
add(57,'transition',{title:clean(57)[0],tag:undefined,illustration:'welcome'});
cards(58,'steps-overview');
compact(59);
cards(60,'standard',2,true);
cards(61);
add(62,'standard',{sub:clean(62)[2]});
work(63);
cards(64);
cover(65);
{const p=clean(66);add(66,'cover',{tag:undefined,title:p[2],bottom:p.at(-2),illustration:'welcome'});}

// The only copy corrections here are numbering and schedule, as authorized.
slides[16].items[3][0]='仮説 C';
slides[38].items[3][0]='仮説 C';
slides[47].tag='WORK 2-1 · 発表準備';
slides[44].tag='WORK 2-1';
const timingPath='docs/workshop-schedule-2026-09-13.json';
let schedule=[];
if(fs.existsSync(timingPath)){
 const plan=JSON.parse(fs.readFileSync(timingPath,'utf8'));schedule=plan.schedule;
 for(const [index,overrides] of Object.entries(plan.pageTimings)){
  const {window,...fields}=overrides;
  Object.assign(slides[Number(index)-1],fields,window?{timeWindow:window}:{});
 }
}
const type="export type Slide={chapter:number;kind?:string;title:string;sub?:string;items?:string[][];note:string;time?:number;timerPlacement?:'badge';mode?:string;done?:string;tag?:string;bottom?:string;sourceId?:string;timeWindow?:string;illustration?:'concept'|'welcome';summary?:string;callout?:string};\n";
const out=type+'export const chapters='+JSON.stringify(chapters)+';\nexport const schedule='+JSON.stringify(schedule)+';\nexport const steps:string[][]=[];\nexport const slides:Slide[]=\n'+JSON.stringify(slides,null,2)+';\n';
fs.writeFileSync('app/slides.ts',out);
console.log('Synced',slides.length,'slides in Figma order. Schedule rows:',schedule.length);
