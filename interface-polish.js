/* Interface icons: inline SVG, without emoji fonts or external assets. */
const interfaceIconPaths={
 menu:'M4 6h16M4 12h16M4 18h16',
 day:'M12 3a9 9 0 1 0 9 9M12 3v9h9',
 goal:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 10v4M10 12h4',
 difficulty:'m12 3 9 9-9 9-9-9 9-9ZM12 8v5M12 16h.01',
 check:'m5 12 4 4L19 6',
 notes:'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 8h7M9 12h7M9 16h5',
 calendar:'M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01',
 arrowUpRight:'M6 18 18 6M6 6h12v12',
 left:'M20 12H4m7-7-7 7 7 7',right:'M4 12h16m-7-7 7 7-7 7',
 up:'M12 20V4m-7 7 7-7 7 7',down:'M12 4v16m-7-7 7 7 7-7',
 chevronLeft:'m15 5-7 7 7 7',chevronRight:'m9 5 7 7-7 7',
 plus:'M12 5v14M5 12h14',
 edit:'m15 4 5 5M4 20l5-1L20 8a2.1 2.1 0 0 0-4-4L5 15l-1 5Z',
 pin:'M9 3h6l-1 6 4 4v2H6v-2l4-4-1-6ZM12 15v6',
 list:'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
 gauge:'M4.6 17a9 9 0 1 1 14.8 0M12 12l4-5M12 12h.01',
 mic:'M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0V5ZM5 10v1a7 7 0 0 0 14 0v-1M12 18v3M8 21h8',
 undo:'M4 9h10a6 6 0 0 1 0 12M4 9l5-5M4 9l5 5',redo:'M20 9H10a6 6 0 0 0 0 12M20 9l-5-5M20 9l-5 5',
 more:'M5 12h.01M12 12h.01M19 12h.01',
 grip:'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
 settings:'m9 3-.6 3-2.7 1.6L3 7l-1 3 2.1 2L4 15l3 2 2 1 .5 3h5l.6-3 2.7-1.6 2.7.6 1-3-2.1-2L20 9l-3-2-2-1-.5-3H9ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
 copy:'M8 8h12v12H8V8ZM16 8V4H4v12h4',
 expand:'M9 3H3v6M15 3h6v6M21 15v6h-6M9 21H3v-6',
 shrink:'M3 9h6V3M21 9h-6V3M15 21v-6h6M3 15h6v6',
 resize:'m9 20 11-11M15 20l5-5',
 info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 10v7M12 7h.01',
 close:'m6 6 12 12M18 6 6 18',
 logo:'M12 3a9 9 0 1 0 9 9h-9V3ZM12 3a9 9 0 0 1 9 9'
};
const interfaceIconGlyphs={'☰':'menu','◷':'day','◎':'goal','◇':'difficulty','✓':'check','▤':'notes','▦':'calendar','↗':'arrowUpRight','←':'left','→':'right','↑':'up','↓':'down','‹':'chevronLeft','›':'chevronRight','＋':'plus','✎':'edit','⌖':'pin','☷':'list','◉':'gauge','↶':'undo','↷':'redo','⋯':'more','⋮':'grip','⚙':'settings','⧉':'copy','⛶':'expand','↙':'shrink','◢':'resize','ⓘ':'info','×':'close','◒':'logo'};
function interfaceIcon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${interfaceIconPaths[name]||interfaceIconPaths.plus}"></path></svg>`}
(function(){
 if(typeof MutationObserver==='undefined'||!document.createElement)return;
 const iconOnlyLabels={menu:'Меню',left:'Назад',right:'Вперёд',up:'Выше',down:'Ниже',chevronLeft:'Предыдущий месяц',chevronRight:'Следующий месяц',plus:'Добавить',undo:'Отменить',redo:'Повторить',more:'Действия',grip:'Переместить',settings:'Настройки',copy:'Дублировать',expand:'Развернуть',shrink:'Свернуть',resize:'Изменить размер',info:'Описание',close:'Закрыть'};
 function decorateText(el,forcedName){for(const node of [...el.childNodes]){if(node.nodeType!==3)continue;const value=node.nodeValue;if(!/[☰◷◎◇✓▤▦↗←→↑↓‹›＋✎⌖☷◉↶↷⋯⋮⚙⧉⛶↙◢ⓘ×◒]/u.test(value))continue;
 const only=value.trim().replace(/⋮⋮/g,'⋮'),isOnly=Object.hasOwn(interfaceIconGlyphs,only),name=forcedName||(el.id==='voiceBtn'?'mic':interfaceIconGlyphs[only]);
 if(isOnly&&!el.hasAttribute('aria-label')&&['BUTTON','SUMMARY'].includes(el.tagName))el.setAttribute('aria-label',iconOnlyLabels[name]||el.getAttribute('title')||'Действие');
 const fragment=document.createDocumentFragment(),chunks=value.split(/(⋮⋮|[☰◷◎◇✓▤▦↗←→↑↓‹›＋✎⌖☷◉↶↷⋯⋮⚙⧉⛶↙◢ⓘ×◒])/u);
 for(const chunk of chunks){if(!chunk)continue;const key=chunk==='⋮⋮'?'⋮':chunk;if(Object.hasOwn(interfaceIconGlyphs,key)){const span=document.createElement('span');span.className='ui-icon-slot';span.setAttribute('aria-hidden','true');span.innerHTML=interfaceIcon(forcedName||(el.id==='voiceBtn'?'mic':interfaceIconGlyphs[key]));fragment.append(span)}else fragment.append(document.createTextNode(chunk))}node.replaceWith(fragment);
 }}
 function decorate(root){const candidates=[];if(root.nodeType===1)candidates.push(root);if(root.querySelectorAll)candidates.push(...root.querySelectorAll('button, summary, nav b, .brand>span, .tag, .studio-panel-title>span, .hero-mark, .circle, footer a, .space-item>.small, .direction-card>.row>span:last-child, .clickable>div:first-child>span.small'));
 for(const el of candidates){if(el.closest?.('.ui-icon-slot,svg'))continue;const tag=el.tagName;if(tag==='BUTTON'){if(el.matches('.space-item,.direction-card,.event-title')||el.closest('.space-layer'))continue;const handler=el.getAttribute('onclick')||'';if(/^openItem\(/.test(handler)&&!/^Открыть/.test(el.textContent.trim()))continue;decorateText(el)}else if(tag==='SUMMARY'){decorateText(el)}else if(el.matches('nav b,.brand>span,.hero-mark,.circle,footer a,.space-item>.small,.direction-card>.row>span:last-child,.clickable>div:first-child>span.small'))decorateText(el,el.matches('.brand>span,.hero-mark')?'logo':undefined);else if(el.matches('.tag')&&/^СЕГОДНЯ\s*✓$/.test(el.textContent.trim()))decorateText(el);else if(el.matches('.studio-panel-title>span')&&el.textContent.trim()==='ⓘ')decorateText(el)}
 }
 decorate(document.body);
 const observer=new MutationObserver(records=>{const roots=new Set();for(const r of records){if(r.type==='characterData')roots.add(r.target.parentElement);else for(const n of r.addedNodes)if(n.nodeType===1)roots.add(n);else if(n.nodeType===3)roots.add(n.parentElement)}for(const root of roots)if(root?.isConnected)decorate(root)});
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
