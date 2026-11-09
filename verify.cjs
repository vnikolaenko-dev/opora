const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const scripts=[...fs.readFileSync('index.html','utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const nodes={};const element=()=>({innerHTML:'',textContent:'',value:'',style:{},classList:{toggle(){}},setAttribute(){},prepend(){},addEventListener(){},showModal(){this.open=true},close(){this.open=false}});const get=id=>nodes[id]??=element();let stored;
const ctx={document:{getElementById:get,createElement:element,querySelector:s=>s.includes(':hover')||s.includes(':focus-within')?null:get(s),hidden:false},localStorage:{getItem(){return null},setItem(k,v){stored=v}},structuredClone,console,Date,Math,JSON,Number,String,Object,FormData:class{},setTimeout(){},clearTimeout(){},setInterval(){},window:{matchMedia(){return {matches:false}}}};
vm.createContext(ctx);for(const code of scripts)vm.runInContext(code,ctx);
vm.runInContext(`
for(const p of ['day','planning','goals','difficulties','habits','quit','notes']){go(p);if(!$('app').innerHTML)throw Error('Empty view '+p)}
go('day');if(!trackerHTML().includes('График')&&!trackerHTML().includes('график'))throw Error('Graph');changeTracker(1);if(trackerIndex!==1)throw Error('Carousel');
go('habits');toggleHabit('h1');if(weekRate(data.habits[0])!==1||streak(data.habits[0])!==1)throw Error('Habit gauge');setView('habit','list');if(!$('app').innerHTML.includes('habit-line'))throw Error('Habit list');
go('quit');setView('quit','list');if(!$('app').innerHTML.includes('list-counter'))throw Error('Quit list');quitTarget('q1');onSubmit({target:'45'});if(data.quits[0].target!==45)throw Error('Target');
go('planning');editEvent();onSubmit({title:'Встреча',date:shiftDate(date(),1),time:'18:00',related:'income',notes:'Тест'});save();if(upcoming().length!==1)throw Error('Upcoming');const eid=data.events[0].id;editEvent(eid);onSubmit({title:'Новая встреча',date:shiftDate(date(),2),time:'19:00',related:'income',notes:''});save();if(!dayRail().includes('Новая встреча'))throw Error('Home agenda');toggleEvent(eid);if(upcoming().length!==0)throw Error('Event done');toggleEvent(eid);if(upcoming().length!==1)throw Error('Event restore');
planMonth='2026-12';moveMonth(1);if(planMonth!=='2027-01')throw Error('Year rollover');
openItem('income');if($('app').innerHTML.includes('Изучить отчётность'))throw Error('Detail too dense');selectBranch('stocks');detailSwitch('metrics');if(!$('app').innerHTML.includes('Дивиденды за месяц'))throw Error('Metric tab');toggleBranch('stocks');if(!target('stocks').closed||target('stocks').metrics[0].values.length!==3)throw Error('History');toggleBranch('stocks');
addValue('stocks','m1');onSubmit({date:'2026-11-01',value:'4200'});if(target('stocks').metrics[0].values.length!==4)throw Error('Add value');
openItem('noise');convert();onSubmit({});if(item().type!=='problem')throw Error('Convert');
toggleMenu();if(!data.ui.menuHidden)throw Error('Collapse');toggleMenu();save();
`,ctx);

vm.runInContext(`
go('day');const recordsBefore=JSON.stringify({items:data.items,habits:data.habits,quits:data.quits,events:data.events,notes:data.notes});const originalLayout=JSON.stringify(data.ui.space);
startSpace();updateSpace('sp-chart','width',12);updateSpace('sp-chart','source','habit:h1');updateSpace('sp-chart','style','counter');resizeSpace('sp-chart',420);
if(!/studio-counter|habit-panel-counter/.test(spaceChart(spacePanel('sp-chart'))))throw Error('Counter visualization');
addSpace('quit');const addedId=spaceSelected;duplicateSpace(addedId);const copyId=spaceSelected;if(copyId===addedId)throw Error('Duplicate ID');
const oldFirst=spaceDraft.panels[0].id;moveSpace(copyId,-1);dropSpace(oldFirst,{preventDefault(){}});
spaceDrag=copyId;dropSpace(oldFirst,{preventDefault(){}});if(spaceDraft.panels[0].id!==copyId)throw Error('Drag reorder');
updateSpace('sp-calendar','visible',false);removeSpace(addedId);cancelSpace();if(JSON.stringify(data.ui.space)!==originalLayout)throw Error('Cancel changed saved layout');
startSpace();updateSpace('sp-chart','width',12);updateSpace('sp-chart','source','habit:h1');updateSpace('sp-chart','style','bars');saveSpace();if(data.ui.space.panels[0].width!==12)throw Error('Apply layout');
if(JSON.stringify({items:data.items,habits:data.habits,quits:data.quits,events:data.events,notes:data.notes})!==recordsBefore)throw Error('Layout changed user records');
if(new Set(spaceSources().map(s=>s.key)).size!==spaceSources().length)throw Error('Unstable source IDs');
`,ctx);
console.log('PASS: constructor draft isolation, source binding, chart/counter, width/height, duplicate IDs, keyboard/drag ordering, hide/remove, cancel, apply, stable sources, user records preserved.');


vm.runInContext(`
// Studio geometry, independent dashboards, history and query semantics.
go('day');const savedBeforeStudio=JSON.stringify(data.ui.space);startSpace();
const panel=spacePanel('sp-chart');updateSpace(panel.id,'x',4);updateSpace(panel.id,'w',20);if(panel.x+panel.w>24)throw Error('Grid bounds');
const coords=JSON.stringify(spaceDraft);studioCompact();studioUndoAction();if(JSON.stringify(spaceDraft)!==coords)throw Error('Undo coordinates');studioRedoAction();
for(const a of spaceDraft.panels.filter(p=>p.visible))for(const b of spaceDraft.panels.filter(p=>p.visible&&p.id!==a.id))if(overlaps(a,b))throw Error('Panel collision');
const p=spacePanel('sp-chart');p.sources=['habit:h1','habit:h2'];p.mode='multi';p.period='7';p.reduce='sum';p.style='line';if(!spaceChart(p).includes('studio-legend'))throw Error('Multi-series graph');
p.style='table';if(!spaceChart(p).includes('<table'))throw Error('Table');p.style='gauge';if(!spaceChart(p).includes('gauge'))throw Error('Gauge');
p.sources=['metric:income:stocks:m1','habit:h1'];p.style='line';if(!spaceChart(p).includes('разные единицы'))throw Error('Mixed units guard');
const imported=validStudioImport({format:'opora-dashboard',version:2,name:'Import',space:spaceDraft});if(imported.id===data.ui.activeBoard)throw Error('Import isolation');
let rejected=false;try{validStudioImport({format:'opora-dashboard',version:2,space:{panels:[{...p,id:'bad id'}]}})}catch{rejected=true}if(!rejected)throw Error('Import validation');
cancelSpace();if(JSON.stringify(data.ui.space)!==savedBeforeStudio)throw Error('Studio cancel modified layout');
const oldBoard=data.ui.activeBoard;boardDialog('new');onSubmit({name:'Проверка отдельного дашборда'});if(data.ui.activeBoard===oldBoard||data.ui.space.panels.length)throw Error('New board');startSpace();studioAdd('text');studioSet(spaceSelected,'text','Проверка');saveSpace();const newBoard=data.ui.activeBoard;switchBoard(oldBoard);if(!data.ui.space.panels.length)throw Error('Board switch');switchBoard(newBoard);if(data.ui.space.panels[0].text!=='Проверка')throw Error('Board persistence');switchBoard(oldBoard);save();
`,ctx);
console.log('PASS: 24-column bounds, collision handling, compaction undo/redo, multi-series, table/gauge, unit compatibility, import validation, draft cancellation, named dashboards and independent persistence.');


vm.runInContext(`
go('day');startSpace();const pinp=spacePanel('sp-chart');pinp.mode='rotate';pinp.source='rotate';pinp.style='auto';pinp.sourceStyles={};pinp.pinnedSource=null;pinp.sources=['habit:h1','metric:income:stocks:m1'];spaceChartIndices[pinp.id]=0;
if(effectivePanelView(pinp)!=='counter'||!spaceChart(pinp).includes('habit-panel-counter'))throw Error('Auto habit counter');
setPanelView(pinp.id,'gauge');if(effectivePanelView(pinp)!=='gauge')throw Error('Per-source view');
cycleSpace(pinp.id,1);if(effectivePanelView(pinp)!=='line')throw Error('Auto metric graph');
pinPanelSource(pinp.id);const frozen=spaceChartIndices[pinp.id];cycleSpace(pinp.id,1);if(spaceChartIndices[pinp.id]!==frozen||studioRows(pinp)[0].key!=='metric:income:stocks:m1')throw Error('Pinned tracker advanced');
pinPanelSource(pinp.id);cycleSpace(pinp.id,1);if(effectivePanelView(pinp)!=='gauge')throw Error('View not remembered for habit');
pinPanelSource(pinp.id);studioSelectSource(pinp.id,'habit:h1',false);if(spacePanel(pinp.id).pinnedSource)throw Error('Removed source stays pinned');
cancelSpace();startSpace();const savedPin=spacePanel('sp-chart');savedPin.mode='rotate';savedPin.source='rotate';savedPin.sources=['habit:h1'];savedPin.style='auto';spaceChartIndices[savedPin.id]=0;pinPanelSource(savedPin.id);saveSpace();if(!data.ui.space.panels.find(p=>p.id===savedPin.id).pinnedSource)throw Error('Pin not saved');
`,ctx);
console.log('PASS: automatic habit counters/metric graphs, per-tracker visualization, pin stops cycling, unpin resumes, removed source unpins, pin persistence.');

assert.equal(JSON.parse(stored).events.length,1);assert.equal(JSON.parse(stored).ui.habitView,'list');console.log('PASS: 7 sections, graph carousel, habit gauges/list, quit target/list, event create/edit/complete/restore, upcoming events, month/year navigation, simplified goal tabs, close/reopen preservation, measurements, circumstance conversion, menu and persistence.');
