(() => {
const data=window.TIDELINE_DATA,$=id=>document.getElementById(id);
let idx=data.findIndex(d=>d.year===1969),filter='All',activeEvent=null,activeEventYear=null;
const yearText=y=>y<0?Math.abs(y)+' BCE':y===0?'1 CE':y+' CE';
const century=y=>y<0?'BCE':y<100?'1ST CENTURY':Math.floor(y/100)+1+'TH CENTURY';
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stories={
space:[[1903,'FIRST FLIGHT','Powered flight begins'],[1957,'SPUTNIK','First artificial satellite'],[1961,'GAGARIN','First human in space'],[1969,'APOLLO 11','First crewed Moon landing'],[1998,'ISS','International Space Station assembly begins'],[2021,'JWST','Next-generation telescope launches']],
internet:[[1969,'ARPANET','Early packet-switching network'],[1983,'TCP/IP','Shared internet protocol becomes standard'],[1989,'THE WEB','World Wide Web proposed'],[1991,'PUBLIC WEB','Web opens to wider use'],[2007,'SMARTPHONE','Internet moves into the pocket'],[2023,'GENERATIVE AI','New interfaces to digital knowledge']],
cinema:[[1895,'EARLY CINEMA','Public film screenings'],[1927,'SOUND FILM','Sound transforms the screen'],[1939,'COLOUR ERA','Colour features gain prominence'],[1950,'WIDESCREEN','New formats reshape moviegoing'],[1995,'DIGITAL VFX','Digital effects expand storytelling'],[2020,'STREAMING','Home viewing becomes central']],
architecture:[[1900,'ART NOUVEAU','Organic forms and ornament'],[1925,'ART DECO','Geometry and modern materials'],[1950,'MODERNISM','Function, form and new materials'],[1970,'BRUTALISM','Monumental exposed concrete'],[2000,'SUSTAINABILITY','Efficiency enters design priorities'],[2025,'ADAPTIVE REUSE','Cities rethink existing buildings']],
'human-rights':[[1919,'LEAGUE ERA','New international institutions'],[1945,'UN FOUNDED','A new global organisation'],[1948,'UDHR','Universal Declaration adopted'],[1960,'DECOLONISATION','New independent states'],[1994,'TRANSITION','Apartheid ends in South Africa'],[2015,'SDGs','Global development goals adopted']]
};
function jumpYear(y){let best=0,dist=Infinity;data.forEach((d,i)=>{const n=Math.abs(d.year-y);if(n<dist){dist=n;best=i}});idx=best;filter='All';render();$('yearRange').scrollIntoView({behavior:'smooth',block:'center'})}
function openEvent(e,d){activeEvent=e;activeEventYear=d.year;$('modalKicker').textContent=e[0].toUpperCase()+' / '+yearText(d.year);$('modalTitle').textContent=e[1];$('modalBody').textContent=e[2];$('modalExtra').textContent=e[3]||'Explore the wider context of this moment in the Tideline archive.';$('modalDate').textContent=yearText(d.year);$('modal').classList.add('open');$('modal').setAttribute('aria-hidden','false');$('closeModal').focus()}
function renderParallel(d){const regions=['NORTH AMERICA','EUROPE','SOUTH ASIA','EAST ASIA','AFRICA','OCEANIA'];const lines=['Political, cultural and technological changes unfold across the region.','Local events connect to wider movements in trade, politics and ideas.','Societies and cultures develop through distinct local histories.','Innovation, exchange and political change shape many communities.','A wide range of societies, states and cultures shape the continent’s story.','Island communities and continental societies have distinct histories and connections.'];$('parallelGrid').innerHTML=regions.map((r,i)=>`<article class="parallel-card"><div class="place">${r}</div><h3>${safe(yearText(d.year))}</h3><p>${safe(lines[i])}</p></article>`).join('')}
function render(){
 const d=data[idx];$('heroYear').textContent=d.label;$('yearPeriod').textContent=d.year<0?'BEFORE COMMON ERA':'COMMON ERA';$('eraTitle').textContent=d.era;$('eraDescription').textContent=d.desc;$('rangeLabel').textContent=yearText(d.year);$('eraIndex').textContent=century(d.year)+' · '+String(idx+1).padStart(2,'0')+' / '+data.length;$('yearRange').value=idx;$('yearRange').max=data.length-1;$('reflection').textContent=d.reflection;
 ['lifeSound','lifeObjects','lifeStyle','lifeRhythm'].forEach((id,i)=>$(id).textContent=d.life[i]);
 const events=d.events.filter(e=>filter==='All'||e[0]===filter);$('allCount').textContent=' '+d.events.length;
 $('eventList').innerHTML=events.map(e=>`<button class="event-card" data-event="${d.events.indexOf(e)}"><span class="event-category">${safe(e[0])}</span><span><span class="event-title">${safe(e[1])}</span><span class="event-summary">${safe(e[2])}</span></span><span class="event-arrow">↗</span></button>`).join('');$('emptyState').hidden=events.length!==0;
 document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));$('eventList').querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>openEvent(d.events[+b.dataset.event],d)));renderParallel(d);renderCapsules(d);renderThenNow();renderSound(d);$('mapYear').textContent='CURRENTLY EXPLORING · '+yearText(d.year);
}
function renderCapsules(d){
 const era=d.year<1920?'early 20th century':d.year<1950?'interwar and wartime era':d.year<1980?'mid-century':d.year<2000?'late 20th century':'digital age';
 const objects=[
 ['PHOTOGRAPHS','A visual record',`Photographs from the ${era}: streets, homes, work, public events and ordinary people.`, 'photographs '+d.year,'https://www.loc.gov/photos/?fo=json&q='],
 ['POSTERS & PRINT','The public voice',`Posters, newspapers, advertisements and printed ephemera reveal what people saw and read.`, 'posters newspapers '+d.year,'https://www.europeana.eu/en/search?query='],
 ['OBJECTS & DESIGN','Things people used',`${d.life[1]}. Look for surviving objects, product design and tools of everyday life.`, 'everyday objects technology '+d.year,'https://www.si.edu/search/collection-images?edan_q='],
 ['DOCUMENTS','Words from the time',`Letters, maps, official documents and first-hand records help recover contemporary perspectives.`, 'historical documents '+d.year,'https://www.loc.gov/search/?q=']
 ];
 $('capsuleGrid').innerHTML=objects.map(c=>`<article class="capsule"><span>${c[0]}</span><h3>${c[1]}</h3><p>${safe(c[2])}</p><a class="capsule-link" target="_blank" rel="noopener" href="${c[4]+encodeURIComponent(c[3])}">SEARCH COLLECTIONS ↗</a></article>`).join('');
}
function renderThenNow(){
 const y=+$('thenNowRange').value,d=data.find(x=>x.year===y)||data.reduce((a,b)=>Math.abs(b.year-y)<Math.abs(a.year-y)?b:a);
 $('thenYear').textContent=y;$('thenText').textContent=d.era+'. '+d.desc;
 const comps=[
 ['COMMUNICATION',y<1950?'Letters, telegrams, landlines and print media shaped communication.':y<1995?'Telephones, broadcast television and early computer networks connected people.':y<2007?'Email, websites and mobile phones accelerated global communication.':'Smartphones, messaging, video calls and social platforms make communication nearly instantaneous.','Smartphones, messaging, video calls, social networks and AI-assisted tools.'],
 ['TRANSPORT',y<1920?'Walking, horses, railways and steamships carried most long-distance journeys.':y<1950?'Rail, ocean liners, buses and growing car ownership moved people.':y<2000?'Mass car ownership, commercial aviation and expanding public transit.':'High-speed rail, global aviation, electric vehicles and app-based mobility.','Electric vehicles, high-speed rail, aviation and real-time navigation.'],
 ['MEDIA & SOUND',y<1927?'Live performance, print, gramophones and silent cinema.':y<1980?'Radio, records, cinema and television define mass entertainment.':y<2005?'Cassette tapes, CDs, television, video games and early online media.':'Streaming, podcasts, social video, games and creator platforms.','Streaming libraries, podcasts, social video, games and digital creation.'],
 ['EVERYDAY TOOLS',d.life[1]+'. '+d.life[3]+'.','Connected devices, cloud services, smart appliances and digital payments.']
 ];
 $('comparisonGrid').innerHTML=comps.map(c=>`<article class="comparison-card"><span>${c[0]}</span><div><small>${y} · THEN</small><p>${safe(c[1])}</p></div><div><small>2025 · NOW</small><p>${safe(c[2])}</p></div></article>`).join('');
}
function renderSound(d){
 $('soundTitle').textContent=d.life[0];
 const era=d.year<1920?'acoustic recordings, live ensembles and regional folk traditions':d.year<1950?'radio orchestras, swing, jazz, blues and popular song':d.year<1980?'radio, vinyl records, soul, rock, funk and regional music scenes':d.year<2000?'cassette tapes, CDs, hip-hop, pop, electronic music and global radio':'digital recording, streaming, global pop and independent online scenes';
 $('soundText').textContent=`For ${yearText(d.year)}, explore ${era}. The exact sound varied by region, language, class and community; this is a listening doorway, not a single soundtrack for the whole world.`;
 const q=encodeURIComponent(d.life[0]+' '+d.year+' historical recording');
 $('soundLink').href='https://commons.wikimedia.org/wiki/Special:MediaSearch?type=audio&search='+q;
 $('soundLocLink').href='https://www.loc.gov/audio/?fo=json&q='+q;
 $('soundEuropeLink').href='https://www.europeana.eu/en/search?query='+q;
}
const regionInfo={'North America':'Indigenous histories, colonisation, migration, industrialisation and social movements all shape this region.','Europe':'Empires, cities, religious and intellectual movements, industrial change and shifting borders connect many distinct histories.','Africa':'The continent contains many political, linguistic and cultural histories. Trade networks, kingdoms, colonial rule, resistance and independence vary widely by place.','South Asia':'Long histories of urban life, trade, religious and philosophical traditions, empires, colonialism and independence shape this region.','East Asia':'Distinct histories of states, philosophies, trade, technology, art and social change connect communities across the region.','Oceania':'Island societies and the Australian continent hold diverse Indigenous histories, maritime networks, colonial histories and contemporary connections.'};

const mapPeriods={
1900:{title:'A world shaped by empires',label:'GLOBAL EMPIRES',text:'European imperial powers control large territories in Africa and Asia; the Ottoman, Qing and other empires remain important political forces. The coloured shapes show broad areas of imperial rule and influence, not surveyed borders.',british:[[105,125,105,45],[471,196,55,80],[785,165,55,45],[805,310,40,24]],french:[[490,260,75,62],[525,128,30,24]],other:[[595,135,125,55],[185,132,75,45]]},
1914:{title:'Empires at the edge of war',label:'THE WORLD IN 1914',text:'On the eve of the First World War, imperial competition is global. The Ottoman Empire still spans parts of southeast Europe and western Asia; European colonial rule shapes much of Africa and parts of Asia.',british:[[105,125,105,45],[471,196,55,80],[785,165,55,45],[805,310,40,24]],french:[[490,260,75,62],[525,128,30,24]],other:[[595,135,125,55],[185,132,75,45],[470,130,52,34]]},
1945:{title:'A postwar order takes shape',label:'THE WORLD IN 1945',text:'The Second World War ends. European empires remain, but anti-colonial movements gather force; the United States and Soviet Union emerge as superpowers. The map highlights broad postwar spheres and colonial reach, not precise frontiers.',british:[[105,125,105,45],[471,196,55,80],[785,165,55,45]],french:[[490,260,75,62],[525,128,30,24]],other:[[185,132,75,45],[600,135,110,55]]},
1960:{title:'Decolonisation redraws the map',label:'THE YEAR OF AFRICA',text:'Seventeen African countries become independent in 1960. Decolonisation is reshaping the political map, while Cold War alliances influence politics across several regions. Independence timelines differ by country.',british:[[105,125,105,45],[471,196,55,80],[785,165,55,45]],french:[[490,260,75,62]],other:[[600,135,110,55]]},
1991:{title:'The Cold War ends',label:'A NEW WORLD ORDER',text:'The Soviet Union dissolves in 1991. Across Europe and Eurasia, new states emerge and political boundaries change. The map marks the broad former Soviet sphere rather than depicting every successor-state border.',british:[],french:[],other:[[620,125,100,65]]},
2025:{title:'A world of sovereign states',label:'CONTEMPORARY WORLD',text:'The contemporary map is a world of sovereign states, disputed territories and changing alliances. This stylised view is a geographic orientation layer, not a detailed current political-boundary dataset.',british:[],french:[],other:[]}
};
function drawMapPeriod(year){
 const p=mapPeriods[year]||mapPeriods[1900],g=$('mapOverlays'),colors={british:'#b85f42',french:'#d2a36d',other:'#718c84'};
 $('mapRegionLabel').textContent=year+' · '+p.label;$('mapTitle').textContent=p.title;$('mapText').textContent=p.text;$('mapYear').textContent='MAP PERIOD · '+year;window.tidelineMapYear=year;
 g.innerHTML=Object.entries(p).filter(([k,v])=>Array.isArray(v)).map(([k,items])=>items.map(([x,y,w,h])=>`<ellipse class="territory ${k}" cx="${x}" cy="${y}" rx="${w/2}" ry="${h/2}" fill="${colors[k]}"/>`).join('')).join('');
 document.querySelectorAll('[data-map-period]').forEach(b=>b.classList.toggle('active',+b.dataset.mapPeriod===year));
}


document.querySelectorAll('[data-map-period]').forEach(b=>b.addEventListener('click',()=>drawMapPeriod(+b.dataset.mapPeriod)));
$('mapJump').addEventListener('click',()=>jumpYear(window.tidelineMapYear));
function renderStory(key){currentStory=key;$('storyTrack').innerHTML=stories[key].map(([y,l,d])=>`<button class="story-stop" data-story-year="${y}"><span>${l}</span><b>${y}</b><small>${d}</small></button>`).join('');$('storyTrack').querySelectorAll('[data-story-year]').forEach(b=>b.addEventListener('click',()=>jumpYear(+b.dataset.storyYear)))}
let currentStory='space';const archiveKey='tideline-personal-archive-v3';function getSaved(){try{return JSON.parse(localStorage.getItem(archiveKey)||'[]')}catch(e){return []}}
function renderArchive(){const all=getSaved(),f=$('archiveFilter').value;const a=all.filter(x=>f==='All'||(f==='Years'&&x.type==='year')||(f==='Events'&&x.type==='event')||(f==='Stories'&&x.type==='story'));$('savedCount').textContent=all.length+' SAVED';$('savedArchive').innerHTML=a.length?a.map((x,i)=>`<article class="saved-item"><div><strong>${safe(x.label)}</strong><small>${safe(x.note)}</small></div><button data-remove="${safe(x.key)}" aria-label="Remove saved item">×</button></article>`).join(''):'<p class="archive-empty">Your archive is waiting. Save a year or an event to begin.</p>';$('savedArchive').querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{const x=getSaved();const n=x.findIndex(v=>v.key===b.dataset.remove);if(n>=0)x.splice(n,1);localStorage.setItem(archiveKey,JSON.stringify(x));renderArchive()}))}
$('saveEventBtn').addEventListener('click',()=>{
 if(!activeEvent)return;
 const a=getSaved(),key='event-'+activeEventYear+'-'+activeEvent[1];
 if(a.some(x=>x.key===key)){toast('This event is already in your archive.');return}
 a.unshift({key,type:'event',year:activeEventYear,label:activeEvent[1],note:yearText(activeEventYear)+' · '+activeEvent[0]});
 localStorage.setItem(archiveKey,JSON.stringify(a));renderArchive();toast('Event saved to your personal archive.');
});
$('saveYearBtn').addEventListener('click',()=>{const d=data[idx],a=getSaved();if(a.some(x=>x.year===d.year)){toast('This year is already in your archive.');return}a.unshift({key:'year-'+d.year,type:'year',year:d.year,label:yearText(d.year),note:d.era});localStorage.setItem(archiveKey,JSON.stringify(a));renderArchive();toast('Year saved to your personal archive.')});
function toast(m){$('toast').textContent=m;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)}

$('saveStoryBtn').addEventListener('click',()=>{
 const labels={space:'Space exploration',internet:'The internet',cinema:'Cinema',architecture:'Architecture & design','human-rights':'Human rights'};
 const key='story-'+currentStory,a=getSaved();if(a.some(x=>x.key===key)){toast('This story is already in your archive.');return}
 a.unshift({key,type:'story',label:labels[currentStory],note:'Guided story collection'});localStorage.setItem(archiveKey,JSON.stringify(a));renderArchive();toast('Story saved to your personal archive.');
});
$('archiveFilter').addEventListener('change',renderArchive);
$('yearRange').addEventListener('input',e=>{idx=+e.target.value;render()});document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render()}));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{const r={ancient:[-3000,0],medieval:[476,1348],renaissance:[1450,1600],modern:[1750,1989],contemporary:[2000,2025]},[a,z]=r[b.dataset.jump],c=data.map((d,i)=>({i,y:d.year})).filter(x=>x.y>=a&&x.y<=z);if(c.length){idx=c[0].i;render()}}));
$('closeModal').addEventListener('click',()=>$('modal').classList.remove('open'));$('modal').addEventListener('click',e=>{if(e.target===$('modal'))$('modal').classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('modal').classList.remove('open');if(e.key==='ArrowRight'&&!$('modal').classList.contains('open')){idx=Math.min(idx+1,data.length-1);render()}if(e.key==='ArrowLeft'&&!$('modal').classList.contains('open')){idx=Math.max(idx-1,0);render()}});
$('aboutBtn').addEventListener('click',()=>openEvent(['ABOUT','History is a place you can visit.','TIDELINE is an interactive atlas of human history. This edition is an editorial starter archive—not an exhaustive or definitive history.','The regional map is schematic. Audio links lead to external collections. Entries should be source-checked before publication.'],{year:1969}));
$('lifeBtn').addEventListener('click',()=>$('capsuleGrid').scrollIntoView({behavior:'smooth'}));
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('night');const on=document.body.classList.contains('night');$('themeBtn').textContent=on?'DAY MODE':'NIGHT MODE';try{localStorage.setItem('tideline-night',on?'1':'0')}catch(e){}});
try{if(localStorage.getItem('tideline-night')==='1'){document.body.classList.add('night');$('themeBtn').textContent='DAY MODE'}}catch(e){}
$('thenNowRange').addEventListener('input',renderThenNow);$('storySelect').addEventListener('change',e=>renderStory(e.target.value));document.querySelectorAll('[data-story]').forEach(b=>b.addEventListener('click',()=>{$('storySelect').value=b.dataset.story;renderStory(b.dataset.story);document.querySelector('.machine-section').scrollIntoView({behavior:'smooth'})}));
$('yearRange').max=data.length-1;renderStory('space');renderArchive();drawMapPeriod(1900);render();
})();