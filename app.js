(() => {
'use strict';

const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];
const esc = (v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const money = v => `${Number(v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} ₪`;
const num = v => Number(v||0).toLocaleString('en-US',{maximumFractionDigits:2});
const uid=(p='id')=>`${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
const isoNow=()=>new Date().toISOString();
const dateOnly=v=>{if(!v)return '';const d=new Date(v);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)};
const fmtDate=v=>{if(!v)return '—';const d=new Date(v);if(Number.isNaN(d.getTime()))return String(v);return new Intl.DateTimeFormat('ar-EG',{year:'numeric',month:'short',day:'numeric'}).format(d)};
const fmtDateTime=v=>{if(!v)return '—';const d=new Date(v);if(Number.isNaN(d.getTime()))return String(v);return new Intl.DateTimeFormat('ar-EG',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)};

const ICONS={
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',download:'<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>',
 home:'<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 receipt:'<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',wallet:'<path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 11h6v4h-6a2 2 0 0 1 0-4z"/>',bank:'<path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M2 20h20M12 3 2 8h20z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',chart:'<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
 userCog:'<path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/><circle cx="18" cy="17" r="3"/><path d="M18 12v2m0 6v2m-5-5h2m6 0h2"/>',clipboard:'<path d="M9 4h6l1 2h3v15H5V6h3z"/><path d="M9 3h6v4H9z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',meter:'<path d="M5 4h14v16H5z"/><path d="M8 14a4 4 0 0 1 8 0M12 14l2-3M8 8h8"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h4M14 13h3M7 17h10"/>',mapPin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',arrowDown:'<path d="M12 3v14m0 0 5-5m-5 5-5-5M5 21h14"/>',arrowUp:'<path d="M12 21V7m0 0 5 5m-5-5-5 5M5 3h14"/>',transfer:'<path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3"/>',expense:'<path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5"/>',
 refresh:'<path d="M20 7h-5V2M4 17h5v5"/><path d="M6.1 8A7 7 0 0 1 18 5l2 2M17.9 16A7 7 0 0 1 6 19l-2-2"/>',logout:'<path d="M10 17l5-5-5-5M15 12H3M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"/>',more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 chevron:'<path d="m8 10 4 4 4-4"/>',sort:'<path d="M8 6h12M8 12h9M8 18h6M4 4v16m0 0-2-2m2 2 2-2"/>',phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.7 19.7 0 0 1-8.63-3.07 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z"/>',
 save:'<path d="M5 3h12l2 2v16H5z"/><path d="M8 3v6h8V3M8 14h8v7H8"/>',back:'<path d="m15 18-6-6 6-6"/>',edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',message:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/>',whatsapp:'<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z"/><path d="M8.5 8.5c.3 3 2 4.7 5 5l1-1.3 2 .9c-.4 1.7-1.6 2.5-3.1 2.3-4.2-.6-7-3.4-7.6-7.6-.2-1.5.6-2.7 2.3-3.1l.9 2z"/>',camera:'<path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/>',send:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>'
};
function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.more}</svg>`}
function hydrateIcons(root=document){$$('[data-icon]',root).forEach(el=>{el.innerHTML=icon(el.dataset.icon)});}

const SESSION_KEY='AHMADI_USERS_SESSION_V2';
const PRINTER_PREF_KEY='AHMADI_PRINTER_PREF_V1';
function getPrinterPaperSize(){try{const v=String(localStorage.getItem(PRINTER_PREF_KEY)||'80');return ['58','80','a4'].includes(v)?v:'80'}catch(_){return '80'}}
function setPrinterPaperSize(v){v=String(v||'80');if(!['58','80','a4'].includes(v))v='80';try{localStorage.setItem(PRINTER_PREF_KEY,v)}catch(_){}return v}
const DATASETS=['settings','subscribers','regions','distributionBoards','meters','invoices','accounts','movements','logs','tasks','chats','backups'];
const defaults={settings:{platformName:'الأحمدي لإدارة الكهرباء',networkName:'',ownerName:'',defaultRate:0,defaultDiscount:0,nearDueDays:3,networkLogo:'',networkLogoKey:'',networkLogoName:'',networkLogoSize:0},subscribers:[],regions:[],distributionBoards:[],meters:[],invoices:[],accounts:[],movements:[],logs:[],tasks:[],chats:[],backups:[]};
let session=null,currentPage='home',detail=null,deferredInstall=null;
let dashboardFilter={mode:'all',from:'',to:''};
let detailSearch='',detailSort='date-desc',meterSection='all';
let pickerState=null;
let pendingInvoiceImage='';
let pendingInvoiceImageName='';
const data={};

function storageKey(ds){return `AHMADI_USERS_DATA_V1::${session?.companyId||'guest'}::${ds}`}
function loadLocal(){DATASETS.forEach(ds=>{try{const raw=localStorage.getItem(storageKey(ds));data[ds]=raw?JSON.parse(raw):structuredClone(defaults[ds]);}catch(_){data[ds]=structuredClone(defaults[ds]);}});normalizeData();}
function normalizeData(){
  DATASETS.forEach(ds=>{if(data[ds]==null)data[ds]=structuredClone(defaults[ds]);});
  if(!Array.isArray(data.subscribers))data.subscribers=Object.values(data.subscribers||{});
  for(const ds of ['regions','distributionBoards','meters','invoices','accounts','movements','logs','tasks','chats','backups'])if(!Array.isArray(data[ds]))data[ds]=Object.values(data[ds]||{});
  if(!data.settings||Array.isArray(data.settings))data.settings={...defaults.settings}; else data.settings={...defaults.settings,...data.settings,ownerName:data.settings.ownerName||data.settings.managerName||'',platformName:data.settings.platformName||data.settings.appName||defaults.settings.platformName};
}
function save(ds,remote=true){localStorage.setItem(storageKey(ds),JSON.stringify(data[ds]));if(remote)window.AhmadiCloud?.markChanged(ds);}
function adapter(){return {getDataset:ds=>data[ds],setDataset:(ds,v)=>{data[ds]=v;normalizeData();save(ds,false);},beforePushPending:async(names)=>{if(window.AhmadiImageSync?.prepareDatasets)await window.AhmadiImageSync.prepareDatasets(names)},onRemoteApplied:()=>render()}}
function logAction(title,meta=''){data.logs.unshift({id:uid('log'),title,meta,actor:session?.actorName||'',date:isoNow()});data.logs=data.logs.slice(0,500);save('logs');}
function hasPerm(code){return session?.actorType==='owner'||session?.permissions?.includes('*')||session?.permissions?.includes(code)}
function guard(code){if(hasPerm(code))return true;toast('لا تملك صلاحية تنفيذ هذا الإجراء','تنبيه');return false}

function toast(message,title='تم'){const root=$('#toastRoot');const el=document.createElement('div');el.className='toast';el.innerHTML=`${icon(title==='خطأ'?'x':'refresh')}<div><strong>${esc(title)}</strong><span>${esc(message)}</span></div>`;root.appendChild(el);setTimeout(()=>el.remove(),3300)}
function setSyncStatus(status){const pill=$('#syncPill');if(!pill)return;const offline=status.mode==='offline';pill.innerHTML=`<span class="sync-dot" style="background:${offline?'var(--gold)':'var(--green)'}"></span><span>${offline?'محفوظ محلياً':'البيانات محدثة'}</span>`}

function timeBounds(){const now=new Date(),start=new Date(now),end=new Date(now);end.setHours(23,59,59,999);if(dashboardFilter.mode==='all')return null;if(dashboardFilter.mode==='today'){start.setHours(0,0,0,0)}else if(dashboardFilter.mode==='week'){start.setDate(now.getDate()-6);start.setHours(0,0,0,0)}else if(dashboardFilter.mode==='month'){start.setDate(1);start.setHours(0,0,0,0)}else if(dashboardFilter.mode==='year'){start.setMonth(0,1);start.setHours(0,0,0,0)}else if(dashboardFilter.mode==='range'){if(!dashboardFilter.from||!dashboardFilter.to)return null;return [new Date(`${dashboardFilter.from}T00:00:00`),new Date(`${dashboardFilter.to}T23:59:59`)];}return [start,end]}
function inRange(v){const b=timeBounds();if(!b)return true;const d=new Date(v||0);return !Number.isNaN(d.getTime())&&d>=b[0]&&d<=b[1]}
function filtered(ds,dateField='date'){return (data[ds]||[]).filter(x=>inRange(x[dateField]||x.createdAt||x.created_at))}
function subscriberBy(id){return data.subscribers.find(x=>String(x.id)===String(id))||{name:'مشترك محذوف',phone:''}}
function fullPhone(sub){if(!sub)return '';let raw=String(sub.phone||'').replace(/\D/g,'');if(raw.startsWith('970')||raw.startsWith('972'))return '+'+raw;raw=raw.replace(/^0+/,'');return `${sub.prefix||'+970'}${raw}`}
function meterBy(id){return data.meters.find(x=>String(x.id)===String(id))||null}
function regionBy(id){return data.regions.find(x=>String(x.id)===String(id))||{name:'غير محددة',regionNumber:''}}
function boardBy(id){return data.distributionBoards.find(x=>String(x.id)===String(id))||{name:'غير محددة',boardNumber:'',regionId:''}}
function meterInvoices(id,scoped=false){const src=scoped?filtered('invoices'):data.invoices;return src.filter(i=>String(i.meterId)===String(id))}
function meterConsumption(id,scoped=false){return meterInvoices(id,scoped).reduce((s,i)=>s+Number(i.consumption||0),0)}
function meterCost(id,scoped=false){return meterInvoices(id,scoped).reduce((s,i)=>s+invoiceNet(i),0)}
function nextSequence(rows,field,prefix,digits=4){let max=0;for(const row of rows||[]){const m=String(row?.[field]||'').match(/(\d+)$/);if(m)max=Math.max(max,Number(m[1])||0)}return `${prefix}${String(max+1).padStart(digits,'0')}`}
function nextMeterNumber(){return nextSequence(data.meters,'meterNumber','M',4)}
function nextRegionNumber(){return nextSequence(data.regions,'regionNumber','R',3)}
function nextBoardNumber(){return nextSequence(data.distributionBoards,'boardNumber','DB',3)}
function meterInRange(m){if(!timeBounds())return true;return inRange(m.createdAt||m.openingDate)||meterInvoices(m.id,true).length>0}
function boardMeters(id){return data.meters.filter(m=>String(m.boardId)===String(id))}
function regionMeters(id){return data.meters.filter(m=>String(m.regionId)===String(id))}
function regionBoards(id){return data.distributionBoards.filter(b=>String(b.regionId)===String(id))}
function accountBy(id){return data.accounts.find(x=>String(x.id)===String(id))||{name:'حساب غير معروف',type:''}}
function invoiceNet(i){return Math.max(0,Number(i.total ?? (Number(i.subtotal||0)-Number(i.discount||0))))}
function movementType(m){const t=String(m?.type||'');return ({collect:'collection',account_deposit:'deposit',account_expense:'expense',initial_payment:'collection'})[t]||t}
function subscriberBalance(id){const inv=data.invoices.filter(i=>String(i.subscriberId)===String(id)).reduce((s,i)=>s+invoiceNet(i),0);const col=data.movements.filter(m=>movementType(m)==='collection'&&String(m.subscriberId)===String(id)).reduce((s,m)=>s+Number(m.amount||0),0);const sent=data.movements.filter(m=>movementType(m)==='send'&&String(m.subscriberId)===String(id)).reduce((s,m)=>s+Number(m.amount||0),0);return inv-col+sent}
function subscriberBalanceScoped(id){const inv=filtered('invoices').filter(i=>String(i.subscriberId)===String(id)).reduce((s,i)=>s+invoiceNet(i),0);const mov=filtered('movements').filter(m=>String(m.subscriberId)===String(id));const col=mov.filter(m=>movementType(m)==='collection').reduce((s,m)=>s+Number(m.amount||0),0);const sent=mov.filter(m=>movementType(m)==='send').reduce((s,m)=>s+Number(m.amount||0),0);return inv-col+sent}
function subscriberSnapshot(id){
 const meters=data.meters.filter(m=>String(m.subscriberId)===String(id));
 const invoices=data.invoices.filter(i=>String(i.subscriberId)===String(id));
 const orderedMeters=[...meters].sort((a,b)=>new Date(a.openingDate||a.createdAt||0)-new Date(b.openingDate||b.createdAt||0));
 const firstMeter=orderedMeters[0]||null;
 const latestInvoice=[...invoices].sort((a,b)=>new Date(b.periodTo||b.date||b.createdAt||0)-new Date(a.periodTo||a.date||a.createdAt||0))[0]||null;
 const latestMeter=[...meters].sort((a,b)=>new Date(b.lastReadingDate||b.openingDate||0)-new Date(a.lastReadingDate||a.openingDate||0))[0]||null;
 const consumption=invoices.reduce((a,i)=>a+Number(i.consumption||0),0);
 const cost=invoices.reduce((a,i)=>a+invoiceNet(i),0);
 const paid=data.movements.filter(m=>movementType(m)==='collection'&&String(m.subscriberId)===String(id)).reduce((a,m)=>a+Number(m.amount||0),0);
 const balance=subscriberBalance(id);
 return {meters,invoices,openingDate:firstMeter?.openingDate||'',openingReading:Number(firstMeter?.openingReading||0),lastDate:latestInvoice?.periodTo||latestInvoice?.date||latestMeter?.lastReadingDate||latestMeter?.openingDate||'',lastReading:Number(latestInvoice?.closingReading??latestMeter?.lastReading??latestMeter?.openingReading??0),consumption,cost,paid,balance,dueFrom:Math.max(balance,0),dueTo:Math.max(-balance,0),latestInvoice};
}
function cleanPhoneDigits(sub){return fullPhone(sub).replace(/\D/g,'')}
function buildSubscriberMessage(sub){
 const s=subscriberSnapshot(sub.id),actor=session?.actorName||data.settings.ownerName||session?.ownerName||'';
 return [`مرحبا ${sub.name||''}`,`${data.settings.networkName||data.settings.platformName||session?.companyName||'شبكة الكهرباء'}`,`المرسل: ${actor||'صاحب الحساب'}`,`${fmtDateTime(new Date())}`,'','الملخص الإجمالي لاشتراك الكهرباء',`تاريخ القراءة الافتتاحية: ${fmtDate(s.openingDate)}`,`القراءة الافتتاحية: ${num(s.openingReading)} KW`,`تاريخ آخر قراءة: ${fmtDate(s.lastDate)}`,`القراءة الأخيرة: ${num(s.lastReading)} KW`,`الاستهلاك الكلي: ${num(s.consumption)} KW`,`إجمالي تكلفة الاستهلاك: ${money(s.cost)}`,`إجمالي المبلغ المدفوع: ${money(s.paid)}`,`إجمالي المبلغ المتبقي عليك: ${money(s.dueFrom)}`,`إجمالي المبلغ المتبقي لك: ${money(s.dueTo)}`].join('\n');
}
function buildInvoiceMessage(inv){
 const sub=subscriberBy(inv.subscriberId),m=meterBy(inv.meterId),s=subscriberSnapshot(inv.subscriberId),actor=session?.actorName||data.settings.ownerName||session?.ownerName||'';
 return [`مرحبا ${sub.name||''}`,`${data.settings.networkName||data.settings.platformName||session?.companyName||'شبكة الكهرباء'}`,`المرسل: ${actor||'صاحب الحساب'}`,`${fmtDateTime(new Date())}`,'',`تفاصيل اشتراك الكهرباء لعداد: ${m?.label||m?.meterNumber||'—'}`,`رقم العداد: ${m?.meterNumber||'—'}`,`القراءة السابقة: ${num(inv.openingReading)} KW`,`تاريخ القراءة السابقة: ${fmtDate(inv.periodFrom||inv.date)}`,`القراءة الحالية: ${num(inv.closingReading)} KW`,`تاريخ القراءة الحالية: ${fmtDate(inv.periodTo||inv.date)}`,`إجمالي استهلاك الفاتورة: ${num(inv.consumption)} كيلو`,`سعر الكيلو: ${money(inv.unitPrice||0)}`,`الخصم: ${money(inv.discount||0)}`,`إجمالي تكلفة استهلاك الفاتورة: ${money(invoiceNet(inv))}`,'','الملخص الإجمالي',`القراءة الافتتاحية: ${num(s.openingReading)} KW`,`تاريخ القراءة الافتتاحية: ${fmtDate(s.openingDate)}`,`القراءة الأخيرة: ${num(s.lastReading)} KW`,`تاريخ القراءة الأخيرة: ${fmtDate(s.lastDate)}`,`إجمالي الاستهلاك: ${num(s.consumption)} KW`,`إجمالي تكلفة الاستهلاك: ${money(s.cost)}`,`إجمالي المبلغ المدفوع: ${money(s.paid)}`,`إجمالي المبلغ المتبقي لك: ${money(s.dueTo)}`,`إجمالي المبلغ المتبقي عليك: ${money(s.dueFrom)}`].join('\n');
}
function contactSubscriber(sub,mode,message){
 const digits=cleanPhoneDigits(sub);if(!digits)return toast('لا يوجد رقم هاتف صالح لهذا المشترك','تنبيه');
 if(mode==='call'){location.href=`tel:+${digits}`;return;}
 if(mode==='whatsapp'){window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message||buildSubscriberMessage(sub))}`,'_blank');return;}
 if(mode==='sms'){location.href=`sms:+${digits}?body=${encodeURIComponent(message||buildSubscriberMessage(sub))}`;return;}
}
function openSendChooser(sub,message,title='إرسال الرسالة'){
 openModal(title,`<div class="contact-sheet"><button class="contact-choice whatsapp" data-send-channel="whatsapp" data-send-sub="${sub.id}" type="button">${icon('whatsapp')}<span><strong>واتساب</strong><small>إرسال الرسالة عبر واتساب</small></span></button><button class="contact-choice" data-send-channel="sms" data-send-sub="${sub.id}" type="button">${icon('message')}<span><strong>SMS</strong><small>إرسال رسالة نصية</small></span></button><button class="contact-choice" data-send-channel="call" data-send-sub="${sub.id}" type="button">${icon('phone')}<span><strong>اتصال</strong><small>الاتصال بالمشترك</small></span></button><textarea id="sendMessagePayload" hidden>${esc(message||'')}</textarea></div>`);
}
async function compressInvoiceImage(file,maxBytes=110*1024){
 if(!file)return '';if(!/^image\//i.test(file.type||''))throw Error('اختر صورة صالحة.');
 const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
 const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src});
 let w=img.naturalWidth||img.width,h=img.naturalHeight||img.height,max=1280;if(Math.max(w,h)>max){const k=max/Math.max(w,h);w=Math.round(w*k);h=Math.round(h*k)}
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d',{alpha:false}).drawImage(img,0,0,w,h);
 let quality=.78,out=canvas.toDataURL('image/jpeg',quality);while(out.length*0.75>maxBytes&&quality>.3){quality-=.08;out=canvas.toDataURL('image/jpeg',quality)}return out;
}
function previousInvoiceForMeter(meterId){return data.invoices.filter(i=>String(i.meterId)===String(meterId)).sort((a,b)=>new Date(b.periodTo||b.date||0)-new Date(a.periodTo||a.date||0))[0]||null}
function refreshInvoiceForm(){
 const form=$('#invoiceForm');if(!form)return;const meterId=form.querySelector('[name=meterId]')?.value||'',m=meterBy(meterId),prev=previousInvoiceForMeter(meterId);
 const prevReading=Number(m?.lastReading??m?.openingReading??0),prevDate=m?.lastReadingDate||m?.openingDate||'',prevNotes=prev?.notes||'لا توجد ملاحظات للقراءة السابقة.';
 const prevBox=$('#invoicePrevious');if(prevBox)prevBox.innerHTML=m?`<div><span>القراءة السابقة</span><strong>${num(prevReading)} KW</strong></div><div><span>تاريخ القراءة السابقة</span><strong>${fmtDate(prevDate)}</strong></div><div class="wide"><span>ملاحظات القراءة السابقة</span><strong>${esc(prevNotes)}</strong></div>`:'<div class="wide muted-note">اختر المشترك ثم العداد لعرض القراءة السابقة.</div>';
 if(m){const unit=form.querySelector('[name=unitPrice]');if(unit&&!unit.dataset.touched&&Number(unit.value||0)===0)unit.value=Number(m.ratePerKw||data.settings.defaultRate||0);}
 const closing=Number(form.querySelector('[name=closingReading]')?.value||0),unit=Number(form.querySelector('[name=unitPrice]')?.value||0),discount=Math.max(0,Number(form.querySelector('[name=discount]')?.value||0));
 const consumption=m&&Number.isFinite(closing)&&closing>=prevReading?closing-prevReading:0,subtotal=consumption*unit,total=Math.max(0,subtotal-discount);const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
 set('#pvPrevDate',fmtDate(prevDate));set('#pvPrevRead',m?`${num(prevReading)} KW`:'—');set('#pvNowDate',fmtDate(form.querySelector('[name=date]')?.value));set('#pvNowRead',Number.isFinite(closing)&&closing?`${num(closing)} KW`:'—');set('#pvConsumption',`${num(consumption)} KW`);set('#pvUnit',money(unit));set('#pvDiscount',money(discount));set('#pvTotal',money(total));
 const photo=$('#invoicePhotoPreview');if(photo)photo.innerHTML=pendingInvoiceImage?`<img src="${pendingInvoiceImage}" alt="صورة القراءة"><button type="button" data-remove-reading-photo>${icon('x')} إزالة الصورة</button>`:'<span>لم يتم إرفاق صورة للقراءة</span>';
}
function handlePickerChange(name,value){
 if(name==='invoiceSubscriberId'){
  const form=$('#invoiceForm');if(!form)return;const meterHidden=form.querySelector('[name=meterId]'),btn=meterHidden?.closest('.field')?.querySelector('[data-picker]');
  if(btn){const cfg=pickers.get(btn.dataset.picker);if(cfg){cfg.items=data.meters.filter(m=>String(m.subscriberId)===String(value)).map(m=>({value:m.id,label:`${m.label||m.meterNumber||'عداد'} — ${m.meterNumber||''}`}));meterHidden.value='';btn.querySelector('b').textContent=cfg.items.length?'اختر العداد':'لا توجد عدادات لهذا المشترك';}}refreshInvoiceForm();
 }
 if(name==='meterId'){
  const form=$('#invoiceForm'),m=meterBy(value);if(form&&m){const subHidden=form.querySelector('[name=invoiceSubscriberId]');if(subHidden){subHidden.value=m.subscriberId;const b=subHidden.closest('.field')?.querySelector('b');if(b)b.textContent=`${subscriberBy(m.subscriberId).name} — ${fullPhone(subscriberBy(m.subscriberId))}`;}}refreshInvoiceForm();
 }
 if(name==='regionId'){
  const form=$('#meterForm');if(!form)return;const boardHidden=form.querySelector('[name=boardId]'),btn=boardHidden?.closest('.field')?.querySelector('[data-picker]');
  if(btn){const cfg=pickers.get(btn.dataset.picker);if(cfg){cfg.items=data.distributionBoards.filter(b=>String(b.regionId)===String(value)).map(b=>({value:b.id,label:`${b.name||'لوحة توزيع'} — ${b.boardNumber||''}`}));boardHidden.value='';btn.querySelector('b').textContent=cfg.items.length?'اختر لوحة التوزيع':'لا توجد لوحات في هذه المنطقة';}}
 }
}

function accountBalance(id){const acc=accountBy(id);let b=Number(acc.openingBalance||acc.balanceOpening||0);for(const m of data.movements){const a=Number(m.amount||0),t=movementType(m),to=m.accountId||m.toAccountId||m.accountToId||'',from=m.accountId||m.fromAccountId||m.accountFromId||'';if(t==='collection'&&String(to)===String(id))b+=a;if(t==='deposit'&&String(to)===String(id))b+=a;if(t==='send'&&String(from)===String(id))b-=a;if(t==='expense'&&String(from)===String(id))b-=a;if(t==='transfer'){const tf=m.fromAccountId||m.accountFromId||'',tt=m.toAccountId||m.accountToId||'';if(String(tf)===String(id))b-=a;if(String(tt)===String(id))b+=a;}}return b}
function stats(){
 const inv=filtered('invoices'),mov=filtered('movements'),subs=(data.subscribers||[]).filter(s=>inRange(s.createdAt||s.created_at)),meters=(data.meters||[]).filter(m=>inRange(m.createdAt||m.created_at));
 const invoiceGross=inv.reduce((s,i)=>s+Number(i.subtotal||invoiceNet(i)+Number(i.discount||0)),0),invoiceTotal=inv.reduce((s,i)=>s+invoiceNet(i),0),discount=inv.reduce((s,i)=>s+Number(i.discount||0),0);
 const collections=mov.filter(m=>movementType(m)==='collection').reduce((s,m)=>s+Number(m.amount||0),0),expenses=mov.filter(m=>movementType(m)==='expense').reduce((s,m)=>s+Number(m.amount||0),0);
 const balances=data.subscribers.map(s=>subscriberBalanceScoped(s.id));const dueFrom=balances.reduce((s,b)=>s+Math.max(b,0),0),dueTo=balances.reduce((s,b)=>s+Math.max(-b,0),0);
 const totalAccounts=data.accounts.reduce((s,a)=>s+accountBalance(a.id),0),cash=data.accounts.filter(a=>a.type==='cash').reduce((s,a)=>s+accountBalance(a.id),0),bank=data.accounts.filter(a=>a.type==='bank').reduce((s,a)=>s+accountBalance(a.id),0);
 const consumption=inv.reduce((s,i)=>s+Number(i.consumption||0),0),avg=consumption?invoiceTotal/consumption:0;
 return {subs:subs.length,totalSubs:data.subscribers.length,meters:meters.length,totalMeters:data.meters.length,invoiceGross,invoiceTotal,collections,dueFrom,dueTo,expenses,equity:invoiceTotal-expenses-dueTo,flows:invoiceTotal-expenses-dueFrom+dueTo,net:invoiceTotal-expenses-dueFrom,discount,totalAccounts,cash,bank,consumption,consumptionCost:invoiceTotal,avg};
}
function valuesFor(kind){const inv=filtered('invoices'),mov=filtered('movements');switch(kind){case'invoice':return inv.map(i=>invoiceNet(i));case'collection':return mov.filter(m=>movementType(m)==='collection').map(m=>Number(m.amount||0));case'expense':return mov.filter(m=>movementType(m)==='expense').map(m=>Number(m.amount||0));case'consumption':return inv.map(i=>Number(i.consumption||0));case'accounts':return data.accounts.map(a=>accountBalance(a.id));default:return inv.slice(-8).map(i=>invoiceNet(i));}}
function miniChart(vals=[],type='line'){const v=vals.slice(-8);while(v.length<5)v.unshift(0);const max=Math.max(1,...v.map(Math.abs));if(type==='bars'){const bars=v.map((n,i)=>`<rect x="${i*10+2}" y="${32-(Math.abs(n)/max*26)}" width="6" height="${Math.abs(n)/max*26}" rx="2"/>`).join('');return `<div class="mini-chart"><svg viewBox="0 0 82 36" fill="var(--gold)">${bars}</svg></div>`}const pts=v.map((n,i)=>`${i*(80/(v.length-1))+1},${32-(n/max*26)}`).join(' ');return `<div class="mini-chart"><svg viewBox="0 0 82 36"><polyline points="${pts}" fill="none" stroke="var(--teal2)" stroke-width="2"/><polyline points="0,34 ${pts} 82,34" fill="rgba(85,200,184,.08)" stroke="none"/></svg></div>`}

const nav=[
 ['home','الرئيسية','home','home'],['subscribers','المشتركين','users','subscribers.view'],['meters','العدادات','meter','subscribers.view'],['invoices','الفواتير','receipt','subscriptions.view'],['flows','التدفقات المالية','wallet','flows.view'],['accounts','الحسابات المالية','bank','accounts.view'],['logs','السجل الزمني','clock','timeline.view'],['reports','التقارير','chart','reports.view'],['settings','الإعدادات','settings','settings.view'],['employees','إدارة الموظفين','userCog','employees.view'],['platform','إدارة الإعدادات','settings','settings.edit'],['tasks','إدارة المهام','clipboard','tasks.view']
];
function visibleNav(){return nav.filter(n=>n[0]==='home'||hasPerm(n[3]))}
function renderNav(){const drawer=$('#drawerNav');drawer.innerHTML=visibleNav().map(([id,label,ic])=>`<button class="drawer-link ${currentPage===id?'active':''}" data-nav="${id}" type="button">${icon(ic)}<span>${label}</span></button>`).join('');const bottom=[['home','الرئيسية','home'],['subscribers','المشتركين','users'],['invoices','الفواتير','receipt'],['flows','الدفعات','wallet'],['more','المزيد','more']];$('#bottomNav').innerHTML=bottom.map(([id,l,ic])=>`<button class="bottom-link ${currentPage===id||(id==='more'&&!['home','subscribers','invoices','flows'].includes(currentPage))?'active':''}" data-nav="${id}" type="button">${icon(ic)}<span>${l}</span></button>`).join('')}
function setPageTitle(title){$('#pageTitle').textContent=title}
function render(){renderNav();if(detail?.kind==='subscriber-profile')renderSubscriberProfile(detail.id,detail.tab||'overview');else if(detail?.kind==='meter-profile')renderMeterProfile(detail.id);else if(detail?.kind==='board-profile')renderBoardProfile(detail.id);else if(detail?.kind==='region-profile')renderRegionProfile(detail.id,detail.section||'');else if(detail?.kind==='invoice-profile')renderInvoiceProfile(detail.id);else if(detail)renderDetail();else({home:renderHome,subscribers:renderSubscribers,meters:renderMeters,invoices:renderInvoices,flows:renderFlows,accounts:renderAccounts,logs:renderLogs,reports:renderReports,settings:renderSettings,employees:renderEmployees,platform:renderPlatform,tasks:renderTasks}[currentPage]||renderHome)();hydrateIcons();renderFab()}
function pageHead(title,sub='',meta=''){return `<div class="page-head"><div><h1>${esc(title)}</h1>${sub?`<p>${esc(sub)}</p>`:''}</div>${meta?`<div class="head-meta">${meta}</div>`:''}</div>`}
function timeFilterHtml(){const labels={all:'الكل',today:'اليوم',week:'هذا الأسبوع',month:'هذا الشهر',year:'هذه السنة',range:'من - إلى'};return `<div class="time-filter">${Object.entries(labels).map(([k,l])=>`<button class="filter-chip ${dashboardFilter.mode===k?'active':''}" data-time="${k}" type="button">${l}</button>`).join('')}</div>${dashboardFilter.mode==='range'?`<div class="date-range"><label class="date-input">من<input id="rangeFrom" type="date" value="${esc(dashboardFilter.from)}"></label><label class="date-input">إلى<input id="rangeTo" type="date" value="${esc(dashboardFilter.to)}"></label></div>`:''}`}
function metric(kind,label,value,sub='',chart='line',vals=[]){return `<button class="metric" data-detail="${kind}" type="button"><div class="metric-label">${label}</div><div class="metric-value">${value}</div>${sub?`<div class="metric-sub">${sub}</div>`:''}${miniChart(vals,chart)}</button>`}
function summaryCard(id,title,sub,ic,body,wide=false,open=false){return `<section class="summary-card ${wide?'wide':''} ${open?'open':''}" data-summary="${id}"><button class="summary-toggle" type="button" data-summary-toggle="${id}"><div class="summary-title"><span class="summary-icon">${icon(ic)}</span><div><strong>${title}</strong><small>${sub}</small></div></div><span class="chev">${icon('chevron')}</span></button><div class="summary-body">${body}</div></section>`}
function renderHome(){setPageTitle('الرئيسية');const s=stats(),actor=session?.actorName||session?.ownerName||'صاحب الحساب';const quick=[['add-subscriber','إضافة مشترك','users','subscribers.add'],['add-meter','إضافة عداد','meter','subscribers.add'],['follow-subscriber','متابعة مشترك','search','subscribers.view'],['collection','إيداع دفعة','arrowDown','flows.collect'],['send','إرسال دفعة','arrowUp','flows.send'],['expense','إضافة مصروف','expense','flows.expense'],['transfer','تحويل بين الحسابات','transfer','flows.transfer']].filter(x=>hasPerm(x[3]));
 const quickBody=`<div class="quick-grid">${quick.map(([a,l,ic])=>`<button class="quick-action" data-action="${a}" type="button"><span class="qa-icon">${icon(ic)}</span><span>${l}</span></button>`).join('')}</div>`;
 const subBody=`<div class="metric-list">${metric('subscriber-count','عدد المشتركين',num(s.totalSubs),'مشترك مسجل','line',data.subscribers.map((_,i)=>i+1))}${metric('meter-count','عدد العدادات',num(s.totalMeters),'عداد مسجل','bars',data.meters.map((_,i)=>i+1))}${metric('due-from','المستحق عليهم',money(s.dueFrom),'إجمالي المبلغ المستحق','line',data.subscribers.map(x=>Math.max(subscriberBalanceScoped(x.id),0)))}${metric('due-to','المستحق لهم',money(s.dueTo),'إجمالي المبلغ المستحق','line',data.subscribers.map(x=>Math.max(-subscriberBalanceScoped(x.id),0)))}</div>`;
 const finBody=`<div class="metric-list">${metric('invoice-total','إجمالي ثمن الفواتير',money(s.invoiceTotal),'قيمة الفواتير','bars',valuesFor('invoice'))}${metric('collected','إجمالي المبالغ المحصلة',money(s.collections),'تحصيلات المشتركين','line',valuesFor('collection'))}${metric('due-from','إجمالي المستحق عليهم',money(s.dueFrom),'مبالغ لم تُحصّل','line',data.subscribers.map(x=>Math.max(subscriberBalanceScoped(x.id),0)))}${metric('due-to','إجمالي المستحق لهم',money(s.dueTo),'أرصدة لصالح المشتركين','line',data.subscribers.map(x=>Math.max(-subscriberBalanceScoped(x.id),0)))}${metric('expenses','إجمالي المصروفات',money(s.expenses),'المصروف خلال الفترة','bars',valuesFor('expense'))}${metric('equity','حقوق الملكية',money(s.equity),'الفواتير - المصروفات','line',[s.invoiceTotal,s.expenses,s.equity])}${metric('flows-total','إجمالي التدفقات المالية',money(s.flows),'حسب المعادلة المحددة','line',[s.invoiceTotal,s.expenses,s.dueFrom,s.dueTo,s.flows])}${metric('flows-net','صافي التدفقات المالية',money(s.net),'الفواتير - المصروفات - المستحق عليهم','line',[s.invoiceTotal,s.expenses,s.dueFrom,s.net])}${metric('discounts','إجمالي خصومات الفواتير',money(s.discount),'الخصومات الممنوحة','bars',filtered('invoices').map(i=>Number(i.discount||0)))}</div>`;
 const accBody=`<div class="metric-list">${metric('accounts-total','إجمالي الأرصدة الكلية',money(s.totalAccounts),'كل الحسابات','bars',valuesFor('accounts'))}${metric('accounts-cash','إجمالي الأرصدة النقدية',money(s.cash),'الحسابات النقدية','line',data.accounts.filter(a=>a.type==='cash').map(a=>accountBalance(a.id)))}${metric('accounts-bank','إجمالي الأرصدة البنكية',money(s.bank),'الحسابات البنكية','line',data.accounts.filter(a=>a.type==='bank').map(a=>accountBalance(a.id)))}</div>`;
 const powerBody=`<div class="metric-list">${metric('consumption','إجمالي استهلاك الكهرباء',`${num(s.consumption)} kW`,'خلال الفترة','line',valuesFor('consumption'))}${metric('consumption-cost','إجمالي تكلفة الاستهلاك',money(s.consumptionCost),'تساوي مبلغ الفواتير','bars',valuesFor('invoice'))}${metric('average-rate','متوسط سعر بيع الكيلو',`${num(s.avg)} ₪`,'متوسط سعر kW','line',[s.consumptionCost,s.consumption,s.avg])}</div>`;
 $('#mainContent').innerHTML=`<section class="hero"><p class="welcome">مرحباً بك، <span>${esc(actor)}</span></p><div class="sub">لوحة تشغيل الشبكة وإدارة المشتركين والفواتير والتدفقات المالية.</div><div id="syncPill" class="sync-pill"><span class="sync-dot"></span><span>البيانات محدثة</span></div></section>${timeFilterHtml()}<div class="summary-grid">${summaryCard('quick','إجراءات سريعة','أهم العمليات اليومية','more',quickBody,true,true)}${summaryCard('subs','ملخص المشتركين','المشتركين والعدادات والاستحقاقات','users',subBody)}${summaryCard('flows','ملخص التدفقات المالية','الفواتير والتحصيلات والمصروفات','wallet',finBody)}${summaryCard('accounts','ملخص الحسابات المالية','الأرصدة النقدية والبنكية','bank',accBody)}${summaryCard('power','ملخص استهلاك الكهرباء','الاستهلاك والتكلفة ومتوسط البيع','meter',powerBody)}</div>`;setSyncStatus(window.AhmadiCloud?.getStatus?.()||{mode:'idle'})}

function renderSubscribers(){
 setPageTitle('المشتركين');const q=detailSearch.trim().toLowerCase();
 const rows=data.subscribers.filter(s=>{const b=subscriberBalance(s.id);return !q||`${s.name||''} ${fullPhone(s)||''} ${Math.abs(b)} ${money(Math.abs(b))}`.toLowerCase().includes(q)});
 $('#mainContent').innerHTML=`${pageHead('المشتركين','',`العدد ${rows.length}`)}${listToolbar('بحث بالاسم أو الهاتف أو المبلغ...')}<div class="count-banner"><div><small>إجمالي المشتركين</small><strong>${rows.length}</strong></div><span class="badge">${data.meters.length} عداد</span></div><div class="cards-list">${rows.length?rows.map(subscriberRow).join(''):`<div class="empty">لا يوجد مشتركون حتى الآن.</div>`}</div>`;
}
function renderMeters(){
 setPageTitle('العدادات');const q=detailSearch.trim().toLowerCase();
 const scopedMeters=data.meters.filter(m=>meterInRange(m));
 const totalConsumption=scopedMeters.reduce((s,m)=>s+meterConsumption(m.id,true),0);
 const totalBoards=data.distributionBoards.length,totalRegions=data.regions.length;
 const hubs=[
  ['all','جميع العدادات',data.meters.length,`${num(totalConsumption)} kW`,'meter'],
  ['boards','لوحات التوزيع',totalBoards,`${scopedMeters.length} عداد`,'panel'],
  ['regions','مناطق لوحات التوزيع',totalRegions,`${totalBoards} لوحة`,'mapPin']
 ];
 let body='';
 if(meterSection==='all'){
   let rows=scopedMeters.filter(m=>{const s=subscriberBy(m.subscriberId),r=regionBy(m.regionId),b=boardBy(m.boardId);return !q||`${s.name} ${fullPhone(s)} ${m.meterNumber||''} ${m.location||''} ${r.name||''} ${b.name||''} ${b.boardNumber||''}`.toLowerCase().includes(q)});
   if(detailSort==='amount-desc')rows.sort((a,b)=>meterConsumption(b.id,true)-meterConsumption(a.id,true));else if(detailSort==='amount-asc')rows.sort((a,b)=>meterConsumption(a.id,true)-meterConsumption(b.id,true));else if(detailSort==='date-asc')rows.sort((a,b)=>new Date(a.lastReadingDate||a.openingDate||0)-new Date(b.lastReadingDate||b.openingDate||0));else rows.sort((a,b)=>new Date(b.lastReadingDate||b.openingDate||0)-new Date(a.lastReadingDate||a.openingDate||0));
   body=`${timeFilterHtml()}${listToolbar('بحث بالاسم أو رقم العداد أو المنطقة أو اللوحة...')}<div class="count-banner"><div><small>إجمالي العدادات</small><strong>${rows.length}</strong></div><span class="badge">${num(rows.reduce((s,m)=>s+meterConsumption(m.id,true),0))} kW</span></div><div class="cards-list">${rows.length?rows.map(meterRow).join(''):'<div class="empty">لا توجد عدادات مطابقة.</div>'}</div>`;
 }else if(meterSection==='boards'){
   let rows=data.distributionBoards.filter(b=>{const r=regionBy(b.regionId);return !q||`${b.name||''} ${b.boardNumber||''} ${r.name||''} ${b.notes||''}`.toLowerCase().includes(q)});
   if(detailSort==='amount-desc')rows.sort((a,b)=>boardMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-boardMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0));else if(detailSort==='amount-asc')rows.sort((a,b)=>boardMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-boardMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0));else if(detailSort==='date-asc')rows.sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0));else rows.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
   body=`${timeFilterHtml()}${listToolbar('بحث باسم أو رقم لوحة التوزيع أو المنطقة...')}<div class="count-banner"><div><small>إجمالي لوحات التوزيع</small><strong>${rows.length}</strong></div><span class="badge">${rows.reduce((s,b)=>s+boardMeters(b.id).length,0)} عداد</span></div><div class="cards-list">${rows.length?rows.map(distributionBoardRow).join(''):'<div class="empty">لا توجد لوحات توزيع.</div>'}</div>`;
 }else{
   let rows=data.regions.filter(r=>!q||`${r.name||''} ${r.regionNumber||''} ${r.notes||''}`.toLowerCase().includes(q));
   if(detailSort==='amount-desc')rows.sort((a,b)=>regionMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-regionMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0));else if(detailSort==='amount-asc')rows.sort((a,b)=>regionMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-regionMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0));else if(detailSort==='date-asc')rows.sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0));else rows.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
   body=`${timeFilterHtml()}${listToolbar('بحث باسم أو رقم المنطقة...')}<div class="count-banner"><div><small>إجمالي المناطق</small><strong>${rows.length}</strong></div><span class="badge">${rows.reduce((s,r)=>s+regionMeters(r.id).length,0)} عداد</span></div><div class="cards-list">${rows.length?rows.map(regionRow).join(''):'<div class="empty">لا توجد مناطق مضافة.</div>'}</div>`;
 }
 $('#mainContent').innerHTML=`${pageHead('العدادات','إدارة العدادات ولوحات التوزيع والمناطق')}<div class="meter-hub-grid">${hubs.map(([id,title,count,meta,ic])=>`<button class="meter-hub-card ${meterSection===id?'active':''}" data-meter-section="${id}" type="button"><span class="meter-hub-icon">${icon(ic)}</span><span><strong>${title}</strong><small>${meta}</small></span><b>${count}</b></button>`).join('')}</div>${body}`;
}
function renderInvoices(){
 setPageTitle('الفواتير');let rows=filtered('invoices');const q=detailSearch.trim().toLowerCase();
 rows=rows.filter(i=>{const s=subscriberBy(i.subscriberId),m=meterBy(i.meterId);return !q||`${s.name} ${fullPhone(s)} ${i.id} ${m?.label||''} ${m?.meterNumber||''}`.toLowerCase().includes(q)});rows=sortRows(rows,'amount','date');const total=rows.reduce((s,i)=>s+invoiceNet(i),0);
 $('#mainContent').innerHTML=`${pageHead('الفواتير','',money(total))}${timeFilterHtml()}${listToolbar('بحث بالاسم أو الهاتف أو العداد...')}<div class="count-banner"><div><small>إجمالي قيمة الفواتير</small><strong>${money(total)}</strong></div><span class="badge">${rows.length} فاتورة</span></div><div class="cards-list">${rows.length?rows.map(invoiceRow).join(''):`<div class="empty">لا توجد فواتير في الفترة المحددة.</div>`}</div>`;
}
function renderFlows(){setPageTitle('التدفقات المالية');let rows=filtered('movements').filter(m=>['collection','send','expense','transfer','deposit'].includes(movementType(m)));const q=detailSearch.toLowerCase();rows=rows.filter(m=>!q||`${subscriberBy(m.subscriberId).name} ${m.notes||''} ${accountBy(m.accountId||m.fromAccountId).name}`.toLowerCase().includes(q));rows=sortRows(rows,'amount','date');const received=rows.filter(m=>['collection','deposit'].includes(movementType(m))).reduce((s,m)=>s+Number(m.amount||0),0),sent=rows.filter(m=>['send','expense'].includes(movementType(m))).reduce((s,m)=>s+Number(m.amount||0),0);$('#mainContent').innerHTML=`${pageHead('التدفقات المالية','التحصيل والإرسال والمصروفات والتحويلات')}${timeFilterHtml()}${listToolbar('بحث بالاسم أو المبلغ أو الملاحظات...')}<div class="report-grid" style="margin-bottom:14px"><div class="report-card"><small>الوارد</small><strong>${money(received)}</strong></div><div class="report-card"><small>الصادر</small><strong>${money(sent)}</strong></div></div><div class="cards-list">${rows.length?rows.map(m=>flowRow(m)).join(''):`<div class="empty">لا توجد حركات مالية.</div>`}</div>`}
function flowRow(m){const map={collection:['تحصيل دفعة','arrowDown','good'],send:['إرسال دفعة','arrowUp','warn'],expense:['مصروف','expense','bad'],transfer:['تحويل بين الحسابات','transfer',''],deposit:['إيداع للحساب','arrowDown','good']};const mt=movementType(m);const [l,ic,b]=map[mt]||['حركة','wallet',''];const who=m.subscriberId?subscriberBy(m.subscriberId).name:(movementType(m)==='transfer'?`${accountBy(m.fromAccountId||m.accountFromId).name} ← ${accountBy(m.toAccountId||m.accountToId).name}`:accountBy(m.accountId||m.accountToId||m.accountFromId).name);return `<div class="row-card"><span class="row-icon">${icon(ic)}</span><span><strong>${l} • ${esc(who)}</strong><small>${fmtDateTime(m.date)} ${m.notes?`• ${esc(m.notes)}`:''}</small></span><span class="row-amount"><strong>${money(m.amount)}</strong><span class="badge ${b}">${movementType(m)}</span></span></div>`}
function renderAccounts(){setPageTitle('الحسابات المالية');const rows=data.accounts;const total=rows.reduce((s,a)=>s+accountBalance(a.id),0);$('#mainContent').innerHTML=`${pageHead('الحسابات المالية','النقدية والبنكية والتحويلات',money(total))}${listToolbar('بحث باسم الحساب...')}<div class="count-banner"><div><small>إجمالي الأرصدة</small><strong>${money(total)}</strong></div><span class="badge">${rows.length} حساب</span></div><div class="cards-list">${rows.length?rows.map(a=>`<article class="row-card" data-account="${a.id}"><span class="row-icon">${icon(a.type==='bank'?'bank':'wallet')}</span><span><strong>${esc(a.name)}</strong><small>${a.type==='bank'?'حساب بنكي':'حساب نقدي'} ${a.number?`• ${esc(a.number)}`:''}</small></span><span class="row-amount"><strong>${money(accountBalance(a.id))}</strong></span></button>`).join(''):`<div class="empty">لا توجد حسابات مالية.</div>`}</div>`}
function renderLogs(){setPageTitle('السجل الزمني');const rows=filtered('logs','date').filter(l=>!detailSearch||`${l.title} ${l.meta} ${l.actor}`.toLowerCase().includes(detailSearch.toLowerCase()));$('#mainContent').innerHTML=`${pageHead('السجل الزمني','كل العمليات المسجلة')}${timeFilterHtml()}${listToolbar('بحث في السجل...')}<div class="cards-list">${rows.length?rows.map(l=>`<div class="row-card"><span class="row-icon">${icon('clock')}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.actor||'')} • ${fmtDateTime(l.date)}</small><small>${esc(l.meta||'')}</small></span><span></span></div>`).join(''):`<div class="empty">لا توجد عمليات في الفترة.</div>`}</div>`}
function renderReports(){setPageTitle('التقارير');const s=stats();const items=[['تقرير المشتركين',`${data.subscribers.length} مشترك`,'users'],['تقرير الفواتير',money(s.invoiceTotal),'receipt'],['تقرير التدفقات المالية',money(s.flows),'wallet'],['تقرير الحسابات',money(s.totalAccounts),'bank'],['تقرير المصروفات',money(s.expenses),'expense'],['تقرير استهلاك الكهرباء',`${num(s.consumption)} kW`,'meter']];$('#mainContent').innerHTML=`${pageHead('التقارير','ملخصات مباشرة حسب الفترة')}${timeFilterHtml()}<div class="report-grid">${items.map(([t,v,ic])=>`<button class="report-card" data-report="${t}" type="button"><span class="row-icon" style="margin-bottom:12px">${icon(ic)}</span><strong>${t}</strong><p>${v}</p></button>`).join('')}</div>`}
function renderSettings(){setPageTitle('الإعدادات');$('#mainContent').innerHTML=`${pageHead('الإعدادات','إعدادات التطبيق على هذا الجهاز')}<div class="report-grid"><div class="report-card"><strong>تثبيت التطبيق</strong><p>ثبّت التطبيق من Chrome للوصول السريع والعمل بصورة مستقلة.</p><button class="secondary-btn" data-action="install" type="button">تثبيت</button></div><div class="report-card"><strong>المزامنة</strong><p>التغييرات تحفظ محلياً فوراً، وعند توفر الإنترنت تتم مزامنتها تلقائياً.</p><button class="secondary-btn" data-action="sync" type="button">تحديث الآن</button></div></div>`}
function renderPlatform(){setPageTitle('إدارة الإعدادات');if(!guardSilent('settings.edit'))return renderNoPermission();const st=data.settings||{};$('#mainContent').innerHTML=`${pageHead('إدارة الإعدادات','إعدادات الشبكة الأساسية')}<form id="platformForm" class="modal" style="max-height:none;width:100%;border-radius:24px"><div class="modal-body"><div class="form-grid"><label class="field"><span>اسم المنصة</span><input name="platformName" value="${esc(st.platformName||'')}"></label><label class="field"><span>اسم شبكة الكهرباء</span><input name="networkName" value="${esc(st.networkName||st.platformName||'')}" placeholder="مثال: شبكة الأحمدي"></label><label class="field"><span>اسم صاحب الحساب</span><input name="ownerName" value="${esc(st.ownerName||session?.ownerName||'')}"></label><label class="field"><span>سعر الكيلو الافتراضي</span><input name="defaultRate" type="number" step="0.001" min="0" value="${Number(st.defaultRate||0)}"></label><label class="field"><span>الخصم الافتراضي للفاتورة</span><input name="defaultDiscount" type="number" step="0.01" min="0" value="${Number(st.defaultDiscount||0)}"></label><label class="field"><span>فترة التنبيه بالأيام</span><input name="nearDueDays" type="number" min="1" value="${Number(st.nearDueDays||3)}"></label></div></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ الإعدادات</button></div></form>`}
function renderEmployees(){setPageTitle('إدارة الموظفين');if(!guardSilent('employees.view'))return renderNoPermission();$('#mainContent').innerHTML=`${pageHead('إدارة الموظفين','حسابات الموظفين والصلاحيات')}<div id="employeeList" class="cards-list"><div class="empty">جارٍ تحميل الموظفين...</div></div>`;loadEmployees()}
async function loadEmployees(){try{const rows=await AhmadiCloud.listEmployees(session.companyId);const root=$('#employeeList');if(!root)return;root.innerHTML=rows.length?rows.map(e=>`<button class="row-card" data-employee="${e.id}" type="button"><span class="row-icon">${icon('userCog')}</span><span><strong>${esc(e.name)}</strong><small>${e.username?`@${esc(e.username)} • `:''}${e.status==='active'?'نشط':'موقوف'} • ${(e.permissions||[]).length} صلاحية</small></span><span class="badge ${e.status==='active'?'good':'bad'}">${e.status==='active'?'نشط':'موقوف'}</span></button>`).join(''):`<div class="empty">لا يوجد موظفون.</div>`}catch(e){toast(e.message,'خطأ')}}
function renderTasks(){setPageTitle('إدارة المهام');if(!guardSilent('tasks.view'))return renderNoPermission();const rows=data.tasks||[];$('#mainContent').innerHTML=`${pageHead('إدارة المهام','مهام الفريق والمتابعة')}<div class="cards-list">${rows.length?rows.map(t=>`<div class="row-card"><span class="row-icon">${icon('clipboard')}</span><span><strong>${esc(t.title)}</strong><small>${fmtDateTime(t.dueAt)} • ${esc(t.status||'معلقة')}</small></span><span class="badge ${t.status==='ناجحة'?'good':t.status==='فاشلة'?'bad':'warn'}">${esc(t.status||'معلقة')}</span></div>`).join(''):`<div class="empty">لا توجد مهام.</div>`}</div>`}
function renderNoPermission(){$('#mainContent').innerHTML=`<div class="empty">لا تملك صلاحية عرض هذه الصفحة.</div>`}
function guardSilent(code){return hasPerm(code)}
function listToolbar(ph){return `<div class="list-toolbar"><label class="search-box">${icon('search')}<input id="listSearch" placeholder="${esc(ph)}" value="${esc(detailSearch)}"></label><button class="sort-btn" id="sortBtn" type="button">${icon('sort')}</button></div>`}
function sortRows(rows,amountField='amount',dateField='date'){const r=[...rows];if(detailSort==='amount-desc')r.sort((a,b)=>Number(b[amountField]??invoiceNet(b))-Number(a[amountField]??invoiceNet(a)));else if(detailSort==='amount-asc')r.sort((a,b)=>Number(a[amountField]??invoiceNet(a))-Number(b[amountField]??invoiceNet(b)));else if(detailSort==='date-asc')r.sort((a,b)=>new Date(a[dateField]||a.createdAt)-new Date(b[dateField]||b.createdAt));else r.sort((a,b)=>new Date(b[dateField]||b.createdAt)-new Date(a[dateField]||a.createdAt));return r}

function renderDetail(){const kind=detail.kind;const s=stats(),q=detailSearch.toLowerCase();setPageTitle(detail.title||'التفاصيل');let title='',total='',rowsHtml='',extra='';let rows=[];
 if(kind==='subscriber-count'){title='المشتركون';rows=data.subscribers.filter(x=>inRange(x.createdAt||x.created_at)&&(!q||`${x.name||''} ${x.phone||''}`.toLowerCase().includes(q)));total=`${rows.length} مشترك`;rowsHtml=rows.map(x=>subscriberRow(x)).join('')}
 else if(kind==='meter-count'){title='العدادات';rows=data.meters.filter(x=>inRange(x.createdAt||x.created_at)&&(!q||`${x.label||''} ${x.meterNumber||''} ${subscriberBy(x.subscriberId).name}`.toLowerCase().includes(q)));total=`${rows.length} عداد`;rowsHtml=rows.map(m=>meterRow(m)).join('')}
 else if(kind==='due-from'||kind==='due-to'){const dueFrom=kind==='due-from';title=dueFrom?'المستحق عليهم':'المستحق لهم';rows=data.subscribers.filter(x=>(dueFrom?subscriberBalanceScoped(x.id)>0:subscriberBalanceScoped(x.id)<0)&&(!q||`${x.name||''} ${x.phone||''}`.toLowerCase().includes(q)));const t=rows.reduce((a,x)=>a+Math.abs(subscriberBalanceScoped(x.id)),0);total=money(t);rowsHtml=rows.map(x=>subscriberRow(x,true)).join('')}
 else if(kind==='invoice-total'||kind==='consumption-cost'){title=kind==='invoice-total'?'الفواتير':'تكلفة الاستهلاك';rows=sortRows(filtered('invoices').filter(i=>{const sb=subscriberBy(i.subscriberId);return !q||`${sb.name} ${sb.phone} ${i.id}`.toLowerCase().includes(q)}),'amount','date');total=money(rows.reduce((a,x)=>a+invoiceNet(x),0));rowsHtml=rows.map(invoiceRow).join('')}
 else if(kind==='collected'){title='المبالغ المحصلة';rows=sortRows(filtered('movements').filter(x=>movementType(x)==='collection'&&(!q||`${subscriberBy(x.subscriberId).name} ${x.notes||''}`.toLowerCase().includes(q))),'amount','date');total=money(rows.reduce((a,x)=>a+Number(x.amount||0),0));rowsHtml=rows.map(flowRow).join('')}
 else if(kind==='expenses'){title='المصروفات';rows=sortRows(filtered('movements').filter(x=>movementType(x)==='expense'&&(!q||`${x.payee||''} ${x.notes||''}`.toLowerCase().includes(q))),'amount','date');total=money(rows.reduce((a,x)=>a+Number(x.amount||0),0));rowsHtml=rows.map(flowRow).join('')}
 else if(kind==='discounts'){title='خصومات الفواتير';rows=sortRows(filtered('invoices').filter(x=>Number(x.discount||0)>0&&(!q||`${subscriberBy(x.subscriberId).name} ${subscriberBy(x.subscriberId).phone}`.toLowerCase().includes(q))),'discount','date');total=money(rows.reduce((a,x)=>a+Number(x.discount||0),0));rowsHtml=rows.map(i=>{const sub=subscriberBy(i.subscriberId);const paid=data.movements.filter(m=>movementType(m)==='collection'&&String(m.subscriberId)===String(i.subscriberId)).reduce((x,m)=>x+Number(m.amount||0),0);return `<div class="row-card"><span class="row-icon">${icon('receipt')}</span><span><strong>${esc(sub.name)}</strong><small>الفاتورة ${money(i.subtotal||0)} • الخصم ${money(i.discount||0)} • بعد الخصم ${money(invoiceNet(i))}</small></span><span class="row-amount"><strong>${money(Math.max(subscriberBalance(sub.id),0))}</strong><small>المتبقي</small></span></div>`}).join('')}
 else if(['accounts-total','accounts-cash','accounts-bank'].includes(kind)){title=kind==='accounts-cash'?'الأرصدة النقدية':kind==='accounts-bank'?'الأرصدة البنكية':'إجمالي الأرصدة';rows=data.accounts.filter(a=>(kind==='accounts-total'||a.type===(kind==='accounts-cash'?'cash':'bank'))&&(!q||`${a.name||''} ${a.number||''}`.toLowerCase().includes(q)));total=money(rows.reduce((a,x)=>a+accountBalance(x.id),0));rowsHtml=rows.map(a=>`<div class="row-card"><span class="row-icon">${icon(a.type==='bank'?'bank':'wallet')}</span><span><strong>${esc(a.name)}</strong><small>${a.type==='bank'?'بنكي':'نقدي'}</small></span><span class="row-amount"><strong>${money(accountBalance(a.id))}</strong></span></div>`).join('')}
 else if(kind==='consumption'){title='استهلاك الكهرباء';rows=sortRows(filtered('invoices').filter(i=>Number(i.consumption||0)>0&&(!q||`${subscriberBy(i.subscriberId).name} ${subscriberBy(i.subscriberId).phone}`.toLowerCase().includes(q))),'consumption','date');total=`${num(rows.reduce((a,x)=>a+Number(x.consumption||0),0))} kW`;rowsHtml=rows.map(i=>`<button class="row-card" data-invoice="${i.id}" type="button"><span class="row-icon">${icon('meter')}</span><span><strong>${esc(subscriberBy(i.subscriberId).name)}</strong><small>${fmtDate(i.periodFrom||i.date)} → ${fmtDate(i.periodTo||i.date)} • ${num(i.openingReading)} → ${num(i.closingReading)}</small></span><span class="row-amount"><strong>${num(i.consumption)} kW</strong></span></button>`).join('')}
 else if(kind==='average-rate'){title='متوسط سعر بيع الكيلو';total=`${num(s.avg)} ₪`;extra=`<div class="equation"><div class="eq-card"><span>إجمالي مبيع الاستهلاك</span><strong>${money(s.consumptionCost)}</strong></div><div class="eq-op">÷</div><div class="eq-card"><span>إجمالي الاستهلاك</span><strong>${num(s.consumption)} kW</strong></div><div class="eq-op">=</div><div class="eq-card"><span>متوسط سعر البيع</span><strong>${num(s.avg)} ₪</strong></div></div>`}
 else if(['equity','flows-total','flows-net'].includes(kind)){title=kind==='equity'?'حقوق الملكية':kind==='flows-total'?'إجمالي التدفقات المالية':'صافي التدفقات المالية';total=money(kind==='equity'?s.equity:kind==='flows-total'?s.flows:s.net);extra=`<div class="metric-list">${metric('invoice-total','الفواتير',money(s.invoiceTotal),'','bars',valuesFor('invoice'))}${metric('expenses','المصروفات',money(s.expenses),'','bars',valuesFor('expense'))}${metric('due-from','المستحق عليهم',money(s.dueFrom),'','line',data.subscribers.map(x=>Math.max(subscriberBalanceScoped(x.id),0)))}${metric('due-to','المستحق لهم',money(s.dueTo),'','line',data.subscribers.map(x=>Math.max(-subscriberBalanceScoped(x.id),0)))}${metric(kind,'النتيجة',total,'','line',[s.invoiceTotal,s.expenses,s.dueFrom,s.dueTo])}</div>`}
 $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn" id="detailBack" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(title)}</h1></div></div>${timeFilterHtml()}${!extra?listToolbar('بحث في النتائج...'):''}<div class="count-banner"><div><small>الإجمالي</small><strong>${total}</strong></div></div>${extra||`<div class="cards-list">${rowsHtml||'<div class="empty">لا توجد بيانات.</div>'}</div>`}`;
}
function subscriberRow(s,showDue=false){
 const b=subscriberBalance(s.id);return `<article class="row-card contact-card" data-subscriber="${s.id}"><span class="row-icon">${icon('users')}</span><span class="row-main"><strong>${esc(s.name||'بدون اسم')}</strong><small>${esc(fullPhone(s)||'بدون هاتف')} • ${fmtDate(s.createdAt)}</small><div class="mini-contact-actions"><button data-contact="call" data-contact-sub="${s.id}" type="button" aria-label="اتصال">${icon('phone')}</button><button data-contact="whatsapp" data-contact-sub="${s.id}" type="button" aria-label="واتساب">${icon('whatsapp')}</button><button data-contact="sms" data-contact-sub="${s.id}" type="button" aria-label="SMS">${icon('message')}</button></div></span><span class="row-amount"><strong>${money(Math.abs(b))}</strong><small>${b>0?'مستحق عليه':b<0?'مستحق له':'متوازن'}</small></span></article>`;
}
function meterRow(m){const s=subscriberBy(m.subscriberId),r=regionBy(m.regionId),b=boardBy(m.boardId),scoped=currentPage==='meters'||detail?.kind==='board-profile'||detail?.kind==='region-profile',cons=meterConsumption(m.id,scoped)||Math.max(0,Number(m.lastReading??m.openingReading??0)-Number(m.openingReading||0));return `<article class="row-card meter-list-card" data-meter="${m.id}"><span class="row-icon">${icon('meter')}</span><span><strong>${esc(s.name)} • ${esc(m.label||m.meterNumber||'عداد')}</strong><small>رقم العداد: ${esc(m.meterNumber||'—')} • المنطقة: ${esc(r.name||'غير محددة')}</small><small>لوحة التوزيع: ${esc(b.name||b.boardNumber||'غير محددة')} • ${esc(m.location||'بدون موقع')}</small><small>${fmtDate(m.openingDate)} ${num(m.openingReading||0)} → ${fmtDate(m.lastReadingDate||m.openingDate)} ${num(m.lastReading??m.openingReading??0)}</small>${m.notes?`<small>ملاحظة: ${esc(m.notes)}</small>`:''}</span><span class="row-amount"><strong>${num(cons)} kW</strong><small>إجمالي الاستهلاك</small></span></article>`}
function distributionBoardRow(b){const r=regionBy(b.regionId),meters=boardMeters(b.id),cons=meters.reduce((s,m)=>s+meterConsumption(m.id,true),0);return `<article class="row-card distribution-card" data-board="${b.id}"><span class="row-icon">${icon('panel')}</span><span><strong>${esc(b.name||'لوحة توزيع')}</strong><small>رقم اللوحة: ${esc(b.boardNumber||'—')} • المنطقة: ${esc(r.name||'غير محددة')}</small><small>${meters.length} عداد داخل اللوحة${b.notes?` • ${esc(b.notes)}`:''}</small></span><span class="row-amount"><strong>${num(cons)} kW</strong><small>إجمالي الاستهلاك</small></span></article>`}
function regionRow(r){const boards=regionBoards(r.id),meters=regionMeters(r.id),cons=meters.reduce((s,m)=>s+meterConsumption(m.id,true),0);return `<article class="row-card region-card" data-region="${r.id}"><span class="row-icon">${icon('mapPin')}</span><span><strong>${esc(r.name||'منطقة')}</strong><small>رقم المنطقة: ${esc(r.regionNumber||'—')}</small><small>${boards.length} لوحة توزيع • ${meters.length} عداد${r.notes?` • ${esc(r.notes)}`:''}</small></span><span class="row-amount"><strong>${num(cons)} kW</strong><small>إجمالي الاستهلاك</small></span></article>`}

function invoiceRow(i){
 const sub=subscriberBy(i.subscriberId),m=meterBy(i.meterId);return `<article class="row-card contact-card invoice-card" data-invoice="${i.id}"><span class="row-icon">${icon('receipt')}</span><span class="row-main"><strong>${esc(sub.name)}</strong><small>${esc(m?.label||m?.meterNumber||'عداد')} • ${fmtDate(i.date)} • ${num(i.consumption)} kW</small><div class="mini-contact-actions"><button data-invoice-contact="call" data-invoice-id="${i.id}" type="button" aria-label="اتصال">${icon('phone')}</button><button data-invoice-contact="whatsapp" data-invoice-id="${i.id}" type="button" aria-label="واتساب">${icon('whatsapp')}</button><button data-invoice-contact="sms" data-invoice-id="${i.id}" type="button" aria-label="SMS">${icon('message')}</button></div></span><span class="row-amount"><strong>${money(invoiceNet(i))}</strong><small>خصم ${money(i.discount||0)}</small></span></article>`;
}

function renderFab(){const root=$('#fabRoot');if(detail){root.innerHTML='';return}const actions=[];if(currentPage==='subscribers'&&hasPerm('subscribers.add'))actions.push(['add-subscriber','إضافة مشترك','users']);if(currentPage==='meters'&&hasPerm('subscribers.add')){actions.push(['add-meter','إضافة عداد','meter']);actions.push(['add-board','إضافة لوحة توزيع','panel']);actions.push(['add-region','إضافة منطقة','mapPin']);}if(currentPage==='invoices'&&hasPerm('subscriptions.add'))actions.push(['add-invoice','إضافة فاتورة','receipt']);if(currentPage==='accounts'){if(hasPerm('accounts.add'))actions.push(['add-account','إضافة حساب','bank']);if(hasPerm('accounts.transfer')||hasPerm('flows.transfer'))actions.push(['account-transfer','تحويل','transfer']);}if(currentPage==='flows'){if(hasPerm('flows.collect'))actions.push(['collection','تحصيل دفعة','arrowDown']);if(hasPerm('flows.send'))actions.push(['send','إرسال دفعة','arrowUp']);if(hasPerm('flows.expense'))actions.push(['expense','مصروف','expense'])}if(currentPage==='employees'&&hasPerm('employees.manage'))actions.push(['add-employee','إضافة موظف','userCog']);if(currentPage==='tasks'&&hasPerm('tasks.manage'))actions.push(['add-task','إضافة مهمة','clipboard']);if(!actions.length){root.innerHTML='';return}root.innerHTML=`<div id="fabMenu" class="fab-menu hidden">${actions.map(([a,l,ic])=>`<button class="fab-item" data-action="${a}" type="button">${icon(ic)}<span>${l}</span></button>`).join('')}</div><button id="fabMain" class="fab-main" type="button">${icon('plus')}</button>`}

function openModal(title,body,formId=''){const root=$('#modalRoot');root.innerHTML=`<div class="modal-backdrop" data-modal-close><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><strong>${esc(title)}</strong><button class="icon-btn dark" data-modal-close type="button">${icon('x')}</button></div><div class="modal-body">${body}</div></section></div>`;hydrateIcons(root);if(formId)setTimeout(()=>$('#'+formId)?.querySelector('input,button')?.focus(),30)}
function closeModal(){if(pickerState)closePicker();$('#modalRoot').innerHTML=''}
function inputField(name,label,type='text',value='',placeholder='',extra=''){return `<label class="field"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${extra}></label>`}
const pickers=new Map();
function pickerField(name,label,items,value='',placeholder='اختر'){
 const id=uid('pick');pickers.set(id,{items,name,placeholder});const current=items.find(x=>String(x.value)===String(value));
 return `<label class="field dropdown-field"><span>${label}</span><input type="hidden" name="${name}" value="${esc(value)}"><button class="select-button almezan-select-trigger" data-picker="${id}" type="button" aria-haspopup="listbox" aria-expanded="false"><b>${esc(current?.label||placeholder)}</b>${icon('chevron')}</button></label>`
}
function pickerMenuPosition(){
 if(!pickerState)return;const {button,menu}=pickerState;if(!button?.isConnected||!menu?.isConnected)return closePicker();
 const r=button.getBoundingClientRect(),vv=window.visualViewport,ox=vv?.offsetLeft||0,oy=vv?.offsetTop||0,vw=vv?.width||window.innerWidth,vh=vv?.height||window.innerHeight;
 const side=window.innerWidth<=620?10:8,leftLimit=ox+side,rightLimit=ox+vw-side,bottomLimit=oy+vh-side;
 const width=Math.max(170,Math.min(Math.max(r.width,220),rightLimit-leftLimit));
 let left=Math.max(leftLimit,Math.min(r.left,rightLimit-width));
 menu.style.left=`${left}px`;menu.style.right='auto';menu.style.width=`${width}px`;menu.style.maxWidth=`${Math.max(160,rightLimit-leftLimit)}px`;
 const below=Math.max(0,bottomLimit-(r.bottom+6)),above=Math.max(0,r.top-(oy+side)),maxH=Math.max(120,Math.min(320,Math.max(below,above)));
 menu.style.maxHeight=`${maxH}px`;
 menu.style.top=(below>=Math.min(180,maxH)||below>=above)?`${Math.max(oy+side,Math.min(bottomLimit-maxH,r.bottom+6))}px`:`${Math.max(oy+side,r.top-maxH-6)}px`;
 requestAnimationFrame(()=>{if(!menu.isConnected)return;const mr=menu.getBoundingClientRect();let x=mr.left;if(mr.right>rightLimit)x-=mr.right-rightLimit;if(x<leftLimit)x=leftLimit;menu.style.left=`${x}px`;const now=menu.getBoundingClientRect();if(now.bottom>bottomLimit)menu.style.top=`${Math.max(oy+side,bottomLimit-now.height)}px`});
}
function openPicker(id,button){
 const cfg=pickers.get(id);if(!cfg)return;closePicker();
 const current=button.closest('.field')?.querySelector('input[type=hidden]')?.value||'';
 const menu=document.createElement('div');menu.id='pickerFloatingMenu';menu.className='almezan-select-menu';menu.setAttribute('role','listbox');
 menu.innerHTML=`<div class="almezan-select-search">${icon('search')}<input id="pickerSearch" type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="بحث..." aria-label="بحث في القائمة"></div><div id="pickerOptions" class="almezan-select-options"></div>`;
 document.body.appendChild(menu);button.classList.add('open');button.setAttribute('aria-expanded','true');pickerState={id,button,cfg,current,menu};renderPickerOptions(current);pickerMenuPosition();
 const search=menu.querySelector('#pickerSearch');search?.addEventListener('pointerdown',e=>e.stopPropagation());search?.addEventListener('click',e=>e.stopPropagation());search?.addEventListener('input',()=>renderPickerOptions(current));
 menu.addEventListener('click',e=>{e.stopPropagation();const option=e.target.closest('[data-pick-value]');if(option)selectPicker(option.dataset.pickValue)});
}
function renderPickerOptions(current){
 if(!pickerState)return;const search=pickerState.menu?.querySelector('#pickerSearch'),q=(search?.value||'').trim().toLowerCase(),root=pickerState.menu?.querySelector('#pickerOptions');if(!root)return;
 const rows=pickerState.cfg.items.filter(x=>!q||String(x.label).toLowerCase().includes(q));
 root.innerHTML=rows.map(x=>`<button class="almezan-select-option ${String(x.value)===String(current)?'selected':''}" data-pick-value="${esc(x.value)}" type="button" role="option" aria-selected="${String(x.value)===String(current)}">${esc(x.label)}</button>`).join('')||'<div class="almezan-select-empty">لا توجد نتائج</div>';
}
function closePicker(){
 if(!pickerState){document.getElementById('pickerFloatingMenu')?.remove();return}
 pickerState.button?.classList.remove('open');pickerState.button?.setAttribute('aria-expanded','false');pickerState.menu?.remove();pickerState=null;
}
function selectPicker(value){
 if(!pickerState)return;const {button,cfg}=pickerState,item=cfg.items.find(x=>String(x.value)===String(value)),field=button.closest('.field'),hidden=field?.querySelector('input[type=hidden]');if(hidden)hidden.value=value;const valueEl=button.querySelector('b');if(valueEl)valueEl.textContent=item?.label||cfg.placeholder||'اختر';const name=cfg.name;closePicker();handlePickerChange(name,value)
}
function openSimpleSelect(button){
 const hidden=button.closest('.field')?.querySelector('input[type=hidden]');if(!hidden)return;const type=button.dataset.simpleSelect;let items=[];
 if(type==='account-type')items=[{value:'cash',label:'نقدي'},{value:'bank',label:'بنكي'}];else if(type==='employee-status')items=[{value:'active',label:'نشط'},{value:'inactive',label:'موقوف'}];else return;
 const id=uid('simplepick');pickers.set(id,{items,name:hidden.name,placeholder:'اختر'});openPicker(id,button);
}

function openAddSubscriber(){if(!guard('subscribers.add'))return;const prefixes=[{value:'+970',label:'+970 فلسطين'},{value:'+972',label:'+972'}];openModal('إضافة مشترك',`<form id="subscriberForm"><div class="form-grid">${inputField('name','اسم المشترك','','','اكتب الاسم الكامل')}${pickerField('prefix','مقدمة الهاتف',prefixes,'+970')}${inputField('phone','رقم هاتف المشترك','tel','','59xxxxxxx','inputmode="tel"')}${inputField('address','العنوان','','','المنطقة أو العنوان')}${inputField('createdAt','تاريخ إضافة المشترك','date',dateOnly(new Date()),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات اختيارية"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} حفظ المشترك</button></div></form>`,'subscriberForm')}
function openAddRegion(){
 if(!guard('subscribers.add'))return;
 openModal('إضافة منطقة لوحات توزيع',`<form id="regionForm"><div class="form-grid">${inputField('name','اسم المنطقة','','','مثال: المنطقة الشمالية')}${inputField('regionNumber','رقم المنطقة','text',nextRegionNumber(),'','')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات عن المنطقة"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} حفظ المنطقة</button></div></form>`,'regionForm');
}
function openAddBoard(preselectedRegionId=''){
 if(!guard('subscribers.add'))return;
 if(!data.regions.length)return toast('أضف منطقة أولاً ثم أضف لوحة التوزيع','تنبيه');
 const regionItems=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
 openModal('إضافة لوحة توزيع',`<form id="boardForm"><div class="form-grid">${pickerField('boardRegionId','المنطقة',regionItems,preselectedRegionId,'اختر المنطقة')}${inputField('name','اسم لوحة التوزيع','','','مثال: لوحة الحي المركزي')}${inputField('boardNumber','رقم لوحة التوزيع','text',nextBoardNumber(),'','')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات عن لوحة التوزيع"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} حفظ لوحة التوزيع</button></div></form>`,'boardForm');
}
function openAddMeter(preselectedSubscriberId=''){
 if(!guard('subscribers.add'))return;if(!data.subscribers.length)return toast('أضف مشتركاً أولاً','تنبيه');
 if(!data.regions.length)return toast('أضف منطقة من قائمة العدادات أولاً','تنبيه');
 if(!data.distributionBoards.length)return toast('أضف لوحة توزيع من قائمة العدادات أولاً','تنبيه');
 const subItems=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));
 const regionItems=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
 openModal('إضافة عداد',`<form id="meterForm"><div class="form-grid">${pickerField('subscriberId','اسم المشترك',subItems,preselectedSubscriberId,'اختر المشترك')}${inputField('meterNumber','رقم العداد','text',nextMeterNumber(),'','readonly')}${pickerField('regionId','منطقة العداد',regionItems,'','اختر المنطقة')}${pickerField('boardId','لوحة التوزيع',[],'','اختر المنطقة أولاً')}${inputField('label','اسم العداد','','','مثال: العداد الرئيسي')}${inputField('location','موقع العداد','','','مثال: المنزل / المحل / العمارة')}${inputField('openingReading','القراءة الافتتاحية للعداد','number','0','0','step="0.01" min="0"')}${inputField('openingDate','تاريخ القراءة الافتتاحية','date',dateOnly(new Date()),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات عن العداد"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} حفظ العداد</button></div></form>`,'meterForm');
}
function openAddInvoice(preselectedSubscriberId=''){
 if(!guard('subscriptions.add'))return;if(!data.subscribers.length)return toast('أضف مشتركاً أولاً','تنبيه');pendingInvoiceImage='';pendingInvoiceImageName='';
 const subItems=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));const meterItems=data.meters.filter(m=>!preselectedSubscriberId||String(m.subscriberId)===String(preselectedSubscriberId)).map(m=>({value:m.id,label:`${m.label||m.meterNumber||'عداد'} — ${m.meterNumber||''}`}));
 openModal('إضافة فاتورة',`<form id="invoiceForm"><input type="hidden" name="sendMode" value="save"><div class="form-grid">${pickerField('invoiceSubscriberId','اسم المشترك',subItems,preselectedSubscriberId,'اختر المشترك')}${pickerField('meterId','العداد',meterItems,'',meterItems.length?'اختر العداد':'لا توجد عدادات للمشترك')}<div id="invoicePrevious" class="previous-reading span-2"><div class="wide muted-note">اختر المشترك ثم العداد لعرض القراءة السابقة.</div></div>${inputField('date','تاريخ القراءة الحالية','date',dateOnly(new Date()),'')}${inputField('closingReading','القراءة الحالية','number','','أدخل القراءة الحالية','step="0.01" min="0"')}${inputField('unitPrice','سعر الكيلو','number',data.settings.defaultRate||0,'0','step="0.001" min="0" data-touched=""')}${inputField('discount','الخصم','number',data.settings.defaultDiscount||0,'0','step="0.01" min="0"')}<label class="field span-2"><span>ملاحظات القراءة الحالية</span><textarea name="notes" rows="3" placeholder="أضف ملاحظة عن القراءة الحالية"></textarea></label><div class="reading-photo-block span-2"><div class="reading-photo-actions"><label class="photo-action">${icon('image')}<span>إرفاق صورة</span><input id="readingPhotoGallery" type="file" accept="image/*" hidden></label><label class="photo-action">${icon('camera')}<span>التقاط صورة</span><input id="readingPhotoCamera" type="file" accept="image/*" capture="environment" hidden></label></div><div id="invoicePhotoPreview" class="reading-photo-preview"><span>لم يتم إرفاق صورة للقراءة</span></div></div><section class="invoice-preview span-2"><div class="preview-title">${icon('receipt')}<div><strong>معاينة الفاتورة</strong><small>تتحدث تلقائياً أثناء الإدخال</small></div></div><div class="preview-grid"><span>تاريخ القراءة السابقة<b id="pvPrevDate">—</b></span><span>القراءة السابقة<b id="pvPrevRead">—</b></span><span>تاريخ القراءة الحالية<b id="pvNowDate">${fmtDate(dateOnly(new Date()))}</b></span><span>القراءة الحالية<b id="pvNowRead">—</b></span><span>إجمالي الاستهلاك<b id="pvConsumption">0 KW</b></span><span>سعر الكيلو<b id="pvUnit">${money(data.settings.defaultRate||0)}</b></span><span>الخصم<b id="pvDiscount">${money(data.settings.defaultDiscount||0)}</b></span><span class="highlight">إجمالي تكلفة الاستهلاك<b id="pvTotal">${money(0)}</b></span></div></section></div><div class="modal-actions invoice-actions" style="padding:18px 0 0"><button class="secondary-btn" data-invoice-submit="save" type="submit">${icon('save')} حفظ</button><button class="primary-btn" data-invoice-submit="send" type="submit">${icon('send')} حفظ وإرسال</button></div></form>`,'invoiceForm');setTimeout(refreshInvoiceForm,40);
}
function openMovement(type,preselectedSubscriberId=''){const perm={collection:'flows.collect',send:'flows.send',expense:'flows.expense',transfer:'flows.transfer'}[type];if(!guard(perm))return;if(type==='transfer'){if(data.accounts.length<2)return toast('أضف حسابين على الأقل','تنبيه');return openTransfer(preselectedSubscriberId)}if(!data.accounts.length)return toast('لا توجد حسابات مالية، أضف حساباً أولاً','تنبيه');const accItems=data.accounts.map(a=>({value:a.id,label:`${a.name} — ${money(accountBalance(a.id))}`}));const subItems=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));const titles={collection:'استقبال دفعة',send:'إرسال دفعة',expense:'إضافة مصروف'};openModal(titles[type],`<form id="movementForm" data-type="${type}"><div class="form-grid">${type!=='expense'?pickerField('subscriberId','المشترك',subItems,preselectedSubscriberId):inputField('payee','اسم/سبب المصروف','','','مثال: صيانة')}${pickerField('accountId',type==='collection'?'الحساب المودع فيه':'الحساب المصروف منه',accItems)}${inputField('amount','المبلغ','number','','0','step="0.01" min="0.01" required')}${inputField('date','التاريخ','datetime-local',new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="أضف ملاحظة"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">حفظ العملية</button></div></form>`,'movementForm')}
function openTransfer(contextSubscriberId=''){const items=data.accounts.map(a=>({value:a.id,label:`${a.name} — ${money(accountBalance(a.id))}`}));openModal('تحويل بين الحسابات',`<form id="transferForm"><input type="hidden" name="subscriberId" value="${esc(contextSubscriberId)}"><div class="form-grid">${pickerField('fromAccountId','الحساب المحول منه',items)}${pickerField('toAccountId','الحساب المحول إليه',items)}${inputField('amount','المبلغ','number','','0','step="0.01" min="0.01" required')}${inputField('date','تاريخ التحويل','datetime-local',new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">حفظ التحويل</button></div></form>`,'transferForm')}
function openAddAccount(){if(!guard('accounts.add'))return;openModal('إضافة حساب مالي',`<form id="accountForm"><div class="form-grid">${inputField('name','اسم الحساب','','','مثال: الصندوق الرئيسي')}<label class="field dropdown-field has-select"><span>نوع الحساب</span><input type="hidden" name="type" value="cash"><button class="select-button" data-simple-select="account-type" type="button"><b style="font-weight:300">نقدي</b>${icon('chevron')}</button></label>${inputField('number','رقم الحساب','','','اختياري للحساب البنكي')}${inputField('openingBalance','الرصيد الافتتاحي','number','0','0','step="0.01"')}${inputField('createdAt','تاريخ الإضافة','date',dateOnly(new Date()),'')}<label class="field"><span>ملاحظات</span><textarea name="notes" rows="3"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">حفظ الحساب</button></div></form>`,'accountForm')}
const permissionList=[['home.view','عرض الرئيسية'],['subscribers.view','عرض المشتركين'],['subscribers.add','إضافة مشترك / عداد'],['subscribers.edit','تعديل المشتركين والعدادات'],['subscriptions.view','عرض الفواتير'],['subscriptions.add','إضافة فاتورة'],['subscriptions.edit','تعديل الفواتير'],['flows.view','عرض التدفقات'],['flows.collect','تحصيل دفعة'],['flows.send','إرسال دفعة'],['flows.expense','إضافة مصروف'],['flows.transfer','تحويل بين الحسابات'],['flows.edit','تعديل الحركات'],['accounts.view','عرض الحسابات'],['accounts.add','إضافة حساب'],['accounts.edit','تعديل الحسابات'],['accounts.transfer','تحويل الحسابات'],['timeline.view','عرض السجل الزمني'],['reports.view','عرض التقارير'],['settings.view','عرض الإعدادات'],['settings.edit','إدارة إعدادات المنصة'],['tasks.view','عرض المهام'],['tasks.manage','إدارة المهام'],['employees.view','عرض الموظفين'],['employees.manage','إدارة الموظفين']];
function openAddEmployee(edit=null){if(!guard('employees.manage'))return;const checked=new Set(edit?.permissions||[]);openModal(edit?'تعديل الموظف':'إضافة موظف',`<form id="employeeForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم الموظف','text',edit?.name||'','الاسم الظاهر داخل التطبيق')}${inputField('username','اسم المستخدم','text',edit?.username||'','اسم دخول خاص بالموظف','autocomplete="off" autocapitalize="none"')}${inputField('password','كلمة المرور','password','',edit?'اتركها فارغة لعدم التغيير':'كلمة مرور خاصة بالموظف')}<label class="field dropdown-field has-select"><span>الحالة</span><input type="hidden" name="status" value="${edit?.status||'active'}"><button class="select-button" data-simple-select="employee-status" type="button"><b style="font-weight:300">${edit?.status==='inactive'?'موقوف':'نشط'}</b>${icon('chevron')}</button></label></div><div style="margin-top:16px"><div class="eyebrow">الصلاحيات الدقيقة</div><div class="perm-grid" style="margin-top:8px">${permissionList.map(([v,l])=>`<label class="perm"><input type="checkbox" name="permissions" value="${v}" ${checked.has(v)?'checked':''}><span>${l}</span></label>`).join('')}</div></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">حفظ الموظف</button>${edit?`<button class="secondary-btn" data-delete-employee="${edit.id}" type="button">حذف</button>`:''}</div></form>`,'employeeForm')}
function openAddTask(){if(!guard('tasks.manage'))return;openModal('إضافة مهمة',`<form id="taskForm"><div class="form-grid">${inputField('title','عنوان المهمة','','','عنوان واضح')}${inputField('dueAt','موعد المهمة','datetime-local',new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16),'')}<label class="field span-2"><span>التفاصيل</span><textarea name="details" rows="4"></textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">حفظ المهمة</button></div></form>`,'taskForm')}
function openFollowSubscriber(){if(!data.subscribers.length)return toast('لا يوجد مشتركون','تنبيه');const items=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));openModal('متابعة مشترك',`<div class="form-grid">${pickerField('followSubscriber','اختر المشترك',items)}</div><div class="modal-actions" style="padding:18px 0 0"><button id="followOpenBtn" class="primary-btn" type="button">فتح الملف</button></div>`)}
function renderSubscriberProfile(id,tab=''){
 const s=data.subscribers.find(x=>String(x.id)===String(id));if(!s)return;const activeTab=tab||(detail?.kind==='subscriber-profile'&&String(detail.id)===String(id)?detail.tab:'overview')||'overview';detail={kind:'subscriber-profile',id,title:'ملف المشترك',tab:activeTab};setPageTitle('ملف المشترك');
 const snap=subscriberSnapshot(id),meters=snap.meters,invoices=[...snap.invoices].sort((a,b)=>new Date(b.date)-new Date(a.date)),moves=data.movements.filter(m=>String(m.subscriberId||'')===String(id)).sort((a,b)=>new Date(b.date||b.createdAt)-new Date(a.date||a.createdAt));
 const quick=`<section class="profile-quick"><div class="profile-quick-title"><strong>إجراءات سريعة</strong><small>إجراءات مرتبطة بالمشترك</small></div><div class="quick-grid profile-actions">${hasPerm('subscriptions.add')?`<button class="quick-action" data-profile-action="invoice" data-profile-id="${id}" type="button"><span class="qa-icon">${icon('receipt')}</span>إضافة فاتورة</button>`:''}${hasPerm('subscribers.add')?`<button class="quick-action" data-profile-action="meter" data-profile-id="${id}" type="button"><span class="qa-icon">${icon('meter')}</span>إضافة عداد</button>`:''}${hasPerm('flows.collect')?`<button class="quick-action" data-profile-action="collection" data-profile-id="${id}" type="button"><span class="qa-icon">${icon('arrowDown')}</span>استقبال دفعة</button>`:''}${hasPerm('flows.send')?`<button class="quick-action" data-profile-action="send" data-profile-id="${id}" type="button"><span class="qa-icon">${icon('arrowUp')}</span>إرسال دفعة</button>`:''}${hasPerm('flows.transfer')?`<button class="quick-action" data-profile-action="transfer" data-profile-id="${id}" type="button"><span class="qa-icon">${icon('transfer')}</span>تحويل بين الحسابات</button>`:''}</div></section>`;
 const header=`<section class="subscriber-profile-head"><div class="subscriber-profile-main"><button class="secondary-btn compact" id="profileBack" type="button">${icon('back')} رجوع</button><div class="subscriber-avatar">${esc((s.name||'م').trim().charAt(0))}</div><div><small>ملف المشترك</small><h1>${esc(s.name)}</h1><p>${esc(fullPhone(s)||'')} • ${esc(s.address||'بدون عنوان')}</p></div></div><div class="profile-contact-actions"><button data-contact="call" data-contact-sub="${id}" type="button">${icon('phone')}</button><button data-contact="whatsapp" data-contact-sub="${id}" type="button">${icon('whatsapp')}</button><button data-contact="sms" data-contact-sub="${id}" type="button">${icon('message')}</button></div></section><div class="profile-tabs"><button class="${activeTab==='overview'?'active':''}" data-profile-tab="overview" data-profile-id="${id}" type="button">نظرة عامة</button><button class="${activeTab==='invoices'?'active':''}" data-profile-tab="invoices" data-profile-id="${id}" type="button">الفواتير <b>${invoices.length}</b></button><button class="${activeTab==='movements'?'active':''}" data-profile-tab="movements" data-profile-id="${id}" type="button">الحركات المالية <b>${moves.length}</b></button></div>`;
 let body='';
 if(activeTab==='overview'){
  const latest=snap.latestInvoice;
  body=`<section class="profile-data-card"><div class="card-section-title">${icon('users')}<div><strong>بيانات المشترك</strong><small>المعلومات الأساسية والاستحقاقات</small></div></div><div class="profile-data-grid"><span>الاسم<b>${esc(s.name)}</b></span><span>رقم الهاتف<b dir="ltr">${esc(fullPhone(s)||'—')}</b></span><span>العنوان<b>${esc(s.address||'—')}</b></span><span>تاريخ الإضافة<b>${fmtDate(s.createdAt)}</b></span><span class="debt">المستحق عليه<b>${money(snap.dueFrom)}</b></span><span class="credit">المستحق له<b>${money(snap.dueTo)}</b></span></div>${s.notes?`<div class="profile-note">${esc(s.notes)}</div>`:''}</section><section class="electric-summary"><div class="card-section-title">${icon('meter')}<div><strong>الملخص الإجمالي لاشتراك الكهرباء</strong><small>من أول قراءة حتى آخر قراءة</small></div></div><div class="metric-list">${metric('meter-reading','القراءة الافتتاحية',`${num(snap.openingReading)} KW`,fmtDate(snap.openingDate),'line',[snap.openingReading])}${metric('meter-last','القراءة الأخيرة',`${num(snap.lastReading)} KW`,fmtDate(snap.lastDate),'line',[snap.openingReading,snap.lastReading])}${metric('consumption','الاستهلاك الكلي',`${num(snap.consumption)} KW`,'','bars',invoices.map(i=>i.consumption))}${metric('consumption-cost','إجمالي تكلفة الاستهلاك',money(snap.cost),'','bars',invoices.map(invoiceNet))}${metric('collections','إجمالي المدفوع',money(snap.paid),'','','')}${metric('due-from','المتبقي عليك',money(snap.dueFrom),'','','')}${metric('due-to','المتبقي لك',money(snap.dueTo),'','','')}</div></section>${latest?`<section class="latest-invoice-card"><div class="card-section-title">${icon('receipt')}<div><strong>آخر فاتورة</strong><small>${fmtDate(latest.date)} • ${esc(meterBy(latest.meterId)?.label||'العداد')}</small></div></div><div class="preview-grid"><span>القراءة السابقة<b>${num(latest.openingReading)} KW</b></span><span>القراءة الحالية<b>${num(latest.closingReading)} KW</b></span><span>الاستهلاك<b>${num(latest.consumption)} KW</b></span><span class="highlight">القيمة<b>${money(invoiceNet(latest))}</b></span></div><button class="secondary-btn wide-button" data-invoice="${latest.id}" type="button">عرض تفاصيل الفاتورة</button></section>`:`<div class="empty">لا توجد فواتير لهذا المشترك حتى الآن.</div>`}<section class="meters-section"><div class="section-row-title"><div><strong>عدادات المشترك</strong><small>${meters.length} عداد</small></div></div><div class="cards-list">${meters.map(meterRow).join('')||'<div class="empty">لا توجد عدادات لهذا المشترك.</div>'}</div></section>`;
 }else if(activeTab==='invoices') body=`<div class="cards-list profile-tab-list">${invoices.length?invoices.map(invoiceRow).join(''):'<div class="empty">لا توجد فواتير لهذا المشترك.</div>'}</div>`;
 else body=`<div class="cards-list profile-tab-list">${moves.length?moves.map(m=>`<article class="row-card"><span class="row-icon">${icon(movementType(m)==='collection'?'arrowDown':movementType(m)==='send'?'arrowUp':'transfer')}</span><span><strong>${movementType(m)==='collection'?'استقبال دفعة':movementType(m)==='send'?'إرسال دفعة':'تحويل مالي'}</strong><small>${fmtDateTime(m.date||m.createdAt)}${m.notes?` • ${esc(m.notes)}`:''}</small></span><span class="row-amount"><strong>${money(m.amount)}</strong></span></article>`).join(''):'<div class="empty">لا توجد حركات مالية لهذا المشترك.</div>'}</div>`;
 $('#mainContent').innerHTML=`${header}${quick}${body}`;renderFab();hydrateIcons();
}

function renderMeterProfile(id){
 const m=meterBy(id);if(!m)return;
 let inv=filtered('invoices').filter(i=>String(i.meterId)===String(id));
 const q=detailSearch.trim().toLowerCase();
 inv=inv.filter(i=>!q||`${i.notes||''} ${i.id||''} ${invoiceNet(i)} ${i.consumption||0} ${i.closingReading||''}`.toLowerCase().includes(q));
 inv=sortRows(inv,'amount','date');
 const allMeterInvoices=data.invoices.filter(i=>String(i.meterId)===String(id)).sort((a,b)=>new Date(a.periodTo||a.date||0)-new Date(b.periodTo||b.date||0));
 const first=Number(m.openingReading||0),last=Number(m.lastReading??first),cons=inv.reduce((a,i)=>a+Number(i.consumption||0),0),cost=inv.reduce((a,i)=>a+invoiceNet(i),0),r=regionBy(m.regionId),b=boardBy(m.boardId),sub=subscriberBy(m.subscriberId);
 const readings=[{id:`opening-${m.id}`,date:m.openingDate,reading:first,notes:m.notes||'القراءة الافتتاحية',opening:true},...allMeterInvoices.map(i=>({id:i.id,date:i.periodTo||i.date,reading:Number(i.closingReading||0),notes:i.notes||'',image:i.readingImage||'',invoiceId:i.id}))];
 detail={kind:'meter-profile',id,title:'تفاصيل العداد'};setPageTitle('تفاصيل العداد');
 $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" id="profileBack" data-back-page="meters" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(m.label||m.meterNumber||'عداد')}</h1><p>${esc(sub.name)} • ${esc(m.meterNumber||'')}</p></div></div><section class="profile-data-card"><div class="card-section-title">${icon('meter')}<div><strong>بيانات العداد</strong><small>المنطقة ولوحة التوزيع والقراءات</small></div></div><div class="profile-data-grid"><span>المشترك<b>${esc(sub.name)}</b></span><span>رقم العداد<b>${esc(m.meterNumber||'—')}</b></span><span>منطقة العداد<b>${esc(r.name||'غير محددة')}</b></span><span>لوحة التوزيع<b>${esc(b.name||b.boardNumber||'غير محددة')}</b></span><span>موقع العداد<b>${esc(m.location||'—')}</b></span><span>القراءة الافتتاحية<b>${num(first)} KW</b></span><span>تاريخ الافتتاحية<b>${fmtDate(m.openingDate)}</b></span><span>القراءة الأخيرة<b>${num(last)} KW</b></span><span>تاريخ القراءة الأخيرة<b>${fmtDate(m.lastReadingDate||m.openingDate)}</b></span>${m.notes?`<span class="wide">الملاحظات<b>${esc(m.notes)}</b></span>`:''}</div></section>${timeFilterHtml()}${listToolbar('بحث في فواتير وقراءات العداد...')}<div class="metric-list" style="margin-bottom:14px">${metric('meter-reading','القراءة الافتتاحية',num(first),fmtDate(m.openingDate),'line',[first])}${metric('meter-last','القراءة الأخيرة',num(last),fmtDate(m.lastReadingDate),'line',[first,last])}${metric('consumption','إجمالي الاستهلاك',`${num(cons)} kW`,'حسب الفترة','line',inv.map(i=>Number(i.consumption||0)))}${metric('consumption-cost','إجمالي تكلفة الاستهلاك',money(cost),'حسب الفترة','bars',inv.map(invoiceNet))}</div><section class="readings-history"><div class="section-row-title"><div><strong>سجل قراءات العداد</strong><small>${readings.length} قراءة مسجلة</small></div></div><div class="readings-list">${readings.map(x=>`<div class="reading-row"><span class="reading-dot ${x.opening?'opening':''}"></span><div><strong>${num(x.reading)} KW</strong><small>${fmtDate(x.date)}${x.notes?` • ${esc(x.notes)}`:''}</small></div>${x.invoiceId?`<button class="tiny-action" data-invoice="${x.invoiceId}" type="button">${icon('receipt')} الفاتورة</button>`:'<span class="badge">افتتاحية</span>'}</div>`).join('')}</div></section><section class="meter-invoices-section"><div class="section-row-title"><div><strong>فواتير العداد</strong><small>${inv.length} فاتورة في الفترة المحددة</small></div></div><div class="cards-list">${inv.length?inv.map(invoiceRow).join(''):'<div class="empty">لا توجد فواتير لهذا العداد في الفترة المحددة.</div>'}</div></section>`;renderFab();hydrateIcons();
}
function renderBoardProfile(id){
 const b=boardBy(id);if(!b||!b.id)return;const r=regionBy(b.regionId),q=detailSearch.trim().toLowerCase();let meters=boardMeters(id).filter(m=>meterInRange(m)&&(!q||`${subscriberBy(m.subscriberId).name} ${m.meterNumber||''} ${m.location||''}`.toLowerCase().includes(q)));
 if(detailSort==='amount-desc')meters.sort((a,z)=>meterConsumption(z.id,true)-meterConsumption(a.id,true));else if(detailSort==='amount-asc')meters.sort((a,z)=>meterConsumption(a.id,true)-meterConsumption(z.id,true));else if(detailSort==='date-asc')meters.sort((a,z)=>new Date(a.lastReadingDate||a.openingDate||0)-new Date(z.lastReadingDate||z.openingDate||0));else meters.sort((a,z)=>new Date(z.lastReadingDate||z.openingDate||0)-new Date(a.lastReadingDate||a.openingDate||0));
 const cons=meters.reduce((s,m)=>s+meterConsumption(m.id,true),0);detail={kind:'board-profile',id,title:'لوحة التوزيع'};setPageTitle('لوحة التوزيع');
 $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" id="profileBack" data-back-page="meters" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(b.name||'لوحة توزيع')}</h1><p>${esc(r.name||'غير محددة')} • رقم اللوحة: ${esc(b.boardNumber||'—')}${b.notes?` • ${esc(b.notes)}`:''}</p></div></div><div class="metric-list" style="margin-bottom:14px">${metric('meter-count','عدد العدادات',meters.length,'داخل اللوحة','bars',meters.map((_,i)=>i+1))}${metric('consumption','إجمالي الاستهلاك',`${num(cons)} kW`,'حسب الفترة','line',meters.map(m=>meterConsumption(m.id,true)))}</div>${timeFilterHtml()}${listToolbar('بحث باسم المشترك أو رقم العداد...')}<div class="cards-list">${meters.length?meters.map(meterRow).join(''):'<div class="empty">لا توجد عدادات في هذه اللوحة ضمن الفترة.</div>'}</div>`;renderFab();hydrateIcons();
}
function renderRegionProfile(id,section=''){
 const r=regionBy(id);if(!r||!r.id)return;const meters=regionMeters(id),boards=regionBoards(id),filteredMeters=meters.filter(m=>meterInRange(m)),cons=filteredMeters.reduce((s,m)=>s+meterConsumption(m.id,true),0);detail={kind:'region-profile',id,section,title:'تفاصيل المنطقة'};setPageTitle('تفاصيل المنطقة');
 let body='';const q=detailSearch.trim().toLowerCase();
 if(section==='meters'){
   let rows=filteredMeters.filter(m=>!q||`${subscriberBy(m.subscriberId).name} ${m.meterNumber||''} ${m.location||''}`.toLowerCase().includes(q));
   if(detailSort==='amount-desc')rows.sort((a,z)=>meterConsumption(z.id,true)-meterConsumption(a.id,true));else if(detailSort==='amount-asc')rows.sort((a,z)=>meterConsumption(a.id,true)-meterConsumption(z.id,true));else if(detailSort==='date-asc')rows.sort((a,z)=>new Date(a.lastReadingDate||a.openingDate||0)-new Date(z.lastReadingDate||z.openingDate||0));else rows.sort((a,z)=>new Date(z.lastReadingDate||z.openingDate||0)-new Date(a.lastReadingDate||a.openingDate||0));
   body=`${timeFilterHtml()}${listToolbar('بحث في عدادات المنطقة...')}<div class="count-banner"><div><small>عدادات المنطقة</small><strong>${rows.length}</strong></div><span class="badge">${num(rows.reduce((a,m)=>a+meterConsumption(m.id,true),0))} kW</span></div><div class="cards-list">${rows.length?rows.map(meterRow).join(''):'<div class="empty">لا توجد عدادات في هذه المنطقة.</div>'}</div>`;
 }else if(section==='boards'){
   let rows=boards.filter(b=>!q||`${b.name||''} ${b.boardNumber||''}`.toLowerCase().includes(q));
   const boardCons=x=>boardMeters(x.id).reduce((a,m)=>a+meterConsumption(m.id,true),0);
   if(detailSort==='amount-desc')rows.sort((a,z)=>boardCons(z)-boardCons(a));else if(detailSort==='amount-asc')rows.sort((a,z)=>boardCons(a)-boardCons(z));else if(detailSort==='date-asc')rows.sort((a,z)=>new Date(a.createdAt||0)-new Date(z.createdAt||0));else rows.sort((a,z)=>new Date(z.createdAt||0)-new Date(a.createdAt||0));
   body=`${timeFilterHtml()}${listToolbar('بحث في لوحات توزيع المنطقة...')}<div class="count-banner"><div><small>لوحات توزيع المنطقة</small><strong>${rows.length}</strong></div><span class="badge">${rows.reduce((a,b)=>a+boardMeters(b.id).length,0)} عداد</span></div><div class="cards-list">${rows.length?rows.map(distributionBoardRow).join(''):'<div class="empty">لا توجد لوحات توزيع في هذه المنطقة.</div>'}</div>`;
 }
 $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" id="profileBack" data-back-page="meters" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(r.name||'منطقة')}</h1><p>رقم المنطقة: ${esc(r.regionNumber||'—')}${r.notes?` • ${esc(r.notes)}`:''}</p></div></div><div class="region-summary-grid"><button class="region-summary-card ${section==='meters'?'active':''}" data-region-view="meters" type="button"><span>${icon('meter')}</span><div><small>جميع عدادات المنطقة</small><strong>${meters.length}</strong><em>${num(cons)} kW استهلاك</em></div></button><button class="region-summary-card ${section==='boards'?'active':''}" data-region-view="boards" type="button"><span>${icon('panel')}</span><div><small>لوحات التوزيع</small><strong>${boards.length}</strong><em>${num(cons)} kW استهلاك العدادات</em></div></button></div>${body||'<div class="empty">اختر بطاقة العدادات أو لوحات التوزيع لعرض التفاصيل.</div>'}`;renderFab();hydrateIcons();
}
function renderInvoiceProfile(id){
 const i=data.invoices.find(x=>String(x.id)===String(id));if(!i)return;const sub=subscriberBy(i.subscriberId),m=meterBy(i.meterId),snap=subscriberSnapshot(i.subscriberId);detail={kind:'invoice-profile',id,title:'تفاصيل الفاتورة'};setPageTitle('تفاصيل الفاتورة');
 $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn" id="profileBack" data-back-subscriber="${sub.id}" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">فاتورة ${esc(sub.name)}</h1><p>${esc(m?.label||m?.meterNumber||'عداد')} • ${fmtDate(i.date)}</p></div><div class="profile-contact-actions"><button data-invoice-contact="call" data-invoice-id="${i.id}" type="button">${icon('phone')}</button><button data-invoice-contact="whatsapp" data-invoice-id="${i.id}" type="button">${icon('whatsapp')}</button><button data-invoice-contact="sms" data-invoice-id="${i.id}" type="button">${icon('message')}</button></div></div><section class="profile-data-card"><div class="card-section-title">${icon('receipt')}<div><strong>تفاصيل فاتورة الكهرباء</strong><small>${esc(m?.label||'')} ${m?.meterNumber?`• ${esc(m.meterNumber)}`:''}</small></div></div><div class="profile-data-grid"><span>تاريخ القراءة السابقة<b>${fmtDate(i.periodFrom||i.date)}</b></span><span>القراءة السابقة<b>${num(i.openingReading)} KW</b></span><span>تاريخ القراءة الحالية<b>${fmtDate(i.periodTo||i.date)}</b></span><span>القراءة الحالية<b>${num(i.closingReading)} KW</b></span><span>إجمالي الاستهلاك<b>${num(i.consumption)} KW</b></span><span>سعر الكيلو<b>${money(i.unitPrice||0)}</b></span><span>الخصم<b>${money(i.discount||0)}</b></span><span class="highlight-field">إجمالي الفاتورة<b>${money(invoiceNet(i))}</b></span></div>${i.notes?`<div class="profile-note">${esc(i.notes)}</div>`:''}${i.readingImage?`<button class="invoice-reading-image" data-view-reading-image="${i.id}" type="button"><img src="${i.readingImage}" alt="صورة قراءة العداد"><span>${icon('image')} عرض صورة القراءة</span></button>`:''}</section><section class="electric-summary"><div class="card-section-title">${icon('meter')}<div><strong>الملخص الإجمالي للمشترك</strong><small>حتى هذه اللحظة</small></div></div><div class="metric-list">${metric('consumption','إجمالي الاستهلاك',`${num(snap.consumption)} KW`,'','','')}${metric('consumption-cost','إجمالي التكلفة',money(snap.cost),'','','')}${metric('collections','إجمالي المدفوع',money(snap.paid),'','','')}${metric('due-from','المتبقي عليك',money(snap.dueFrom),'','','')}${metric('due-to','المتبقي لك',money(snap.dueTo),'','','')}</div></section>`;renderFab();hydrateIcons();
}

async function handleSubmit(form,submitter=null){const fd=new FormData(form);const obj=Object.fromEntries(fd.entries());try{
 if(form.id==='subscriberForm'){const phone=String(obj.phone||'').replace(/\D/g,'').replace(/^0+/,'');const created=obj.createdAt?`${obj.createdAt}T12:00:00`:isoNow();const row={id:uid('sub'),name:String(obj.name||'').trim(),prefix:obj.prefix||'+970',phone,address:String(obj.address||'').trim(),notes:String(obj.notes||'').trim(),createdAt:created};if(!row.name)throw Error('اكتب اسم المشترك.');data.subscribers.unshift(row);save('subscribers');logAction('إضافة مشترك',row.name);toast('تمت إضافة المشترك');closeModal();currentPage='subscribers';render()}
 if(form.id==='regionForm'){const row={id:uid('region'),name:String(obj.name||'').trim(),regionNumber:String(obj.regionNumber||'').trim()||nextRegionNumber(),notes:String(obj.notes||'').trim(),createdAt:isoNow()};if(!row.name)throw Error('اكتب اسم المنطقة.');data.regions.unshift(row);save('regions');logAction('إضافة منطقة لوحات توزيع',`${row.name} • ${row.regionNumber}`);toast('تمت إضافة المنطقة');closeModal();currentPage='meters';meterSection='regions';render()}
 if(form.id==='boardForm'){const row={id:uid('board'),regionId:obj.boardRegionId,name:String(obj.name||'').trim(),boardNumber:String(obj.boardNumber||'').trim()||nextBoardNumber(),notes:String(obj.notes||'').trim(),createdAt:isoNow()};if(!row.regionId)throw Error('اختر المنطقة.');if(!row.name)throw Error('اكتب اسم لوحة التوزيع.');data.distributionBoards.unshift(row);save('distributionBoards');logAction('إضافة لوحة توزيع',`${row.name} • ${row.boardNumber}`);toast('تمت إضافة لوحة التوزيع');closeModal();currentPage='meters';meterSection='boards';render()}
 if(form.id==='meterForm'){const opening=Number(obj.openingReading||0),board=boardBy(obj.boardId);const row={id:uid('meter'),subscriberId:obj.subscriberId,regionId:obj.regionId,boardId:obj.boardId,label:String(obj.label||'').trim()||String(obj.meterNumber||'').trim()||'عداد',meterNumber:String(obj.meterNumber||'').trim()||nextMeterNumber(),location:String(obj.location||'').trim(),openingReading:opening,lastReading:opening,openingDate:obj.openingDate||dateOnly(new Date()),lastReadingDate:obj.openingDate||dateOnly(new Date()),ratePerKw:Number(data.settings.defaultRate||0),notes:String(obj.notes||'').trim(),createdAt:isoNow()};if(!row.subscriberId)throw Error('اختر المشترك.');if(!row.regionId)throw Error('اختر منطقة العداد.');if(!row.boardId)throw Error('اختر لوحة التوزيع.');if(String(board.regionId)!==String(row.regionId))throw Error('لوحة التوزيع لا تتبع المنطقة المختارة.');data.meters.unshift(row);save('meters');logAction('إضافة عداد',`${subscriberBy(row.subscriberId).name} • ${row.meterNumber}`);toast('تمت إضافة العداد');closeModal();if(detail?.kind==='subscriber-profile'&&String(detail.id)===String(row.subscriberId))renderSubscriberProfile(row.subscriberId,detail.tab);else{currentPage='meters';meterSection='all';render()}}
 if(form.id==='invoiceForm'){const m=meterBy(obj.meterId);if(!obj.invoiceSubscriberId)throw Error('اختر المشترك.');if(!m||String(m.subscriberId)!==String(obj.invoiceSubscriberId))throw Error('اختر عداداً تابعاً للمشترك.');const closing=Number(obj.closingReading),opening=Number(m.lastReading??m.openingReading??0);if(!Number.isFinite(closing)||closing<opening)throw Error('القراءة الحالية يجب أن تكون أكبر من أو تساوي القراءة السابقة.');const date=obj.date||dateOnly(new Date());if(m.lastReadingDate&&new Date(`${date}T23:59:59`)<new Date(`${m.lastReadingDate}T00:00:00`))throw Error('تاريخ القراءة الحالية لا يمكن أن يسبق تاريخ القراءة السابقة.');const consumption=closing-opening,unit=Number(obj.unitPrice||m.ratePerKw||data.settings.defaultRate||0),subtotal=consumption*unit,discount=Math.max(0,Number(obj.discount||0)),total=Math.max(0,subtotal-discount);const row={id:uid('inv'),subscriberId:m.subscriberId,meterId:m.id,date,periodFrom:m.lastReadingDate||m.openingDate,periodTo:date,openingReading:opening,closingReading:closing,consumption,unitPrice:unit,subtotal,discount,total,notes:String(obj.notes||'').trim(),readingImage:pendingInvoiceImage||'',readingImageName:pendingInvoiceImageName||'',createdAt:isoNow()};data.invoices.unshift(row);m.lastReading=closing;m.lastReadingDate=date;m.ratePerKw=unit;save('invoices');save('meters');logAction('إضافة فاتورة',`${subscriberBy(row.subscriberId).name} • ${money(total)}`);const shouldSend=obj.sendMode==='send';pendingInvoiceImage='';pendingInvoiceImageName='';closeModal();currentPage='invoices';render();toast('تم حفظ الفاتورة');if(shouldSend)setTimeout(()=>openSendChooser(subscriberBy(row.subscriberId),buildInvoiceMessage(row),'إرسال الفاتورة'),80)}
 if(form.id==='movementForm'){const type=form.dataset.type;const amount=Number(obj.amount||0);if(!(amount>0))throw Error('أدخل مبلغاً صحيحاً.');if(type!=='expense'&&!obj.subscriberId)throw Error('اختر المشترك.');if(!obj.accountId)throw Error('اختر الحساب.');if(['send','expense'].includes(type)&&accountBalance(obj.accountId)<amount)throw Error('رصيد الحساب غير كافٍ.');const row={id:uid('mov'),type,subscriberId:obj.subscriberId||'',payee:obj.payee||'',accountId:obj.accountId,amount,date:obj.date,notes:obj.notes||'',createdAt:isoNow()};data.movements.unshift(row);save('movements');logAction(type==='collection'?'استقبال دفعة':type==='send'?'إرسال دفعة':'إضافة مصروف',`${money(amount)} • ${type==='expense'?row.payee:subscriberBy(row.subscriberId).name}`);toast('تم حفظ العملية');closeModal();if(detail?.kind==='subscriber-profile'&&row.subscriberId)renderSubscriberProfile(row.subscriberId,'movements');else render()}
 if(form.id==='transferForm'){const amount=Number(obj.amount||0);if(!obj.fromAccountId||!obj.toAccountId||obj.fromAccountId===obj.toAccountId)throw Error('اختر حسابين مختلفين.');if(!(amount>0))throw Error('أدخل مبلغاً صحيحاً.');if(accountBalance(obj.fromAccountId)<amount)throw Error('رصيد الحساب المحول منه غير كافٍ.');data.movements.unshift({id:uid('mov'),type:'transfer',subscriberId:obj.subscriberId||'',fromAccountId:obj.fromAccountId,toAccountId:obj.toAccountId,amount,date:obj.date,notes:obj.notes||'',createdAt:isoNow()});save('movements');logAction('تحويل بين الحسابات',`${accountBy(obj.fromAccountId).name} ← ${accountBy(obj.toAccountId).name} • ${money(amount)}`);toast('تم التحويل');closeModal();if(detail?.kind==='subscriber-profile'&&obj.subscriberId)renderSubscriberProfile(obj.subscriberId,'movements');else render()}
 if(form.id==='accountForm'){const row={id:uid('acc'),name:obj.name.trim(),type:obj.type||'cash',number:obj.number.trim(),openingBalance:Number(obj.openingBalance||0),createdAt:obj.createdAt,notes:obj.notes||''};if(!row.name)throw Error('اكتب اسم الحساب.');data.accounts.unshift(row);save('accounts');logAction('إضافة حساب',row.name);toast('تمت إضافة الحساب');closeModal();render()}
 if(form.id==='platformForm'){data.settings={...data.settings,platformName:obj.platformName.trim(),networkName:String(obj.networkName||'').trim(),ownerName:obj.ownerName.trim(),defaultRate:Number(obj.defaultRate||0),defaultDiscount:Number(obj.defaultDiscount||0),nearDueDays:Number(obj.nearDueDays||3)};save('settings');logAction('تعديل إعدادات المنصة');toast('تم حفظ الإعدادات');render()}
 if(form.id==='employeeForm'){const permissions=fd.getAll('permissions');const id=form.dataset.id;if(id)await AhmadiCloud.updateEmployee(session.companyId,id,{name:obj.name,username:obj.username,password:obj.password,status:obj.status,permissions});else await AhmadiCloud.createEmployee(session.companyId,{name:obj.name,username:obj.username,password:obj.password,permissions});toast(id?'تم تعديل الموظف':'تمت إضافة الموظف');closeModal();renderEmployees()}
 if(form.id==='taskForm'){data.tasks.unshift({id:uid('task'),title:obj.title.trim(),details:obj.details||'',dueAt:obj.dueAt,status:'معلقة',createdAt:isoNow()});save('tasks');logAction('إضافة مهمة',obj.title);toast('تمت إضافة المهمة');closeModal();render()}
 }catch(e){toast(e.message||'تعذر تنفيذ العملية','خطأ')}}

function openSortPicker(){const items=[{value:'date-desc',label:'التاريخ: الأحدث أولاً'},{value:'date-asc',label:'التاريخ: الأقدم أولاً'},{value:'amount-desc',label:'القيمة: الأعلى أولاً'},{value:'amount-asc',label:'القيمة: الأقل أولاً'}];openModal('ترتيب النتائج',`<div class="picker-options">${items.map(x=>`<button class="picker-option ${detailSort===x.value?'selected':''}" data-sort-value="${x.value}" type="button">${x.label}</button>`).join('')}</div>`)}
function navigate(page){detail=null;detailSearch='';if(page==='more'){openDrawer();return}currentPage=page;closeDrawer();render();window.scrollTo({top:0,behavior:'smooth'})}
function openDrawer(){$('#drawer').classList.add('open');$('#drawerBackdrop').classList.add('show');$('#drawer').setAttribute('aria-hidden','false')}
function closeDrawer(){$('#drawer').classList.remove('open');$('#drawerBackdrop').classList.remove('show');$('#drawer').setAttribute('aria-hidden','true')}

function bindEvents(){
 let loginBusy=false;
 $('#loginForm').addEventListener('submit',async e=>{e.preventDefault();if(loginBusy)return;loginBusy=true;const btn=e.submitter||$('#loginForm button[type=submit]');if(btn){btn.disabled=true;const label=btn.querySelector('span:first-child');if(label)label.textContent='جارٍ الدخول...';}try{const s=await AhmadiCloud.loginUser($('#username').value,$('#password').value);session=s;localStorage.setItem(SESSION_KEY,JSON.stringify(s));await startSession(true)}catch(err){toast(err.message||'تعذر تسجيل الدخول','خطأ')}finally{loginBusy=false;if(btn){btn.disabled=false;const label=btn.querySelector('span:first-child');if(label)label.textContent='دخول إلى المنصة';}}});
 $('#drawerBtn').addEventListener('click',openDrawer);$('#drawerClose').addEventListener('click',closeDrawer);$('#drawerBackdrop').addEventListener('click',closeDrawer);$('#logoutBtn').addEventListener('click',()=>{AhmadiCloud.detach();localStorage.removeItem(SESSION_KEY);session=null;location.reload()});$('#syncNowBtn').addEventListener('click',()=>AhmadiCloud.syncNow().then(()=>toast('تم تحديث البيانات')).catch(e=>toast(e.message,'خطأ')));
 document.addEventListener('click',async e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
   if(pickerState&&!e.target.closest('.almezan-select-menu')&&!e.target.closest('.select-button'))closePicker();
   const openFabMenu=$('#fabMenu');
   if(openFabMenu&&!openFabMenu.classList.contains('hidden')&&!e.target.closest('#fabRoot'))openFabMenu.classList.add('hidden');
   const navBtn=e.target.closest('[data-nav]');if(navBtn){navigate(navBtn.dataset.nav);return}
   const sum=e.target.closest('[data-summary-toggle]');if(sum){sum.closest('.summary-card').classList.toggle('open');return}
   const time=e.target.closest('[data-time]');if(time){dashboardFilter.mode=time.dataset.time;if(dashboardFilter.mode==='range'){const d=dateOnly(new Date());dashboardFilter.from=d;dashboardFilter.to=d}render();return}
   const d=e.target.closest('[data-detail]');if(d){detail={kind:d.dataset.detail};render();window.scrollTo({top:0,behavior:'smooth'});return}
   if(e.target.closest('#detailBack')){detail=null;render();return}
   const profileBack=e.target.closest('#profileBack');if(profileBack){const backSub=profileBack.dataset.backSubscriber,backPage=profileBack.dataset.backPage;if(backSub){renderSubscriberProfile(backSub,'overview')}else{detail=null;currentPage=backPage||'subscribers';render()}return}
   const tab=e.target.closest('[data-profile-tab]');if(tab){renderSubscriberProfile(tab.dataset.profileId,tab.dataset.profileTab);window.scrollTo({top:0,behavior:'smooth'});return}
   const pa=e.target.closest('[data-profile-action]');if(pa){const id=pa.dataset.profileId,a=pa.dataset.profileAction;if(a==='invoice')openAddInvoice(id);else if(a==='meter')openAddMeter(id);else if(a==='collection')openMovement('collection',id);else if(a==='send')openMovement('send',id);else if(a==='transfer')openTransfer(id);return}
   const contact=e.target.closest('[data-contact]');if(contact){e.preventDefault();e.stopPropagation();const sub=subscriberBy(contact.dataset.contactSub);contactSubscriber(sub,contact.dataset.contact,buildSubscriberMessage(sub));return}
   const invContact=e.target.closest('[data-invoice-contact]');if(invContact){e.preventDefault();e.stopPropagation();const inv=data.invoices.find(x=>String(x.id)===String(invContact.dataset.invoiceId));if(inv){const sub=subscriberBy(inv.subscriberId);contactSubscriber(sub,invContact.dataset.invoiceContact,buildInvoiceMessage(inv))}return}
   const chooser=e.target.closest('[data-send-channel]');if(chooser){const sub=subscriberBy(chooser.dataset.sendSub),message=$('#sendMessagePayload')?.value||buildSubscriberMessage(sub);contactSubscriber(sub,chooser.dataset.sendChannel,message);if(chooser.dataset.sendChannel!=='call')closeModal();return}
   const act=e.target.closest('[data-action]');if(act){if(act.closest('#fabMenu'))$('#fabMenu')?.classList.add('hidden');handleAction(act.dataset.action);return}
   if(e.target.closest('#fabMain')){$('#fabMenu')?.classList.toggle('hidden');return}
   if(e.target.closest('[data-modal-close]')&&e.target.closest('.modal')===null){closeModal();return}
   if(e.target.closest('.modal-head [data-modal-close]')){closeModal();return}
   const pb=e.target.closest('[data-picker]');if(pb){openPicker(pb.dataset.picker,pb);return}
   const po=e.target.closest('[data-pick-value]');if(po){selectPicker(po.dataset.pickValue);return}
   const simple=e.target.closest('[data-simple-select]');if(simple){openSimpleSelect(simple);return}
   if(e.target.closest('#sortBtn')){openSortPicker();return}
   const sort=e.target.closest('[data-sort-value]');if(sort){detailSort=sort.dataset.sortValue;closeModal();render();return}
   const invSubmit=e.target.closest('[data-invoice-submit]');if(invSubmit){const h=invSubmit.closest('form')?.querySelector('[name=sendMode]');if(h)h.value=invSubmit.dataset.invoiceSubmit;return}
   const removePhoto=e.target.closest('[data-remove-reading-photo]');if(removePhoto){pendingInvoiceImage='';pendingInvoiceImageName='';refreshInvoiceForm();return}
   const viewPhoto=e.target.closest('[data-view-reading-image]');if(viewPhoto){const inv=data.invoices.find(x=>String(x.id)===String(viewPhoto.dataset.viewReadingImage));if(inv?.readingImage)openModal('صورة قراءة العداد',`<div class="full-image-view"><img src="${inv.readingImage}" alt="صورة القراءة"></div>`);return}
   const sub=e.target.closest('[data-subscriber]');if(sub){renderSubscriberProfile(sub.dataset.subscriber);return}
   const meterSectionBtn=e.target.closest('[data-meter-section]');if(meterSectionBtn){meterSection=meterSectionBtn.dataset.meterSection;detailSearch='';renderMeters();window.scrollTo({top:0,behavior:'smooth'});return}
   const regionView=e.target.closest('[data-region-view]');if(regionView&&detail?.kind==='region-profile'){detail.section=regionView.dataset.regionView;detailSearch='';renderRegionProfile(detail.id,detail.section);return}
   const board=e.target.closest('[data-board]');if(board){renderBoardProfile(board.dataset.board);return}
   const region=e.target.closest('[data-region]');if(region){renderRegionProfile(region.dataset.region);return}
   const meter=e.target.closest('[data-meter]');if(meter){renderMeterProfile(meter.dataset.meter);return}
   const inv=e.target.closest('[data-invoice]');if(inv){renderInvoiceProfile(inv.dataset.invoice);return}
   const emp=e.target.closest('[data-employee]');if(emp){try{const rows=await AhmadiCloud.listEmployees(session.companyId);openAddEmployee(rows.find(x=>x.id===emp.dataset.employee))}catch(err){toast(err.message,'خطأ')}return}
   const del=e.target.closest('[data-delete-employee]');if(del){if(confirm('حذف الموظف نهائياً؟')){await AhmadiCloud.deleteEmployee(session.companyId,del.dataset.deleteEmployee);toast('تم حذف الموظف');closeModal();renderEmployees()}return}
   if(e.target.closest('#followOpenBtn')){const id=$('#modalRoot input[name=followSubscriber]')?.value;if(id){closeModal();renderSubscriberProfile(id)}else toast('اختر المشترك','تنبيه');return}
   if(e.target.closest('[data-report]')){toast('سيتم توسيع هذا التقرير في الشرح القادم','تقرير');return}
 });
 document.addEventListener('submit',e=>{if(e.target.id!=='loginForm'){e.preventDefault();handleSubmit(e.target,e.submitter)}});
 document.addEventListener('input',e=>{if(e.target.id==='listSearch'){detailSearch=e.target.value;clearTimeout(window.__searchT);window.__searchT=setTimeout(render,120)}if(e.target.id==='rangeFrom'){dashboardFilter.from=e.target.value}if(e.target.id==='rangeTo'){dashboardFilter.to=e.target.value}if(e.target.closest('#invoiceForm')&&['closingReading','unitPrice','discount','date'].includes(e.target.name)){if(e.target.name==='unitPrice')e.target.dataset.touched='1';refreshInvoiceForm()}});
 document.addEventListener('change',async e=>{if(e.target.id==='rangeFrom'||e.target.id==='rangeTo')render();if(e.target.id==='readingPhotoGallery'||e.target.id==='readingPhotoCamera'){try{const file=e.target.files?.[0];if(file){window.AhmadiImageProgress?.start('invoice');pendingInvoiceImage=await compressInvoiceImage(file,50*1024,'invoice-readings');pendingInvoiceImageName=file.name||'reading.jpg';refreshInvoiceForm();window.AhmadiImageProgress?.done('invoice',navigator.onLine?'تم تجهيز وإرفاق الصورة':'تم حفظ الصورة محلياً وستُرفع عند عودة الإنترنت')}}catch(err){window.AhmadiImageProgress?.fail('invoice');toast(err.message||'تعذر معالجة الصورة','خطأ')}finally{e.target.value=''}}});
 $('#installBtn').addEventListener('click',installApp);$('#globalSearchBtn').addEventListener('click',()=>{const inp=$('#listSearch');if(inp)inp.focus();else navigate('subscribers')});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('#installBtn').classList.remove('hidden')});
 window.addEventListener('scroll',e=>{if(!pickerState)return;if(e.target&&pickerState.menu?.contains(e.target))return;pickerMenuPosition()},true);
 window.addEventListener('resize',()=>pickerState&&pickerMenuPosition());
 window.visualViewport?.addEventListener('resize',()=>pickerState&&pickerMenuPosition());
 window.visualViewport?.addEventListener('scroll',()=>pickerState&&pickerMenuPosition());
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closePicker();}});
}
function handleAction(a){const map={ 'add-subscriber':openAddSubscriber,'add-meter':openAddMeter,'add-region':openAddRegion,'add-board':openAddBoard,'add-invoice':openAddInvoice,'follow-subscriber':openFollowSubscriber,'collection':()=>openMovement('collection'),'send':()=>openMovement('send'),'expense':()=>openMovement('expense'),'transfer':()=>openMovement('transfer'),'account-transfer':()=>{if(!guard(hasPerm('accounts.transfer')?'accounts.transfer':'flows.transfer'))return;openTransfer()},'add-account':openAddAccount,'add-employee':()=>openAddEmployee(),'add-task':openAddTask,'install':installApp,'sync':()=>AhmadiCloud.syncNow().then(()=>toast('تم تحديث البيانات')).catch(e=>toast(e.message,'خطأ'))};map[a]?.()}
async function installApp(){if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null}else toast('افتح التطبيق من Chrome واستخدم خيار تثبيت التطبيق إذا لم يظهر الزر.','تثبيت')}

async function startSession(freshLogin=false){
 $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');loadLocal();let seeded=false;
 if(!data.settings.ownerName&&session.ownerName){data.settings.ownerName=session.ownerName;seeded=true}if((!data.settings.platformName||data.settings.platformName===defaults.settings.platformName)&&session.companyName){data.settings.platformName=session.companyName;seeded=true}if(seeded)save('settings',false);
 const owner=data.settings.ownerName||session.ownerName||session.actorName||'';$('#actorLabel').textContent=session.actorName||owner||(session.actorType==='employee'?'موظف':'صاحب الحساب');$('#drawerActor').textContent=session.actorName||owner||'صاحب الحساب';$('#drawerName').textContent=session.companyName||data.settings.platformName||'الأحمدي';
 AhmadiCloud.attach(adapter(),session);AhmadiCloud.onStatus(setSyncStatus);render();
 try{await AhmadiCloud.initialSync();if(!freshLogin){const validated=await AhmadiCloud.validateUser(session);if(validated===false){AhmadiCloud.detach();localStorage.removeItem(SESSION_KEY);session=null;$('#appView').classList.add('hidden');$('#loginView').classList.remove('hidden');toast('تم تغيير أو إيقاف بيانات الدخول. سجل الدخول من جديد.','تنبيه');return;}if(validated&&typeof validated==='object'){session=validated;localStorage.setItem(SESSION_KEY,JSON.stringify(session));$('#actorLabel').textContent=session.actorName||session.ownerName||'صاحب الحساب';$('#drawerActor').textContent=session.actorName||session.ownerName||'صاحب الحساب';$('#drawerName').textContent=session.companyName||data.settings.platformName||'الأحمدي';}}render();}catch(_){/* Offline-first */}
}
async function restoreSession(){const raw=localStorage.getItem(SESSION_KEY);if(!raw)return;try{session=JSON.parse(raw);if(!session?.companyId||!session?.username)return;await startSession()}catch(_){localStorage.removeItem(SESSION_KEY)}}

/* ==== v8 review patch ==== */
(function(){
  try{
    data.settings = data.settings || {};
    if(!Array.isArray(data.settings.expenseTypes)) data.settings.expenseTypes = [];
  }catch(e){}

  let pendingMovementImage='';
  let pendingMovementImageName='';

  function actionStrip(actions=[]){
    return `<div class="page-actions">${actions.map(a=>`<button class="secondary-btn compact" data-action="${a[0]}" type="button">${icon(a[2]||'plus')} ${a[1]}</button>`).join('')}</div>`;
  }
  function tinyEdit(kind,id){
    return `<button class="tiny-action edit-inline" data-edit="${kind}" data-id="${id}" type="button">${icon('edit')} تعديل</button>`;
  }
  function expenseTypeItems(){
    return (data.settings.expenseTypes||[]).map(x=>({value:x,label:x}));
  }
  function buildMovementMessage(m){
    if(window.__AHMADI_V23_MESSAGE_ENGINE?.movement)return window.__AHMADI_V23_MESSAGE_ENGINE.movement(m);
    const sub=subscriberBy(m.subscriberId);
    const acc=accountBy(m.accountId||m.fromAccountId||m.toAccountId);
    const type=movementType(m);
    const label=type==='collection'?'استقبال دفعة':type==='send'?'إرسال دفعة':type==='expense'?'مصروف':'تحويل مالي';
    return [
      `مرحبا ${sub.name||''}`.trim(),
      `شبكة الكهرباء: ${data.settings.networkName||'—'}`,
      `المستخدم: ${session?.actorName||data.settings.ownerName||session?.ownerName||'—'}`,
      `التاريخ: ${fmtDate(m.date||m.createdAt)}`,
      `العملية: ${label}`,
      `المبلغ: ${money(m.amount||0)}`,
      acc?.name?`الحساب: ${acc.name}`:'',
      m.notes?`الملاحظات: ${m.notes}`:''
    ].filter(Boolean).join('\n');
  }
  function recalcMeterState(meterId){
    const m=meterBy(meterId); if(!m) return;
    const inv=data.invoices
      .filter(i=>String(i.meterId)===String(meterId))
      .sort((a,b)=>new Date(a.date||a.periodTo||0)-new Date(b.date||b.periodTo||0));
    let lastReading=Number(m.openingReading||0), lastDate=m.openingDate||'';
    inv.forEach(i=>{
      i.openingReading=lastReading;
      i.periodFrom=lastDate||m.openingDate;
      i.consumption=Math.max(0, Number(i.closingReading||0)-lastReading);
      i.subtotal=Number(i.consumption||0)*Number(i.unitPrice||0);
      i.total=Math.max(0, Number(i.subtotal||0)-Math.max(0, Number(i.discount||0)));
      i.periodTo=i.date||i.periodTo;
      lastReading=Number(i.closingReading||0);
      lastDate=i.date||i.periodTo||lastDate;
    });
    m.lastReading=lastReading;
    m.lastReadingDate=lastDate||m.openingDate;
    if(inv.length) m.ratePerKw=Number(inv[inv.length-1].unitPrice||m.ratePerKw||0);
    save('meters'); save('invoices');
  }
  function refreshMovementForm(){
    const form=$('#movementForm'); if(!form) return;
    const subId=form.querySelector('[name=subscriberId]')?.value||'';
    const box=$('#movementSubscriberBalance');
    if(box && subId){
      const bal=subscriberBalance(subId);
      box.innerHTML=`<div><span>حالة المشترك</span><strong>${subscriberBy(subId).name}</strong></div><div><span>المبلغ المستحق عليه</span><strong>${money(Math.max(bal,0))}</strong></div><div><span>المبلغ المستحق له</span><strong>${money(Math.max(-bal,0))}</strong></div>`;
    }else if(box){
      box.innerHTML='<div class="wide muted-note">اختر المشترك لعرض حالته المالية.</div>';
    }
    const photo=$('#movementPhotoPreview');
    if(photo) photo.innerHTML=pendingMovementImage
      ? `<img src="${pendingMovementImage}" alt="صورة الإشعار"><button type="button" data-remove-movement-photo>${icon('x')} إزالة الصورة</button>`
      : '<span>لم يتم إرفاق صورة إشعار</span>';
  }
  function openAddExpenseType(){
    if(!guard('flows.expense')) return;
    openModal('إضافة نوع مصروف', `<form id="expenseTypeForm"><div class="form-grid">${inputField('name','اسم نوع المصروف','','','مثال: صيانة')}${inputField('createdAt','تاريخ الإضافة','date',dateOnly(new Date()),'')}<label class="field span-2"><span>ملاحظات</span><textarea name="notes" rows="3" placeholder="اختياري"></textarea></label></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ النوع</button></div></form>`, 'expenseTypeForm');
  }
  function openEditByType(kind,id){
    if(kind==='subscriber') return openAddSubscriber(data.subscribers.find(x=>String(x.id)===String(id)));
    if(kind==='region') return openAddRegion(data.regions.find(x=>String(x.id)===String(id)));
    if(kind==='board') return openAddBoard('', data.distributionBoards.find(x=>String(x.id)===String(id)));
    if(kind==='meter') return openAddMeter('', data.meters.find(x=>String(x.id)===String(id)));
    if(kind==='invoice') return openAddInvoice('', data.invoices.find(x=>String(x.id)===String(id)));
    if(kind==='movement'){
      const row=data.movements.find(x=>String(x.id)===String(id));
      return openMovement((row||{}).type||movementType(row||{}), '', row);
    }
    if(kind==='account') return openAddAccount(data.accounts.find(x=>String(x.id)===String(id)));
  }

  subscriberRow=function(s,showDue=false){
    const b=subscriberBalance(s.id);
    return `<article class="row-card contact-card" data-subscriber="${s.id}"><span class="row-icon">${icon('users')}</span><span class="row-main"><strong>${esc(s.name||'بدون اسم')}</strong><small>${esc(fullPhone(s)||'بدون هاتف')} • ${fmtDate(s.createdAt)}</small><div class="mini-contact-actions"><button data-contact="call" data-contact-sub="${s.id}" type="button" aria-label="اتصال">${icon('phone')}</button><button data-contact="whatsapp" data-contact-sub="${s.id}" type="button" aria-label="واتساب">${icon('whatsapp')}</button><button data-contact="sms" data-contact-sub="${s.id}" type="button" aria-label="SMS">${icon('message')}</button></div></span><span class="row-amount"><strong>${money(Math.abs(b))}</strong><small>${b>0?'مستحق عليه':b<0?'مستحق له':'متوازن'}</small>${tinyEdit('subscriber',s.id)}</span></article>`;
  };
  meterRow=function(m){
    const s=subscriberBy(m.subscriberId),r=regionBy(m.regionId),b=boardBy(m.boardId),scoped=currentPage==='meters'||detail?.kind==='board-profile'||detail?.kind==='region-profile',cons=meterConsumption(m.id,scoped)||Math.max(0,Number(m.lastReading??m.openingReading??0)-Number(m.openingReading||0));
    return `<article class="row-card meter-list-card" data-meter="${m.id}"><span class="row-icon">${icon('meter')}</span><span><strong>${esc(s.name)} • ${esc(m.label||m.meterNumber||'عداد')}</strong><small>رقم العداد: ${esc(m.meterNumber||'—')} • المنطقة: ${esc(r.name||'غير محددة')}</small><small>لوحة التوزيع: ${esc(b.name||b.boardNumber||'غير محددة')} • ${esc(m.location||'بدون موقع')}</small><small>${fmtDate(m.openingDate)} ${num(m.openingReading||0)} → ${fmtDate(m.lastReadingDate||m.openingDate)} ${num(m.lastReading??m.openingReading??0)}</small>${m.notes?`<small>ملاحظة: ${esc(m.notes)}</small>`:''}</span><span class="row-amount"><strong>${num(cons)} kW</strong><small>إجمالي الاستهلاك</small>${tinyEdit('meter',m.id)}</span></article>`;
  };
  distributionBoardRow=function(b){
    const r=regionBy(b.regionId),meters=boardMeters(b.id),cons=meters.reduce((s,m)=>s+meterConsumption(m.id,true),0);
    return `<article class="row-card distribution-card" data-board="${b.id}"><span class="row-icon">${icon('panel')}</span><span><strong>${esc(b.name||'لوحة توزيع')}</strong><small>رقم اللوحة: ${esc(b.boardNumber||'—')} • المنطقة: ${esc(r.name||'غير محددة')}</small><small>${meters.length} عداد داخل اللوحة${b.notes?` • ${esc(b.notes)}`:''}</small></span><span class="row-amount"><strong>${num(cons)} kW</strong><small>إجمالي الاستهلاك</small>${tinyEdit('board',b.id)}</span></article>`;
  };
  regionRow=function(r){
    const boards=regionBoards(r.id),meters=regionMeters(r.id),cons=meters.reduce((s,m)=>s+meterConsumption(m.id,true),0);
    return `<article class="row-card region-card" data-region="${r.id}"><span class="row-icon">${icon('mapPin')}</span><span><strong>${esc(r.name||'منطقة')}</strong><small>رقم المنطقة: ${esc(r.regionNumber||'—')}</small><small>${boards.length} لوحة توزيع • ${meters.length} عداد${r.notes?` • ${esc(r.notes)}`:''}</small></span><span class="row-amount"><strong>${num(cons)} kW</strong><small>إجمالي الاستهلاك</small>${tinyEdit('region',r.id)}</span></article>`;
  };
  invoiceRow=function(i){
    const sub=subscriberBy(i.subscriberId),m=meterBy(i.meterId);
    return `<article class="row-card contact-card invoice-card" data-invoice="${i.id}"><span class="row-icon">${icon('receipt')}</span><span class="row-main"><strong>${esc(sub.name)}</strong><small>${esc(m?.label||m?.meterNumber||'عداد')} • ${fmtDate(i.date)} • ${num(i.consumption)} kW</small><div class="mini-contact-actions"><button data-invoice-contact="call" data-invoice-id="${i.id}" type="button" aria-label="اتصال">${icon('phone')}</button><button data-invoice-contact="whatsapp" data-invoice-id="${i.id}" type="button" aria-label="واتساب">${icon('whatsapp')}</button><button data-invoice-contact="sms" data-invoice-id="${i.id}" type="button" aria-label="SMS">${icon('message')}</button></div></span><span class="row-amount"><strong>${money(invoiceNet(i))}</strong><small>خصم ${money(i.discount||0)}</small>${tinyEdit('invoice',i.id)}</span></article>`;
  };
  flowRow=function(m){
    const map={collection:['تحصيل دفعة','arrowDown','good'],send:['إرسال دفعة','arrowUp','warn'],expense:['مصروف','expense','bad'],transfer:['تحويل بين الحسابات','transfer',''],deposit:['إيداع للحساب','arrowDown','good']};
    const mt=movementType(m); const [l,ic,b]=map[mt]||['حركة','wallet',''];
    const who=m.subscriberId?subscriberBy(m.subscriberId).name:(movementType(m)==='transfer'?`${accountBy(m.fromAccountId||m.accountFromId).name} ← ${accountBy(m.toAccountId||m.accountToId).name}`:accountBy(m.accountId||m.accountToId||m.accountFromId).name);
    return `<div class="row-card"><span class="row-icon">${icon(ic)}</span><span><strong>${l} • ${esc(who)}</strong><small>${fmtDateTime(m.date)} ${m.notes?`• ${esc(m.notes)}`:''}</small></span><span class="row-amount"><strong>${money(m.amount)}</strong><span class="badge ${b}">${movementType(m)}</span>${tinyEdit('movement',m.id)}</span></div>`;
  };

  openAddSubscriber=function(edit=null){
    if(!guard('subscribers.add')) return;
    const prefixes=[{value:'+970',label:'+970 فلسطين'},{value:'+972',label:'+972'}];
    openModal(edit?'تعديل المشترك':'إضافة مشترك', `<form id="subscriberForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم المشترك','text',edit?.name||'','اكتب الاسم الكامل')}${pickerField('prefix','مقدمة الهاتف',prefixes,edit?.prefix||'+970')}${inputField('phone','رقم هاتف المشترك','tel',edit?.phone||'','59xxxxxxx','inputmode="tel"')}${inputField('address','العنوان','',edit?.address||'','المنطقة أو العنوان')}${inputField('createdAt','تاريخ إضافة المشترك','date',dateOnly(edit?.createdAt||new Date()),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات اختيارية">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} ${edit?'حفظ التعديلات':'حفظ المشترك'}</button></div></form>`, 'subscriberForm');
  };
  openAddRegion=function(edit=null){
    if(!guard('subscribers.add')) return;
    openModal(edit?'تعديل المنطقة':'إضافة منطقة لوحات توزيع', `<form id="regionForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم المنطقة','',edit?.name||'','مثال: المنطقة الشمالية')}${inputField('regionNumber','رقم المنطقة','text',edit?.regionNumber||nextRegionNumber(),'','')}${inputField('createdAt','تاريخ الإضافة','date',dateOnly(edit?.createdAt||new Date()),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات عن المنطقة">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} ${edit?'حفظ التعديلات':'حفظ المنطقة'}</button></div></form>`, 'regionForm');
  };
  openAddBoard=function(preselectedRegionId='',edit=null){
    if(!guard('subscribers.add')) return;
    if(!data.regions.length) return toast('أضف منطقة أولاً ثم أضف لوحة التوزيع','تنبيه');
    const regionItems=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
    openModal(edit?'تعديل لوحة التوزيع':'إضافة لوحة توزيع', `<form id="boardForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${pickerField('boardRegionId','منطقة اللوحة',regionItems,edit?.regionId||preselectedRegionId,'اختر المنطقة')}${inputField('name','اسم لوحة التوزيع','',edit?.name||'','مثال: لوحة الحي المركزي')}${inputField('boardNumber','رقم لوحة التوزيع','text',edit?.boardNumber||nextBoardNumber(),'','')}${inputField('createdAt','تاريخ إضافة اللوحة','date',dateOnly(edit?.createdAt||new Date()),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات عن لوحة التوزيع">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} ${edit?'حفظ التعديلات':'حفظ لوحة التوزيع'}</button></div></form>`, 'boardForm');
  };
  openAddMeter=function(preselectedSubscriberId='',edit=null){
    if(!guard('subscribers.add')) return;
    if(!data.subscribers.length) return toast('أضف مشتركاً أولاً','تنبيه');
    if(!data.regions.length) return toast('أضف منطقة أولاً','تنبيه');
    if(!data.distributionBoards.length) return toast('أضف لوحة توزيع أولاً','تنبيه');
    const subItems=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));
    const regionItems=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
    const selectedRegion=edit?.regionId||'';
    const boardItems=data.distributionBoards.filter(b=>!selectedRegion||String(b.regionId)===String(selectedRegion)).map(b=>({value:b.id,label:`${b.name||'لوحة توزيع'} — ${b.boardNumber||''}`}));
    openModal(edit?'تعديل عداد':'إضافة عداد', `<form id="meterForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${pickerField('subscriberId','اسم المشترك',subItems,edit?.subscriberId||preselectedSubscriberId,'اختر المشترك')}${inputField('label','اسم العداد','',edit?.label||'','مثال: العداد الرئيسي')}${inputField('meterNumber','رقم العداد','text',edit?.meterNumber||nextMeterNumber(),'','readonly')}${pickerField('regionId','منطقة العداد',regionItems,edit?.regionId||'','اختر المنطقة')}${pickerField('boardId','لوحة التوزيع الخاصة بالعداد',boardItems,edit?.boardId||'',boardItems.length?'اختر اللوحة':'اختر المنطقة أولاً')}${inputField('location','موقع العداد','',edit?.location||'','مثال: المنزل / المحل / العمارة')}${inputField('openingReading','القراءة الافتتاحية','number',edit?.openingReading||0,'0','step="0.01" min="0"')}${inputField('openingDate','تاريخ القراءة الافتتاحية','date',dateOnly(edit?.openingDate||new Date()),'')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="ملاحظات عن العداد">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} ${edit?'حفظ التعديلات':'حفظ العداد'}</button></div></form>`, 'meterForm');
  };
  openAddInvoice=function(preselectedSubscriberId='',edit=null){
    if(!guard('subscriptions.add')) return;
    if(!data.subscribers.length) return toast('أضف مشتركاً أولاً','تنبيه');
    pendingInvoiceImage=edit?.readingImage||''; pendingInvoiceImageName=edit?.readingImageName||'';
    const subId=edit?.subscriberId||preselectedSubscriberId||'';
    const subItems=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));
    const meterItems=data.meters.filter(m=>!subId||String(m.subscriberId)===String(subId)).map(m=>({value:m.id,label:`${m.label||m.meterNumber||'عداد'} — ${m.meterNumber||''}`}));
    openModal(edit?'تعديل فاتورة':'إضافة فاتورة', `<form id="invoiceForm" data-id="${esc(edit?.id||'')}"><input type="hidden" name="sendMode" value="save"><div class="form-grid">${pickerField('invoiceSubscriberId','اسم المشترك',subItems,subId,'اختر المشترك')}${pickerField('meterId','اسم/رقم العداد',meterItems,edit?.meterId||'',meterItems.length?'اختر العداد':'لا توجد عدادات للمشترك')}<div id="invoicePrevious" class="previous-reading span-2"><div class="wide muted-note">اختر المشترك ثم العداد لعرض القراءة السابقة.</div></div>${inputField('date','تاريخ القراءة الحالية','date',dateOnly(edit?.date||new Date()),'')}${inputField('closingReading','القراءة الحالية','number',edit?.closingReading||'','أدخل القراءة الحالية','step="0.01" min="0"')}${inputField('unitPrice','سعر الكيلو','number',(edit&&edit.unitPrice!=null?edit.unitPrice:(data.settings.defaultRate||0)),'0','step="0.001" min="0" data-touched="1"')}${inputField('discount','الخصم','number',(edit&&edit.discount!=null?edit.discount:(data.settings.defaultDiscount||0)),'0','step="0.01" min="0"')}<label class="field span-2"><span>ملاحظات القراءة الحالية</span><textarea name="notes" rows="3" placeholder="أضف ملاحظة عن القراءة الحالية">${esc(edit?.notes||'')}</textarea></label><div class="reading-photo-block span-2"><div class="reading-photo-actions"><label class="photo-action">${icon('image')}<span>إرفاق صورة</span><input id="readingPhotoGallery" type="file" accept="image/*" hidden></label><label class="photo-action">${icon('camera')}<span>التقاط صورة</span><input id="readingPhotoCamera" type="file" accept="image/*" capture="environment" hidden></label></div><div id="invoicePhotoPreview" class="reading-photo-preview"><span>لم يتم إرفاق صورة للقراءة</span></div></div><section class="invoice-preview span-2"><div class="preview-title">${icon('receipt')}<div><strong>معاينة الفاتورة</strong><small>تتحدث تلقائياً أثناء الإدخال</small></div></div><div class="preview-grid"><span>تاريخ القراءة السابقة<b id="pvPrevDate">—</b></span><span>القراءة السابقة<b id="pvPrevRead">—</b></span><span>تاريخ القراءة الحالية<b id="pvNowDate">${fmtDate(dateOnly(edit?.date||new Date()))}</b></span><span>القراءة الحالية<b id="pvNowRead">—</b></span><span>إجمالي الاستهلاك<b id="pvConsumption">0 KW</b></span><span>سعر الكيلو<b id="pvUnit">${money((edit&&edit.unitPrice!=null?edit.unitPrice:(data.settings.defaultRate||0)))}</b></span><span>الخصم<b id="pvDiscount">${money((edit&&edit.discount!=null?edit.discount:(data.settings.defaultDiscount||0)))}</b></span><span class="highlight">إجمالي تكلفة الاستهلاك<b id="pvTotal">${money(0)}</b></span></div></section></div><div class="modal-actions invoice-actions" style="padding:18px 0 0"><button class="secondary-btn" data-invoice-submit="save" type="submit">${icon('save')} حفظ</button><button class="primary-btn" data-invoice-submit="send" type="submit">${icon('send')} حفظ وإرسال</button></div></form>`, 'invoiceForm');
    setTimeout(refreshInvoiceForm,40);
  };
  openMovement=function(type,preselectedSubscriberId='',edit=null){
    const perm={collection:'flows.collect',send:'flows.send',expense:'flows.expense',transfer:'flows.transfer'}[type];
    if(!guard(perm)) return;
    if(type==='transfer') return openTransfer(preselectedSubscriberId,edit);
    if(!data.accounts.length) return toast('لا توجد حسابات مالية، أضف حساباً أولاً','تنبيه');
    pendingMovementImage=edit?.proofImage||''; pendingMovementImageName=edit?.proofImageName||'';
    const accItems=data.accounts.map(a=>({value:a.id,label:`${a.name} — ${money(accountBalance(a.id))}`}));
    const subItems=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));
    const expItems=expenseTypeItems();
    const titles={collection:'استقبال دفعة',send:'إرسال دفعة',expense:'إضافة مصروف'};
    openModal(edit?`تعديل ${titles[type]}`:titles[type], `<form id="movementForm" data-type="${type}" data-id="${esc(edit?.id||'')}"><input type="hidden" name="sendMode" value="save"><div class="form-grid">${type!=='expense'?pickerField('subscriberId','اسم المشترك',subItems,edit?.subscriberId||preselectedSubscriberId):pickerField('expenseType','نوع المصروف',expItems,edit?.expenseType||edit?.payee||'','اختر أو أضف نوع مصروف')}${pickerField('accountId',type==='collection'?'الحساب المستقبل':'الحساب المرسل منه',accItems,edit?.accountId||'')}${inputField('amount',type==='collection'?'المبلغ المستقبل':type==='send'?'المبلغ المرسل':'مبلغ المصروف','number',edit?.amount||'','0','step="0.01" min="0.01" required')}${inputField('date','تاريخ العملية','datetime-local',(edit?.date?new Date(edit.date):new Date(Date.now()-new Date().getTimezoneOffset()*60000)).toISOString().slice(0,16),'')}${type!=='expense'?'<div id="movementSubscriberBalance" class="previous-reading span-2"></div>':''}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3" placeholder="أضف ملاحظة">${esc(edit?.notes||'')}</textarea></label><div class="reading-photo-block span-2"><div class="reading-photo-actions"><label class="photo-action">${icon('image')}<span>إرفاق صورة إشعار</span><input id="movementPhotoGallery" type="file" accept="image/*" hidden></label><label class="photo-action">${icon('camera')}<span>التقاط صورة</span><input id="movementPhotoCamera" type="file" accept="image/*" capture="environment" hidden></label></div><div id="movementPhotoPreview" class="reading-photo-preview"><span>لم يتم إرفاق صورة إشعار</span></div></div></div><div class="modal-actions ${type!=='expense'?'invoice-actions':''}" style="padding:18px 0 0">${type==='expense'?`<button class="primary-btn" type="submit">${icon('save')} حفظ العملية</button>`:`<button class="secondary-btn" data-movement-submit="save" type="submit">${icon('save')} حفظ</button><button class="primary-btn" data-movement-submit="send" type="submit">${icon('send')} حفظ وإرسال</button>`}</div></form>`, 'movementForm');
    refreshMovementForm();
  };
  openTransfer=function(contextSubscriberId='',edit=null){
    if(!(hasPerm('accounts.transfer')||hasPerm('flows.transfer'))) return;
    if(data.accounts.length<2) return toast('أضف حسابين على الأقل','تنبيه');
    const accountItems=data.accounts.map(a=>({value:a.id,label:`${a.name} — ${money(accountBalance(a.id))}`}));
    openModal(edit?'تعديل التحويل':'تحويل بين الحسابات', `<form id="transferForm" data-id="${esc(edit?.id||'')}"><input type="hidden" name="subscriberId" value="${esc(contextSubscriberId)}"><div class="form-grid">${pickerField('fromAccountId','الحساب المحول منه',accountItems,edit?.fromAccountId||'')}${pickerField('toAccountId','الحساب المحول إليه',accountItems,edit?.toAccountId||'')}${inputField('amount','المبلغ المحول','number',edit?.amount||'','0','step="0.01" min="0.01" required')}${inputField('date','تاريخ التحويل','datetime-local',(edit?.date?new Date(edit.date):new Date(Date.now()-new Date().getTimezoneOffset()*60000)).toISOString().slice(0,16),'')}${inputField('reason','سبب التحويل','text',edit?.reason||'','اختياري')}<label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} حفظ التحويل</button></div></form>`, 'transferForm');
  };
  openAddAccount=function(edit=null){
    if(!guard('accounts.add')) return;
    openModal(edit?'تعديل الحساب المالي':'إضافة حساب مالي', `<form id="accountForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم الحساب','',edit?.name||'','مثال: الصندوق الرئيسي')}<label class="field dropdown-field has-select"><span>نوع الحساب</span><input type="hidden" name="type" value="${esc(edit?.type||'cash')}"><button class="select-button" data-simple-select="account-type" type="button"><b style="font-weight:300">${edit?.type==='bank'?'بنكي':'نقدي'}</b>${icon('chevron')}</button></label>${inputField('number','رقم الحساب','',edit?.number||'','اختياري للحساب البنكي')}${inputField('openingBalance','الرصيد الافتتاحي','number',edit?.openingBalance||0,'0','step="0.01"')}${inputField('createdAt','تاريخ الإضافة','date',dateOnly(edit?.createdAt||new Date()),'')}<label class="field"><span>ملاحظات</span><textarea name="notes" rows="3">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions" style="padding:18px 0 0"><button class="primary-btn" type="submit">${icon('save')} ${edit?'حفظ التعديلات':'حفظ الحساب'}</button></div></form>`, 'accountForm');
  };

  renderSubscribers=function(){
    setPageTitle('المشتركين'); const q=detailSearch.trim().toLowerCase();
    const rows=data.subscribers.filter(s=>{const b=subscriberBalance(s.id); return !q||`${s.name||''} ${fullPhone(s)||''} ${Math.abs(b)} ${money(Math.abs(b))}`.toLowerCase().includes(q)});
    $('#mainContent').innerHTML=`${pageHead('المشتركين','',`العدد ${rows.length}`)}${actionStrip([['add-subscriber','إضافة مشترك','users'],['add-meter','إضافة عداد','meter']].filter(()=>hasPerm('subscribers.add')))}${listToolbar('بحث بالاسم أو الهاتف أو المبلغ...')}<div class="count-banner"><div><small>إجمالي المشتركين</small><strong>${rows.length}</strong></div><span class="badge">${data.meters.length} عداد</span></div><div class="cards-list">${rows.length?rows.map(subscriberRow).join(''):`<div class="empty">لا يوجد مشتركون حتى الآن.</div>`}</div>`;
  };
  renderMeters=function(){
    setPageTitle('العدادات'); const q=detailSearch.trim().toLowerCase();
    const scopedMeters=data.meters.filter(m=>meterInRange(m));
    const totalConsumption=scopedMeters.reduce((s,m)=>s+meterConsumption(m.id,true),0);
    const totalBoards=data.distributionBoards.length,totalRegions=data.regions.length;
    const hubs=[['all','جميع العدادات',data.meters.length,`${num(totalConsumption)} kW`,'meter'],['boards','لوحات التوزيع',totalBoards,`${scopedMeters.length} عداد`,'panel'],['regions','مناطق لوحات التوزيع',totalRegions,`${totalBoards} لوحة`,'mapPin']];
    let body='';
    if(meterSection==='all'){
      let rows=scopedMeters.filter(m=>{const s=subscriberBy(m.subscriberId),r=regionBy(m.regionId),b=boardBy(m.boardId);return !q||`${s.name} ${fullPhone(s)} ${m.meterNumber||''} ${m.location||''} ${r.name||''} ${b.name||''} ${b.boardNumber||''}`.toLowerCase().includes(q)});
      if(detailSort==='amount-desc') rows.sort((a,b)=>meterConsumption(b.id,true)-meterConsumption(a.id,true)); else if(detailSort==='amount-asc') rows.sort((a,b)=>meterConsumption(a.id,true)-meterConsumption(b.id,true)); else if(detailSort==='date-asc') rows.sort((a,b)=>new Date(a.lastReadingDate||a.openingDate||0)-new Date(b.lastReadingDate||b.openingDate||0)); else rows.sort((a,b)=>new Date(b.lastReadingDate||b.openingDate||0)-new Date(a.lastReadingDate||a.openingDate||0));
      body=`${timeFilterHtml()}${listToolbar('بحث بالاسم أو رقم العداد أو المنطقة أو اللوحة...')}<div class="count-banner"><div><small>إجمالي العدادات</small><strong>${rows.length}</strong></div><span class="badge">${num(rows.reduce((s,m)=>s+meterConsumption(m.id,true),0))} kW</span></div><div class="cards-list">${rows.length?rows.map(meterRow).join(''):'<div class="empty">لا توجد عدادات مطابقة.</div>'}</div>`;
    }else if(meterSection==='boards'){
      let rows=data.distributionBoards.filter(b=>{const r=regionBy(b.regionId);return !q||`${b.name||''} ${b.boardNumber||''} ${r.name||''} ${b.notes||''}`.toLowerCase().includes(q)});
      if(detailSort==='amount-desc') rows.sort((a,b)=>boardMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-boardMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)); else if(detailSort==='amount-asc') rows.sort((a,b)=>boardMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-boardMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)); else if(detailSort==='date-asc') rows.sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0)); else rows.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
      body=`${timeFilterHtml()}${listToolbar('بحث باسم أو رقم لوحة التوزيع أو المنطقة...')}<div class="count-banner"><div><small>إجمالي لوحات التوزيع</small><strong>${rows.length}</strong></div><span class="badge">${rows.reduce((s,b)=>s+boardMeters(b.id).length,0)} عداد</span></div><div class="cards-list">${rows.length?rows.map(distributionBoardRow).join(''):'<div class="empty">لا توجد لوحات توزيع.</div>'}</div>`;
    }else{
      let rows=data.regions.filter(r=>!q||`${r.name||''} ${r.regionNumber||''} ${r.notes||''}`.toLowerCase().includes(q));
      if(detailSort==='amount-desc') rows.sort((a,b)=>regionMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-regionMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)); else if(detailSort==='amount-asc') rows.sort((a,b)=>regionMeters(a.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)-regionMeters(b.id).reduce((s,m)=>s+meterConsumption(m.id,true),0)); else if(detailSort==='date-asc') rows.sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0)); else rows.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
      body=`${timeFilterHtml()}${listToolbar('بحث باسم أو رقم المنطقة...')}<div class="count-banner"><div><small>إجمالي المناطق</small><strong>${rows.length}</strong></div><span class="badge">${rows.reduce((s,r)=>s+regionMeters(r.id).length,0)} عداد</span></div><div class="cards-list">${rows.length?rows.map(regionRow).join(''):'<div class="empty">لا توجد مناطق مضافة.</div>'}</div>`;
    }
    $('#mainContent').innerHTML=`${pageHead('العدادات','إدارة العدادات ولوحات التوزيع والمناطق')}${actionStrip([['add-region','إضافة منطقة','mapPin'],['add-board','إضافة لوحة توزيع','panel'],['add-meter','إضافة عداد','meter']].filter(()=>hasPerm('subscribers.add')))}<div class="meter-hub-grid">${hubs.map(([id,title,count,meta,ic])=>`<button class="meter-hub-card ${meterSection===id?'active':''}" data-meter-section="${id}" type="button"><span class="meter-hub-icon">${icon(ic)}</span><span><strong>${title}</strong><small>${meta}</small></span><b>${count}</b></button>`).join('')}</div>${body}`;
  };
  renderFlows=function(){
    setPageTitle('التدفقات المالية');
    const inv=filtered('invoices');
    const mov=filtered('movements').filter(m=>['collection','send','expense','transfer','deposit'].includes(movementType(m)));
    const invoiceTotal=inv.reduce((s,i)=>s+invoiceNet(i),0), discount=inv.reduce((s,i)=>s+Number(i.discount||0),0), expenses=mov.filter(m=>movementType(m)==='expense').reduce((s,m)=>s+Number(m.amount||0),0), collections=mov.filter(m=>['collection','deposit'].includes(movementType(m))).reduce((s,m)=>s+Number(m.amount||0),0);
    const balances=data.subscribers.map(s=>subscriberBalanceScoped(s.id));
    const dueFrom=balances.reduce((s,b)=>s+Math.max(b,0),0), dueTo=balances.reduce((s,b)=>s+Math.max(-b,0),0);
    const ownerEquity=invoiceTotal-expenses-dueTo, netFlow=invoiceTotal-expenses-dueFrom;
    const recent=sortRows(mov.filter(m=>!detailSearch||`${subscriberBy(m.subscriberId).name} ${m.notes||''} ${accountBy(m.accountId||m.fromAccountId||m.toAccountId).name}`.toLowerCase().includes(detailSearch.toLowerCase())),'amount','date').slice(0,10);
    $('#mainContent').innerHTML=`${pageHead('التدفقات المالية','ملخص الفواتير والتحصيلات والمصروفات')}${actionStrip([['collection','استقبال دفعة','arrowDown'],['send','إرسال دفعة','arrowUp'],['transfer','تحويل الأموال','transfer'],['expense','إضافة مصروف','expense']].filter(a=>a[0]!=='collection'||hasPerm('flows.collect')).filter(a=>a[0]!=='send'||hasPerm('flows.send')).filter(a=>a[0]!=='transfer'||hasPerm('flows.transfer')).filter(a=>a[0]!=='expense'||hasPerm('flows.expense')))}${timeFilterHtml()}${listToolbar('بحث بالاسم أو المبلغ أو الملاحظات...')}<div class="metric-list" style="margin-bottom:14px">${metric('equity','حقوق الملكية',money(ownerEquity),'الفواتير - المصروفات - المستحق لهم','line',[invoiceTotal,expenses,dueTo,ownerEquity])}${metric('flows-net','صافي التدفق المالي',money(netFlow),'رأس المال - المصروفات - المستحق على المشتركين','line',[invoiceTotal,expenses,dueFrom,netFlow])}${metric('invoice-total','إجمالي ثمن الفواتير',money(invoiceTotal),'من الفترة المحددة','bars',inv.map(invoiceNet))}${metric('due-from','المستحق على المشتركين',money(dueFrom),'إجمالي الديون علينا التحصيل','line',balances.map(b=>Math.max(b,0)))}${metric('due-to','المستحق للمشتركين',money(dueTo),'أرصدة لصالح المشتركين','line',balances.map(b=>Math.max(-b,0)))}${metric('collected','إجمالي المبالغ المحصلة',money(collections),'التحصيلات المسجلة','bars',mov.filter(m=>['collection','deposit'].includes(movementType(m))).map(m=>Number(m.amount||0)))}${metric('expenses','إجمالي المصروفات',money(expenses),'جميع المصروفات','bars',mov.filter(m=>movementType(m)==='expense').map(m=>Number(m.amount||0)))}${metric('discounts','إجمالي الخصومات',money(discount),'خصومات الفواتير','bars',inv.map(i=>Number(i.discount||0)))}${metric('all-movements','جميع الحركات المالية',num(mov.length),'عرض كل الحركات','line',mov.map(m=>Number(m.amount||0)))}</div><section class="summary-card open"><button class="summary-toggle" type="button"><div class="summary-title"><span class="summary-icon">${icon('wallet')}</span><div><strong>آخر الحركات المالية</strong><small>أحدث 10 عمليات</small></div></div></button><div class="summary-body" style="display:block"><div class="cards-list">${recent.length?recent.map(flowRow).join(''):'<div class="empty">لا توجد حركات مالية.</div>'}</div></div></section>`;
  };
  renderAccounts=function(){
    setPageTitle('الحسابات المالية');
    const q=detailSearch.toLowerCase();
    const rows=data.accounts.filter(a=>!q||`${a.name||''} ${a.number||''} ${accountBalance(a.id)} ${fmtDate(a.createdAt)}`.toLowerCase().includes(q));
    const total=rows.reduce((s,a)=>s+accountBalance(a.id),0), cash=rows.filter(a=>a.type==='cash').reduce((s,a)=>s+accountBalance(a.id),0), bank=rows.filter(a=>a.type==='bank').reduce((s,a)=>s+accountBalance(a.id),0);
    $('#mainContent').innerHTML=`${pageHead('الحسابات المالية','النقدية والبنكية والتحويلات',money(total))}${actionStrip([['add-account','إضافة حساب','bank'],['account-transfer','التحويل بين الحسابات','transfer']].filter(a=>a[0]!=='add-account'||hasPerm('accounts.add')).filter(a=>a[0]!=='account-transfer'||hasPerm('accounts.transfer')||hasPerm('flows.transfer')))}${timeFilterHtml()}${listToolbar('بحث بالاسم أو المبلغ أو التاريخ...')}<div class="metric-list" style="margin-bottom:14px">${metric('accounts-total','إجمالي الأرصدة',money(total),'كل الحسابات','bars',rows.map(a=>accountBalance(a.id)))}${metric('accounts-cash','إجمالي الأرصدة النقدية',money(cash),'الحسابات النقدية','line',rows.filter(a=>a.type==='cash').map(a=>accountBalance(a.id)))}${metric('accounts-bank','إجمالي الأرصدة البنكية',money(bank),'الحسابات البنكية','line',rows.filter(a=>a.type==='bank').map(a=>accountBalance(a.id)))}</div><div class="cards-list">${rows.length?rows.map(a=>`<article class="row-card" data-account="${a.id}"><span class="row-icon">${icon(a.type==='bank'?'bank':'wallet')}</span><span><strong>${esc(a.name)}</strong><small>${a.type==='bank'?'حساب بنكي':'حساب نقدي'} ${a.number?`• ${esc(a.number)}`:''} • ${fmtDate(a.createdAt)}</small></span><span class="row-amount"><strong>${money(accountBalance(a.id))}</strong>${tinyEdit('account',a.id)}</span></article>`).join(''):`<div class="empty">لا توجد حسابات مالية.</div>`}</div>`;
  };
  function renderAccountProfile(id){
    const a=accountBy(id); if(!a||!a.id) return;
    detail={kind:'account-profile',id,title:'تفاصيل الحساب'}; setPageTitle('تفاصيل الحساب');
    const q=detailSearch.toLowerCase();
    const incoming=data.movements.filter(m=>['collection','deposit','transfer'].includes(movementType(m)) && (String(m.accountId||m.toAccountId||'')===String(id)) && inRange(m.date||m.createdAt));
    const outgoing=data.movements.filter(m=>['send','expense','transfer'].includes(movementType(m)) && ((movementType(m)==='transfer'?String(m.fromAccountId||'')===String(id):String(m.accountId||'')===String(id))) && inRange(m.date||m.createdAt));
    const filt=rows=>sortRows(rows.filter(m=>!q||`${subscriberBy(m.subscriberId).name} ${m.notes||''} ${m.amount||0}`.toLowerCase().includes(q)),'amount','date');
    const inRows=filt(incoming), outRows=filt(outgoing), balance=accountBalance(id), inTotal=inRows.reduce((s,m)=>s+Number(m.amount||0),0), outTotal=outRows.reduce((s,m)=>s+Number(m.amount||0),0);
    $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" id="profileBack" data-back-page="accounts" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(a.name)}</h1><p>${a.type==='bank'?'حساب بنكي':'حساب نقدي'} ${a.number?`• ${esc(a.number)}`:''}</p></div></div>${actionStrip([['add-account','إضافة حساب','bank'],['account-transfer','تحويل بين الحسابات','transfer']])}${timeFilterHtml()}${listToolbar('بحث بالوقت أو الاسم أو المبلغ...')}<section class="profile-data-card"><div class="card-section-title">${icon(a.type==='bank'?'bank':'wallet')}<div><strong>بطاقة الحساب</strong><small>الرصيد والحركات</small></div></div><div class="profile-data-grid"><span>اسم الحساب<b>${esc(a.name)}</b></span><span>الرصيد الحالي<b>${money(balance)}</b></span><span>إجمالي الوارد<b>${money(inTotal)}</b></span><span>إجمالي الصادر<b>${money(outTotal)}</b></span><span>تاريخ الإضافة<b>${fmtDate(a.createdAt)}</b></span><span>النوع<b>${a.type==='bank'?'بنكي':'نقدي'}</b></span></div></section><section class="readings-history"><div class="section-row-title"><div><strong>جميع الحركات الواردة</strong><small>${inRows.length} حركة</small></div></div><div class="cards-list">${inRows.length?inRows.map(flowRow).join(''):'<div class="empty">لا توجد حركات واردة.</div>'}</div></section><section class="readings-history"><div class="section-row-title"><div><strong>جميع الحركات الصادرة</strong><small>${outRows.length} حركة</small></div></div><div class="cards-list">${outRows.length?outRows.map(flowRow).join(''):'<div class="empty">لا توجد حركات صادرة.</div>'}</div></section>`;
  }

  const __oldRenderDetail=renderDetail;
  renderDetail=function(){
    if(detail?.kind==='all-movements'){
      const q=detailSearch.toLowerCase();
      const rows=sortRows(filtered('movements').filter(x=>['collection','send','expense','transfer','deposit'].includes(movementType(x)) && (!q||`${subscriberBy(x.subscriberId).name} ${x.notes||''} ${accountBy(x.accountId||x.fromAccountId||x.toAccountId).name}`.toLowerCase().includes(q))),'amount','date');
      $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn" id="detailBack" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">جميع الحركات المالية</h1></div></div>${actionStrip([['collection','استقبال دفعة','arrowDown'],['send','إرسال دفعة','arrowUp'],['transfer','تحويل الأموال','transfer']])}${timeFilterHtml()}${listToolbar('بحث في النتائج...')}<div class="count-banner"><div><small>الإجمالي</small><strong>${rows.length} حركة</strong></div></div><div class="cards-list">${rows.length?rows.map(flowRow).join(''):'<div class="empty">لا توجد بيانات.</div>'}</div>`;
      return;
    }
    __oldRenderDetail();
    if(detail?.kind==='expenses'){
      const head=$('#mainContent .page-head');
      if(head && !$('#mainContent .page-actions')) head.insertAdjacentHTML('afterend', actionStrip([['add-expense-type','إضافة نوع مصروف','plus'],['expense','إضافة مصروف','expense']]));
    }
  };

  const __oldRender=render;
  render=function(){
    renderNav();
    if(detail?.kind==='account-profile') renderAccountProfile(detail.id);
    else if(detail?.kind==='subscriber-profile') renderSubscriberProfile(detail.id,detail.tab||'overview');
    else if(detail?.kind==='meter-profile') renderMeterProfile(detail.id);
    else if(detail?.kind==='board-profile') renderBoardProfile(detail.id);
    else if(detail?.kind==='region-profile') renderRegionProfile(detail.id,detail.section||'');
    else if(detail?.kind==='invoice-profile') renderInvoiceProfile(detail.id);
    else if(detail) renderDetail();
    else ({home:renderHome,subscribers:renderSubscribers,meters:renderMeters,invoices:renderInvoices,flows:renderFlows,accounts:renderAccounts,logs:renderLogs,reports:renderReports,settings:renderSettings,employees:renderEmployees,platform:renderPlatform,tasks:renderTasks}[currentPage]||renderHome)();
    hydrateIcons(); renderFab();
  };

  renderFab=function(){
    const root=$('#fabRoot');
    if(detail && !['subscriber-profile','meter-profile','board-profile','region-profile'].includes(detail.kind)){root.innerHTML=''; return;}
    const actions=[];
    if(currentPage==='subscribers'&&hasPerm('subscribers.add')){actions.push(['add-subscriber','إضافة مشترك','users']); actions.push(['add-meter','إضافة عداد','meter']);}
    if((currentPage==='meters'||['meter-profile','board-profile','region-profile'].includes(detail?.kind))&&hasPerm('subscribers.add')){actions.push(['add-meter','إضافة عداد','meter']); actions.push(['add-board','إضافة لوحة توزيع','panel']); actions.push(['add-region','إضافة منطقة','mapPin']);}
    if(currentPage==='invoices'&&hasPerm('subscriptions.add')) actions.push(['add-invoice','إضافة فاتورة','receipt']);
    if(currentPage==='accounts'){ if(hasPerm('accounts.add')) actions.push(['add-account','إضافة حساب','bank']); if(hasPerm('accounts.transfer')||hasPerm('flows.transfer')) actions.push(['account-transfer','تحويل','transfer']); }
    if(currentPage==='flows'){ if(hasPerm('flows.collect')) actions.push(['collection','تحصيل دفعة','arrowDown']); if(hasPerm('flows.send')) actions.push(['send','إرسال دفعة','arrowUp']); if(hasPerm('flows.expense')) actions.push(['expense','مصروف','expense']); }
    if(currentPage==='employees'&&hasPerm('employees.manage')) actions.push(['add-employee','إضافة موظف','userCog']);
    if(currentPage==='tasks'&&hasPerm('tasks.manage')) actions.push(['add-task','إضافة مهمة','clipboard']);
    if(!actions.length){root.innerHTML=''; return;}
    root.innerHTML=`<div id="fabMenu" class="fab-menu hidden">${actions.map(([a,l,ic])=>`<button class="fab-item" data-action="${a}" type="button">${icon(ic)}<span>${l}</span></button>`).join('')}</div><button id="fabMain" class="fab-main" type="button">${icon('plus')}</button>`;
  };

  const __oldHandleAction=handleAction;
  handleAction=function(action){
    if(action==='add-expense-type') return openAddExpenseType();
    return __oldHandleAction(action);
  };

  const __oldHandlePickerChange=handlePickerChange;
  handlePickerChange=function(name,value){
    __oldHandlePickerChange(name,value);
    if(name==='subscriberId') refreshMovementForm();
  };

  const __oldHandleSubmit=handleSubmit;
  handleSubmit=async function(form,submitter=null){
    const fd=new FormData(form), obj=Object.fromEntries(fd.entries());
    try{
      if(form.id==='expenseTypeForm'){
        const name=String(obj.name||'').trim();
        if(!name) throw Error('اكتب اسم نوع المصروف.');
        const set=new Set(data.settings.expenseTypes||[]); set.add(name); data.settings.expenseTypes=[...set]; save('settings'); logAction('إضافة نوع مصروف',name); toast('تمت إضافة نوع المصروف'); closeModal(); render(); return;
      }
      if(form.id==='subscriberForm'){
        const id=form.dataset.id; const row=id?(data.subscribers.find(x=>String(x.id)===String(id))||{id}):{id:uid('sub')};
        Object.assign(row,{name:String(obj.name||'').trim(),prefix:obj.prefix||'+970',phone:String(obj.phone||'').replace(/\D/g,'').replace(/^0+/,''),address:String(obj.address||'').trim(),notes:String(obj.notes||'').trim(),createdAt:obj.createdAt?`${obj.createdAt}T12:00:00`:isoNow()});
        if(!row.name) throw Error('اكتب اسم المشترك.');
        if(!id) data.subscribers.unshift(row); save('subscribers'); logAction(id?'تعديل مشترك':'إضافة مشترك',row.name); toast(id?'تم تعديل المشترك':'تمت إضافة المشترك'); closeModal(); currentPage='subscribers'; render(); return;
      }
      if(form.id==='regionForm'){
        const id=form.dataset.id; const row=id?(data.regions.find(x=>String(x.id)===String(id))||{id}):{id:uid('region')};
        Object.assign(row,{name:String(obj.name||'').trim(),regionNumber:String(obj.regionNumber||'').trim()||nextRegionNumber(),notes:String(obj.notes||'').trim(),createdAt:obj.createdAt?`${obj.createdAt}T12:00:00`:isoNow()});
        if(!row.name) throw Error('اكتب اسم المنطقة.'); if(!id) data.regions.unshift(row); save('regions'); logAction(id?'تعديل منطقة':'إضافة منطقة',`${row.name} • ${row.regionNumber}`); toast(id?'تم تعديل المنطقة':'تمت إضافة المنطقة'); closeModal(); currentPage='meters'; meterSection='regions'; render(); return;
      }
      if(form.id==='boardForm'){
        const id=form.dataset.id; const row=id?(data.distributionBoards.find(x=>String(x.id)===String(id))||{id}):{id:uid('board')};
        Object.assign(row,{regionId:obj.boardRegionId,name:String(obj.name||'').trim(),boardNumber:String(obj.boardNumber||'').trim()||nextBoardNumber(),notes:String(obj.notes||'').trim(),createdAt:obj.createdAt?`${obj.createdAt}T12:00:00`:isoNow()});
        if(!row.regionId) throw Error('اختر المنطقة.'); if(!row.name) throw Error('اكتب اسم اللوحة.'); if(!id) data.distributionBoards.unshift(row); save('distributionBoards'); logAction(id?'تعديل لوحة توزيع':'إضافة لوحة توزيع',`${row.name} • ${row.boardNumber}`); toast(id?'تم تعديل اللوحة':'تمت إضافة اللوحة'); closeModal(); currentPage='meters'; meterSection='boards'; render(); return;
      }
      if(form.id==='meterForm'){
        const id=form.dataset.id, opening=Number(obj.openingReading||0), board=boardBy(obj.boardId); const row=id?(data.meters.find(x=>String(x.id)===String(id))||{id}):{id:uid('meter')};
        Object.assign(row,{subscriberId:obj.subscriberId,regionId:obj.regionId,boardId:obj.boardId,label:String(obj.label||'').trim()||String(obj.meterNumber||'').trim()||'عداد',meterNumber:String(obj.meterNumber||'').trim()||nextMeterNumber(),location:String(obj.location||'').trim(),openingReading:opening,openingDate:obj.openingDate||dateOnly(new Date()),ratePerKw:Number(row.ratePerKw||data.settings.defaultRate||0),notes:String(obj.notes||'').trim(),createdAt:row.createdAt||isoNow()});
        if(!id || !data.invoices.some(i=>String(i.meterId)===String(row.id))){row.lastReading=opening; row.lastReadingDate=row.openingDate;}
        if(!row.subscriberId) throw Error('اختر المشترك.'); if(!row.regionId) throw Error('اختر المنطقة.'); if(!row.boardId) throw Error('اختر لوحة التوزيع.'); if(board && String(board.regionId)!==String(row.regionId)) throw Error('لوحة التوزيع لا تتبع المنطقة المختارة.');
        if(!id) data.meters.unshift(row); else recalcMeterState(row.id); save('meters'); logAction(id?'تعديل عداد':'إضافة عداد',`${subscriberBy(row.subscriberId).name} • ${row.meterNumber}`); toast(id?'تم تعديل العداد':'تمت إضافة العداد'); closeModal(); currentPage='meters'; meterSection='all'; render(); return;
      }
      if(form.id==='invoiceForm'){
        const editId=form.dataset.id, m=meterBy(obj.meterId); if(!obj.invoiceSubscriberId) throw Error('اختر المشترك.'); if(!m||String(m.subscriberId)!==String(obj.invoiceSubscriberId)) throw Error('اختر عداداً تابعاً للمشترك.'); const closing=Number(obj.closingReading), date=obj.date||dateOnly(new Date()), unit=Number(obj.unitPrice||m.ratePerKw||data.settings.defaultRate||0), discount=Math.max(0, Number(obj.discount||0)); if(!Number.isFinite(closing)) throw Error('أدخل القراءة الحالية بشكل صحيح.');
        const row=editId?(data.invoices.find(x=>String(x.id)===String(editId))||{id:editId}):{id:uid('inv'),createdAt:isoNow()};
        Object.assign(row,{subscriberId:m.subscriberId,meterId:m.id,date,periodTo:date,closingReading:closing,unitPrice:unit,discount,notes:String(obj.notes||'').trim(),readingImage:pendingInvoiceImage||row.readingImage||'',readingImageName:pendingInvoiceImageName||row.readingImageName||''});
        if(!editId) data.invoices.unshift(row); recalcMeterState(m.id); save('invoices'); save('meters'); logAction(editId?'تعديل فاتورة':'إضافة فاتورة',`${subscriberBy(row.subscriberId).name} • ${money(invoiceNet(row))}`); const shouldSend=obj.sendMode==='send'; pendingInvoiceImage=''; pendingInvoiceImageName=''; closeModal(); currentPage='invoices'; render(); toast(editId?'تم تعديل الفاتورة':'تم حفظ الفاتورة'); if(shouldSend) setTimeout(()=>openSendChooser(subscriberBy(row.subscriberId),buildInvoiceMessage(row),'إرسال الفاتورة'),80); return;
      }
      if(form.id==='movementForm'){
        const type=form.dataset.type, id=form.dataset.id, amount=Number(obj.amount||0); if(!(amount>0)) throw Error('أدخل مبلغاً صحيحاً.'); if(type!=='expense'&&!obj.subscriberId) throw Error('اختر المشترك.'); if(!obj.accountId) throw Error('اختر الحساب.');
        const row=id?(data.movements.find(x=>String(x.id)===String(id))||{id}):{id:uid('mov'),createdAt:isoNow()};
        Object.assign(row,{type,subscriberId:obj.subscriberId||'',expenseType:obj.expenseType||'',payee:obj.expenseType||obj.payee||'',accountId:obj.accountId,amount,date:obj.date,notes:obj.notes||'',proofImage:pendingMovementImage||row.proofImage||'',proofImageName:pendingMovementImageName||row.proofImageName||''});
        if(!id) data.movements.unshift(row); save('movements'); logAction(id?'تعديل حركة مالية':type==='collection'?'استقبال دفعة':type==='send'?'إرسال دفعة':'إضافة مصروف',`${money(amount)} • ${type==='expense'?(row.expenseType||row.payee):subscriberBy(row.subscriberId).name}`); const shouldSend=obj.sendMode==='send'; pendingMovementImage=''; pendingMovementImageName=''; closeModal(); render(); toast(id?'تم تعديل العملية':'تم حفظ العملية'); if(shouldSend&&row.subscriberId) setTimeout(()=>openSendChooser(subscriberBy(row.subscriberId),buildMovementMessage(row),'إرسال ملخص العملية'),80); return;
      }
      if(form.id==='transferForm'){
        const id=form.dataset.id, amount=Number(obj.amount||0); if(!obj.fromAccountId||!obj.toAccountId||obj.fromAccountId===obj.toAccountId) throw Error('اختر حسابين مختلفين.'); if(!(amount>0)) throw Error('أدخل مبلغاً صحيحاً.');
        const row=id?(data.movements.find(x=>String(x.id)===String(id))||{id}):{id:uid('mov'),createdAt:isoNow()};
        Object.assign(row,{type:'transfer',subscriberId:obj.subscriberId||'',fromAccountId:obj.fromAccountId,toAccountId:obj.toAccountId,amount,date:obj.date,reason:obj.reason||'',notes:obj.notes||''});
        if(!id) data.movements.unshift(row); save('movements'); logAction(id?'تعديل تحويل مالي':'تحويل بين الحسابات',`${obj.fromAccountId} ← ${obj.toAccountId} • ${money(amount)}`); toast(id?'تم تعديل التحويل':'تم التحويل'); closeModal(); render(); return;
      }
      if(form.id==='accountForm'){
        const id=form.dataset.id; const row=id?(data.accounts.find(x=>String(x.id)===String(id))||{id}):{id:uid('acc')};
        Object.assign(row,{name:obj.name.trim(),type:obj.type||'cash',number:obj.number.trim(),openingBalance:Number(obj.openingBalance||0),createdAt:obj.createdAt?`${obj.createdAt}T12:00:00`:(row.createdAt||isoNow()),notes:obj.notes||''});
        if(!row.name) throw Error('اكتب اسم الحساب.'); if(!id) data.accounts.unshift(row); save('accounts'); logAction(id?'تعديل حساب':'إضافة حساب',row.name); toast(id?'تم تعديل الحساب':'تمت إضافة الحساب'); closeModal(); render(); return;
      }
    }catch(e){ toast(e.message||'تعذر تنفيذ العملية','خطأ'); return; }
    return __oldHandleSubmit(form,submitter);
  };

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const editBtn=e.target.closest('[data-edit]');
    if(editBtn){ e.preventDefault(); e.stopPropagation(); openEditByType(editBtn.dataset.edit, editBtn.dataset.id); return; }
    const acc=e.target.closest('[data-account]');
    if(acc){ e.preventDefault(); e.stopPropagation(); renderAccountProfile(acc.dataset.account); hydrateIcons(); renderFab(); return; }
    const mvSubmit=e.target.closest('[data-movement-submit]');
    if(mvSubmit){ const h=mvSubmit.closest('form')?.querySelector('[name=sendMode]'); if(h) h.value=mvSubmit.dataset.movementSubmit; }
    const rm=e.target.closest('[data-remove-movement-photo]');
    if(rm){ pendingMovementImage=''; pendingMovementImageName=''; refreshMovementForm(); }
  }, true);
  document.addEventListener('change',async e=>{
    if(e.target.id==='movementPhotoGallery'||e.target.id==='movementPhotoCamera'){
      try{ const file=e.target.files?.[0]; if(file){ window.AhmadiImageProgress?.start('movement'); pendingMovementImage=await compressInvoiceImage(file,50*1024,'movement-proofs'); pendingMovementImageName=file.name||'proof.jpg'; refreshMovementForm(); window.AhmadiImageProgress?.done('movement',navigator.onLine?'تم تجهيز وإرفاق الصورة':'تم حفظ الصورة محلياً وستُرفع عند عودة الإنترنت'); } }catch(err){ window.AhmadiImageProgress?.fail('movement'); toast(err.message||'تعذر معالجة الصورة','خطأ'); } finally { e.target.value=''; }
    }
  });
})();


/* ==== v9 timeline / audit log patch ==== */
(function(){
  let logMode='all';

  function currentActor(){
    const name=session?.actorName||data.settings?.ownerName||session?.ownerName||session?.username||'مستخدم غير معروف';
    const raw=session?.actorType||'owner';
    const type=(raw==='owner'||raw==='manager'||raw==='admin')?'manager':'employee';
    const id=session?.actorId||session?.employeeId||session?.userId||session?.username||name;
    return {name,type,id};
  }
  function logKind(title=''){
    const t=String(title);
    if(t.includes('حذف'))return 'delete';
    if(t.includes('تعديل'))return 'edit';
    if(t.includes('إضافة'))return 'add';
    if(t.includes('استقبال')||t.includes('إرسال')||t.includes('تحويل')||t.includes('مصروف')||t.includes('دفعة'))return 'finance';
    if(t.includes('دخول')||t.includes('خروج'))return 'session';
    return 'other';
  }
  function actorOf(l){
    const name=l.actorName||l.actor||'مستخدم غير معروف';
    let type=l.actorType||'';
    if(!type){
      const owner=data.settings?.ownerName||session?.ownerName||'';
      type=(owner&&name===owner)?'manager':'employee';
    }
    if(type==='owner'||type==='admin')type='manager';
    const id=l.actorId||name;
    return {name,type,id,key:`${type}|${id}|${name}`};
  }
  function roleLabel(type){return type==='manager'?'مدير':'موظف'}
  function localDateTimeValue(v){
    const d=new Date(v||Date.now());
    if(Number.isNaN(d.getTime()))return '';
    return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);
  }

  // جميع الحركات محفوظة بدون حد 500 حركة، مع هوية الموظف/المدير.
  logAction=function(title,meta='',extra={}){
    const a=currentActor();
    const row={
      id:uid('log'),title:String(title||'حركة داخل التطبيق'),meta:String(meta||''),
      actor:a.name,actorName:a.name,actorType:a.type,actorId:a.id,
      kind:extra.kind||logKind(title),entityType:extra.entityType||'',entityId:extra.entityId||'',
      date:extra.date||isoNow()
    };
    data.logs.unshift(row);
    save('logs');
    return row;
  };

  function sortedLogs(rows){
    const out=[...rows];
    if(detailSort==='date-asc')out.sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));
    else out.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    return out;
  }
  function filteredLogs(){
    const q=detailSearch.trim().toLowerCase();
    return sortedLogs(filtered('logs','date').filter(l=>!q||`${l.title||''} ${l.meta||''} ${actorOf(l).name} ${roleLabel(actorOf(l).type)}`.toLowerCase().includes(q)));
  }
  function actorGroups(rows){
    const map=new Map();
    rows.forEach(l=>{
      const a=actorOf(l),g=map.get(a.key)||{...a,count:0,lastDate:l.date};
      g.count++;if(new Date(l.date||0)>new Date(g.lastDate||0))g.lastDate=l.date;
      map.set(a.key,g);
    });
    return [...map.values()].sort((a,b)=>b.count-a.count||String(a.name).localeCompare(String(b.name),'ar'));
  }
  function logIcon(kind){return kind==='delete'?'trash':kind==='edit'?'edit':kind==='add'?'plus':kind==='finance'?'wallet':kind==='session'?'userCog':'clock'}
  function logKindLabel(kind){return kind==='delete'?'حذف':kind==='edit'?'تعديل':kind==='add'?'إضافة':kind==='finance'?'مالية':kind==='session'?'جلسة':'حركة'}
  function logCard(l){
    const a=actorOf(l),kind=l.kind||logKind(l.title);
    return `<article class="row-card timeline-card" data-log-view="${esc(l.id)}"><span class="row-icon">${icon(logIcon(kind))}</span><span class="row-main"><strong>${esc(l.title||'حركة داخل التطبيق')}</strong><small>${esc(a.name)} • ${roleLabel(a.type)} • ${fmtDateTime(l.date)}</small>${l.meta?`<small class="timeline-meta">${esc(l.meta)}</small>`:''}<div class="timeline-actions"><button type="button" data-log-view="${esc(l.id)}">${icon('search')} عرض</button><button type="button" data-log-edit="${esc(l.id)}">${icon('edit')} تعديل</button><button type="button" data-log-delete="${esc(l.id)}" class="danger">${icon('trash')} حذف</button></div></span><span class="row-amount"><span class="badge log-kind ${kind}">${logKindLabel(kind)}</span></span></article>`;
  }
  function actorCard(g){
    return `<button class="row-card actor-log-card" data-log-actor="${esc(g.key)}" type="button"><span class="row-icon">${icon(g.type==='manager'?'userCog':'users')}</span><span><strong>${esc(g.name)}</strong><small>${roleLabel(g.type)} • آخر حركة ${fmtDateTime(g.lastDate)}</small></span><span class="row-amount"><strong>${g.count}</strong><small>حركة</small></span></button>`;
  }
  function summaryCards(rows){
    const groups=actorGroups(rows),managers=groups.filter(x=>x.type==='manager').length,employees=groups.filter(x=>x.type!=='manager').length;
    return `<div class="log-summary-grid"><button class="log-summary-card ${logMode==='all'?'active':''}" data-log-mode="all" type="button"><span class="log-summary-icon">${icon('clock')}</span><span><strong>السجل الزمني الكلي</strong><small>جميع الحركات داخل التطبيق</small></span><b>${rows.length}</b></button><button class="log-summary-card ${logMode==='actors'?'active':''}" data-log-mode="actors" type="button"><span class="log-summary-icon">${icon('users')}</span><span><strong>حسب الموظفين والمدراء</strong><small>${managers} مدير • ${employees} موظف</small></span><b>${groups.length}</b></button></div>`;
  }

  renderLogs=function(){
    setPageTitle('السجل الزمني');
    const rows=filteredLogs();
    const groups=actorGroups(rows);
    $('#mainContent').innerHTML=`${pageHead('السجل الزمني','كل إضافة أو تعديل أو حذف أو حركة مالية داخل التطبيق')}${timeFilterHtml()}${listToolbar('بحث باسم العملية أو الموظف أو التفاصيل...')}${summaryCards(rows)}${logMode==='actors'?`<div class="count-banner"><div><small>الموظفون والمدراء الظاهرون</small><strong>${groups.length}</strong></div><span class="badge">${rows.length} حركة</span></div><div class="cards-list">${groups.length?groups.map(actorCard).join(''):'<div class="empty">لا توجد حركات للموظفين أو المدراء في الفترة.</div>'}</div>`:`<div class="count-banner"><div><small>إجمالي العمليات</small><strong>${rows.length}</strong></div><span class="badge">سجل ثابت ومحفوظ</span></div><div class="cards-list">${rows.length?rows.map(logCard).join(''):'<div class="empty">لا توجد عمليات في الفترة المحددة.</div>'}</div>`}`;
  };

  function renderLogActor(actorKey){
    const all=filteredLogs();
    const group=actorGroups(all).find(x=>x.key===actorKey);
    const rows=all.filter(l=>actorOf(l).key===actorKey);
    const name=group?.name||actorKey.split('|').pop()||'الموظف';
    const type=group?.type||'employee';
    detail={kind:'log-actor',actorKey,title:`سجل ${name}`};
    setPageTitle('سجل الموظف');
    $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" id="profileBack" data-back-page="logs" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(name)}</h1><p>${roleLabel(type)} • جميع الحركات المسجلة</p></div><div class="head-meta">${rows.length} حركة</div></div>${timeFilterHtml()}${listToolbar('بحث داخل حركات هذا المستخدم...')}<div class="cards-list">${rows.length?rows.map(logCard).join(''):'<div class="empty">لا توجد حركات مطابقة.</div>'}</div>`;
  }

  function openLogView(id){
    const l=data.logs.find(x=>String(x.id)===String(id));if(!l)return;
    const a=actorOf(l),kind=l.kind||logKind(l.title);
    openModal('تفاصيل الحركة',`<section class="log-view-card"><div class="log-view-head"><span>${icon(logIcon(kind))}</span><div><strong>${esc(l.title||'حركة داخل التطبيق')}</strong><small>${logKindLabel(kind)}</small></div></div><div class="profile-data-grid"><span>المستخدم<b>${esc(a.name)}</b></span><span>الصفة<b>${roleLabel(a.type)}</b></span><span>التاريخ والوقت<b>${fmtDateTime(l.date)}</b></span><span>نوع الحركة<b>${logKindLabel(kind)}</b></span>${l.meta?`<span class="wide">التفاصيل<b>${esc(l.meta)}</b></span>`:''}</div><div class="modal-actions"><button class="secondary-btn" type="button" data-log-edit="${esc(l.id)}">${icon('edit')} تعديل</button><button class="secondary-btn danger-btn" type="button" data-log-delete="${esc(l.id)}">${icon('trash')} حذف</button></div></section>`);
  }
  function openLogEdit(id){
    const l=data.logs.find(x=>String(x.id)===String(id));if(!l)return;
    openModal('تعديل الحركة المسجلة',`<form id="logEditForm" data-id="${esc(l.id)}"><div class="form-grid">${inputField('title','عنوان الحركة','text',l.title||'','مثال: تعديل مشترك')}${inputField('date','التاريخ والوقت','datetime-local',localDateTimeValue(l.date),'')}<label class="field span-2"><span>تفاصيل الحركة</span><textarea name="meta" rows="4" placeholder="تفاصيل أو ملاحظات">${esc(l.meta||'')}</textarea></label></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ التعديل</button></div></form>`,'logEditForm');
  }
  function deleteLog(id){
    const idx=data.logs.findIndex(x=>String(x.id)===String(id));if(idx<0)return;
    const old=data.logs[idx];
    if(!confirm(`حذف الحركة من السجل الزمني؟\n${old.title||''}`))return;
    data.logs.splice(idx,1);save('logs');
    logAction('حذف سجل زمني',`${old.title||'حركة'} • ${fmtDateTime(old.date)}`,{kind:'delete',entityType:'log',entityId:id});
    closeModal();render();toast('تم حذف الحركة من السجل');
  }

  const prevRender=render;
  render=function(){
    if(detail?.kind==='log-actor'){renderNav();renderLogActor(detail.actorKey);hydrateIcons();renderFab();return;}
    return prevRender();
  };

  const prevSubmit=handleSubmit;
  handleSubmit=async function(form,submitter=null){
    if(form.id==='logEditForm'){
      const fd=new FormData(form),obj=Object.fromEntries(fd.entries());
      const l=data.logs.find(x=>String(x.id)===String(form.dataset.id));
      if(!l)return;
      const before=l.title||'حركة';
      l.title=String(obj.title||'').trim()||'حركة داخل التطبيق';
      l.meta=String(obj.meta||'').trim();
      l.date=obj.date?new Date(obj.date).toISOString():l.date;
      l.kind=logKind(l.title);
      save('logs');
      logAction('تعديل سجل زمني',`${before} ← ${l.title}`,{kind:'edit',entityType:'log',entityId:l.id});
      closeModal();render();toast('تم تعديل الحركة المسجلة');return;
    }
    return prevSubmit(form,submitter);
  };

  // تسجيل دخول المستخدم الجديد إلى الجلسة.
  const prevStartSession=startSession;
  startSession=async function(freshLogin=false){
    const result=await prevStartSession(freshLogin);
    if(freshLogin&&session){
      logAction('تسجيل الدخول',`${session.actorName||session.username||'مستخدم'} دخل إلى التطبيق`,{kind:'session'});
      render();
    }
    return result;
  };

  // تسجيل إنشاء/تعديل/حذف الموظفين المنفذ عبر الطبقة السحابية.
  try{
    if(window.AhmadiCloud){
      if(typeof AhmadiCloud.createEmployee==='function'&&!AhmadiCloud.createEmployee.__auditWrapped){
        const fn=AhmadiCloud.createEmployee.bind(AhmadiCloud);
        const wrapped=async function(companyId,payload){const r=await fn(companyId,payload);logAction('إضافة موظف',payload?.name||payload?.username||'موظف',{kind:'add',entityType:'employee',entityId:r?.id||''});return r};wrapped.__auditWrapped=true;AhmadiCloud.createEmployee=wrapped;
      }
      if(typeof AhmadiCloud.updateEmployee==='function'&&!AhmadiCloud.updateEmployee.__auditWrapped){
        const fn=AhmadiCloud.updateEmployee.bind(AhmadiCloud);
        const wrapped=async function(companyId,id,payload){const r=await fn(companyId,id,payload);logAction('تعديل موظف',payload?.name||id,{kind:'edit',entityType:'employee',entityId:id});return r};wrapped.__auditWrapped=true;AhmadiCloud.updateEmployee=wrapped;
      }
      if(typeof AhmadiCloud.deleteEmployee==='function'&&!AhmadiCloud.deleteEmployee.__auditWrapped){
        const fn=AhmadiCloud.deleteEmployee.bind(AhmadiCloud);
        const wrapped=async function(companyId,id){const r=await fn(companyId,id);logAction('حذف موظف',String(id),{kind:'delete',entityType:'employee',entityId:id});return r};wrapped.__auditWrapped=true;AhmadiCloud.deleteEmployee=wrapped;
      }
    }
  }catch(_){ }

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const mode=e.target.closest('[data-log-mode]');
    if(mode){e.preventDefault();e.stopPropagation();logMode=mode.dataset.logMode;detail=null;currentPage='logs';detailSearch='';render();return;}
    const actor=e.target.closest('[data-log-actor]');
    if(actor){e.preventDefault();e.stopPropagation();detailSearch='';renderLogActor(actor.dataset.logActor);hydrateIcons();renderFab();return;}
    const edit=e.target.closest('[data-log-edit]');
    if(edit){e.preventDefault();e.stopPropagation();openLogEdit(edit.dataset.logEdit);return;}
    const del=e.target.closest('[data-log-delete]');
    if(del){e.preventDefault();e.stopPropagation();deleteLog(del.dataset.logDelete);return;}
    const view=e.target.closest('[data-log-view]');
    if(view){e.preventDefault();e.stopPropagation();openLogView(view.dataset.logView);return;}
    if(e.target.closest('#logoutBtn')&&session){
      try{logAction('تسجيل الخروج',`${session.actorName||session.username||'مستخدم'} خرج من التطبيق`,{kind:'session'});}catch(_){ }
    }
  },true);

  // عند وجود جلسة مستعادة، أعد الرسم فوراً بالواجهة المحدثة بعد تحميل هذا التعديل.
  setTimeout(()=>{if(session&&currentPage==='logs')render();},0);
})();

/* ==== v13 subscriber reports ==== */
(function(){
  const reportState={
    type:'subscriber-general',
    mode:'opening',
    from:'',to:'',regionId:'',boardId:'',subscriberIds:[],search:'',sort:'date-desc'
  };
  const reportTypes={
    'subscriber-data':{title:'كشف بيانات المشتركين',desc:'الاسم والهاتف والعنوان والحالة المالية',icon:'users'},
    'subscriber-general':{title:'كشف المشتركين العام',desc:'الاستهلاك والقراءات والفواتير والمدفوع والمتبقي',icon:'report'},
    'subscriber-due-from':{title:'كشف المشتركين المستحق عليهم',desc:'المشتركون الذين عليهم استحقاق مالي',icon:'arrowDown'},
    'subscriber-due-to':{title:'كشف المشتركين المستحق لهم',desc:'المشتركون الذين لهم استحقاق مالي',icon:'arrowUp'}
  };
  function reportToday(){return dateOnly(new Date())}
  function dateMs(v,end=false){
    if(!v)return end?Infinity:-Infinity;
    const d=new Date(`${String(v).slice(0,10)}T${end?'23:59:59.999':'00:00:00'}`);return d.getTime();
  }
  function reportInRange(v){const t=new Date(v||0).getTime();return t>=dateMs(reportState.from,false)&&t<=dateMs(reportState.to,true)}
  function earliestActivity(){
    const vals=[];
    data.subscribers.forEach(x=>x.createdAt&&vals.push(x.createdAt));
    data.meters.forEach(x=>(x.openingDate||x.createdAt)&&vals.push(x.openingDate||x.createdAt));
    data.invoices.forEach(x=>(x.date||x.periodTo||x.createdAt)&&vals.push(x.date||x.periodTo||x.createdAt));
    data.movements.forEach(x=>(x.date||x.createdAt)&&vals.push(x.date||x.createdAt));
    if(!vals.length)return reportToday();
    vals.sort((a,b)=>new Date(a)-new Date(b));return dateOnly(vals[0]);
  }
  function resetReportRange(opening=true){reportState.from=opening?earliestActivity():reportToday();reportState.to=reportToday()}
  function subscriberMetersForReport(subId){
    return data.meters.filter(m=>{
      if(String(m.subscriberId)!==String(subId))return false;
      if(reportState.regionId&&String(m.regionId)!==String(reportState.regionId))return false;
      if(reportState.boardId&&String(m.boardId)!==String(reportState.boardId))return false;
      return true;
    });
  }
  function meterReportSnapshot(m){
    const inv=data.invoices.filter(i=>String(i.meterId)===String(m.id)&&reportInRange(i.date||i.periodTo||i.createdAt)).sort((a,b)=>new Date(a.date||a.periodTo||0)-new Date(b.date||b.periodTo||0));
    const lastInv=inv[inv.length-1]||null;
    const consumption=inv.reduce((s,i)=>s+Number(i.consumption||0),0);
    const cost=inv.reduce((s,i)=>s+invoiceNet(i),0);
    const latestReading=lastInv?Number(lastInv.closingReading||0):Number(m.lastReading??m.openingReading??0);
    const latestDate=lastInv?.date||lastInv?.periodTo||m.lastReadingDate||m.openingDate||'';
    return {m,inv,consumption,cost,openingReading:Number(m.openingReading||0),openingDate:m.openingDate||'',lastReading:latestReading,lastDate:latestDate};
  }
  function subscriberReportSnapshot(s){
    const meters=subscriberMetersForReport(s.id),meterSnaps=meters.map(meterReportSnapshot);
    const meterIds=new Set(meters.map(m=>String(m.id)));
    const inv=data.invoices.filter(i=>String(i.subscriberId)===String(s.id)&&reportInRange(i.date||i.periodTo||i.createdAt)&&(!meterIds.size||meterIds.has(String(i.meterId))));
    const moves=data.movements.filter(m=>String(m.subscriberId||'')===String(s.id)&&reportInRange(m.date||m.createdAt));
    const billed=inv.reduce((a,i)=>a+invoiceNet(i),0),paid=moves.filter(m=>movementType(m)==='collection').reduce((a,m)=>a+Number(m.amount||0),0),sent=moves.filter(m=>movementType(m)==='send').reduce((a,m)=>a+Number(m.amount||0),0);
    const balance=billed-paid+sent;
    const consumption=inv.reduce((a,i)=>a+Number(i.consumption||0),0);
    const avg=consumption?billed/consumption:0;
    const dates=[...inv.map(i=>i.date||i.periodTo||i.createdAt),...moves.map(m=>m.date||m.createdAt),...meters.map(m=>m.openingDate||m.createdAt)].filter(Boolean).sort((a,b)=>new Date(b)-new Date(a));
    return {s,meters,meterSnaps,inv,moves,billed,paid,sent,balance,dueFrom:Math.max(balance,0),dueTo:Math.max(-balance,0),consumption,avg,lastDate:dates[0]||s.createdAt||''};
  }
  function eligibleSubscribers(){
    let rows=data.subscribers.map(subscriberReportSnapshot);
    if(reportState.regionId||reportState.boardId)rows=rows.filter(x=>x.meters.length);
    if(reportState.subscriberIds.length){const set=new Set(reportState.subscriberIds.map(String));rows=rows.filter(x=>set.has(String(x.s.id)))}
    if(reportState.type==='subscriber-due-from')rows=rows.filter(x=>x.dueFrom>0);
    if(reportState.type==='subscriber-due-to')rows=rows.filter(x=>x.dueTo>0);
    const q=(reportState.search||'').trim().toLowerCase();
    if(q)rows=rows.filter(x=>`${x.s.name||''} ${fullPhone(x.s)||''} ${x.s.address||''} ${x.meters.map(m=>m.meterNumber+' '+m.label).join(' ')}`.toLowerCase().includes(q));
    const sort=reportState.sort;
    if(sort==='amount-desc')rows.sort((a,b)=>Math.abs(b.balance)-Math.abs(a.balance));
    else if(sort==='amount-asc')rows.sort((a,b)=>Math.abs(a.balance)-Math.abs(b.balance));
    else if(sort==='date-asc')rows.sort((a,b)=>new Date(a.lastDate||0)-new Date(b.lastDate||0));
    else rows.sort((a,b)=>new Date(b.lastDate||0)-new Date(a.lastDate||0));
    return rows;
  }
  function reportSummary(rows){
    return {
      count:rows.length,
      dueFrom:rows.reduce((a,x)=>a+x.dueFrom,0),
      dueTo:rows.reduce((a,x)=>a+x.dueTo,0),
      paid:rows.reduce((a,x)=>a+x.paid,0),
      billed:rows.reduce((a,x)=>a+x.billed,0),
      consumption:rows.reduce((a,x)=>a+x.consumption,0),
      avg:rows.reduce((a,x)=>a+x.consumption,0)?rows.reduce((a,x)=>a+x.billed,0)/rows.reduce((a,x)=>a+x.consumption,0):0
    };
  }
  function reportBackButton(target='reports'){return `<button class="secondary-btn compact" data-report-back="${target}" type="button">${icon('back')} رجوع</button>`}
  function reportTypeCard(type){const x=reportTypes[type];return `<button class="report-menu-card" data-subscriber-report-type="${type}" type="button"><span class="report-menu-icon">${icon(x.icon)}</span><span><strong>${x.title}</strong><small>${x.desc}</small></span><b>${icon('chevron')}</b></button>`}
  function renderSubscriberReportsMenu(){
    detail={kind:'subscriber-reports-menu'};setPageTitle('تقارير المشتركين');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${reportBackButton('reports')}<h1 style="margin-top:12px">تقارير المشتركين</h1><p>اختر نوع الكشف المطلوب ثم طريقة إنشاء التقرير.</p></div><div class="head-meta">${data.subscribers.length} مشترك</div></div><div class="report-menu-list">${Object.keys(reportTypes).map(reportTypeCard).join('')}</div>`;
  }
  function reportCommandCard(mode,title,desc,ic){return `<button class="report-command-card" data-report-command="${mode}" type="button"><span>${icon(ic)}</span><div><strong>${title}</strong><small>${desc}</small></div>${icon('chevron')}</button>`}
  function renderReportCommands(type){
    reportState.type=type||reportState.type;detail={kind:'subscriber-report-commands',reportType:reportState.type};setPageTitle('إنشاء التقرير');const t=reportTypes[reportState.type];
    $('#mainContent').innerHTML=`<div class="page-head"><div>${reportBackButton('subscriber-menu')}<h1 style="margin-top:12px">${t.title}</h1><p>اختر طريقة إنشاء التقرير.</p></div></div><div class="report-command-grid">${reportCommandCard('opening','من الفترة الافتتاحية إلى اليوم','كل البيانات منذ أول تاريخ مسجل وحتى لحظة إنشاء التقرير','clock')}${reportCommandCard('range','حسب فلترة زمنية','تحديد تاريخ البداية والنهاية للتقرير','calendar')}${reportCommandCard('region','حسب المنطقة','اختيار منطقة وفترة زمنية محددة','mapPin')}${reportCommandCard('region-board','حسب المنطقة ولوحة التوزيع','اختيار المنطقة ثم لوحة التوزيع والفترة الزمنية','panel')}${reportCommandCard('subscribers','مشترك واحد أو عدة مشتركين','اختيار المشتركين المطلوب ظهورهم في التقرير','users')}</div>`;
  }
  function configDateFields(){return `${inputField('reportFrom','من تاريخ','date',reportState.from||reportToday(),'')}${inputField('reportTo','إلى تاريخ','date',reportState.to||reportToday(),'')}`}
  function renderReportConfig(mode){
    reportState.mode=mode;detail={kind:'subscriber-report-config',reportType:reportState.type,mode};setPageTitle('خيارات التقرير');
    if(!reportState.from||!reportState.to)resetReportRange(mode==='opening');
    let body='';
    if(mode==='range') body=`<form id="reportConfigForm" data-mode="range"><div class="form-grid">${configDateFields()}</div><div class="report-generate-actions"><button class="primary-btn" type="submit">${icon('report')} إنشاء التقرير</button></div></form>`;
    else if(mode==='region'){
      const items=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
      body=`<form id="reportConfigForm" data-mode="region"><div class="form-grid">${pickerField('reportRegionId','اسم المنطقة',items,reportState.regionId,'اختر المنطقة')}${configDateFields()}</div><div class="report-generate-actions"><button class="primary-btn" type="submit">${icon('report')} إنشاء التقرير</button></div></form>`;
    }else if(mode==='region-board'){
      const regions=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
      const boards=data.distributionBoards.filter(b=>!reportState.regionId||String(b.regionId)===String(reportState.regionId)).map(b=>({value:b.id,label:`${b.name||'لوحة'} — ${b.boardNumber||''}`}));
      body=`<form id="reportConfigForm" data-mode="region-board"><div class="form-grid">${pickerField('reportRegionId','اسم المنطقة',regions,reportState.regionId,'اختر المنطقة')}${pickerField('reportBoardId','لوحة التوزيع',boards,reportState.boardId,boards.length?'اختر اللوحة':'اختر المنطقة أولاً')}${configDateFields()}</div><div class="report-generate-actions"><button class="primary-btn" type="submit">${icon('report')} إنشاء التقرير</button></div></form>`;
    }else if(mode==='subscribers'){
      body=`<div class="subscriber-select-toolbar"><div class="list-search"><span>${icon('search')}</span><input id="reportSubscriberSearch" type="search" placeholder="بحث عن مشترك بالاسم أو الهاتف..." value="${esc(reportState.search||'')}"></div><button class="secondary-btn compact" data-report-select-all type="button">تحديد الكل</button><button class="secondary-btn compact" data-report-clear-all type="button">إلغاء الكل</button></div><div class="form-grid report-period-inline">${configDateFields()}</div><div id="reportSubscriberChoices" class="report-subscriber-choices"></div><div class="report-generate-actions"><button class="primary-btn" data-generate-selected-report type="button">${icon('report')} إنشاء التقرير للمحدد</button></div>`;
    }
    $('#mainContent').innerHTML=`<div class="page-head"><div>${reportBackButton('commands')}<h1 style="margin-top:12px">خيارات ${reportTypes[reportState.type].title}</h1><p>${mode==='opening'?'من الفترة الافتتاحية إلى اليوم':'حدد الخيارات المطلوبة ثم أنشئ التقرير.'}</p></div></div>${body}`;
    if(mode==='subscribers')renderSubscriberChoices();
  }
  function renderSubscriberChoices(){
    const root=$('#reportSubscriberChoices');if(!root)return;const q=(reportState.search||'').trim().toLowerCase(),selected=new Set(reportState.subscriberIds.map(String));
    const rows=data.subscribers.filter(s=>!q||`${s.name||''} ${fullPhone(s)||''}`.toLowerCase().includes(q));
    root.innerHTML=rows.length?rows.map(s=>`<label class="report-subscriber-choice"><input type="checkbox" data-report-subscriber-check value="${s.id}" ${selected.has(String(s.id))?'checked':''}><span class="subscriber-avatar small">${esc((s.name||'م').trim().charAt(0))}</span><span><strong>${esc(s.name||'بدون اسم')}</strong><small>${esc(fullPhone(s)||'بدون هاتف')}</small></span></label>`).join(''):'<div class="empty">لا يوجد مشتركون مطابقون للبحث.</div>';
  }
  function reportMeterLine(ms){return `<div class="report-meter-line"><div><strong>${esc(ms.m.label||'عداد')} • ${esc(ms.m.meterNumber||'—')}</strong><small>${esc(regionBy(ms.m.regionId).name||'بدون منطقة')} • ${esc(boardBy(ms.m.boardId).name||'بدون لوحة')}</small></div><div class="report-meter-stats"><span>افتتاحية<b>${num(ms.openingReading)} KW</b><em>${fmtDate(ms.openingDate)}</em></span><span>الأخيرة<b>${num(ms.lastReading)} KW</b><em>${fmtDate(ms.lastDate)}</em></span><span>الاستهلاك<b>${num(ms.consumption)} KW</b></span></div></div>`}
  function reportSubscriberCard(x,simple=false){
    if(simple)return `<article class="report-result-card simple"><div class="report-card-title"><div><strong>${esc(x.s.name)}</strong><small>${esc(fullPhone(x.s)||'بدون هاتف')}</small></div><span class="badge ${x.balance>0?'warn':x.balance<0?'good':''}">${x.balance>0?'عليه':x.balance<0?'له':'متوازن'} ${money(Math.abs(x.balance))}</span></div><div class="profile-data-grid"><span>العنوان<b>${esc(x.s.address||'—')}</b></span><span>المبلغ المستحق عليه<b>${money(x.dueFrom)}</b></span><span>المبلغ المستحق له<b>${money(x.dueTo)}</b></span></div></article>`;
    return `<article class="report-result-card"><div class="report-card-title"><div><strong>${esc(x.s.name)}</strong><small>${esc(fullPhone(x.s)||'بدون هاتف')} • ${esc(x.s.address||'بدون عنوان')}</small></div><span class="badge ${x.balance>0?'warn':x.balance<0?'good':''}">${x.balance>0?'مستحق عليه':x.balance<0?'مستحق له':'متوازن'} ${money(Math.abs(x.balance))}</span></div><div class="report-sub-summary"><span>إجمالي الاستهلاك<b>${num(x.consumption)} KW</b></span><span>متوسط سعر KW<b>${money(x.avg)}</b></span><span>إجمالي ثمن الكهرباء<b>${money(x.billed)}</b></span><span>إجمالي المدفوع<b>${money(x.paid)}</b></span><span>المستحق عليه<b>${money(x.dueFrom)}</b></span><span>المستحق له<b>${money(x.dueTo)}</b></span></div><div class="report-meter-list">${x.meterSnaps.length?x.meterSnaps.map(reportMeterLine).join(''):'<div class="empty compact-empty">لا يوجد عداد مطابق لشروط التقرير.</div>'}</div></article>`;
  }
  function renderReportResult(){
    detail={kind:'subscriber-report-result',reportType:reportState.type};setPageTitle('نتيجة التقرير');const rows=eligibleSubscribers(),sum=reportSummary(rows),type=reportTypes[reportState.type];
    const periodLabel=`${fmtDate(reportState.from)} ← ${fmtDate(reportState.to)}`;
    $('#mainContent').innerHTML=`<div class="page-head"><div>${reportBackButton('commands')}<h1 style="margin-top:12px">${type.title}</h1><p>${periodLabel}${reportState.regionId?` • ${esc(regionBy(reportState.regionId).name||'')}`:''}${reportState.boardId?` • ${esc(boardBy(reportState.boardId).name||'')}`:''}</p></div><div class="head-meta">${rows.length} مشترك</div></div><div class="report-result-controls"><label><span>من</span><input id="reportResultFrom" type="date" value="${esc(reportState.from)}"></label><label><span>إلى</span><input id="reportResultTo" type="date" value="${esc(reportState.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="reportResultSearch" type="search" value="${esc(reportState.search||'')}" placeholder="بحث في التقرير..."></div><button class="sort-btn" data-report-result-sort type="button">${icon('sort')}<span>ترتيب</span></button></div><div class="report-summary-cards"><div><small>إجمالي المشتركين</small><strong>${sum.count}</strong></div><div><small>إجمالي المبلغ المستحق منهم</small><strong>${money(sum.dueFrom)}</strong></div><div><small>إجمالي المبلغ المدفوع</small><strong>${money(sum.paid)}</strong></div><div><small>إجمالي المبلغ المتبقي لهم</small><strong>${money(sum.dueTo)}</strong></div><div><small>إجمالي استهلاك الكهرباء</small><strong>${num(sum.consumption)} KW</strong></div><div><small>متوسط سعر KW</small><strong>${money(sum.avg)}</strong></div></div><div class="cards-list report-results-list">${rows.length?rows.map(x=>reportSubscriberCard(x,reportState.type==='subscriber-data')).join(''):'<div class="empty">لا توجد بيانات مطابقة لشروط التقرير.</div>'}</div>`;
  }
  function openReportSort(){
    openModal('ترتيب التقرير',`<div class="picker-options"><button class="picker-option ${reportState.sort==='amount-desc'?'selected':''}" data-report-sort-value="amount-desc" type="button">القيمة: الأعلى أولاً</button><button class="picker-option ${reportState.sort==='amount-asc'?'selected':''}" data-report-sort-value="amount-asc" type="button">القيمة: الأقل أولاً</button><button class="picker-option ${reportState.sort==='date-desc'?'selected':''}" data-report-sort-value="date-desc" type="button">التاريخ: الأحدث أولاً</button><button class="picker-option ${reportState.sort==='date-asc'?'selected':''}" data-report-sort-value="date-asc" type="button">التاريخ: الأقدم أولاً</button></div>`);
  }

  renderReports=function(){
    setPageTitle('التقارير');const s=stats();
    const items=[['subscribers','تقارير المشتركين',`${data.subscribers.length} مشترك`,'users'],['invoices','تقرير الفواتير',money(s.invoiceTotal),'receipt'],['flows','تقرير التدفقات المالية',money(s.flows),'wallet'],['accounts','تقرير الحسابات',money(s.totalAccounts),'bank'],['expenses','تقرير المصروفات',money(s.expenses),'expense'],['consumption','تقرير استهلاك الكهرباء',`${num(s.consumption)} kW`,'meter']];
    $('#mainContent').innerHTML=`${pageHead('التقارير','إنشاء تقارير تفصيلية حسب الفترة والمنطقة والمشترك')}<div class="report-main-grid">${items.map(([id,t,v,ic])=>`<button class="report-main-card" data-report-main="${id}" type="button"><span class="report-menu-icon">${icon(ic)}</span><span><strong>${t}</strong><small>${v}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
  };
  const prevRender=render;
  render=function(){
    if(detail?.kind==='subscriber-reports-menu'){renderNav();renderSubscriberReportsMenu();hydrateIcons();renderFab();return;}
    if(detail?.kind==='subscriber-report-commands'){renderNav();renderReportCommands(detail.reportType);hydrateIcons();renderFab();return;}
    if(detail?.kind==='subscriber-report-config'){renderNav();renderReportConfig(detail.mode);hydrateIcons();renderFab();return;}
    if(detail?.kind==='subscriber-report-result'){renderNav();renderReportResult();hydrateIcons();renderFab();return;}
    return prevRender();
  };
  const prevPickerChange=handlePickerChange;
  handlePickerChange=function(name,value){
    prevPickerChange(name,value);
    if(name==='reportRegionId'){
      reportState.regionId=value;reportState.boardId='';
      const form=$('#reportConfigForm');if(form&&form.dataset.mode==='region-board'){
        const hidden=form.querySelector('[name=reportBoardId]'),btn=hidden?.closest('.field')?.querySelector('[data-picker]');
        if(btn){const cfg=pickers.get(btn.dataset.picker);if(cfg){cfg.items=data.distributionBoards.filter(b=>String(b.regionId)===String(value)).map(b=>({value:b.id,label:`${b.name||'لوحة'} — ${b.boardNumber||''}`}));hidden.value='';btn.querySelector('b').textContent=cfg.items.length?'اختر اللوحة':'لا توجد لوحات في هذه المنطقة';}}
      }
    }
    if(name==='reportBoardId')reportState.boardId=value;
  };
  const prevSubmit=handleSubmit;
  handleSubmit=async function(form,submitter=null){
    if(form.id==='reportConfigForm'){
      const fd=new FormData(form),o=Object.fromEntries(fd.entries());reportState.from=o.reportFrom||reportToday();reportState.to=o.reportTo||reportToday();reportState.regionId=o.reportRegionId||'';reportState.boardId=o.reportBoardId||'';reportState.subscriberIds=[];reportState.search='';
      if(new Date(reportState.from)>new Date(reportState.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');
      if(form.dataset.mode==='region'&&!reportState.regionId)return toast('اختر المنطقة','تنبيه');
      if(form.dataset.mode==='region-board'&&(!reportState.regionId||!reportState.boardId))return toast('اختر المنطقة ولوحة التوزيع','تنبيه');
      renderReportResult();hydrateIcons();return;
    }
    return prevSubmit(form,submitter);
  };
  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const main=e.target.closest('[data-report-main]');if(main&&main.dataset.reportMain==='subscribers'){e.preventDefault();e.stopPropagation();reportState.search='';reportState.subscriberIds=[];renderSubscriberReportsMenu();hydrateIcons();renderFab();return;}
    const type=e.target.closest('[data-subscriber-report-type]');if(type){e.preventDefault();e.stopPropagation();reportState.type=type.dataset.subscriberReportType;reportState.regionId='';reportState.boardId='';reportState.subscriberIds=[];reportState.search='';renderReportCommands(reportState.type);hydrateIcons();renderFab();return;}
    const cmd=e.target.closest('[data-report-command]');if(cmd){e.preventDefault();e.stopPropagation();const mode=cmd.dataset.reportCommand;reportState.mode=mode;reportState.regionId='';reportState.boardId='';reportState.subscriberIds=[];reportState.search='';if(mode==='opening'){resetReportRange(true);renderReportResult();}else{resetReportRange(false);renderReportConfig(mode);}hydrateIcons();renderFab();return;}
    const back=e.target.closest('[data-report-back]');if(back){e.preventDefault();e.stopPropagation();const t=back.dataset.reportBack;if(t==='reports'){detail=null;currentPage='reports';render();}else if(t==='subscriber-menu')renderSubscriberReportsMenu();else renderReportCommands(reportState.type);hydrateIcons();renderFab();return;}
    if(e.target.closest('[data-report-select-all]')){e.preventDefault();e.stopPropagation();const q=(reportState.search||'').trim().toLowerCase();const ids=data.subscribers.filter(s=>!q||`${s.name||''} ${fullPhone(s)||''}`.toLowerCase().includes(q)).map(s=>String(s.id));reportState.subscriberIds=[...new Set([...reportState.subscriberIds.map(String),...ids])];renderSubscriberChoices();return;}
    if(e.target.closest('[data-report-clear-all]')){e.preventDefault();e.stopPropagation();reportState.subscriberIds=[];renderSubscriberChoices();return;}
    if(e.target.closest('[data-generate-selected-report]')){e.preventDefault();e.stopPropagation();const f=$('#reportResultFrom')?.value||$('#mainContent [name=reportFrom]')?.value,tt=$('#reportResultTo')?.value||$('#mainContent [name=reportTo]')?.value;if(f)reportState.from=f;if(tt)reportState.to=tt;if(!reportState.subscriberIds.length)return toast('اختر مشتركاً واحداً على الأقل','تنبيه');renderReportResult();hydrateIcons();renderFab();return;}
    if(e.target.closest('[data-report-result-sort]')){e.preventDefault();e.stopPropagation();openReportSort();return;}
    const sv=e.target.closest('[data-report-sort-value]');if(sv){e.preventDefault();e.stopPropagation();reportState.sort=sv.dataset.reportSortValue;closeModal();renderReportResult();hydrateIcons();renderFab();return;}
  },true);
  document.addEventListener('input',e=>{
    if(e.target.id==='reportSubscriberSearch'){reportState.search=e.target.value;renderSubscriberChoices();}
    if(e.target.id==='reportResultSearch'){reportState.search=e.target.value;renderReportResult();hydrateIcons();}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-report-subscriber-check]')){const id=String(e.target.value),set=new Set(reportState.subscriberIds.map(String));if(e.target.checked)set.add(id);else set.delete(id);reportState.subscriberIds=[...set];}
    if(e.target.id==='reportResultFrom'){reportState.from=e.target.value;renderReportResult();hydrateIcons();}
    if(e.target.id==='reportResultTo'){reportState.to=e.target.value;renderReportResult();hydrateIcons();}
    if(e.target.name==='reportFrom')reportState.from=e.target.value;
    if(e.target.name==='reportTo')reportState.to=e.target.value;
  });
})();


/* ==== v14 invoice reports ==== */
(function(){
  const invoiceReportState={
    type:'invoice-general',mode:'opening',from:'',to:'',regionId:'',boardId:'',subscriberIds:[],search:'',sort:'date-desc'
  };
  const invoiceReportTypes={
    'invoice-general':{title:'تقرير الفواتير العام',desc:'إجماليات الفواتير والاستهلاك والمدفوع والمتبقي',icon:'receipt'},
    'invoice-detailed':{title:'تقرير الفواتير المفصل',desc:'تفاصيل كل فاتورة والعداد والقراءات والدفع',icon:'report'},
    'invoice-statement':{title:'كشف حساب المشتركين',desc:'الفواتير والدفعات والرصيد لكل مشترك',icon:'users'}
  };
  function irToday(){return dateOnly(new Date())}
  function irDateMs(v,end=false){
    if(!v)return end?Infinity:-Infinity;
    return new Date(`${String(v).slice(0,10)}T${end?'23:59:59.999':'00:00:00'}`).getTime();
  }
  function irInRange(v){const t=new Date(v||0).getTime();return t>=irDateMs(invoiceReportState.from,false)&&t<=irDateMs(invoiceReportState.to,true)}
  function irEarliest(){
    const vals=[];
    data.meters.forEach(x=>(x.openingDate||x.createdAt)&&vals.push(x.openingDate||x.createdAt));
    data.invoices.forEach(x=>(x.date||x.periodTo||x.createdAt)&&vals.push(x.date||x.periodTo||x.createdAt));
    data.movements.forEach(x=>(x.date||x.createdAt)&&vals.push(x.date||x.createdAt));
    if(!vals.length)return irToday();
    vals.sort((a,b)=>new Date(a)-new Date(b));return dateOnly(vals[0]);
  }
  function irReset(opening=true){invoiceReportState.from=opening?irEarliest():irToday();invoiceReportState.to=irToday()}
  function irBack(target='reports'){return `<button class="secondary-btn compact" data-invoice-report-back="${target}" type="button">${icon('back')} رجوع</button>`}
  function irPeriodLabel(){return `${fmtDate(invoiceReportState.from)} ← ${fmtDate(invoiceReportState.to)}`}
  function irMeterAllowed(m){
    if(!m||!m.id)return false;
    if(invoiceReportState.regionId&&String(m.regionId)!==String(invoiceReportState.regionId))return false;
    if(invoiceReportState.boardId&&String(m.boardId)!==String(invoiceReportState.boardId))return false;
    return true;
  }
  function irSubscriberAllowed(id){
    if(!invoiceReportState.subscriberIds.length)return true;
    return new Set(invoiceReportState.subscriberIds.map(String)).has(String(id));
  }
  function irBaseInvoices(){
    return data.invoices.filter(i=>{
      if(!irInRange(i.date||i.periodTo||i.createdAt))return false;
      if(!irSubscriberAllowed(i.subscriberId))return false;
      const m=meterBy(i.meterId);
      return irMeterAllowed(m);
    }).map(i=>({i,s:subscriberBy(i.subscriberId),m:meterBy(i.meterId)}));
  }
  function irPaymentAllocation(baseRows){
    const map=new Map(),bySub=new Map();
    baseRows.forEach(r=>{const k=String(r.i.subscriberId);if(!bySub.has(k))bySub.set(k,[]);bySub.get(k).push(r)});
    bySub.forEach((rows,subId)=>{
      rows.sort((a,b)=>new Date(a.i.date||a.i.periodTo||0)-new Date(b.i.date||b.i.periodTo||0));
      const moves=data.movements.filter(m=>String(m.subscriberId||'')===String(subId)&&irInRange(m.date||m.createdAt));
      const collections=moves.filter(m=>movementType(m)==='collection').reduce((a,m)=>a+Number(m.amount||0),0);
      const sends=moves.filter(m=>movementType(m)==='send').reduce((a,m)=>a+Number(m.amount||0),0);
      let credit=Math.max(0,collections-sends);
      rows.forEach(r=>{const total=invoiceNet(r.i),paid=Math.max(0,Math.min(total,credit));credit=Math.max(0,credit-paid);map.set(String(r.i.id),paid)});
    });
    return map;
  }
  function irEligibleInvoices(){
    const base=irBaseInvoices(),paidMap=irPaymentAllocation(base);
    let rows=base.map(r=>({...r,paid:Number(paidMap.get(String(r.i.id))||0),remaining:Math.max(0,invoiceNet(r.i)-Number(paidMap.get(String(r.i.id))||0))}));
    const q=(invoiceReportState.search||'').trim().toLowerCase();
    if(q)rows=rows.filter(r=>`${r.s.name||''} ${fullPhone(r.s)||''} ${r.m.label||''} ${r.m.meterNumber||''} ${r.i.id||''}`.toLowerCase().includes(q));
    if(invoiceReportState.sort==='amount-desc')rows.sort((a,b)=>invoiceNet(b.i)-invoiceNet(a.i));
    else if(invoiceReportState.sort==='amount-asc')rows.sort((a,b)=>invoiceNet(a.i)-invoiceNet(b.i));
    else if(invoiceReportState.sort==='date-asc')rows.sort((a,b)=>new Date(a.i.date||a.i.periodTo||0)-new Date(b.i.date||b.i.periodTo||0));
    else rows.sort((a,b)=>new Date(b.i.date||b.i.periodTo||0)-new Date(a.i.date||a.i.periodTo||0));
    return rows;
  }
  function irInvoiceSummary(rows){
    const consumption=rows.reduce((a,r)=>a+Number(r.i.consumption||0),0),total=rows.reduce((a,r)=>a+invoiceNet(r.i),0),paid=rows.reduce((a,r)=>a+Number(r.paid||0),0);
    return {count:rows.length,consumption,total,paid,remaining:Math.max(0,total-paid),avg:consumption?total/consumption:0};
  }
  function irReportTypeCard(type){const x=invoiceReportTypes[type];return `<button class="report-menu-card" data-invoice-report-type="${type}" type="button"><span class="report-menu-icon">${icon(x.icon)}</span><span><strong>${x.title}</strong><small>${x.desc}</small></span><b>${icon('chevron')}</b></button>`}
  function renderInvoiceReportsMenu(){
    detail={kind:'invoice-reports-menu'};setPageTitle('تقارير الفواتير');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${irBack('reports')}<h1 style="margin-top:12px">تقارير الفواتير</h1><p>اختر نوع تقرير الفواتير المطلوب.</p></div><div class="head-meta">${data.invoices.length} فاتورة</div></div><div class="report-menu-list">${Object.keys(invoiceReportTypes).map(irReportTypeCard).join('')}</div>`;
  }
  function irCommandCard(mode,title,desc,ic){return `<button class="report-command-card" data-invoice-report-command="${mode}" type="button"><span>${icon(ic)}</span><div><strong>${title}</strong><small>${desc}</small></div>${icon('chevron')}</button>`}
  function renderInvoiceReportCommands(type){
    invoiceReportState.type=type||invoiceReportState.type;detail={kind:'invoice-report-commands',reportType:invoiceReportState.type};setPageTitle('إنشاء التقرير');const t=invoiceReportTypes[invoiceReportState.type];
    $('#mainContent').innerHTML=`<div class="page-head"><div>${irBack('invoice-menu')}<h1 style="margin-top:12px">${t.title}</h1><p>اختر طريقة إنشاء التقرير.</p></div></div><div class="report-command-grid">${irCommandCard('opening','من الفترة الافتتاحية إلى اليوم','من أول قراءة أو فاتورة مسجلة حتى اليوم','clock')}${irCommandCard('range','حسب فلترة زمنية','اختيار فترة زمنية من وإلى','calendar')}${irCommandCard('region','حسب المنطقة','اختيار المنطقة والفترة الزمنية','mapPin')}${irCommandCard('region-board','حسب المنطقة ولوحة التوزيع','اختيار المنطقة ولوحة التوزيع والفترة','panel')}${irCommandCard('subscribers','مشترك واحد أو عدة مشتركين','اختيار المشتركين المستهدفين في التقرير','users')}</div>`;
  }
  function irDateFields(){return `${inputField('invoiceReportFrom','من تاريخ','date',invoiceReportState.from||irToday(),'')}${inputField('invoiceReportTo','إلى تاريخ','date',invoiceReportState.to||irToday(),'')}`}
  function renderInvoiceReportConfig(mode){
    invoiceReportState.mode=mode;detail={kind:'invoice-report-config',reportType:invoiceReportState.type,mode};setPageTitle('خيارات تقرير الفواتير');if(!invoiceReportState.from||!invoiceReportState.to)irReset(mode==='opening');let body='';
    if(mode==='range')body=`<form id="invoiceReportConfigForm" data-mode="range"><div class="form-grid">${irDateFields()}</div><div class="report-generate-actions"><button class="primary-btn" type="submit">${icon('report')} إنشاء التقرير</button></div></form>`;
    else if(mode==='region'){
      const items=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`}));
      body=`<form id="invoiceReportConfigForm" data-mode="region"><div class="form-grid">${pickerField('invoiceReportRegionId','اسم المنطقة',items,invoiceReportState.regionId,'اختر المنطقة')}${irDateFields()}</div><div class="report-generate-actions"><button class="primary-btn" type="submit">${icon('report')} إنشاء التقرير</button></div></form>`;
    }else if(mode==='region-board'){
      const regions=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`})),boards=data.distributionBoards.filter(b=>!invoiceReportState.regionId||String(b.regionId)===String(invoiceReportState.regionId)).map(b=>({value:b.id,label:`${b.name||'لوحة'} — ${b.boardNumber||''}`}));
      body=`<form id="invoiceReportConfigForm" data-mode="region-board"><div class="form-grid">${pickerField('invoiceReportRegionId','اسم المنطقة',regions,invoiceReportState.regionId,'اختر المنطقة')}${pickerField('invoiceReportBoardId','لوحة التوزيع',boards,invoiceReportState.boardId,boards.length?'اختر اللوحة':'اختر المنطقة أولاً')}${irDateFields()}</div><div class="report-generate-actions"><button class="primary-btn" type="submit">${icon('report')} إنشاء التقرير</button></div></form>`;
    }else if(mode==='subscribers'){
      body=`<div class="subscriber-select-toolbar"><div class="list-search"><span>${icon('search')}</span><input id="invoiceReportSubscriberSearch" type="search" placeholder="بحث عن مشترك بالاسم أو الهاتف..." value="${esc(invoiceReportState.search||'')}"></div><button class="secondary-btn compact" data-invoice-report-select-all type="button">تحديد الكل</button><button class="secondary-btn compact" data-invoice-report-clear-all type="button">إلغاء الكل</button></div><div class="form-grid report-period-inline">${irDateFields()}</div><div id="invoiceReportSubscriberChoices" class="report-subscriber-choices"></div><div class="report-generate-actions"><button class="primary-btn" data-generate-invoice-selected-report type="button">${icon('report')} إنشاء التقرير للمحدد</button></div>`;
    }
    $('#mainContent').innerHTML=`<div class="page-head"><div>${irBack('invoice-commands')}<h1 style="margin-top:12px">خيارات ${invoiceReportTypes[invoiceReportState.type].title}</h1><p>حدد الخيارات المطلوبة ثم أنشئ التقرير.</p></div></div>${body}`;
    if(mode==='subscribers')renderInvoiceSubscriberChoices();
  }
  function renderInvoiceSubscriberChoices(){
    const root=$('#invoiceReportSubscriberChoices');if(!root)return;const q=(invoiceReportState.search||'').trim().toLowerCase(),selected=new Set(invoiceReportState.subscriberIds.map(String));
    const rows=data.subscribers.filter(s=>!q||`${s.name||''} ${fullPhone(s)||''}`.toLowerCase().includes(q));
    root.innerHTML=rows.length?rows.map(s=>`<label class="report-subscriber-choice"><input type="checkbox" data-invoice-report-subscriber-check value="${s.id}" ${selected.has(String(s.id))?'checked':''}><span class="subscriber-avatar small">${esc((s.name||'م').trim().charAt(0))}</span><span><strong>${esc(s.name||'بدون اسم')}</strong><small>${esc(fullPhone(s)||'بدون هاتف')}</small></span></label>`).join(''):'<div class="empty">لا يوجد مشتركون مطابقون للبحث.</div>';
  }
  function irSummaryCards(sum){
    return `<div class="report-summary-cards invoice-report-summary"><div><small>عدد الفواتير الإجمالي</small><strong>${sum.count}</strong></div><div><small>إجمالي استهلاك الكهرباء</small><strong>${num(sum.consumption)} KW</strong></div><div><small>متوسط سعر KW</small><strong>${money(sum.avg)}</strong></div><div><small>إجمالي قيمة الفواتير</small><strong>${money(sum.total)}</strong></div><div><small>إجمالي المبلغ المدفوع</small><strong>${money(sum.paid)}</strong></div><div><small>إجمالي المبلغ المتبقي</small><strong>${money(sum.remaining)}</strong></div></div>`;
  }
  function irControls(){
    return `<div class="report-result-controls"><label><span>من</span><input id="invoiceReportResultFrom" type="date" value="${esc(invoiceReportState.from)}"></label><label><span>إلى</span><input id="invoiceReportResultTo" type="date" value="${esc(invoiceReportState.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="invoiceReportResultSearch" type="search" value="${esc(invoiceReportState.search||'')}" placeholder="بحث بالاسم أو الهاتف أو العداد..."></div><button class="sort-btn" data-invoice-report-result-sort type="button">${icon('sort')}<span>ترتيب</span></button></div>`;
  }
  function irInvoiceCard(r){
    const i=r.i,m=r.m,s=r.s;
    return `<article data-invoice="${esc(i.id)}" class="invoice-report-card"><div class="report-card-title"><div><strong>${esc(s.name||'بدون اسم')}</strong><small>${esc(fullPhone(s)||'بدون هاتف')}</small></div><span class="badge">${fmtDate(i.date||i.periodTo)}</span></div><div class="invoice-report-meter"><strong>${esc(m.label||'عداد')} • ${esc(m.meterNumber||'—')}</strong></div><div class="invoice-report-details"><span>القراءة السابقة<b>${num(i.openingReading||0)} KW</b><em>${fmtDate(i.periodFrom||m.openingDate||i.date)}</em></span><span>القراءة الحالية<b>${num(i.closingReading||0)} KW</b><em>${fmtDate(i.date||i.periodTo)}</em></span><span>الاستهلاك<b>${num(i.consumption||0)} KW</b></span><span>سعر الكيلو<b>${money(i.unitPrice||0)}</b></span><span>الخصم<b>${money(i.discount||0)}</b></span><span>مبلغ الفاتورة<b>${money(invoiceNet(i))}</b></span><span>المبلغ المدفوع<b>${money(r.paid)}</b></span><span>المبلغ المتبقي<b>${money(r.remaining)}</b></span></div></article>`;
  }
  function irStatementMeters(subId,invRows){
    const meterIds=new Set(invRows.map(r=>String(r.m.id))),meters=data.meters.filter(m=>String(m.subscriberId)===String(subId)&&irMeterAllowed(m)&&(meterIds.size?meterIds.has(String(m.id)):true));
    return meters.map(m=>{
      const inv=invRows.filter(r=>String(r.m.id)===String(m.id)).sort((a,b)=>new Date(a.i.date||0)-new Date(b.i.date||0));
      const first=inv[0]?.i,last=inv[inv.length-1]?.i;
      return {m,opening:Number(first?.openingReading??m.openingReading??0),openingDate:first?.periodFrom||m.openingDate||'',last:Number(last?.closingReading??m.lastReading??m.openingReading??0),lastDate:last?.date||last?.periodTo||m.lastReadingDate||m.openingDate||''};
    });
  }
  function irStatementRows(){
    const base=irEligibleInvoices();const bySub=new Map();base.forEach(r=>{const k=String(r.s.id);if(!bySub.has(k))bySub.set(k,[]);bySub.get(k).push(r)});
    let candidates=data.subscribers.filter(s=>irSubscriberAllowed(s.id));
    if(invoiceReportState.regionId||invoiceReportState.boardId)candidates=candidates.filter(s=>data.meters.some(m=>String(m.subscriberId)===String(s.id)&&irMeterAllowed(m)));
    let rows=candidates.map(s=>{
      const inv=bySub.get(String(s.id))||[];
      const moves=data.movements.filter(m=>String(m.subscriberId||'')===String(s.id)&&irInRange(m.date||m.createdAt)&&['collection','send'].includes(movementType(m))).sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));
      const paid=moves.filter(m=>movementType(m)==='collection').reduce((a,m)=>a+Number(m.amount||0),0),sent=moves.filter(m=>movementType(m)==='send').reduce((a,m)=>a+Number(m.amount||0),0),billed=inv.reduce((a,r)=>a+invoiceNet(r.i),0),consumption=inv.reduce((a,r)=>a+Number(r.i.consumption||0),0),balance=billed-paid+sent,meters=irStatementMeters(s.id,inv);
      const opening=meters.reduce((a,x)=>a+x.opening,0),last=meters.reduce((a,x)=>a+x.last,0),openingDates=meters.map(x=>x.openingDate).filter(Boolean).sort((a,b)=>new Date(a)-new Date(b)),lastDates=meters.map(x=>x.lastDate).filter(Boolean).sort((a,b)=>new Date(b)-new Date(a)),dates=[...inv.map(r=>r.i.date||r.i.periodTo),...moves.map(m=>m.date||m.createdAt)].filter(Boolean).sort((a,b)=>new Date(b)-new Date(a));
      return {s,inv,moves,meters,opening,openingDate:openingDates[0]||'',last,lastDate:lastDates[0]||'',consumption,billed,paid,sent,balance,avg:consumption?billed/consumption:0,lastActivity:dates[0]||s.createdAt||''};
    });
    if(!invoiceReportState.subscriberIds.length)rows=rows.filter(x=>x.inv.length||x.moves.length);
    const q=(invoiceReportState.search||'').trim().toLowerCase();if(q)rows=rows.filter(x=>`${x.s.name||''} ${fullPhone(x.s)||''} ${x.inv.map(r=>r.m.label+' '+r.m.meterNumber).join(' ')}`.toLowerCase().includes(q));
    if(invoiceReportState.sort==='amount-desc')rows.sort((a,b)=>Math.abs(b.balance)-Math.abs(a.balance));else if(invoiceReportState.sort==='amount-asc')rows.sort((a,b)=>Math.abs(a.balance)-Math.abs(b.balance));else if(invoiceReportState.sort==='date-asc')rows.sort((a,b)=>new Date(a.lastActivity||0)-new Date(b.lastActivity||0));else rows.sort((a,b)=>new Date(b.lastActivity||0)-new Date(a.lastActivity||0));
    return rows;
  }
  function irStatementInvoiceCard(r){
    const i=r.i,m=r.m;
    return `<div data-invoice="${esc(i.id)}" class="statement-invoice-card"><div class="statement-row-head"><strong>${fmtDate(i.date||i.periodTo)}</strong><span>${esc(m.label||'عداد')} • ${esc(m.meterNumber||'—')}</span></div><div class="statement-mini-grid"><span>القراءة السابقة<b>${num(i.openingReading||0)} KW</b><em>${fmtDate(i.periodFrom||m.openingDate)}</em></span><span>القراءة الحالية<b>${num(i.closingReading||0)} KW</b><em>${fmtDate(i.date||i.periodTo)}</em></span><span>الاستهلاك<b>${num(i.consumption||0)} KW</b></span><span>سعر KW<b>${money(i.unitPrice||0)}</b></span><span>الخصم<b>${money(i.discount||0)}</b></span><span>مبلغ الفاتورة<b>${money(invoiceNet(i))}</b></span></div></div>`;
  }
  function irPaymentCard(m){
    const incoming=movementType(m)==='collection',acc=accountBy(m.accountId);
    return `<div data-movement="${esc(m.id)}" class="statement-payment-card"><div class="statement-row-head"><strong>${fmtDateTime(m.date||m.createdAt)}</strong><span class="badge ${incoming?'good':'warn'}">${incoming?'دفعة مستلمة':'دفعة مرسلة'}</span></div><div class="statement-mini-grid"><span>قيمة الدفعة<b>${money(m.amount||0)}</b></span><span>${incoming?'الحساب المحول إليه':'الحساب المرسل منه'}<b>${esc(acc.name||'—')}</b></span><span class="statement-wide">ملاحظات الدفعة<b>${esc(m.notes||'—')}</b></span></div></div>`;
  }
  function irStatementCard(x){
    const balanceText=x.balance>0?`عليه ${money(x.balance)}`:x.balance<0?`له ${money(Math.abs(x.balance))}`:'متوازن';
    return `<article class="statement-report-card"><div class="statement-title"><div><strong>${esc(x.s.name)}</strong><small>${esc(fullPhone(x.s)||'بدون هاتف')}</small></div><span class="badge ${x.balance>0?'warn':x.balance<0?'good':''}">${balanceText}</span></div><div class="statement-summary"><span>القراءة الافتتاحية<b>${num(x.opening)} KW</b><em>${fmtDate(x.openingDate)}</em></span><span>القراءة الأخيرة<b>${num(x.last)} KW</b><em>${fmtDate(x.lastDate)}</em></span><span>إجمالي الاستهلاك<b>${num(x.consumption)} KW</b></span><span>متوسط سعر KW<b>${money(x.avg)}</b></span><span>إجمالي مبلغ الفواتير<b>${money(x.billed)}</b></span><span>إجمالي المبلغ المدفوع<b>${money(x.paid)}</b></span><span>المتبقي له أو عليه<b>${balanceText}</b></span></div><section class="statement-section"><div class="statement-section-title"><strong>الفواتير</strong><small>${x.inv.length} فاتورة</small></div><div class="statement-list">${x.inv.length?x.inv.map(irStatementInvoiceCard).join(''):'<div class="empty compact-empty">لا توجد فواتير في الفترة.</div>'}</div></section><section class="statement-section"><div class="statement-section-title"><strong>الدفعات</strong><small>${x.moves.length} حركة</small></div><div class="statement-payment-summary"><span>إجمالي المدفوع<b>${money(x.paid)}</b></span><span>إجمالي المرسل للمشترك<b>${money(x.sent)}</b></span><span>الرصيد الحالي<b>${balanceText}</b></span></div><div class="statement-list">${x.moves.length?x.moves.map(irPaymentCard).join(''):'<div class="empty compact-empty">لا توجد دفعات في الفترة.</div>'}</div></section></article>`;
  }
  function renderInvoiceReportResult(){
    detail={kind:'invoice-report-result',reportType:invoiceReportState.type};setPageTitle('نتيجة تقرير الفواتير');const type=invoiceReportTypes[invoiceReportState.type],period=irPeriodLabel();
    if(invoiceReportState.type==='invoice-statement'){
      const rows=irStatementRows();
      $('#mainContent').innerHTML=`<div class="page-head"><div>${irBack('invoice-commands')}<h1 style="margin-top:12px">${type.title}</h1><p>تاريخ التقرير: ${period}${invoiceReportState.regionId?` • ${esc(regionBy(invoiceReportState.regionId).name||'')}`:''}${invoiceReportState.boardId?` • ${esc(boardBy(invoiceReportState.boardId).name||'')}`:''}</p></div><div class="head-meta">${rows.length} مشترك</div></div>${irControls()}<div class="statement-results">${rows.length?rows.map(irStatementCard).join(''):'<div class="empty">لا توجد حسابات مطابقة لشروط التقرير.</div>'}</div>`;
      return;
    }
    const rows=irEligibleInvoices(),sum=irInvoiceSummary(rows);
    $('#mainContent').innerHTML=`<div class="page-head"><div>${irBack('invoice-commands')}<h1 style="margin-top:12px">${type.title}</h1><p>تاريخ التقرير: ${period}${invoiceReportState.regionId?` • ${esc(regionBy(invoiceReportState.regionId).name||'')}`:''}${invoiceReportState.boardId?` • ${esc(boardBy(invoiceReportState.boardId).name||'')}`:''}</p></div><div class="head-meta">${rows.length} فاتورة</div></div>${irControls()}${irSummaryCards(sum)}${invoiceReportState.type==='invoice-detailed'?`<div class="cards-list invoice-report-results">${rows.length?rows.map(irInvoiceCard).join(''):'<div class="empty">لا توجد فواتير مطابقة لشروط التقرير.</div>'}</div>`:`<section class="report-general-note"><span>${icon('receipt')}</span><div><strong>ملخص الفواتير للفترة المحددة</strong><small>تم احتساب الإجماليات من ${fmtDate(invoiceReportState.from)} إلى ${fmtDate(invoiceReportState.to)}.</small></div></section>`}`;
  }
  function openInvoiceReportSort(){
    openModal('ترتيب تقرير الفواتير',`<div class="picker-options"><button class="picker-option ${invoiceReportState.sort==='amount-desc'?'selected':''}" data-invoice-report-sort-value="amount-desc" type="button">القيمة: الأعلى أولاً</button><button class="picker-option ${invoiceReportState.sort==='amount-asc'?'selected':''}" data-invoice-report-sort-value="amount-asc" type="button">القيمة: الأقل أولاً</button><button class="picker-option ${invoiceReportState.sort==='date-desc'?'selected':''}" data-invoice-report-sort-value="date-desc" type="button">التاريخ: الأحدث أولاً</button><button class="picker-option ${invoiceReportState.sort==='date-asc'?'selected':''}" data-invoice-report-sort-value="date-asc" type="button">التاريخ: الأقدم أولاً</button></div>`);
  }

  // Main reports card: invoice report shows total invoice count, as requested.
  renderReports=function(){
    setPageTitle('التقارير');const s=stats();
    const items=[['subscribers','تقارير المشتركين',`${data.subscribers.length} مشترك`,'users'],['invoices','تقارير الفواتير',`${data.invoices.length} فاتورة`,'receipt'],['flows','تقرير التدفقات المالية',money(s.flows),'wallet'],['accounts','تقرير الحسابات',money(s.totalAccounts),'bank'],['expenses','تقرير المصروفات',money(s.expenses),'expense'],['consumption','تقرير استهلاك الكهرباء',`${num(s.consumption)} kW`,'meter']];
    $('#mainContent').innerHTML=`${pageHead('التقارير','إنشاء تقارير تفصيلية حسب الفترة والمنطقة والمشترك')}<div class="report-main-grid">${items.map(([id,t,v,ic])=>`<button class="report-main-card" data-report-main="${id}" type="button"><span class="report-menu-icon">${icon(ic)}</span><span><strong>${t}</strong><small>${v}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
  };

  const irPrevRender=render;
  render=function(){
    if(detail?.kind==='invoice-reports-menu'){renderNav();renderInvoiceReportsMenu();hydrateIcons();renderFab();return;}
    if(detail?.kind==='invoice-report-commands'){renderNav();renderInvoiceReportCommands(detail.reportType);hydrateIcons();renderFab();return;}
    if(detail?.kind==='invoice-report-config'){renderNav();renderInvoiceReportConfig(detail.mode);hydrateIcons();renderFab();return;}
    if(detail?.kind==='invoice-report-result'){renderNav();renderInvoiceReportResult();hydrateIcons();renderFab();return;}
    return irPrevRender();
  };
  const irPrevPicker=handlePickerChange;
  handlePickerChange=function(name,value){
    irPrevPicker(name,value);
    if(name==='invoiceReportRegionId'){
      invoiceReportState.regionId=value;invoiceReportState.boardId='';
      const form=$('#invoiceReportConfigForm');if(form&&form.dataset.mode==='region-board'){
        const hidden=form.querySelector('[name=invoiceReportBoardId]'),btn=hidden?.closest('.field')?.querySelector('[data-picker]');
        if(btn){const cfg=pickers.get(btn.dataset.picker);if(cfg){cfg.items=data.distributionBoards.filter(b=>String(b.regionId)===String(value)).map(b=>({value:b.id,label:`${b.name||'لوحة'} — ${b.boardNumber||''}`}));hidden.value='';btn.querySelector('b').textContent=cfg.items.length?'اختر اللوحة':'لا توجد لوحات في هذه المنطقة';}}
      }
    }
    if(name==='invoiceReportBoardId')invoiceReportState.boardId=value;
  };
  const irPrevSubmit=handleSubmit;
  handleSubmit=async function(form,submitter=null){
    if(form.id==='invoiceReportConfigForm'){
      const fd=new FormData(form),o=Object.fromEntries(fd.entries());invoiceReportState.from=o.invoiceReportFrom||irToday();invoiceReportState.to=o.invoiceReportTo||irToday();invoiceReportState.regionId=o.invoiceReportRegionId||'';invoiceReportState.boardId=o.invoiceReportBoardId||'';invoiceReportState.subscriberIds=[];invoiceReportState.search='';
      if(new Date(invoiceReportState.from)>new Date(invoiceReportState.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');
      if(form.dataset.mode==='region'&&!invoiceReportState.regionId)return toast('اختر المنطقة','تنبيه');
      if(form.dataset.mode==='region-board'&&(!invoiceReportState.regionId||!invoiceReportState.boardId))return toast('اختر المنطقة ولوحة التوزيع','تنبيه');
      renderInvoiceReportResult();hydrateIcons();return;
    }
    return irPrevSubmit(form,submitter);
  };
  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const main=e.target.closest('[data-report-main]');if(main&&main.dataset.reportMain==='invoices'){e.preventDefault();e.stopPropagation();invoiceReportState.search='';invoiceReportState.subscriberIds=[];invoiceReportState.regionId='';invoiceReportState.boardId='';renderInvoiceReportsMenu();hydrateIcons();renderFab();return;}
    const type=e.target.closest('[data-invoice-report-type]');if(type){e.preventDefault();e.stopPropagation();invoiceReportState.type=type.dataset.invoiceReportType;invoiceReportState.regionId='';invoiceReportState.boardId='';invoiceReportState.subscriberIds=[];invoiceReportState.search='';renderInvoiceReportCommands(invoiceReportState.type);hydrateIcons();renderFab();return;}
    const cmd=e.target.closest('[data-invoice-report-command]');if(cmd){e.preventDefault();e.stopPropagation();const mode=cmd.dataset.invoiceReportCommand;invoiceReportState.mode=mode;invoiceReportState.regionId='';invoiceReportState.boardId='';invoiceReportState.subscriberIds=[];invoiceReportState.search='';if(mode==='opening'){irReset(true);renderInvoiceReportResult();}else{irReset(false);renderInvoiceReportConfig(mode);}hydrateIcons();renderFab();return;}
    const back=e.target.closest('[data-invoice-report-back]');if(back){e.preventDefault();e.stopPropagation();const t=back.dataset.invoiceReportBack;if(t==='reports'){detail=null;currentPage='reports';render();}else if(t==='invoice-menu')renderInvoiceReportsMenu();else renderInvoiceReportCommands(invoiceReportState.type);hydrateIcons();renderFab();return;}
    if(e.target.closest('[data-invoice-report-select-all]')){e.preventDefault();e.stopPropagation();const q=(invoiceReportState.search||'').trim().toLowerCase(),ids=data.subscribers.filter(s=>!q||`${s.name||''} ${fullPhone(s)||''}`.toLowerCase().includes(q)).map(s=>String(s.id));invoiceReportState.subscriberIds=[...new Set([...invoiceReportState.subscriberIds.map(String),...ids])];renderInvoiceSubscriberChoices();return;}
    if(e.target.closest('[data-invoice-report-clear-all]')){e.preventDefault();e.stopPropagation();invoiceReportState.subscriberIds=[];renderInvoiceSubscriberChoices();return;}
    if(e.target.closest('[data-generate-invoice-selected-report]')){e.preventDefault();e.stopPropagation();const f=$('#mainContent [name=invoiceReportFrom]')?.value,tt=$('#mainContent [name=invoiceReportTo]')?.value;if(f)invoiceReportState.from=f;if(tt)invoiceReportState.to=tt;if(!invoiceReportState.subscriberIds.length)return toast('اختر مشتركاً واحداً على الأقل','تنبيه');renderInvoiceReportResult();hydrateIcons();renderFab();return;}
    if(e.target.closest('[data-invoice-report-result-sort]')){e.preventDefault();e.stopPropagation();openInvoiceReportSort();return;}
    const sv=e.target.closest('[data-invoice-report-sort-value]');if(sv){e.preventDefault();e.stopPropagation();invoiceReportState.sort=sv.dataset.invoiceReportSortValue;closeModal();renderInvoiceReportResult();hydrateIcons();renderFab();return;}
  },true);
  document.addEventListener('input',e=>{
    if(e.target.id==='invoiceReportSubscriberSearch'){invoiceReportState.search=e.target.value;renderInvoiceSubscriberChoices();}
    if(e.target.id==='invoiceReportResultSearch'){invoiceReportState.search=e.target.value;renderInvoiceReportResult();hydrateIcons();}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-invoice-report-subscriber-check]')){const id=String(e.target.value),set=new Set(invoiceReportState.subscriberIds.map(String));if(e.target.checked)set.add(id);else set.delete(id);invoiceReportState.subscriberIds=[...set];}
    if(e.target.id==='invoiceReportResultFrom'){invoiceReportState.from=e.target.value;renderInvoiceReportResult();hydrateIcons();}
    if(e.target.id==='invoiceReportResultTo'){invoiceReportState.to=e.target.value;renderInvoiceReportResult();hydrateIcons();}
    if(e.target.name==='invoiceReportFrom')invoiceReportState.from=e.target.value;
    if(e.target.name==='invoiceReportTo')invoiceReportState.to=e.target.value;
  });
})();


/* ==== v16 UI polish / theme / FAB direction ==== */
const UI_PREFS_KEY='AHMADI_UI_PREFS_V16';
const UI_ACCENTS={
  teal:{main:'#1d9f91',soft:'#62d5c7',rgb:'29,159,145'},
  blue:{main:'#3478c5',soft:'#79b9ff',rgb:'52,120,197'},
  violet:{main:'#7357c6',soft:'#a692ee',rgb:'115,87,198'},
  amber:{main:'#b9892e',soft:'#e4bd69',rgb:'185,137,46'},
  rose:{main:'#b84f68',soft:'#eb8ba2',rgb:'184,79,104'},
  green:{main:'#2f9663',soft:'#75c99b',rgb:'47,150,99'}
};
function getUiPrefs(){
  try{return {...{theme:'dark',accent:'teal'},...JSON.parse(localStorage.getItem(UI_PREFS_KEY)||'{}')}}catch(_){return {theme:'dark',accent:'teal'}}
}
function applyUiPrefs(prefs=getUiPrefs()){
  const theme=prefs.theme==='light'?'light':'dark',accent=UI_ACCENTS[prefs.accent]?prefs.accent:'teal',c=UI_ACCENTS[accent];
  document.documentElement.dataset.theme=theme;
  document.documentElement.dataset.accent=accent;
  document.documentElement.style.setProperty('--teal',c.main);
  document.documentElement.style.setProperty('--teal2',c.soft);
  document.documentElement.style.setProperty('--accent-rgb',c.rgb);
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='light'?'#f7f9fa':'#071a22';
}
function setUiPrefs(next){const prefs={...getUiPrefs(),...next};localStorage.setItem(UI_PREFS_KEY,JSON.stringify(prefs));applyUiPrefs(prefs);renderSettings();hydrateIcons();}
function uiThemeSettings(){
  const prefs=getUiPrefs();
  const swatches=[['teal','#1d9f91','تركوازي'],['blue','#3478c5','أزرق'],['violet','#7357c6','بنفسجي'],['amber','#b9892e','ذهبي'],['rose','#b84f68','وردي'],['green','#2f9663','أخضر']];
  return `<section class="ui-settings-card"><div class="ui-settings-head"><span class="ui-settings-icon">${icon('settings')}</span><div><strong>المظهر والألوان</strong><small>غيّر الوضع ولون الثيم مع ضبط التباين تلقائياً.</small></div></div><div class="theme-mode-switch"><button class="theme-mode-btn ${prefs.theme==='dark'?'active':''}" data-ui-theme="dark" type="button"><span>الوضع الليلي</span><small>داكن</small></button><button class="theme-mode-btn ${prefs.theme==='light'?'active':''}" data-ui-theme="light" type="button"><span>الوضع النهاري</span><small>أبيض احترافي</small></button></div><div class="accent-title">لون الثيم</div><div class="accent-swatches">${swatches.map(([id,color,label])=>`<button class="accent-swatch ${prefs.accent===id?'active':''}" data-ui-accent="${id}" type="button" aria-label="${label}"><i style="background:${color}"></i><span>${label}</span></button>`).join('')}</div></section>`;
}
renderSettings=function(){
  setPageTitle('الإعدادات');
  $('#mainContent').innerHTML=`${pageHead('الإعدادات','المظهر وإعدادات التطبيق على هذا الجهاز')}${uiThemeSettings()}<div class="settings-tools-grid"><section class="settings-tool-card"><span>${icon('download')}</span><div><strong>تثبيت التطبيق</strong><small>ثبّت التطبيق من Chrome للوصول السريع والعمل بصورة مستقلة.</small></div><button class="secondary-btn compact" data-action="install" type="button">تثبيت</button></section><section class="settings-tool-card"><span>${icon('refresh')}</span><div><strong>المزامنة</strong><small>التغييرات تحفظ محلياً فوراً وتتم مزامنتها عند توفر الإنترنت.</small></div><button class="secondary-btn compact" data-action="sync" type="button">تحديث الآن</button></section></div>`;
};

ICONS.card='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/>';
flowRow=function(m){
  const map={collection:['تحصيل دفعة','arrowDown','good'],send:['إرسال دفعة','arrowUp','bad'],expense:['مصروف','card','bad'],transfer:['تحويل أموال','transfer',''],deposit:['إيداع للحساب','arrowDown','good']};
  const mt=movementType(m),[l,ic,b]=map[mt]||['حركة','wallet',''];
  const who=m.subscriberId?subscriberBy(m.subscriberId).name:(mt==='transfer'?`${accountBy(m.fromAccountId||m.accountFromId).name} ← ${accountBy(m.toAccountId||m.accountToId).name}`:accountBy(m.accountId||m.accountToId||m.accountFromId).name);
  return `<article class="row-card flow-row flow-type-${mt}"><span class="row-icon flow-icon">${icon(ic)}</span><span class="flow-copy"><strong>${l}</strong><small>${esc(who)}</small><small>${fmtDateTime(m.date)}${m.notes?` • ${esc(m.notes)}`:''}</small></span><span class="row-amount"><strong>${['send','expense'].includes(mt)?'-':mt==='collection'?'+':''}${money(m.amount).replace(' ₪','')} ₪</strong><span class="badge ${b}">${l}</span>${typeof tinyEdit==='function'?tinyEdit('movement',m.id):''}</span></article>`;
};
function uiActionStrip(actions=[]){
  return `<div class="page-actions polished-actions">${actions.map(([a,l,ic])=>`<button class="secondary-btn compact action-${a}" data-action="${a}" type="button"><span class="action-icon">${icon(ic||'plus')}</span><span>${l}</span></button>`).join('')}</div>`;
}
renderFlows=function(){
  setPageTitle('التدفقات المالية');
  const inv=filtered('invoices'),mov=filtered('movements').filter(m=>['collection','send','expense','transfer','deposit'].includes(movementType(m)));
  const invoiceTotal=inv.reduce((s,i)=>s+invoiceNet(i),0),discount=inv.reduce((s,i)=>s+Number(i.discount||0),0),expenses=mov.filter(m=>movementType(m)==='expense').reduce((s,m)=>s+Number(m.amount||0),0),collections=mov.filter(m=>['collection','deposit'].includes(movementType(m))).reduce((s,m)=>s+Number(m.amount||0),0);
  const balances=data.subscribers.map(s=>subscriberBalanceScoped(s.id)),dueFrom=balances.reduce((s,b)=>s+Math.max(b,0),0),dueTo=balances.reduce((s,b)=>s+Math.max(-b,0),0),ownerEquity=invoiceTotal-expenses-dueTo,netFlow=invoiceTotal-expenses-dueFrom;
  const q=detailSearch.toLowerCase();let all=mov.filter(m=>!q||`${subscriberBy(m.subscriberId).name} ${m.notes||''} ${accountBy(m.accountId||m.fromAccountId||m.toAccountId).name}`.toLowerCase().includes(q));all=sortRows(all,'amount','date');const recent=all.slice(0,5);
  const acts=[];if(hasPerm('flows.collect'))acts.push(['collection','استقبال دفعة','arrowDown']);if(hasPerm('flows.send'))acts.push(['send','إرسال دفعة','arrowUp']);if(hasPerm('flows.expense'))acts.push(['expense','مصروف','card']);if(hasPerm('flows.transfer'))acts.push(['transfer','تحويل الأموال','transfer']);
  $('#mainContent').innerHTML=`${pageHead('التدفقات المالية','ملخص الفواتير والتحصيلات والمصروفات')}${uiActionStrip(acts)}${timeFilterHtml()}${listToolbar('بحث بالاسم أو المبلغ أو الملاحظات...')}<div class="metric-list finance-metrics">${metric('equity','حقوق الملكية',money(ownerEquity),'الفواتير - المصروفات - المستحق لهم','line',[invoiceTotal,expenses,dueTo,ownerEquity])}${metric('flows-net','صافي التدفق المالي',money(netFlow),'رأس المال - المصروفات - المستحق على المشتركين','line',[invoiceTotal,expenses,dueFrom,netFlow])}${metric('invoice-total','إجمالي ثمن الفواتير',money(invoiceTotal),'من الفترة المحددة','bars',inv.map(invoiceNet))}${metric('due-from','المستحق على المشتركين',money(dueFrom),'إجمالي الديون علينا التحصيل','line',balances.map(b=>Math.max(b,0)))}${metric('due-to','المستحق للمشتركين',money(dueTo),'أرصدة لصالح المشتركين','line',balances.map(b=>Math.max(-b,0)))}${metric('collected','إجمالي المبالغ المحصلة',money(collections),'التحصيلات المسجلة','bars',mov.filter(m=>['collection','deposit'].includes(movementType(m))).map(m=>Number(m.amount||0)))}${metric('expenses','إجمالي المصروفات',money(expenses),'جميع المصروفات','bars',mov.filter(m=>movementType(m)==='expense').map(m=>Number(m.amount||0)))}${metric('discounts','إجمالي الخصومات',money(discount),'خصومات الفواتير','bars',inv.map(i=>Number(i.discount||0)))}</div><section class="latest-ops"><div class="section-row-title latest-ops-title"><div><strong>أحدث العمليات</strong><small>آخر ${recent.length} حركات</small></div><button class="show-all-btn" data-show-all-movements type="button">${icon('back')} <span>عرض الكل</span></button></div><div class="cards-list flow-list">${recent.length?recent.map(flowRow).join(''):'<div class="empty">لا توجد حركات مالية.</div>'}</div></section>`;
};

renderReports=function(){
  setPageTitle('التقارير');const s=stats();
  const items=[['subscribers','تقارير المشتركين',`${data.subscribers.length} مشترك`,'users'],['invoices','تقارير الفواتير',`${data.invoices.length} فاتورة`,'receipt'],['flows','تقرير التدفقات المالية',money(s.flows),'wallet'],['accounts','تقرير الحسابات',money(s.totalAccounts),'bank'],['expenses','تقرير المصروفات',money(s.expenses),'card'],['consumption','تقرير استهلاك الكهرباء',`${num(s.consumption)} kW`,'meter']];
  $('#mainContent').innerHTML=`${pageHead('التقارير','تقارير واضحة ومفصلة حسب الفترة والمنطقة والمشترك')}<div class="report-main-grid polished-report-grid">${items.map(([id,t,v,ic])=>`<button class="report-main-card" data-report-main="${id}" type="button"><span class="report-menu-icon">${icon(ic)}</span><span><strong>${t}</strong><small>${v}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
};

renderFab=function(){
  const root=$('#fabRoot');if(detail&& !['subscriber-profile','meter-profile','board-profile','region-profile'].includes(detail.kind)){root.innerHTML='';return}
  const actions=[];
  if(currentPage==='subscribers'&&hasPerm('subscribers.add')){actions.push(['add-subscriber','إضافة مشترك','users']);actions.push(['add-meter','إضافة عداد','meter']);}
  if((currentPage==='meters'||['meter-profile','board-profile','region-profile'].includes(detail?.kind))&&hasPerm('subscribers.add')){actions.push(['add-meter','إضافة عداد','meter']);actions.push(['add-board','إضافة لوحة توزيع','panel']);actions.push(['add-region','إضافة منطقة','mapPin']);}
  if(currentPage==='invoices'&&hasPerm('subscriptions.add'))actions.push(['add-invoice','إضافة فاتورة','receipt']);
  if(currentPage==='accounts'){if(hasPerm('accounts.add'))actions.push(['add-account','إضافة حساب','bank']);if(hasPerm('accounts.transfer')||hasPerm('flows.transfer'))actions.push(['account-transfer','تحويل','transfer']);}
  if(currentPage==='flows'){if(hasPerm('flows.collect'))actions.push(['collection','تحصيل دفعة','arrowDown']);if(hasPerm('flows.send'))actions.push(['send','إرسال دفعة','arrowUp']);if(hasPerm('flows.expense'))actions.push(['expense','مصروف','card']);if(hasPerm('flows.transfer'))actions.push(['transfer','تحويل','transfer']);}
  if(currentPage==='employees'&&hasPerm('employees.manage'))actions.push(['add-employee','إضافة موظف','userCog']);if(currentPage==='tasks'&&hasPerm('tasks.manage'))actions.push(['add-task','إضافة مهمة','clipboard']);
  if(!actions.length){root.innerHTML='';return}
  root.innerHTML=`<button id="fabMain" class="fab-main" type="button" aria-label="الإجراءات">${icon('plus')}</button><div id="fabMenu" class="fab-menu hidden">${actions.map(([a,l,ic])=>`<button class="fab-item fab-${a}" data-action="${a}" type="button"><span class="fab-item-icon">${icon(ic)}</span><span>${l}</span></button>`).join('')}</div>`;
};

document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
  const theme=e.target.closest('[data-ui-theme]');if(theme){setUiPrefs({theme:theme.dataset.uiTheme});return}
  const accent=e.target.closest('[data-ui-accent]');if(accent){setUiPrefs({accent:accent.dataset.uiAccent});return}
  const showAll=e.target.closest('[data-show-all-movements]');if(showAll){detail={kind:'all-movements'};detailSearch='';render();window.scrollTo({top:0,behavior:'smooth'});return}
},true);


/* ==== v18 financial accounts + meters reports ==== */
(function(){
  const FR={type:'summary',mode:'accounts',from:'',to:'',accountIds:[],subscriberId:'',subscriberMode:'all',search:'',sort:'date-desc'};
  const MR={level:'summary',scope:'all',from:'',to:'',regionId:'',boardId:'',subscriberId:'',meterId:'',search:'',sort:'consumption-desc'};
  const today=()=>dateOnly(new Date());
  const dms=(v,end=false)=>{if(!v)return end?Infinity:-Infinity;const s=String(v).slice(0,10),d=new Date(`${s}T${end?'23:59:59.999':'00:00:00'}`);return d.getTime()};
  const inPeriod=(v,state)=>{const t=new Date(v||0).getTime();return Number.isFinite(t)&&t>=dms(state.from,false)&&t<=dms(state.to,true)};
  function reportOpeningDate(){
    const vals=[];
    data.accounts.forEach(x=>(x.createdAt)&&vals.push(x.createdAt));
    data.meters.forEach(x=>(x.openingDate||x.createdAt)&&vals.push(x.openingDate||x.createdAt));
    data.invoices.forEach(x=>(x.date||x.periodTo||x.createdAt)&&vals.push(x.date||x.periodTo||x.createdAt));
    data.movements.forEach(x=>(x.date||x.createdAt)&&vals.push(x.date||x.createdAt));
    if(!vals.length)return today();vals.sort((a,b)=>new Date(a)-new Date(b));return dateOnly(vals[0]);
  }
  function periodText(state){return `${fmtDate(state.from)} — ${fmtDate(state.to)}`}
  function v18Back(target){return `<button class="secondary-btn compact" data-v18-back="${target}" type="button">${icon('back')} رجوع</button>`}
  function v18SummaryCard(label,value,sub=''){return `<div class="v18-summary-card"><small>${label}</small><strong>${value}</strong>${sub?`<span>${sub}</span>`:''}</div>`}
  function v18MenuCard(attr,id,title,desc,ic,meta=''){
    return `<button class="report-menu-card" ${attr}="${id}" type="button"><span class="report-menu-icon">${icon(ic)}</span><span><strong>${title}</strong><small>${desc}</small></span>${meta?`<b class="v18-card-meta">${meta}</b>`:icon('chevron')}</button>`;
  }

  // -------- financial account reports --------
  function frReset(){FR.from=reportOpeningDate();FR.to=today();FR.accountIds=data.accounts.map(a=>String(a.id));FR.subscriberId='';FR.search='';FR.sort='date-desc'}
  function frSelectedAccounts(){const set=new Set(FR.accountIds.map(String));return data.accounts.filter(a=>set.has(String(a.id)))}
  function frMoveEffect(m,accountId){
    const id=String(accountId),t=movementType(m),amount=Number(m.amount||0);let incoming=0,outgoing=0;
    if(['collection','deposit'].includes(t)&&String(m.accountId||m.toAccountId||'')===id)incoming=amount;
    else if(['send','expense'].includes(t)&&String(m.accountId||m.fromAccountId||'')===id)outgoing=amount;
    else if(t==='transfer'){
      if(String(m.toAccountId||m.accountToId||'')===id)incoming+=amount;
      if(String(m.fromAccountId||m.accountFromId||'')===id)outgoing+=amount;
    }
    return {incoming,outgoing};
  }
  function frAccountSnapshot(a){
    const periodMoves=data.movements.filter(m=>inPeriod(m.date||m.createdAt,FR)).map(m=>({m,...frMoveEffect(m,a.id)})).filter(x=>x.incoming||x.outgoing);
    const incoming=periodMoves.reduce((s,x)=>s+x.incoming,0),outgoing=periodMoves.reduce((s,x)=>s+x.outgoing,0);
    const end=dms(FR.to,true),created=new Date(a.createdAt||0).getTime();let balance=(created&&created>end)?0:Number(a.openingBalance||0);
    data.movements.forEach(m=>{const tm=new Date(m.date||m.createdAt||0).getTime();if(tm<=end){const e=frMoveEffect(m,a.id);balance+=e.incoming-e.outgoing}});
    const lastDate=periodMoves.map(x=>x.m.date||x.m.createdAt).sort((x,y)=>new Date(y)-new Date(x))[0]||a.createdAt||'';
    return {a,moves:periodMoves,incoming,outgoing,balance,lastDate};
  }
  function frRows(){
    let rows=frSelectedAccounts().map(frAccountSnapshot),q=FR.search.trim().toLowerCase();
    if(q)rows=rows.filter(x=>`${x.a.name||''} ${x.a.number||''} ${x.a.notes||''}`.toLowerCase().includes(q));
    if(FR.sort==='amount-desc')rows.sort((a,b)=>b.balance-a.balance);else if(FR.sort==='amount-asc')rows.sort((a,b)=>a.balance-b.balance);else if(FR.sort==='date-asc')rows.sort((a,b)=>new Date(a.lastDate||0)-new Date(b.lastDate||0));else rows.sort((a,b)=>new Date(b.lastDate||0)-new Date(a.lastDate||0));
    return rows;
  }
  function frTotals(rows){return {incoming:rows.reduce((s,x)=>s+x.incoming,0),outgoing:rows.reduce((s,x)=>s+x.outgoing,0),balance:rows.reduce((s,x)=>s+x.balance,0)}}
  function renderFinancialReportsMenu(){
    detail={kind:'financial-reports-menu'};setPageTitle('تقارير الحسابات المالية');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('reports')}<h1 style="margin-top:12px">تقارير الحسابات المالية</h1><p>ملخصات الحسابات والحركات وكشوف المشتركين المالية.</p></div><div class="head-meta">${data.accounts.length} حساب</div></div><div class="report-menu-list">${v18MenuCard('data-financial-report','summary','ملخص إجماليات الحسابات','اختيار حساب واحد أو عدة حسابات وعرض الإيداع والإرسال والرصيد','bank')}${v18MenuCard('data-financial-report','detailed','التقرير المفصل للحسابات المالية','تفاصيل كل حساب وجميع الحركات الواردة والصادرة','wallet')}${v18MenuCard('data-financial-report','subscriber','التقرير حسب المشترك','جميع الحركات أو الإيداعات أو الإرسالات لمشترك محدد','users')}</div>`;
  }
  function frAccountChoices(){
    const selected=new Set(FR.accountIds.map(String));return data.accounts.map(a=>`<label class="v18-check-row"><input type="checkbox" data-fr-account value="${esc(a.id)}" ${selected.has(String(a.id))?'checked':''}><span class="row-icon">${icon(a.type==='bank'?'bank':'wallet')}</span><span><strong>${esc(a.name)}</strong><small>${a.type==='bank'?'بنكي':'نقدي'}${a.number?` • ${esc(a.number)}`:''} • ${money(accountBalance(a.id))}</small></span></label>`).join('');
  }
  function renderFinancialAccountConfig(type){
    FR.type=type;detail={kind:'financial-report-config',reportType:type};setPageTitle('خيارات التقرير المالي');if(!FR.from||!FR.to)frReset();
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('financial-menu')}<h1 style="margin-top:12px">${type==='summary'?'ملخص إجماليات الحسابات':'التقرير المفصل للحسابات'}</h1><p>حدد الحسابات والفترة الزمنية المطلوب ظهورها.</p></div></div><div class="form-grid v18-date-grid">${inputField('frFrom','من تاريخ','date',FR.from,'')}${inputField('frTo','إلى تاريخ','date',FR.to,'')}</div><div class="subscriber-select-toolbar"><div class="list-search"><span>${icon('search')}</span><input id="frAccountSearch" type="search" placeholder="بحث باسم أو رقم الحساب..."></div><button class="secondary-btn compact" data-fr-all type="button">تحديد الكل</button><button class="secondary-btn compact" data-fr-none type="button">إلغاء الكل</button></div><div id="frAccountChoices" class="v18-check-list">${frAccountChoices()}</div><div class="report-generate-actions"><button class="primary-btn" data-fr-generate type="button">${icon('chart')} إنشاء التقرير</button></div>`;
  }
  function renderSubscriberFinancialModes(){
    detail={kind:'financial-subscriber-modes'};setPageTitle('تقرير الحسابات حسب المشترك');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('financial-menu')}<h1 style="margin-top:12px">تقارير المشترك حسب الحركات</h1><p>اختر نوع الحركات المطلوب عرضها.</p></div></div><div class="report-command-grid">${v18MenuCard('data-fr-subscriber-mode','all','تقرير جميع الحركات','كل عمليات الاستقبال والإرسال للمشترك','wallet')}${v18MenuCard('data-fr-subscriber-mode','deposits','تقرير الإيداعات','عمليات استقبال الدفعات من المشترك','arrowDown')}${v18MenuCard('data-fr-subscriber-mode','sends','تقرير الإرسالات','عمليات إرسال الدفعات إلى المشترك','arrowUp')}</div>`;
  }
  function renderSubscriberFinancialConfig(mode){
    FR.subscriberMode=mode;detail={kind:'financial-subscriber-config',mode};setPageTitle('خيارات كشف المشترك');if(!FR.from||!FR.to){FR.from=reportOpeningDate();FR.to=today()}
    const subs=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`}));
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('financial-subscriber-modes')}<h1 style="margin-top:12px">${mode==='all'?'جميع الحركات':mode==='deposits'?'الإيداعات':'الإرسالات'}</h1><p>اختر المشترك والفترة الزمنية.</p></div></div><div class="form-grid">${pickerField('frSubscriberId','اسم المشترك',subs,FR.subscriberId,'اختر المشترك')}${inputField('frSubscriberFrom','من تاريخ','date',FR.from,'')}${inputField('frSubscriberTo','إلى تاريخ','date',FR.to,'')}</div><div class="report-generate-actions"><button class="primary-btn" data-fr-subscriber-generate type="button">${icon('chart')} إنشاء التقرير</button></div>`;
  }
  function frMovementCard(x,a){
    const m=x.m,t=movementType(m),sub=subscriberBy(m.subscriberId),hasSub=m.subscriberId&&sub.name!=='مشترك محذوف';
    const label=x.incoming?'إيداع / وارد':'إرسال / صادر',amount=x.incoming||x.outgoing;
    return `<article data-movement="${esc(m.id)}" class="v18-movement-card ${x.incoming?'incoming':'outgoing'}"><div class="v18-movement-head"><span>${icon(x.incoming?'arrowDown':'arrowUp')}</span><div><strong>${label}</strong><small>${fmtDateTime(m.date||m.createdAt)}</small></div><b>${money(amount)}</b></div><div class="v18-movement-grid"><span>المشترك<b>${hasSub?esc(sub.name):t==='transfer'?'تحويل بين الحسابات':'—'}</b></span><span>رقم المشترك<b>${hasSub?esc(fullPhone(sub)||'—'):'—'}</b></span><span>الحساب<b>${esc(a.name)}</b></span><span>نوع الحركة<b>${t==='collection'?'استقبال دفعة':t==='send'?'إرسال دفعة':t==='expense'?'مصروف':t==='deposit'?'إيداع':'تحويل'}</b></span></div>${m.notes?`<p class="v18-notes">${esc(m.notes)}</p>`:''}</article>`;
  }
  function frAccountSummaryCard(x,detailed=false){
    const a=x.a;
    return `<article class="v18-report-section"><div class="v18-section-head"><span class="report-menu-icon">${icon(a.type==='bank'?'bank':'wallet')}</span><div><strong>${esc(a.name)}</strong><small>${a.number?`رقم الحساب: ${esc(a.number)} • `:''}تاريخ الإضافة: ${fmtDate(a.createdAt)}</small></div><b>${money(x.balance)}</b></div>${a.notes?`<p class="v18-notes">${esc(a.notes)}</p>`:''}<div class="v18-mini-summary">${v18SummaryCard('إجمالي الإيداع',money(x.incoming))}${v18SummaryCard('إجمالي الإرسال',money(x.outgoing))}${v18SummaryCard('الرصيد المتوفر',money(x.balance))}</div>${detailed?`<div class="v18-subtitle"><strong>حركات الحساب</strong><small>${x.moves.length} حركة ضمن الفترة</small></div><div class="v18-movement-list">${x.moves.length?x.moves.map(m=>frMovementCard(m,a)).join(''):'<div class="empty compact-empty">لا توجد حركات في الفترة المحددة.</div>'}</div>`:''}</article>`;
  }
  function frResultControls(){return `<div class="report-result-controls v18-result-controls"><label><span>من</span><input id="frResultFrom" type="date" value="${esc(FR.from)}"></label><label><span>إلى</span><input id="frResultTo" type="date" value="${esc(FR.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="frResultSearch" type="search" value="${esc(FR.search)}" placeholder="بحث باسم أو رقم الحساب..."></div><button class="sort-btn" data-fr-sort type="button">${icon('sort')}<span>ترتيب</span></button></div>`}
  function renderFinancialReportResult(){
    detail={kind:'financial-report-result',reportType:FR.type};setPageTitle('نتيجة تقرير الحسابات');const rows=frRows(),tot=frTotals(rows),names=rows.map(x=>x.a.name).join('، ')||'لا توجد حسابات';
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('financial-config')}<h1 style="margin-top:12px">${FR.type==='summary'?'ملخص إجماليات الحسابات':'التقرير المفصل للحسابات المالية'}</h1><p>الفترة: ${periodText(FR)} • الحسابات: ${esc(names)}</p></div><div class="head-meta">${rows.length} حساب</div></div>${frResultControls()}<div class="v18-summary-grid">${v18SummaryCard('إجمالي الإيداع في الحسابات',money(tot.incoming))}${v18SummaryCard('إجمالي الإرسال من الحسابات',money(tot.outgoing))}${v18SummaryCard('إجمالي الرصيد في الحسابات',money(tot.balance))}</div><div class="v18-report-stack">${rows.length?rows.map(x=>frAccountSummaryCard(x,FR.type==='detailed')).join(''):'<div class="empty">لا توجد حسابات مطابقة.</div>'}</div>`;
  }
  function frSubscriberRows(){
    const sid=String(FR.subscriberId||'');return data.movements.filter(m=>String(m.subscriberId||'')===sid&&inPeriod(m.date||m.createdAt,FR)&&['collection','send'].includes(movementType(m))).filter(m=>FR.subscriberMode==='all'||(FR.subscriberMode==='deposits'&&movementType(m)==='collection')||(FR.subscriberMode==='sends'&&movementType(m)==='send')).sort((a,b)=>new Date(b.date||b.createdAt)-new Date(a.date||a.createdAt));
  }
  function renderSubscriberFinancialResult(){
    detail={kind:'financial-subscriber-result',mode:FR.subscriberMode};setPageTitle('كشف حساب المشترك');const s=subscriberBy(FR.subscriberId),rows=frSubscriberRows();const deposits=rows.filter(m=>movementType(m)==='collection').reduce((a,m)=>a+Number(m.amount||0),0),sends=rows.filter(m=>movementType(m)==='send').reduce((a,m)=>a+Number(m.amount||0),0),net=deposits-sends;
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('financial-subscriber-config')}<h1 style="margin-top:12px">${FR.subscriberMode==='all'?'جميع الحركات':FR.subscriberMode==='deposits'?'إيداعات المشترك':'إرسالات المشترك'}</h1><p>${fmtDate(FR.from)} — ${fmtDate(FR.to)}</p></div><div class="head-meta">${rows.length} حركة</div></div><section class="v18-report-section"><div class="v18-section-head"><span class="report-menu-icon">${icon('users')}</span><div><strong>${esc(s.name)}</strong><small>${esc(fullPhone(s)||'—')} • ${esc(s.address||'بدون عنوان')}</small></div></div><div class="v18-summary-grid compact">${v18SummaryCard('إجمالي الدفع / الإيداع',money(deposits))}${v18SummaryCard('إجمالي الإرسال',money(sends))}${v18SummaryCard('صافي التدفق',money(net))}</div></section><div class="v18-movement-list">${rows.length?rows.map(m=>{const incoming=movementType(m)==='collection',a=accountBy(m.accountId||m.toAccountId||m.fromAccountId);return `<article data-movement="${esc(m.id)}" class="v18-movement-card ${incoming?'incoming':'outgoing'}"><div class="v18-movement-head"><span>${icon(incoming?'arrowDown':'arrowUp')}</span><div><strong>${incoming?'إيداع / استقبال دفعة':'إرسال دفعة'}</strong><small>${fmtDateTime(m.date||m.createdAt)}</small></div><b>${money(m.amount)}</b></div><div class="v18-movement-grid"><span>اسم الحساب<b>${esc(a.name||'—')}</b></span><span>تاريخ الحركة<b>${fmtDateTime(m.date||m.createdAt)}</b></span><span>مبلغ الحركة<b>${money(m.amount)}</b></span><span>نوع الحركة<b>${incoming?'وارد':'صادر'}</b></span></div>${m.notes?`<p class="v18-notes">${esc(m.notes)}</p>`:''}</article>`}).join(''):'<div class="empty">لا توجد حركات ضمن الفترة.</div>'}</div>`;
  }
  function openFrSort(){openModal('ترتيب تقرير الحسابات',`<div class="picker-options"><button class="picker-option" data-fr-sort-value="amount-desc" type="button">الرصيد: الأعلى أولاً</button><button class="picker-option" data-fr-sort-value="amount-asc" type="button">الرصيد: الأقل أولاً</button><button class="picker-option" data-fr-sort-value="date-desc" type="button">التاريخ: الأحدث أولاً</button><button class="picker-option" data-fr-sort-value="date-asc" type="button">التاريخ: الأقدم أولاً</button></div>`)}

  // -------- meter reports --------
  function mrReset(){MR.from=reportOpeningDate();MR.to=today();MR.regionId='';MR.boardId='';MR.subscriberId='';MR.meterId='';MR.search='';MR.sort='consumption-desc'}
  function mrMeterSnap(m){
    const inv=data.invoices.filter(i=>String(i.meterId)===String(m.id)&&inPeriod(i.date||i.periodTo||i.createdAt,MR)).sort((a,b)=>new Date(a.date||a.periodTo||0)-new Date(b.date||b.periodTo||0));
    const consumption=inv.reduce((s,i)=>s+Number(i.consumption||0),0),last=inv[inv.length-1]||null;
    return {m,s:subscriberBy(m.subscriberId),r:regionBy(m.regionId),b:boardBy(m.boardId),inv,consumption,lastReading:last?Number(last.closingReading||0):Number(m.lastReading??m.openingReading??0),lastDate:last?.date||last?.periodTo||m.lastReadingDate||m.openingDate||'',openingReading:Number(m.openingReading||0),openingDate:m.openingDate||''};
  }
  function mrMeters(){
    let rows=data.meters.filter(m=>(!MR.regionId||String(m.regionId)===String(MR.regionId))&&(!MR.boardId||String(m.boardId)===String(MR.boardId))&&(!MR.subscriberId||String(m.subscriberId)===String(MR.subscriberId))&&(!MR.meterId||String(m.id)===String(MR.meterId))).map(mrMeterSnap);const q=MR.search.trim().toLowerCase();
    if(q)rows=rows.filter(x=>`${x.s.name||''} ${fullPhone(x.s)||''} ${x.m.label||''} ${x.m.meterNumber||''} ${x.r.name||''} ${x.b.name||''}`.toLowerCase().includes(q));
    if(MR.sort==='consumption-asc')rows.sort((a,b)=>a.consumption-b.consumption);else if(MR.sort==='date-desc')rows.sort((a,b)=>new Date(b.lastDate||0)-new Date(a.lastDate||0));else if(MR.sort==='date-asc')rows.sort((a,b)=>new Date(a.lastDate||0)-new Date(b.lastDate||0));else rows.sort((a,b)=>b.consumption-a.consumption);
    return rows;
  }
  function mrTotals(rows){const regions=new Set(rows.map(x=>String(x.m.regionId)).filter(Boolean)),boards=new Set(rows.map(x=>String(x.m.boardId)).filter(Boolean)),subs=new Set(rows.map(x=>String(x.m.subscriberId)).filter(Boolean));return {regions:regions.size,boards:boards.size,subs:subs.size,meters:rows.length,consumption:rows.reduce((s,x)=>s+x.consumption,0)}}
  function renderMeterReportsMenu(){
    detail={kind:'meter-reports-menu'};setPageTitle('تقارير العدادات');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('reports')}<h1 style="margin-top:12px">تقارير العدادات</h1><p>تقارير ملخصة ومفصلة للمناطق واللوحات والمشتركين والعدادات.</p></div><div class="head-meta">${data.meters.length} عداد</div></div><div class="report-menu-list">${v18MenuCard('data-meter-report-level','summary','التقرير الملخص لعدادات الكهرباء','إجماليات مرتبة حسب المناطق واللوحات والمشتركين','meter')}${v18MenuCard('data-meter-report-level','detailed','التقرير المفصل لعدادات الكهرباء','القراءات والفواتير والتسلسل الكامل لكل عداد','receipt')}</div>`;
  }
  function renderMeterReportScopes(level){
    MR.level=level;detail={kind:'meter-report-scopes',level};setPageTitle(level==='summary'?'تقارير العدادات الملخصة':'تقارير العدادات المفصلة');
    const cards=[['all','التقرير الإجمالي للعدادات الكهربائية','كل المناطق واللوحات والمشتركين والعدادات','meter'],['regions','التقرير الإجمالي للمناطق','إجماليات كل منطقة ولوحاتها وعداداتها','mapPin'],['boards','التقرير الإجمالي للوحات التوزيع','كل لوحة وعداداتها واستهلاكها','panel'],['subscribers','التقرير الإجمالي للمشتركين','كل مشترك وعدداداته واستهلاكه','users'],['meters','التقرير الإجمالي للعدادات','كل عداد وقراءاته واستهلاكه','meter']];
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('meter-menu')}<h1 style="margin-top:12px">${level==='summary'?'التقرير الملخص':'التقرير المفصل'}</h1><p>اختر مستوى التقرير المطلوب.</p></div></div><div class="report-command-grid">${cards.map(c=>v18MenuCard('data-meter-report-scope',c[0],c[1],c[2],c[3])).join('')}</div>`;
  }
  function mrFilteredBoardItems(regionId=''){return data.distributionBoards.filter(b=>!regionId||String(b.regionId)===String(regionId)).map(b=>({value:b.id,label:`${b.name||'لوحة'} — ${b.boardNumber||''}`}))}
  function mrFilteredMeterItems(){return data.meters.filter(m=>(!MR.regionId||String(m.regionId)===String(MR.regionId))&&(!MR.boardId||String(m.boardId)===String(MR.boardId))&&(!MR.subscriberId||String(m.subscriberId)===String(MR.subscriberId))).map(m=>({value:m.id,label:`${subscriberBy(m.subscriberId).name} — ${m.label||m.meterNumber||'عداد'} — ${m.meterNumber||''}`}))}
  function renderMeterReportConfig(scope){
    MR.scope=scope;detail={kind:'meter-report-config',level:MR.level,scope};setPageTitle('خيارات تقرير العدادات');if(!MR.from||!MR.to)mrReset();
    const regions=data.regions.map(r=>({value:r.id,label:`${r.name} — ${r.regionNumber||''}`})),boards=mrFilteredBoardItems(MR.regionId),subs=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''}`})),meters=mrFilteredMeterItems();
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('meter-scopes')}<h1 style="margin-top:12px">خيارات التقرير</h1><p>يمكنك تحديد المنطقة واللوحة والمشترك والعداد أو تركها على الكل.</p></div></div><div class="form-grid">${pickerField('mrRegionId','المنطقة',regions,MR.regionId,'كل المناطق')}${pickerField('mrBoardId','لوحة التوزيع',boards,MR.boardId,'كل اللوحات')}${pickerField('mrSubscriberId','المشترك',subs,MR.subscriberId,'كل المشتركين')}${pickerField('mrMeterId','العداد',meters,MR.meterId,'كل العدادات')}${inputField('mrFrom','من تاريخ','date',MR.from,'')}${inputField('mrTo','إلى تاريخ','date',MR.to,'')}</div><div class="report-generate-actions"><button class="primary-btn" data-mr-generate type="button">${icon('chart')} إنشاء التقرير</button></div>`;
  }
  function mrInvoiceCards(x){
    if(!x.inv.length)return '<div class="empty compact-empty">لا توجد فواتير للعداد في الفترة.</div>';
    return `<div class="v18-invoice-list">${x.inv.map(i=>`<article class="v18-invoice-line"><div><strong>فاتورة ${fmtDate(i.date||i.periodTo)}</strong><small>${num(i.consumption||0)} KW • ${money(invoiceNet(i))}</small></div><div class="v18-invoice-grid"><span>القراءة السابقة<b>${num(i.openingReading||0)} KW</b></span><span>القراءة الحالية<b>${num(i.closingReading||0)} KW</b></span><span>سعر الكيلو<b>${money(i.unitPrice||0)}</b></span><span>الخصم<b>${money(i.discount||0)}</b></span></div></article>`).join('')}</div>`;
  }
  function mrMeterCard(x,detailed=false){
    return `<article class="v18-meter-card"><div class="v18-section-head"><span class="report-menu-icon">${icon('meter')}</span><div><strong>${esc(x.m.label||x.m.meterNumber||'عداد')}</strong><small>${esc(x.s.name)} • ${esc(fullPhone(x.s)||'—')} • رقم العداد ${esc(x.m.meterNumber||'—')}</small></div><b>${num(x.consumption)} KW</b></div><div class="v18-meter-data"><span>المنطقة<b>${esc(x.r.name||'—')} ${x.r.regionNumber?`(${esc(x.r.regionNumber)})`:''}</b></span><span>لوحة التوزيع<b>${esc(x.b.name||'—')} ${x.b.boardNumber?`(${esc(x.b.boardNumber)})`:''}</b></span><span>القراءة الافتتاحية<b>${num(x.openingReading)} KW</b><em>${fmtDate(x.openingDate)}</em></span><span>القراءة الأخيرة<b>${num(x.lastReading)} KW</b><em>${fmtDate(x.lastDate)}</em></span><span>إجمالي الاستهلاك<b>${num(x.consumption)} KW</b></span></div>${detailed?`<div class="v18-subtitle"><strong>فواتير العداد</strong><small>${x.inv.length} فاتورة</small></div>${mrInvoiceCards(x)}`:''}</article>`;
  }
  function mrBoardCard(board,rows,detailed=false){
    const b=boardBy(board),r=regionBy(b.regionId),meters=rows.filter(x=>String(x.m.boardId)===String(board)),cons=meters.reduce((s,x)=>s+x.consumption,0);
    return `<article class="v18-report-section"><div class="v18-section-head"><span class="report-menu-icon">${icon('panel')}</span><div><strong>${esc(b.name||'لوحة توزيع')}</strong><small>رقم اللوحة ${esc(b.boardNumber||'—')} • ${esc(r.name||'—')} ${r.regionNumber?`(${esc(r.regionNumber)})`:''}</small></div><b>${num(cons)} KW</b></div><div class="v18-mini-summary">${v18SummaryCard('عدد العدادات',meters.length)}${v18SummaryCard('إجمالي استهلاك اللوحة',`${num(cons)} KW`)}</div><div class="v18-subtitle"><strong>عدادات اللوحة</strong><small>${meters.length} عداد</small></div><div class="v18-report-stack nested">${meters.length?meters.map(x=>mrMeterCard(x,detailed)).join(''):'<div class="empty compact-empty">لا توجد عدادات.</div>'}</div></article>`;
  }
  function mrRegionCard(region,rows,detailed=false){
    const r=regionBy(region),meters=rows.filter(x=>String(x.m.regionId)===String(region)),boardIds=[...new Set(meters.map(x=>String(x.m.boardId)).filter(Boolean))],cons=meters.reduce((s,x)=>s+x.consumption,0);
    return `<article class="v18-region-card"><div class="v18-section-head"><span class="report-menu-icon">${icon('mapPin')}</span><div><strong>${esc(r.name||'منطقة')}</strong><small>رقم المنطقة ${esc(r.regionNumber||'—')}</small></div><b>${num(cons)} KW</b></div><div class="v18-mini-summary">${v18SummaryCard('عدد لوحات التوزيع',boardIds.length)}${v18SummaryCard('عدد عدادات المنطقة',meters.length)}${v18SummaryCard('استهلاك المنطقة',`${num(cons)} KW`)}</div><div class="v18-report-stack nested">${boardIds.length?boardIds.map(id=>mrBoardCard(id,meters,detailed)).join(''):'<div class="empty compact-empty">لا توجد لوحات ضمن التقرير.</div>'}</div></article>`;
  }
  function mrSubscriberCard(sid,rows,detailed=false){
    const s=subscriberBy(sid),meters=rows.filter(x=>String(x.m.subscriberId)===String(sid)),cons=meters.reduce((a,x)=>a+x.consumption,0),boards=[...new Set(meters.map(x=>String(x.m.boardId)).filter(Boolean))],regions=[...new Set(meters.map(x=>String(x.m.regionId)).filter(Boolean))];
    return `<article class="v18-report-section"><div class="v18-section-head"><span class="report-menu-icon">${icon('users')}</span><div><strong>${esc(s.name)}</strong><small>${esc(fullPhone(s)||'—')} • ${meters.length} عداد</small></div><b>${num(cons)} KW</b></div><div class="v18-mini-summary">${v18SummaryCard('عدد العدادات',meters.length)}${v18SummaryCard('لوحات التوزيع',boards.length)}${v18SummaryCard('المناطق',regions.length)}${v18SummaryCard('إجمالي الاستهلاك',`${num(cons)} KW`)}</div><div class="v18-report-stack nested">${meters.length?meters.map(x=>mrMeterCard(x,detailed)).join(''):'<div class="empty compact-empty">لا توجد عدادات للمشترك.</div>'}</div></article>`;
  }
  function mrControls(){return `<div class="report-result-controls v18-result-controls"><label><span>من</span><input id="mrResultFrom" type="date" value="${esc(MR.from)}"></label><label><span>إلى</span><input id="mrResultTo" type="date" value="${esc(MR.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="mrResultSearch" type="search" value="${esc(MR.search)}" placeholder="بحث بالمشترك أو العداد أو المنطقة..."></div><button class="sort-btn" data-mr-sort type="button">${icon('sort')}<span>ترتيب</span></button></div>`}
  function renderMeterReportResult(){
    detail={kind:'meter-report-result',level:MR.level,scope:MR.scope};setPageTitle('نتيجة تقرير العدادات');const rows=mrMeters(),tot=mrTotals(rows),detailed=MR.level==='detailed';let body='';
    if(MR.scope==='boards')body=[...new Set(rows.map(x=>String(x.m.boardId)).filter(Boolean))].map(id=>mrBoardCard(id,rows,detailed)).join('');
    else if(MR.scope==='subscribers')body=[...new Set(rows.map(x=>String(x.m.subscriberId)).filter(Boolean))].map(id=>mrSubscriberCard(id,rows,detailed)).join('');
    else if(MR.scope==='meters')body=rows.map(x=>mrMeterCard(x,detailed)).join('');
    else body=[...new Set(rows.map(x=>String(x.m.regionId)).filter(Boolean))].map(id=>mrRegionCard(id,rows,detailed)).join('');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v18Back('meter-config')}<h1 style="margin-top:12px">${MR.level==='summary'?'التقرير الملخص':'التقرير المفصل'} — ${MR.scope==='all'?'الإجمالي':MR.scope==='regions'?'المناطق':MR.scope==='boards'?'لوحات التوزيع':MR.scope==='subscribers'?'المشتركين':'العدادات'}</h1><p>الفترة: ${periodText(MR)}</p></div><div class="head-meta">${rows.length} عداد</div></div>${mrControls()}<div class="v18-summary-grid meters">${v18SummaryCard('إجمالي المناطق',tot.regions)}${v18SummaryCard('إجمالي لوحات التوزيع',tot.boards)}${v18SummaryCard('إجمالي المشتركين',tot.subs)}${v18SummaryCard('إجمالي العدادات',tot.meters)}${v18SummaryCard('إجمالي الاستهلاك الكلي',`${num(tot.consumption)} KW`)}</div><div class="v18-report-stack">${body||'<div class="empty">لا توجد بيانات مطابقة لشروط التقرير.</div>'}</div>`;
  }
  function openMrSort(){openModal('ترتيب تقرير العدادات',`<div class="picker-options"><button class="picker-option" data-mr-sort-value="consumption-desc" type="button">الاستهلاك: الأعلى أولاً</button><button class="picker-option" data-mr-sort-value="consumption-asc" type="button">الاستهلاك: الأقل أولاً</button><button class="picker-option" data-mr-sort-value="date-desc" type="button">التاريخ: الأحدث أولاً</button><button class="picker-option" data-mr-sort-value="date-asc" type="button">التاريخ: الأقدم أولاً</button></div>`)}
  function updateMrMeterPicker(){
    const form=$('#mainContent'),hidden=form?.querySelector('[name=mrMeterId]'),btn=hidden?.closest('.field')?.querySelector('[data-picker]');if(!btn)return;const cfg=pickers.get(btn.dataset.picker);if(!cfg)return;cfg.items=mrFilteredMeterItems();if(MR.meterId&&!cfg.items.some(x=>String(x.value)===String(MR.meterId))){MR.meterId='';hidden.value='';btn.querySelector('b').textContent=cfg.placeholder||'كل العدادات'}
  }

  // Reports main menu replaces old consumption card with full meters reports.
  renderReports=function(){
    setPageTitle('التقارير');const s=stats();
    const items=[['subscribers','تقارير المشتركين',`${data.subscribers.length} مشترك`,'users'],['invoices','تقارير الفواتير',`${data.invoices.length} فاتورة`,'receipt'],['flows','تقرير التدفقات المالية',money(s.flows),'wallet'],['accounts','تقارير الحسابات المالية',`${data.accounts.length} حساب`,'bank'],['meters','تقارير العدادات',`${data.meters.length} عداد`,'meter'],['expenses','تقرير المصروفات',money(s.expenses),'card']];
    $('#mainContent').innerHTML=`${pageHead('التقارير','تقارير واضحة ومفصلة حسب الفترة والمنطقة والمشترك والحساب')}<div class="report-main-grid polished-report-grid">${items.map(([id,t,v,ic])=>`<button class="report-main-card" data-report-main="${id}" type="button"><span class="report-menu-icon">${icon(ic)}</span><span><strong>${t}</strong><small>${v}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
  };

  const prevRender=render;
  render=function(){
    if(detail?.kind==='financial-reports-menu'){renderNav();renderFinancialReportsMenu();hydrateIcons();renderFab();return}
    if(detail?.kind==='financial-report-config'){renderNav();renderFinancialAccountConfig(detail.reportType);hydrateIcons();renderFab();return}
    if(detail?.kind==='financial-report-result'){renderNav();renderFinancialReportResult();hydrateIcons();renderFab();return}
    if(detail?.kind==='financial-subscriber-modes'){renderNav();renderSubscriberFinancialModes();hydrateIcons();renderFab();return}
    if(detail?.kind==='financial-subscriber-config'){renderNav();renderSubscriberFinancialConfig(detail.mode);hydrateIcons();renderFab();return}
    if(detail?.kind==='financial-subscriber-result'){renderNav();renderSubscriberFinancialResult();hydrateIcons();renderFab();return}
    if(detail?.kind==='meter-reports-menu'){renderNav();renderMeterReportsMenu();hydrateIcons();renderFab();return}
    if(detail?.kind==='meter-report-scopes'){renderNav();renderMeterReportScopes(detail.level);hydrateIcons();renderFab();return}
    if(detail?.kind==='meter-report-config'){renderNav();renderMeterReportConfig(detail.scope);hydrateIcons();renderFab();return}
    if(detail?.kind==='meter-report-result'){renderNav();renderMeterReportResult();hydrateIcons();renderFab();return}
    return prevRender();
  };

  const prevPicker=handlePickerChange;
  handlePickerChange=function(name,value){
    prevPicker(name,value);
    if(name==='frSubscriberId')FR.subscriberId=value;
    if(name==='mrRegionId'){
      MR.regionId=value;MR.boardId='';MR.meterId='';const form=$('#mainContent'),hidden=form?.querySelector('[name=mrBoardId]'),btn=hidden?.closest('.field')?.querySelector('[data-picker]');if(btn){const cfg=pickers.get(btn.dataset.picker);if(cfg){cfg.items=mrFilteredBoardItems(value);hidden.value='';btn.querySelector('b').textContent=cfg.placeholder||'كل اللوحات'}}updateMrMeterPicker();
    }
    if(name==='mrBoardId'){MR.boardId=value;MR.meterId='';updateMrMeterPicker()}
    if(name==='mrSubscriberId'){MR.subscriberId=value;MR.meterId='';updateMrMeterPicker()}
    if(name==='mrMeterId')MR.meterId=value;
  };

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const main=e.target.closest('[data-report-main]');
    if(main?.dataset.reportMain==='accounts'){e.preventDefault();e.stopPropagation();frReset();renderFinancialReportsMenu();hydrateIcons();renderFab();return}
    if(main?.dataset.reportMain==='meters'){e.preventDefault();e.stopPropagation();mrReset();renderMeterReportsMenu();hydrateIcons();renderFab();return}
    const fr=e.target.closest('[data-financial-report]');if(fr){e.preventDefault();e.stopPropagation();const type=fr.dataset.financialReport;if(type==='subscriber')renderSubscriberFinancialModes();else{FR.type=type;FR.accountIds=data.accounts.map(a=>String(a.id));renderFinancialAccountConfig(type)}hydrateIcons();renderFab();return}
    const frm=e.target.closest('[data-fr-subscriber-mode]');if(frm){e.preventDefault();e.stopPropagation();FR.subscriberMode=frm.dataset.frSubscriberMode;FR.subscriberId='';renderSubscriberFinancialConfig(FR.subscriberMode);hydrateIcons();renderFab();return}
    const ml=e.target.closest('[data-meter-report-level]');if(ml){e.preventDefault();e.stopPropagation();MR.level=ml.dataset.meterReportLevel;renderMeterReportScopes(MR.level);hydrateIcons();renderFab();return}
    const ms=e.target.closest('[data-meter-report-scope]');if(ms){e.preventDefault();e.stopPropagation();MR.scope=ms.dataset.meterReportScope;MR.regionId=MR.boardId=MR.subscriberId=MR.meterId='';renderMeterReportConfig(MR.scope);hydrateIcons();renderFab();return}
    const back=e.target.closest('[data-v18-back]');if(back){e.preventDefault();e.stopPropagation();const t=back.dataset.v18Back;if(t==='reports'){detail=null;currentPage='reports';render()}else if(t==='financial-menu')renderFinancialReportsMenu();else if(t==='financial-config')renderFinancialAccountConfig(FR.type);else if(t==='financial-subscriber-modes')renderSubscriberFinancialModes();else if(t==='financial-subscriber-config')renderSubscriberFinancialConfig(FR.subscriberMode);else if(t==='meter-menu')renderMeterReportsMenu();else if(t==='meter-scopes')renderMeterReportScopes(MR.level);else if(t==='meter-config')renderMeterReportConfig(MR.scope);hydrateIcons();renderFab();return}
    if(e.target.closest('[data-fr-all]')){FR.accountIds=data.accounts.map(a=>String(a.id));const root=$('#frAccountChoices');if(root)root.innerHTML=frAccountChoices();return}
    if(e.target.closest('[data-fr-none]')){FR.accountIds=[];const root=$('#frAccountChoices');if(root)root.innerHTML=frAccountChoices();return}
    if(e.target.closest('[data-fr-generate]')){FR.from=$('[name=frFrom]')?.value||FR.from;FR.to=$('[name=frTo]')?.value||FR.to;if(new Date(FR.from)>new Date(FR.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');if(!FR.accountIds.length)return toast('اختر حساباً واحداً على الأقل','تنبيه');FR.search='';renderFinancialReportResult();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-fr-subscriber-generate]')){FR.from=$('[name=frSubscriberFrom]')?.value||FR.from;FR.to=$('[name=frSubscriberTo]')?.value||FR.to;if(!FR.subscriberId)return toast('اختر المشترك','تنبيه');if(new Date(FR.from)>new Date(FR.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');renderSubscriberFinancialResult();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-fr-sort]')){openFrSort();return}const fsv=e.target.closest('[data-fr-sort-value]');if(fsv){FR.sort=fsv.dataset.frSortValue;closeModal();renderFinancialReportResult();hydrateIcons();return}
    if(e.target.closest('[data-mr-generate]')){MR.from=$('[name=mrFrom]')?.value||MR.from;MR.to=$('[name=mrTo]')?.value||MR.to;if(new Date(MR.from)>new Date(MR.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');MR.search='';renderMeterReportResult();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-mr-sort]')){openMrSort();return}const msv=e.target.closest('[data-mr-sort-value]');if(msv){MR.sort=msv.dataset.mrSortValue;closeModal();renderMeterReportResult();hydrateIcons();return}
  },true);

  document.addEventListener('change',e=>{
    if(e.target.matches('[data-fr-account]')){const id=String(e.target.value),set=new Set(FR.accountIds.map(String));if(e.target.checked)set.add(id);else set.delete(id);FR.accountIds=[...set]}
    if(e.target.id==='frResultFrom'){FR.from=e.target.value;renderFinancialReportResult();hydrateIcons()}
    if(e.target.id==='frResultTo'){FR.to=e.target.value;renderFinancialReportResult();hydrateIcons()}
    if(e.target.id==='mrResultFrom'){MR.from=e.target.value;renderMeterReportResult();hydrateIcons()}
    if(e.target.id==='mrResultTo'){MR.to=e.target.value;renderMeterReportResult();hydrateIcons()}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='frAccountSearch'){const q=e.target.value.trim().toLowerCase();$$('#frAccountChoices .v18-check-row').forEach(el=>{el.style.display=el.textContent.toLowerCase().includes(q)?'':'none'})}
    if(e.target.id==='frResultSearch'){FR.search=e.target.value;clearTimeout(window.__frt);window.__frt=setTimeout(()=>{renderFinancialReportResult();hydrateIcons()},140)}
    if(e.target.id==='mrResultSearch'){MR.search=e.target.value;clearTimeout(window.__mrt);window.__mrt=setTimeout(()=>{renderMeterReportResult();hydrateIcons()},140)}
  });
})();


/* ==== v20 expense reports ==== */
(function(){
  const ER={type:'general',from:'',to:'',typeNames:[],search:'',sort:'date-desc'};
  const today=()=>dateOnly(new Date());
  const toMs=(v,end=false)=>{if(!v)return end?Infinity:-Infinity;const d=new Date(`${String(v).slice(0,10)}T${end?'23:59:59.999':'00:00:00'}`);return d.getTime()};
  const expenseDate=m=>m.date||m.createdAt||'';
  const expenseName=m=>String(m.expenseType||m.payee||'مصروف عام').trim()||'مصروف عام';
  const isExpense=m=>movementType(m)==='expense';
  function expenseOpening(){const rows=data.movements.filter(isExpense).map(expenseDate).filter(Boolean).sort((a,b)=>new Date(a)-new Date(b));return rows.length?dateOnly(rows[0]):today()}
  function resetExpenseReport(){ER.type='general';ER.from=expenseOpening();ER.to=today();ER.typeNames=allExpenseTypes();ER.search='';ER.sort='date-desc'}
  function allExpenseTypes(){return [...new Set([...(data.settings?.expenseTypes||[]),...data.movements.filter(isExpense).map(expenseName)].map(x=>String(x||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ar'))}
  function inExpensePeriod(m){const t=new Date(expenseDate(m)||0).getTime();return Number.isFinite(t)&&t>=toMs(ER.from,false)&&t<=toMs(ER.to,true)}
  function expenseRows(){let rows=data.movements.filter(m=>isExpense(m)&&inExpensePeriod(m));const selected=new Set(ER.typeNames.map(String));if(selected.size)rows=rows.filter(m=>selected.has(expenseName(m)));const q=ER.search.trim().toLowerCase();if(q)rows=rows.filter(m=>`${expenseName(m)} ${accountBy(m.accountId).name||''} ${m.notes||''} ${m.amount||0}`.toLowerCase().includes(q));if(ER.sort==='amount-desc')rows.sort((a,b)=>Number(b.amount||0)-Number(a.amount||0));else if(ER.sort==='amount-asc')rows.sort((a,b)=>Number(a.amount||0)-Number(b.amount||0));else if(ER.sort==='date-asc')rows.sort((a,b)=>new Date(expenseDate(a)||0)-new Date(expenseDate(b)||0));else rows.sort((a,b)=>new Date(expenseDate(b)||0)-new Date(expenseDate(a)||0));return rows}
  function groupedExpenses(rows){const map=new Map();for(const m of rows){const n=expenseName(m);if(!map.has(n))map.set(n,[]);map.get(n).push(m)}return [...map.entries()].map(([name,movements])=>({name,movements,total:movements.reduce((s,m)=>s+Number(m.amount||0),0),from:movements.map(expenseDate).sort((a,b)=>new Date(a)-new Date(b))[0]||'',to:movements.map(expenseDate).sort((a,b)=>new Date(b)-new Date(a))[0]||''}))}
  function backExpense(target='reports'){return `<button class="secondary-btn compact" data-expense-back="${target}" type="button">${icon('back')} رجوع</button>`}
  function expenseSummaryCard(label,value,sub=''){return `<div class="v20-expense-summary"><small>${label}</small><strong>${value}</strong>${sub?`<span>${sub}</span>`:''}</div>`}
  function renderExpenseReportsMenu(){detail={kind:'expense-reports-menu'};setPageTitle('تقارير المصروفات');const count=data.movements.filter(isExpense).length,total=data.movements.filter(isExpense).reduce((s,m)=>s+Number(m.amount||0),0);$('#mainContent').innerHTML=`<div class="page-head"><div>${backExpense('reports')}<h1 style="margin-top:12px">تقارير المصروفات</h1><p>تقارير إجمالية ومفصلة حسب نوع المصروف والفترة الزمنية.</p></div><div class="head-meta">${count} حركة</div></div><div class="report-menu-list"><button class="report-menu-card" data-expense-report="general" type="button"><span class="report-menu-icon">${icon('card')}</span><span><strong>التقرير الإجمالي للمصروفات</strong><small>إجمالي المصروفات وقيمة كل نوع وفترة الصرف.</small></span><b class="v18-card-meta">${money(total)}</b></button><button class="report-menu-card" data-expense-report="detailed" type="button"><span class="report-menu-icon">${icon('receipt')}</span><span><strong>التقرير المفصل للمصروفات</strong><small>اختيار أنواع المصروفات ثم عرض جميع الحركات التابعة لكل نوع.</small></span>${icon('chevron')}</button></div>`}
  function renderExpenseGeneral(){detail={kind:'expense-report-general'};setPageTitle('التقرير الإجمالي للمصروفات');if(!ER.from||!ER.to)resetExpenseReport();const rows=expenseRows(),groups=groupedExpenses(rows),total=rows.reduce((s,m)=>s+Number(m.amount||0),0);$('#mainContent').innerHTML=`<div class="page-head"><div>${backExpense('expense-menu')}<h1 style="margin-top:12px">التقرير الإجمالي للمصروفات</h1><p>فترة التقرير: ${fmtDate(ER.from)} — ${fmtDate(ER.to)}</p></div></div><div class="v20-expense-filters"><label><span>من</span><input id="expenseGeneralFrom" type="date" value="${esc(ER.from)}"></label><label><span>إلى</span><input id="expenseGeneralTo" type="date" value="${esc(ER.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="expenseGeneralSearch" type="search" value="${esc(ER.search)}" placeholder="بحث بنوع المصروف..."></div><button class="sort-btn" data-expense-sort type="button">${icon('sort')}<span>ترتيب</span></button></div><div class="v20-expense-top">${expenseSummaryCard('إجمالي المصروفات',money(total),`${rows.length} حركة`)}${expenseSummaryCard('فترة الصرف',`${fmtDate(ER.from)} — ${fmtDate(ER.to)}`,'من إلى')}</div><div class="v20-expense-types">${groups.length?groups.map(g=>`<article class="v20-expense-type-card"><div class="v20-expense-type-head"><span>${icon('card')}</span><div><strong>${esc(g.name)}</strong><small>فترة الصرف: ${fmtDate(g.from)} — ${fmtDate(g.to)}</small></div><b>${money(g.total)}</b></div><div class="v20-expense-type-meta"><span>عدد الحركات<b>${g.movements.length}</b></span><span>قيمة مبلغ الصرف<b>${money(g.total)}</b></span></div></article>`).join(''):'<div class="empty">لا توجد مصروفات في الفترة المحددة.</div>'}</div>`}
  function expenseTypeChoices(){const selected=new Set(ER.typeNames.map(String));return allExpenseTypes().map(n=>{const total=data.movements.filter(m=>isExpense(m)&&expenseName(m)===n).reduce((s,m)=>s+Number(m.amount||0),0);return `<label class="v18-check-row"><input type="checkbox" data-expense-type value="${esc(n)}" ${selected.has(n)?'checked':''}><span class="row-icon">${icon('card')}</span><span><strong>${esc(n)}</strong><small>${money(total)} إجمالي مسجل</small></span></label>`}).join('')}
  function renderExpenseDetailedConfig(){detail={kind:'expense-report-detailed-config'};setPageTitle('اختيار المصروفات');if(!ER.from||!ER.to)resetExpenseReport();if(!ER.typeNames.length)ER.typeNames=allExpenseTypes();$('#mainContent').innerHTML=`<div class="page-head"><div>${backExpense('expense-menu')}<h1 style="margin-top:12px">التقرير المفصل للمصروفات</h1><p>حدد أنواع المصروفات والفترة الزمنية المطلوبة.</p></div></div><div class="form-grid v18-date-grid">${inputField('expenseDetailedFrom','من تاريخ','date',ER.from,'')}${inputField('expenseDetailedTo','إلى تاريخ','date',ER.to,'')}</div><div class="subscriber-select-toolbar"><div class="list-search"><span>${icon('search')}</span><input id="expenseTypeSearch" type="search" placeholder="بحث في أنواع المصروفات..."></div><button class="secondary-btn compact" data-expense-types-all type="button">تحديد الكل</button><button class="secondary-btn compact" data-expense-types-none type="button">إلغاء الكل</button></div><div id="expenseTypeChoices" class="v18-check-list">${expenseTypeChoices()||'<div class="empty">لا توجد أنواع مصروفات مضافة.</div>'}</div><div class="report-generate-actions"><button class="primary-btn" data-expense-detailed-generate type="button">${icon('chart')} إنشاء التقرير المفصل</button></div>`}
  function expenseMovementCard(m){const a=accountBy(m.accountId),name=expenseName(m);return `<article data-movement="${esc(m.id)}" class="v20-expense-movement"><div class="v20-expense-movement-head"><span>${icon('arrowUp')}</span><div><strong>${esc(name)}</strong><small>${fmtDateTime(expenseDate(m))}</small></div><b>${money(m.amount)}</b></div><div class="v18-movement-grid"><span>الحساب المالي<b>${esc(a.name||'—')}</b></span><span>نوع المصروف<b>${esc(name)}</b></span><span>تاريخ الحركة<b>${fmtDateTime(expenseDate(m))}</b></span><span>مبلغ الحركة<b>${money(m.amount)}</b></span></div>${m.notes?`<p class="v18-notes">${esc(m.notes)}</p>`:''}${m.proofImage?`<button class="v20-proof" data-expense-proof="${esc(m.id)}" type="button">${icon('image')} عرض صورة الإشعار</button>`:''}</article>`}
  function renderExpenseDetailedResult(){detail={kind:'expense-report-detailed-result'};setPageTitle('نتيجة تقرير المصروفات');const rows=expenseRows(),groups=groupedExpenses(rows),total=rows.reduce((s,m)=>s+Number(m.amount||0),0);$('#mainContent').innerHTML=`<div class="page-head"><div>${backExpense('expense-config')}<h1 style="margin-top:12px">التقرير المفصل للمصروفات</h1><p>فترة الصرف: ${fmtDate(ER.from)} — ${fmtDate(ER.to)}</p></div><div class="head-meta">${ER.typeNames.length} نوع</div></div><div class="v20-expense-filters"><label><span>من</span><input id="expenseResultFrom" type="date" value="${esc(ER.from)}"></label><label><span>إلى</span><input id="expenseResultTo" type="date" value="${esc(ER.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="expenseResultSearch" type="search" value="${esc(ER.search)}" placeholder="بحث في الحركات..."></div><button class="sort-btn" data-expense-sort type="button">${icon('sort')}<span>ترتيب</span></button></div><div class="v20-expense-top">${expenseSummaryCard('إجمالي المصروفات',money(total),`${rows.length} حركة`)}${expenseSummaryCard('فترة الصرف',`${fmtDate(ER.from)} — ${fmtDate(ER.to)}`,'من إلى')}</div><div class="v20-expense-detail-stack">${groups.length?groups.map(g=>`<section class="v20-expense-group"><div class="v20-expense-group-head"><span class="report-menu-icon">${icon('card')}</span><div><strong>${esc(g.name)}</strong><small>${g.movements.length} حركة • ${fmtDate(g.from)} — ${fmtDate(g.to)}</small></div><b>${money(g.total)}</b></div><div class="v20-expense-movement-list">${g.movements.map(expenseMovementCard).join('')}</div></section>`).join(''):'<div class="empty">لا توجد حركات مصروفات مطابقة.</div>'}</div>`}
  function openExpenseSort(){openModal('ترتيب المصروفات',`<div class="picker-options"><button class="picker-option" data-expense-sort-value="amount-desc" type="button">المبلغ: الأعلى أولاً</button><button class="picker-option" data-expense-sort-value="amount-asc" type="button">المبلغ: الأقل أولاً</button><button class="picker-option" data-expense-sort-value="date-desc" type="button">التاريخ: الأحدث أولاً</button><button class="picker-option" data-expense-sort-value="date-asc" type="button">التاريخ: الأقدم أولاً</button></div>`)}

  // Name the reports card consistently.
  const previousReportsRenderer=renderReports;
  renderReports=function(){previousReportsRenderer();const card=$('[data-report-main="expenses"] strong');if(card)card.textContent='تقارير المصروفات'};

  const previousRenderExpense=render;
  render=function(){
    if(detail?.kind==='expense-reports-menu'){renderNav();renderExpenseReportsMenu();hydrateIcons();renderFab();return}
    if(detail?.kind==='expense-report-general'){renderNav();renderExpenseGeneral();hydrateIcons();renderFab();return}
    if(detail?.kind==='expense-report-detailed-config'){renderNav();renderExpenseDetailedConfig();hydrateIcons();renderFab();return}
    if(detail?.kind==='expense-report-detailed-result'){renderNav();renderExpenseDetailedResult();hydrateIcons();renderFab();return}
    return previousRenderExpense();
  };

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const main=e.target.closest('[data-report-main="expenses"]');if(main){e.preventDefault();e.stopPropagation();resetExpenseReport();renderExpenseReportsMenu();hydrateIcons();renderFab();return}
    const type=e.target.closest('[data-expense-report]');if(type){e.preventDefault();e.stopPropagation();ER.type=type.dataset.expenseReport;ER.search='';ER.sort='date-desc';ER.from=expenseOpening();ER.to=today();if(ER.type==='general')renderExpenseGeneral();else{ER.typeNames=allExpenseTypes();renderExpenseDetailedConfig()}hydrateIcons();renderFab();return}
    const back=e.target.closest('[data-expense-back]');if(back){e.preventDefault();e.stopPropagation();const t=back.dataset.expenseBack;if(t==='reports'){detail=null;currentPage='reports';render()}else if(t==='expense-menu')renderExpenseReportsMenu();else if(t==='expense-config')renderExpenseDetailedConfig();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-expense-types-all]')){ER.typeNames=allExpenseTypes();const root=$('#expenseTypeChoices');if(root)root.innerHTML=expenseTypeChoices();return}
    if(e.target.closest('[data-expense-types-none]')){ER.typeNames=[];const root=$('#expenseTypeChoices');if(root)root.innerHTML=expenseTypeChoices();return}
    if(e.target.closest('[data-expense-detailed-generate]')){ER.from=$('[name=expenseDetailedFrom]')?.value||ER.from;ER.to=$('[name=expenseDetailedTo]')?.value||ER.to;if(new Date(ER.from)>new Date(ER.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');if(!ER.typeNames.length)return toast('اختر نوع مصروف واحداً على الأقل','تنبيه');ER.search='';renderExpenseDetailedResult();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-expense-sort]')){openExpenseSort();return}
    const sv=e.target.closest('[data-expense-sort-value]');if(sv){ER.sort=sv.dataset.expenseSortValue;closeModal();if(detail?.kind==='expense-report-general')renderExpenseGeneral();else renderExpenseDetailedResult();hydrateIcons();return}
    const proof=e.target.closest('[data-expense-proof]');if(proof){const m=data.movements.find(x=>String(x.id)===String(proof.dataset.expenseProof));if(m?.proofImage)openModal('صورة إشعار المصروف',`<div class="full-image-view"><img src="${m.proofImage}" alt="إشعار المصروف"></div>`);return}
  },true);
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-expense-type]')){const n=String(e.target.value),set=new Set(ER.typeNames.map(String));if(e.target.checked)set.add(n);else set.delete(n);ER.typeNames=[...set]}
    if(e.target.id==='expenseGeneralFrom'){ER.from=e.target.value;renderExpenseGeneral();hydrateIcons()}
    if(e.target.id==='expenseGeneralTo'){ER.to=e.target.value;renderExpenseGeneral();hydrateIcons()}
    if(e.target.id==='expenseResultFrom'){ER.from=e.target.value;renderExpenseDetailedResult();hydrateIcons()}
    if(e.target.id==='expenseResultTo'){ER.to=e.target.value;renderExpenseDetailedResult();hydrateIcons()}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='expenseTypeSearch'){const q=e.target.value.trim().toLowerCase();$$('#expenseTypeChoices .v18-check-row').forEach(el=>el.style.display=el.textContent.toLowerCase().includes(q)?'':'none')}
    if(e.target.id==='expenseGeneralSearch'){ER.search=e.target.value;clearTimeout(window.__erg);window.__erg=setTimeout(()=>{renderExpenseGeneral();hydrateIcons()},140)}
    if(e.target.id==='expenseResultSearch'){ER.search=e.target.value;clearTimeout(window.__erd);window.__erd=setTimeout(()=>{renderExpenseDetailedResult();hydrateIcons()},140)}
  });
})();


/* ==== v21 timeline reports ==== */
(function(){
  const TR={from:'',to:'',actorKeys:[],search:'',sort:'date-desc'};
  const timelineToday=()=>dateOnly(new Date())||new Date().toISOString().slice(0,10);
  function timelineOpening(){
    const ds=(data.logs||[]).map(l=>new Date(l.date||l.createdAt||0)).filter(d=>!Number.isNaN(d.getTime())).sort((a,b)=>a-b);
    return ds.length?dateOnly(ds[0]):timelineToday();
  }
  function resetTimelineReport(){TR.from=timelineOpening();TR.to=timelineToday();TR.actorKeys=[];TR.search='';TR.sort='date-desc'}
  function trActorOf(l){
    const name=l.actorName||l.actor||'مستخدم غير معروف';
    let type=l.actorType||'';
    if(!type){
      const owner=data.settings?.ownerName||session?.ownerName||'';
      type=(owner&&name===owner)?'manager':'employee';
    }
    if(type==='owner'||type==='admin')type='manager';
    const id=l.actorId||name;
    return {name,type,id,key:`${type}|${id}|${name}`};
  }
  const trRole=t=>t==='manager'?'مدير':'موظف';
  function trKind(l){
    const kind=String(l.kind||''); if(kind)return kind;
    const t=String(l.title||'');
    if(t.includes('حذف'))return'delete';if(t.includes('تعديل'))return'edit';if(t.includes('إضافة'))return'add';
    if(t.includes('استقبال')||t.includes('إرسال')||t.includes('تحويل')||t.includes('مصروف')||t.includes('دفعة'))return'finance';
    if(t.includes('دخول')||t.includes('خروج'))return'session';return'other';
  }
  function trKindLabel(k){return k==='delete'?'حذف':k==='edit'?'تعديل':k==='add'?'إضافة':k==='finance'?'حركة مالية':k==='session'?'جلسة':'حركة'}
  function trKindIcon(k){return k==='delete'?'trash':k==='edit'?'edit':k==='add'?'plus':k==='finance'?'wallet':k==='session'?'userCog':'clock'}
  function timelineActors(){
    const map=new Map();
    (data.logs||[]).forEach(l=>{const a=trActorOf(l),g=map.get(a.key)||{...a,count:0,lastDate:l.date||l.createdAt};g.count++;if(new Date(l.date||0)>new Date(g.lastDate||0))g.lastDate=l.date;map.set(a.key,g)});
    return [...map.values()].sort((a,b)=>(a.type===b.type?String(a.name).localeCompare(String(b.name),'ar'):(a.type==='manager'?-1:1)));
  }
  function trInRange(v){
    const d=new Date(v||0); if(Number.isNaN(d.getTime()))return false;
    const f=new Date(`${TR.from||timelineOpening()}T00:00:00`),t=new Date(`${TR.to||timelineToday()}T23:59:59.999`);
    return d>=f&&d<=t;
  }
  function trSelectedRows(){
    const set=new Set(TR.actorKeys.map(String)),q=(TR.search||'').trim().toLowerCase();
    let rows=(data.logs||[]).filter(l=>set.has(trActorOf(l).key)&&trInRange(l.date||l.createdAt));
    if(q)rows=rows.filter(l=>{const a=trActorOf(l);return `${l.title||''} ${l.meta||''} ${a.name} ${trRole(a.type)}`.toLowerCase().includes(q)});
    rows.sort((a,b)=>TR.sort==='date-asc'?new Date(a.date||0)-new Date(b.date||0):new Date(b.date||0)-new Date(a.date||0));
    return rows;
  }
  function trActorChoices(){
    const selected=new Set(TR.actorKeys.map(String));
    return timelineActors().map(a=>`<label class="v18-check-row timeline-report-actor"><input type="checkbox" data-timeline-report-actor value="${esc(a.key)}" ${selected.has(a.key)?'checked':''}><span class="row-icon">${icon(a.type==='manager'?'userCog':'users')}</span><span><strong>${esc(a.name)}</strong><small>${trRole(a.type)} • ${a.count} حركة مسجلة</small></span></label>`).join('');
  }
  function trBack(target='reports'){return `<button class="secondary-btn compact" data-timeline-report-back="${target}" type="button">${icon('back')} رجوع</button>`}
  function renderTimelineReportConfig(){
    detail={kind:'timeline-report-config'};setPageTitle('تقارير السجل الزمني');if(!TR.from||!TR.to)resetTimelineReport();
    const actors=timelineActors();
    $('#mainContent').innerHTML=`<div class="page-head"><div>${trBack('reports')}<h1 style="margin-top:12px">تقارير السجل الزمني</h1><p>اختر مديراً أو موظفاً واحداً أو أكثر وحدد الفترة الزمنية للتقرير.</p></div><div class="head-meta">${actors.length} مستخدم</div></div><div class="form-grid v18-date-grid">${inputField('timelineReportFrom','من تاريخ','date',TR.from,'')}${inputField('timelineReportTo','إلى تاريخ','date',TR.to,'')}</div><div class="subscriber-select-toolbar"><div class="list-search"><span>${icon('search')}</span><input id="timelineActorSearch" type="search" placeholder="بحث باسم المدير أو الموظف..."></div><button class="secondary-btn compact" data-timeline-actors-all type="button">تحديد الكل</button><button class="secondary-btn compact" data-timeline-actors-none type="button">إلغاء الكل</button></div><div id="timelineActorChoices" class="v18-check-list timeline-actor-choices">${trActorChoices()||'<div class="empty">لا توجد حركات مسجلة لمستخدمين حتى الآن.</div>'}</div><div class="report-generate-actions"><button class="primary-btn" data-timeline-report-generate type="button">${icon('chart')} إنشاء تقرير السجل الزمني</button></div>`;
  }
  function trLogCard(l){
    const a=trActorOf(l),kind=trKind(l);
    return `<article class="timeline-report-log"><span class="timeline-report-log-icon ${kind}">${icon(trKindIcon(kind))}</span><div class="timeline-report-log-copy"><strong>${esc(l.title||'حركة داخل التطبيق')}</strong><small>${fmtDateTime(l.date||l.createdAt)} • ${trKindLabel(kind)}</small>${l.meta?`<p>${esc(l.meta)}</p>`:''}</div></article>`;
  }
  function trActorSection(a,rows){
    return `<section class="timeline-report-section"><div class="v18-section-head"><span class="report-menu-icon">${icon(a.type==='manager'?'userCog':'users')}</span><div><strong>السجل الزمني الخاص بـ ${esc(a.name)}</strong><small>${trRole(a.type)} • الفترة من ${fmtDate(TR.from)} إلى ${fmtDate(TR.to)}</small></div><b>${rows.length} حركة</b></div><div class="timeline-report-log-list">${rows.length?rows.map(trLogCard).join(''):'<div class="empty compact-empty">لا توجد حركات لهذا المستخدم في الفترة المحددة.</div>'}</div></section>`;
  }
  function renderTimelineReportResult(){
    detail={kind:'timeline-report-result'};setPageTitle('نتيجة تقرير السجل الزمني');
    const rows=trSelectedRows(),actors=timelineActors().filter(a=>TR.actorKeys.includes(a.key));
    const sections=actors.map(a=>trActorSection(a,rows.filter(l=>trActorOf(l).key===a.key))).join('');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${trBack('config')}<h1 style="margin-top:12px">تقرير السجل الزمني</h1><p>الفترة من ${fmtDate(TR.from)} إلى ${fmtDate(TR.to)}</p></div><div class="head-meta">${actors.length} مستخدم</div></div><div class="report-result-controls timeline-report-controls"><label><span>من</span><input id="timelineResultFrom" type="date" value="${esc(TR.from)}"></label><label><span>إلى</span><input id="timelineResultTo" type="date" value="${esc(TR.to)}"></label><div class="list-search"><span>${icon('search')}</span><input id="timelineResultSearch" type="search" value="${esc(TR.search)}" placeholder="بحث في حركات التقرير..."></div><button class="sort-btn" data-timeline-report-sort type="button">${icon('sort')}<span>ترتيب</span></button></div><div class="v18-summary-grid timeline-report-summary"><div class="v18-summary-card"><small>إجمالي عدد الحركات</small><strong>${rows.length}</strong><span>لكل الحسابات المختارة</span></div><div class="v18-summary-card"><small>الفترة الزمنية</small><strong>${fmtDate(TR.from)}</strong><span>إلى ${fmtDate(TR.to)}</span></div><div class="v18-summary-card"><small>عدد المدراء والموظفين</small><strong>${actors.length}</strong><span>${actors.filter(a=>a.type==='manager').length} مدير • ${actors.filter(a=>a.type!=='manager').length} موظف</span></div></div><div class="v18-report-stack">${sections||'<div class="empty">لا توجد حركات مطابقة لشروط التقرير.</div>'}</div>`;
  }
  function openTimelineSort(){openModal('ترتيب السجل الزمني',`<div class="picker-options"><button class="picker-option ${TR.sort==='date-desc'?'selected':''}" data-timeline-sort-value="date-desc" type="button">التاريخ: الأحدث أولاً</button><button class="picker-option ${TR.sort==='date-asc'?'selected':''}" data-timeline-sort-value="date-asc" type="button">التاريخ: الأقدم أولاً</button></div>`)}

  const prevReports=renderReports;
  renderReports=function(){
    prevReports();
    const grid=$('#mainContent .report-main-grid');
    if(grid&&!grid.querySelector('[data-report-main="timeline"]'))grid.insertAdjacentHTML('beforeend',`<button class="report-main-card" data-report-main="timeline" type="button"><span class="report-menu-icon">${icon('clock')}</span><span><strong>تقارير السجل الزمني</strong><small>${(data.logs||[]).length} حركة مسجلة</small></span>${icon('chevron')}</button>`);
  };

  const prevRenderTimeline=render;
  render=function(){
    if(detail?.kind==='timeline-report-config'){renderNav();renderTimelineReportConfig();hydrateIcons();renderFab();return}
    if(detail?.kind==='timeline-report-result'){renderNav();renderTimelineReportResult();hydrateIcons();renderFab();return}
    return prevRenderTimeline();
  };

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const main=e.target.closest('[data-report-main="timeline"]');if(main){e.preventDefault();e.stopPropagation();resetTimelineReport();renderTimelineReportConfig();hydrateIcons();renderFab();return}
    const back=e.target.closest('[data-timeline-report-back]');if(back){e.preventDefault();e.stopPropagation();if(back.dataset.timelineReportBack==='reports'){detail=null;currentPage='reports';render()}else renderTimelineReportConfig();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-timeline-actors-all]')){TR.actorKeys=timelineActors().map(a=>a.key);const root=$('#timelineActorChoices');if(root)root.innerHTML=trActorChoices();return}
    if(e.target.closest('[data-timeline-actors-none]')){TR.actorKeys=[];const root=$('#timelineActorChoices');if(root)root.innerHTML=trActorChoices();return}
    if(e.target.closest('[data-timeline-report-generate]')){
      TR.from=$('[name=timelineReportFrom]')?.value||TR.from;TR.to=$('[name=timelineReportTo]')?.value||TR.to;
      if(new Date(TR.from)>new Date(TR.to))return toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية','تنبيه');
      if(!TR.actorKeys.length)return toast('اختر مديراً أو موظفاً واحداً على الأقل','تنبيه');
      TR.search='';renderTimelineReportResult();hydrateIcons();renderFab();return;
    }
    if(e.target.closest('[data-timeline-report-sort]')){openTimelineSort();return}
    const sort=e.target.closest('[data-timeline-sort-value]');if(sort){TR.sort=sort.dataset.timelineSortValue;closeModal();renderTimelineReportResult();hydrateIcons();return}
  },true);
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-timeline-report-actor]')){const key=String(e.target.value),set=new Set(TR.actorKeys.map(String));if(e.target.checked)set.add(key);else set.delete(key);TR.actorKeys=[...set]}
    if(e.target.id==='timelineResultFrom'){TR.from=e.target.value;renderTimelineReportResult();hydrateIcons()}
    if(e.target.id==='timelineResultTo'){TR.to=e.target.value;renderTimelineReportResult();hydrateIcons()}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='timelineActorSearch'){const q=e.target.value.trim().toLowerCase();$$('#timelineActorChoices .timeline-report-actor').forEach(el=>{el.style.display=el.textContent.toLowerCase().includes(q)?'':'none'})}
    if(e.target.id==='timelineResultSearch'){TR.search=e.target.value;clearTimeout(window.__timelineReportSearch);window.__timelineReportSearch=setTimeout(()=>{renderTimelineReportResult();hydrateIcons()},140)}
  });
})();

/* ==== v22 summary reports from home dashboard ==== */
(()=>{
  const SUMMARY_REPORTS={
    subscribers:{title:'ملخص المشتركين',sub:'المشتركين والعدادات والاستحقاقات خلال الفترة',icon:'users'},
    meters:{title:'ملخص العدادات',sub:'العدادات والمناطق ولوحات التوزيع والاستهلاك',icon:'meter'},
    power:{title:'ملخص استهلاك الكهرباء',sub:'الاستهلاك والتكلفة ومتوسط سعر البيع',icon:'meter'},
    flows:{title:'ملخص قائمة التدفقات النقدية',sub:'الفواتير والتحصيلات والمصروفات والاستحقاقات',icon:'wallet'},
    accounts:{title:'ملخص الحسابات المالية',sub:'الوارد والصادر وصافي حركة الحسابات خلال الفترة',icon:'bank'}
  };
  const summaryReportState={type:'subscribers'};

  function srBack(target='reports'){
    return `<button class="secondary-btn compact" data-summary-report-back="${target}" type="button">${icon('back')} رجوع</button>`;
  }
  function srPeriodLabel(){
    const labels={all:'من بداية البيانات إلى اليوم',today:'اليوم',week:'آخر 7 أيام',month:'هذا الشهر',year:'هذه السنة'};
    if(dashboardFilter.mode==='range')return `${fmtDate(dashboardFilter.from)} — ${fmtDate(dashboardFilter.to)}`;
    return labels[dashboardFilter.mode]||labels.all;
  }
  function srScopedInvoices(){return filtered('invoices')}
  function srScopedMovements(){return filtered('movements')}
  function srScopedSubscriberIds(){
    if(!timeBounds())return new Set((data.subscribers||[]).map(s=>String(s.id)));
    const ids=new Set();
    (data.subscribers||[]).forEach(s=>{if(inRange(s.createdAt||s.created_at))ids.add(String(s.id))});
    srScopedInvoices().forEach(i=>ids.add(String(i.subscriberId)));
    srScopedMovements().forEach(m=>{if(m.subscriberId)ids.add(String(m.subscriberId))});
    (data.meters||[]).forEach(m=>{if(inRange(m.createdAt||m.openingDate))ids.add(String(m.subscriberId))});
    return ids;
  }
  function srScopedMeters(){
    if(!timeBounds())return [...(data.meters||[])];
    const invoiceMeterIds=new Set(srScopedInvoices().map(i=>String(i.meterId)));
    return (data.meters||[]).filter(m=>inRange(m.createdAt||m.openingDate)||invoiceMeterIds.has(String(m.id)));
  }
  function srAccountMovementTotals(acc){
    let incoming=0,outgoing=0;
    for(const m of srScopedMovements()){
      const amount=Number(m.amount||0),t=movementType(m);
      const to=m.accountId||m.toAccountId||m.accountToId||'';
      const from=m.accountId||m.fromAccountId||m.accountFromId||'';
      if((t==='collection'||t==='deposit')&&String(to)===String(acc.id))incoming+=amount;
      if((t==='send'||t==='expense')&&String(from)===String(acc.id))outgoing+=amount;
      if(t==='transfer'){
        if(String(m.toAccountId||m.accountToId||'')===String(acc.id))incoming+=amount;
        if(String(m.fromAccountId||m.accountFromId||'')===String(acc.id))outgoing+=amount;
      }
    }
    return {incoming,outgoing,net:incoming-outgoing};
  }
  function srMetric(label,value,sub='',ic='chart'){
    return `<div class="v18-summary-card summary-report-metric"><span class="summary-report-metric-icon">${icon(ic)}</span><small>${label}</small><strong>${value}</strong>${sub?`<span>${sub}</span>`:''}</div>`;
  }
  function renderSummaryReportsMenu(){
    detail={kind:'summary-reports-menu'};setPageTitle('تقارير الملخصات');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${srBack('reports')}<h1 style="margin-top:12px">تقارير الملخصات</h1><p>نفس ملخصات الصفحة الرئيسية مع احتساب النتائج حسب الفترة الزمنية المختارة.</p></div><div class="head-meta">5 تقارير</div></div>${timeFilterHtml()}<div class="report-menu-list">${Object.entries(SUMMARY_REPORTS).map(([id,r])=>`<button class="report-menu-card" data-summary-report-type="${id}" type="button"><span class="report-menu-icon">${icon(r.icon)}</span><span><strong>${r.title}</strong><small>${r.sub}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
  }
  function renderSummarySubscribers(){
    const ids=srScopedSubscriberIds(),subs=(data.subscribers||[]).filter(s=>ids.has(String(s.id))),meters=srScopedMeters();
    const s=stats();
    return `<div class="v18-summary-grid summary-report-grid">${srMetric('عدد المشتركين',subs.length,'ضمن الفترة أو لهم حركة خلالها','users')}${srMetric('عدد العدادات',meters.length,'العدادات المرتبطة بالفترة','meter')}${srMetric('المستحق على المشتركين',money(s.dueFrom),'حسب الفواتير والدفعات في الفترة','arrowUp')}${srMetric('المستحق للمشتركين',money(s.dueTo),'أرصدة لصالح المشتركين في الفترة','arrowDown')}</div>`;
  }
  function renderSummaryMeters(){
    const meters=srScopedMeters(),regions=new Set(meters.map(m=>String(m.regionId)).filter(Boolean)),boards=new Set(meters.map(m=>String(m.boardId)).filter(Boolean)),subs=new Set(meters.map(m=>String(m.subscriberId)).filter(Boolean));
    const inv=srScopedInvoices().filter(i=>meters.some(m=>String(m.id)===String(i.meterId))),cons=inv.reduce((a,i)=>a+Number(i.consumption||0),0),cost=inv.reduce((a,i)=>a+invoiceNet(i),0);
    return `<div class="v18-summary-grid summary-report-grid">${srMetric('إجمالي العدادات',meters.length,'عداد ضمن الفترة','meter')}${srMetric('إجمالي المناطق',regions.size,'مناطق مرتبطة بالعدادات','mapPin')}${srMetric('إجمالي لوحات التوزيع',boards.size,'لوحات مرتبطة بالعدادات','panel')}${srMetric('إجمالي المشتركين',subs.size,'مشتركون لديهم عدادات ضمن الفترة','users')}${srMetric('إجمالي استهلاك العدادات',`${num(cons)} KW`,'الاستهلاك المسجل في الفواتير','chart')}${srMetric('إجمالي تكلفة الاستهلاك',money(cost),'قيمة استهلاك هذه العدادات','receipt')}</div>`;
  }
  function renderSummaryPower(){
    const inv=srScopedInvoices(),cons=inv.reduce((a,i)=>a+Number(i.consumption||0),0),cost=inv.reduce((a,i)=>a+invoiceNet(i),0),avg=cons?cost/cons:0,meters=new Set(inv.map(i=>String(i.meterId))),subs=new Set(inv.map(i=>String(i.subscriberId)));
    return `<div class="v18-summary-grid summary-report-grid">${srMetric('إجمالي استهلاك الكهرباء',`${num(cons)} KW`,'خلال الفترة المختارة','meter')}${srMetric('إجمالي تكلفة الاستهلاك',money(cost),'إجمالي قيمة الفواتير','receipt')}${srMetric('متوسط سعر بيع KW',money(avg),'التكلفة ÷ الاستهلاك','chart')}${srMetric('عدد العدادات المستهلكة',meters.size,'عداد له فاتورة في الفترة','meter')}${srMetric('عدد المشتركين المستهلكين',subs.size,'مشترك له فاتورة في الفترة','users')}${srMetric('عدد الفواتير',inv.length,'الفواتير المحتسبة في الملخص','receipt')}</div>`;
  }
  function renderSummaryFlows(){
    const s=stats();
    return `<div class="v18-summary-grid summary-report-grid">${srMetric('إجمالي ثمن الفواتير',money(s.invoiceTotal),'قيمة الفواتير في الفترة','receipt')}${srMetric('إجمالي المبالغ المحصلة',money(s.collections),'تحصيلات المشتركين','arrowDown')}${srMetric('المستحق على المشتركين',money(s.dueFrom),'مبالغ لم يتم تحصيلها','arrowUp')}${srMetric('المستحق للمشتركين',money(s.dueTo),'أرصدة لصالح المشتركين','arrowDown')}${srMetric('إجمالي المصروفات',money(s.expenses),'المصروف خلال الفترة','expense')}${srMetric('حقوق الملكية',money(s.equity),'الفواتير - المصروفات - المستحق لهم','wallet')}${srMetric('إجمالي التدفقات المالية',money(s.flows),'حسب معادلة التدفقات المعتمدة','transfer')}${srMetric('صافي التدفق المالي',money(s.net),'رأس المال - المصروفات - المستحق عليهم','chart')}${srMetric('إجمالي الخصومات',money(s.discount),'خصومات الفواتير في الفترة','receipt')}</div>`;
  }
  function renderSummaryAccounts(){
    const accounts=(data.accounts||[]),rows=accounts.map(a=>({a,...srAccountMovementTotals(a)}));
    const active=timeBounds()?rows.filter(x=>x.incoming||x.outgoing||inRange(x.a.createdAt)):rows;
    const totalIn=active.reduce((s,x)=>s+x.incoming,0),totalOut=active.reduce((s,x)=>s+x.outgoing,0),net=totalIn-totalOut;
    const cash=active.filter(x=>x.a.type==='cash').reduce((s,x)=>s+x.net,0),bank=active.filter(x=>x.a.type==='bank').reduce((s,x)=>s+x.net,0);
    return `<div class="v18-summary-grid summary-report-grid">${srMetric('الحسابات ذات العلاقة بالفترة',active.length,'حسابات أضيفت أو تحركت في الفترة','bank')}${srMetric('إجمالي الوارد',money(totalIn),'الإيداعات والتحصيلات والتحويلات الواردة','arrowDown')}${srMetric('إجمالي الصادر',money(totalOut),'الإرسالات والمصروفات والتحويلات الصادرة','arrowUp')}${srMetric('صافي حركة الحسابات',money(net),'الوارد - الصادر خلال الفترة','transfer')}${srMetric('صافي حركة الحسابات النقدية',money(cash),'الحسابات النقدية خلال الفترة','wallet')}${srMetric('صافي حركة الحسابات البنكية',money(bank),'الحسابات البنكية خلال الفترة','bank')}</div>`;
  }
  function renderSummaryReportResult(type=summaryReportState.type){
    summaryReportState.type=SUMMARY_REPORTS[type]?type:'subscribers';const r=SUMMARY_REPORTS[summaryReportState.type];detail={kind:'summary-report-result',reportType:summaryReportState.type};setPageTitle(r.title);
    let body='';
    if(summaryReportState.type==='subscribers')body=renderSummarySubscribers();
    else if(summaryReportState.type==='meters')body=renderSummaryMeters();
    else if(summaryReportState.type==='power')body=renderSummaryPower();
    else if(summaryReportState.type==='flows')body=renderSummaryFlows();
    else body=renderSummaryAccounts();
    $('#mainContent').innerHTML=`<div class="page-head"><div>${srBack('menu')}<h1 style="margin-top:12px">${r.title}</h1><p>فترة التقرير: ${srPeriodLabel()}</p></div><div class="head-meta">ملخص زمني</div></div>${timeFilterHtml()}<section class="summary-report-period"><span>${icon('clock')}</span><div><small>الفترة الزمنية المحتسبة</small><strong>${srPeriodLabel()}</strong></div></section>${body}`;
  }

  const prevReportsSummary=renderReports;
  renderReports=function(){
    prevReportsSummary();
    const grid=$('#mainContent .report-main-grid');
    if(grid&&!grid.querySelector('[data-report-main="summaries"]'))grid.insertAdjacentHTML('beforeend',`<button class="report-main-card" data-report-main="summaries" type="button"><span class="report-menu-icon">${icon('chart')}</span><span><strong>تقارير الملخصات</strong><small>5 ملخصات من الصفحة الرئيسية</small></span>${icon('chevron')}</button>`);
  };

  const prevRenderSummary=render;
  render=function(){
    if(detail?.kind==='summary-reports-menu'){renderNav();renderSummaryReportsMenu();hydrateIcons();renderFab();return;}
    if(detail?.kind==='summary-report-result'){renderNav();renderSummaryReportResult(detail.reportType);hydrateIcons();renderFab();return;}
    return prevRenderSummary();
  };

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const main=e.target.closest('[data-report-main="summaries"]');
    if(main){e.preventDefault();e.stopPropagation();renderSummaryReportsMenu();hydrateIcons();renderFab();return;}
    const type=e.target.closest('[data-summary-report-type]');
    if(type){e.preventDefault();e.stopPropagation();summaryReportState.type=type.dataset.summaryReportType;renderSummaryReportResult(summaryReportState.type);hydrateIcons();renderFab();return;}
    const back=e.target.closest('[data-summary-report-back]');
    if(back){e.preventDefault();e.stopPropagation();if(back.dataset.summaryReportBack==='reports'){detail=null;currentPage='reports';render();}else renderSummaryReportsMenu();hydrateIcons();renderFab();return;}
  },true);
})();

/* ==== v23 final settings / message templates / access / support ==== */
(function(){
  const V23_TEMPLATE_DEFAULTS={
    summary:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nالملخص الإجمالي\n{{ملخص_العدادات}}`,
    invoice:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nتفاصيل فاتورة الكهرباء\n{{تفاصيل_الفاتورة}}\n\nالملخص الإجمالي\n{{ملخص_العدادات}}`,
    payment:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nنود إعلامكم أنه تم استلام دفعة من طرفكم.\nيوم الدفع: {{تاريخ_الحركة}}\nالمبلغ: {{مبلغ_الحركة}}\nوأودعت هذه الدفعة في حساب: {{اسم_الحساب}}\n\nالملخص الإجمالي\n{{ملخص_العدادات}}`,
    send:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nنود إعلامكم أنه تم إرسال دفعة لكم.\nيوم الدفع: {{تاريخ_الحركة}}\nالمبلغ: {{مبلغ_الحركة}}\nوأرسلت هذه الدفعة من حساب: {{اسم_الحساب}}\n\nالملخص الإجمالي\n{{ملخص_العدادات}}`,
    transferFrom:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nنود إعلامكم أنه تم تحويل مبلغ مالي من حسابكم {{اسم_المحول_منه}} إلى حساب المشترك {{اسم_المحول_اليه}}.\nالمبلغ: {{مبلغ_الحركة}}\nتاريخ التحويل: {{تاريخ_الحركة}}\n\nالملخص الإجمالي\n{{ملخص_العدادات}}`,
    transferTo:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nنود إعلامكم أنه تم تحويل مبلغ مالي من حساب المشترك {{اسم_المحول_منه}} إلى حسابكم {{اسم_المحول_اليه}}.\nالمبلغ: {{مبلغ_الحركة}}\nتاريخ التحويل: {{تاريخ_الحركة}}\n\nالملخص الإجمالي\n{{ملخص_العدادات}}`,
    customBase:`مرحبا {{اسم_المشترك}}\nاليوم: {{التاريخ_والوقت}}\nاسم الشبكة: {{اسم_الشبكة}}\nاسم الحساب المرسل: {{اسم_المرسل}}\n\nاكتب رسالتك هنا...`
  };
  const V23_TEMPLATE_META={
    summary:['قالب الملخص','يُرسل من قائمة المشتركين.','users'],
    invoice:['قالب الفواتير','يُرسل من قائمة الفواتير.','receipt'],
    payment:['قالب الدفعات المالية','للتحصيلات والإيداعات.','arrowDown'],
    send:['قالب الإرسالات المالية','للإرسالات المالية للمشترك.','arrowUp'],
    transferFrom:['تحويل بين المشتركين — المحول منه','رسالة صاحب الحساب المحول منه.','transfer'],
    transferTo:['تحويل بين المشتركين — المحول إليه','رسالة صاحب الحساب المحول إليه.','transfer'],
    customBase:['القالب السابع — الرسالة الاستعلامية','قالب فارغ كأساس للقوالب المخصصة.','message']
  };

  function ensureV23Settings(){
    data.settings=data.settings||{};
    const s=data.settings;
    if(!s.networkName)s.networkName=session?.companyName||'';
    if(!s.ownerName)s.ownerName=session?.ownerName||session?.actorName||'';
    if(s.networkLoginUsername===undefined)s.networkLoginUsername=session?.username||'';
    if(s.networkLoginPassword===undefined)s.networkLoginPassword='';
    if(s.activationCode===undefined)s.activationCode=session?.subscriptionId||'';
    if(!s.messageTemplates||typeof s.messageTemplates!=='object')s.messageTemplates={};
    Object.entries(V23_TEMPLATE_DEFAULTS).forEach(([k,v])=>{if(!s.messageTemplates[k])s.messageTemplates[k]=v});
    if(!Array.isArray(s.customMessageTemplates))s.customMessageTemplates=[];
    if(s.subscriberSupportEnabled===undefined)s.subscriberSupportEnabled=true;
    if(s.notificationsEnabled===undefined)s.notificationsEnabled=true;
    if(s.notificationScheduleEnabled===undefined)s.notificationScheduleEnabled=false;
    if(!s.notificationStart)s.notificationStart='08:00';
    if(!s.notificationEnd)s.notificationEnd='22:00';
    if(!s.appLanguage)s.appLanguage='ar';
    document.documentElement.lang=s.appLanguage;document.documentElement.dir=s.appLanguage==='en'?'ltr':'rtl';
    (data.subscribers||[]).forEach(x=>{if(!x.status)x.status='active'});
  }
  function saveSettingsV23(){ensureV23Settings();save('settings');}
  function v23Actor(){return session?.actorName||data.settings?.ownerName||session?.ownerName||session?.username||'مدير الشبكة'}
  function v23NetworkName(){return data.settings?.networkName||session?.companyName||data.settings?.platformName||'شبكة الكهرباء'}
  function v23AvgPrice(invoices=[]){const cons=invoices.reduce((a,i)=>a+Number(i.consumption||0),0);if(cons>0)return invoices.reduce((a,i)=>a+Number(i.consumption||0)*Number(i.unitPrice||0),0)/cons;return invoices.length?invoices.reduce((a,i)=>a+Number(i.unitPrice||0),0)/invoices.length:0}
  function v23MeterSummary(sub){
    const snap=subscriberSnapshot(sub.id),meters=data.meters.filter(m=>String(m.subscriberId)===String(sub.id));
    if(!meters.length)return `لا توجد عدادات مسجلة للمشترك.\nإجمالي المبلغ المدفوع: ${money(snap.paid)}\nإجمالي المبلغ المتبقي عليه: ${money(snap.dueFrom)}\nإجمالي المبلغ المتبقي له: ${money(snap.dueTo)}`;
    return meters.map((m,idx)=>{
      const inv=data.invoices.filter(i=>String(i.meterId)===String(m.id)).sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));
      const last=inv[inv.length-1],cons=inv.reduce((a,i)=>a+Number(i.consumption||0),0),cost=inv.reduce((a,i)=>a+invoiceNet(i),0),avg=v23AvgPrice(inv);
      const lastReading=last?.closingReading??m.lastReading??m.openingReading??0,lastDate=last?.periodTo||last?.date||m.lastReadingDate||m.openingDate;
      return [`${idx+1}. اسم العداد: ${m.label||'عداد'} — رقم العداد: ${m.meterNumber||'—'}`,`القراءة الافتتاحية: ${num(m.openingReading||0)} KW — ${fmtDate(m.openingDate)}`,`القراءة الأخيرة: ${num(lastReading)} KW — ${fmtDate(lastDate)}`,`إجمالي استهلاك الكهرباء: ${num(cons)} KW`,`متوسط سعر الكيلو: ${money(avg)}`,`إجمالي ثمن الفواتير: ${money(cost)}`,`إجمالي المبلغ المدفوع: ${money(snap.paid)}`,`إجمالي المبلغ المتبقي عليه: ${money(snap.dueFrom)}`,`إجمالي المبلغ المتبقي له: ${money(snap.dueTo)}`].join('\n');
    }).join('\n\n');
  }
  function v23InvoiceDetails(inv){
    if(!inv)return '';
    const m=meterBy(inv.meterId);
    return [`اسم العداد: ${m?.label||'عداد'} — رقم العداد: ${m?.meterNumber||'—'}`,`القراءة السابقة: ${num(inv.openingReading||0)} KW — ${fmtDate(inv.periodFrom||inv.date)}`,`القراءة الحالية: ${num(inv.closingReading||0)} KW — ${fmtDate(inv.periodTo||inv.date)}`,`إجمالي استهلاك الفاتورة: ${num(inv.consumption||0)} KW`,`سعر KW: ${money(inv.unitPrice||0)}`,`الخصم: ${money(inv.discount||0)}`,`ثمن الفاتورة: ${money(invoiceNet(inv))}`].join('\n');
  }
  function v23FillTemplate(key,ctx={}){
    ensureV23Settings();const sub=ctx.sub||subscriberBy(ctx.subscriberId||ctx.movement?.subscriberId||ctx.invoice?.subscriberId||ctx.transfer?.fromSubscriberId);const movement=ctx.movement||{},transfer=ctx.transfer||{};
    const acc=ctx.account||accountBy(movement.accountId||movement.toAccountId||movement.fromAccountId||'');
    const fromSub=transfer.fromSubscriberId?subscriberBy(transfer.fromSubscriberId):null,toSub=transfer.toSubscriberId?subscriberBy(transfer.toSubscriberId):null;
    const map={
      'اسم_المشترك':sub?.name||'',
      'التاريخ_والوقت':fmtDateTime(new Date()),
      'اسم_الشبكة':v23NetworkName(),
      'اسم_المرسل':v23Actor(),
      'ملخص_العدادات':sub?v23MeterSummary(sub):'',
      'تفاصيل_الفاتورة':v23InvoiceDetails(ctx.invoice),
      'تاريخ_الحركة':fmtDateTime(movement.date||transfer.date||new Date()),
      'مبلغ_الحركة':money(movement.amount||transfer.amount||0),
      'اسم_الحساب':acc?.name||'',
      'ملاحظات_الحركة':movement.notes||transfer.notes||'',
      'اسم_المحول_منه':fromSub?.name||'',
      'اسم_المحول_اليه':toSub?.name||''
    };
    const raw=ctx.template||data.settings.messageTemplates?.[key]||V23_TEMPLATE_DEFAULTS[key]||'';
    return String(raw).replace(/\{\{([^{}]+)\}\}/g,(m,k)=>Object.prototype.hasOwnProperty.call(map,k)?String(map[k]):m).trim();
  }
  buildSubscriberMessage=function(sub){return v23FillTemplate('summary',{sub})};
  buildInvoiceMessage=function(inv){return v23FillTemplate('invoice',{sub:subscriberBy(inv.subscriberId),invoice:inv})};
  window.__AHMADI_V23_MESSAGE_ENGINE={
    movement(m){const type=movementType(m),key=type==='collection'||type==='deposit'?'payment':type==='send'?'send':'summary';return v23FillTemplate(key,{sub:subscriberBy(m.subscriberId),movement:m})},
    render:(key,ctx)=>v23FillTemplate(key,ctx)
  };

  const v23BaseApplyUiPrefs=applyUiPrefs;
  function v23Minutes(v){const [h,m]=String(v||'00:00').split(':').map(Number);return (h||0)*60+(m||0)}
  function v23ScheduleDark(prefs){
    if(!prefs?.scheduleEnabled)return prefs?.theme==='light'?'light':'dark';
    const now=new Date(),n=now.getHours()*60+now.getMinutes(),a=v23Minutes(prefs.scheduleStart||'19:00'),b=v23Minutes(prefs.scheduleEnd||'06:00');
    const inside=a===b?true:(a<b?n>=a&&n<b:n>=a||n<b);return inside?'dark':'light';
  }
  applyUiPrefs=function(prefs=getUiPrefs()){return v23BaseApplyUiPrefs({...prefs,theme:v23ScheduleDark(prefs)})};
  setInterval(()=>{const p=getUiPrefs();if(p.scheduleEnabled)applyUiPrefs(p)},60000);

  function v23Back(){return `<button class="secondary-btn compact" data-settings-back type="button">${icon('back')} رجوع</button>`}
  function v23SettingCard(id,title,desc,ic,meta=''){
    return `<button class="settings-main-card" data-settings-section="${id}" type="button"><span class="settings-main-icon">${icon(ic)}</span><span><strong>${title}</strong><small>${desc}</small></span>${meta?`<b>${meta}</b>`:icon('chevron')}</button>`;
  }
  renderSettings=function(){
    ensureV23Settings();setPageTitle('الإعدادات');const prefs=getUiPrefs();
    const cards=[
      ['network','بيانات الشبكة','اسم الشبكة، حساب المدير، اسم المستخدم، كلمة المرور ورمز التفعيل.','settings',''],
      ['printer','إعدادات الطابعة','اختيار مقاس الطباعة الافتراضي: 58mm أو 80mm أو A4.','receipt',getPrinterPaperSize().toUpperCase()+(getPrinterPaperSize()==='a4'?'':'mm')],
      ['templates','قوالب الرسائل','7 قوالب أساسية قابلة للتعديل مع قوالب مخصصة إضافية.','message',`${7+(data.settings.customMessageTemplates?.length||0)} قالب`],
      ['language','اللغة','اختيار لغة واجهة التطبيق.','chart',data.settings.appLanguage==='en'?'English':'العربية'],
      ['appearance','المظهر','الوضع الداكن والفاتح والثيمات والجدولة الزمنية.','settings',v23ScheduleDark(prefs)==='dark'?'داكن':'فاتح'],
      ['support','الدعم الفني','التواصل المباشر مع إدارة المنصة والدعم الفني.','message',''],
      ['notifications','الإشعارات','تفعيل الإشعارات وجدولتها زمنياً.','clock',data.settings.notificationsEnabled?'مفعلة':'معطلة'],
      ['access','إدارة الوصول','تجميد الموظفين والمشتركين وتحديد مناطق الموظفين.','userCog',''],
      ['export','تصدير نسخة','تصدير إلى ملف الهاتف أو المشاركة إلى Google Drive.','download',''],
      ['logout','تسجيل الخروج','الخروج من حساب الشبكة على هذا الجهاز.','logout','']
    ];
    $('#mainContent').innerHTML=`${pageHead('الإعدادات','إدارة الشبكة والرسائل والمظهر والنسخ والصلاحيات')}<div class="settings-main-grid">${cards.map(c=>v23SettingCard(...c)).join('')}</div>`;
  };
  function renderNetworkSettings(){
    ensureV23Settings();detail={kind:'settings-network'};setPageTitle('بيانات الشبكة');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">بيانات الشبكة</h1><p>يمكن تعديل كل خانة ثم حفظ البيانات.</p></div></div><form id="networkDataForm" class="settings-detail-card"><div class="form-grid">${inputField('networkName','اسم الشبكة','text',data.settings.networkName||session?.companyName||'','اسم الشبكة')}${inputField('managerAccountName','اسم حساب المدير','text',data.settings.ownerName||session?.ownerName||session?.actorName||'','اسم المدير')}${inputField('networkLoginUsername','اسم المستخدم','text',data.settings.networkLoginUsername||session?.username||'','اسم المستخدم','autocomplete="off"')}${inputField('networkLoginPassword','كلمة المرور','password',data.settings.networkLoginPassword||'','أدخل كلمة المرور المحفوظة')}${inputField('activationCode','رمز التفعيل','text',data.settings.activationCode||session?.subscriptionId||'','رمز التفعيل')}</div><div class="settings-note">تعديل اسم المستخدم أو كلمة المرور هنا يحدّث بيانات الشبكة المحفوظة داخل النظام والقوالب، ولا يغيّر بيانات التفعيل في القاعدة الأم.</div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ البيانات</button></div></form>`;
  }
  function renderPrinterSettings(){
    ensureV23Settings();detail={kind:'settings-printer'};setPageTitle('إعدادات الطابعة');
    const current=getPrinterPaperSize();
    const option=(value,title,desc)=>`<label class="printer-paper-option ${current===value?'active':''}"><input type="radio" name="printerPaperSize" value="${value}" ${current===value?'checked':''}><span><strong>${title}</strong><small>${desc}</small></span><i>${current===value?'✓':''}</i></label>`;
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">إعدادات الطابعة</h1><p>اختر المقاس الذي سيستخدم تلقائياً عند الضغط على طباعة الفاتورة.</p></div></div><form id="printerSettingsForm" class="settings-detail-card printer-settings-card"><div class="printer-paper-grid">${option('58','58mm','طابعة حرارية صغيرة بعرض 58 مم.')}${option('80','80mm','طابعة حرارية بعرض 80 مم — المقاس الموصى به.')}${option('a4','A4','ورق عادي A4 مع إبقاء تصميم الفاتورة ضيقاً في المنتصف.')}</div><div class="settings-note">زر «طباعة» يفتح أمر الطباعة مباشرة بالمقاس المحفوظ، بدون المرور على معاينة داخل التطبيق. شاشة الطباعة الخاصة بالنظام أو Chrome قد تظهر قبل الإرسال للطابعة حسب إعدادات الجهاز.</div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ إعدادات الطابعة</button></div></form>`;
  }
  function renderTemplatesSettings(){
    ensureV23Settings();detail={kind:'settings-templates'};setPageTitle('قوالب الرسائل');
    const built=Object.entries(V23_TEMPLATE_META).map(([k,[t,d,ic]])=>`<article class="template-card"><span class="template-icon">${icon(ic)}</span><div><strong>${t}</strong><small>${d}</small><p>${esc((data.settings.messageTemplates[k]||'').split('\n').slice(0,2).join(' • '))}</p></div><button class="tiny-action" data-template-edit="${k}" type="button">${icon('edit')} تعديل</button></article>`).join('');
    const custom=(data.settings.customMessageTemplates||[]).map(t=>`<article class="template-card"><span class="template-icon">${icon('message')}</span><div><strong>${esc(t.name||'قالب مخصص')}</strong><small>قالب استعلامي مخصص</small><p>${esc(String(t.content||'').split('\n').slice(0,2).join(' • '))}</p></div><div class="template-actions"><button class="tiny-action" data-custom-template-edit="${esc(t.id)}" type="button">${icon('edit')} تعديل</button><button class="tiny-action danger-btn" data-custom-template-delete="${esc(t.id)}" type="button">${icon('trash')} حذف</button></div></article>`).join('');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">قوالب الرسائل</h1><p>كل قالب قابل للتعديل وإضافة نصوص جديدة مع الحفاظ على المتغيرات.</p></div><button class="primary-btn compact" data-add-custom-template type="button">${icon('plus')} قالب مخصص</button></div><section class="template-help"><strong>المتغيرات المتاحة</strong><small>{{اسم_المشترك}} • {{التاريخ_والوقت}} • {{اسم_الشبكة}} • {{اسم_المرسل}} • {{ملخص_العدادات}} • {{تفاصيل_الفاتورة}} • {{مبلغ_الحركة}} • {{اسم_الحساب}}</small></section><div class="template-list">${built}${custom||'<div class="empty">لا توجد قوالب مخصصة بعد.</div>'}</div>`;
  }
  function openTemplateEditor(key='',customId=''){
    ensureV23Settings();let name='',content='',builtin=false;
    if(key){builtin=true;name=V23_TEMPLATE_META[key]?.[0]||key;content=data.settings.messageTemplates[key]||V23_TEMPLATE_DEFAULTS[key]||''}
    else{const row=(data.settings.customMessageTemplates||[]).find(x=>String(x.id)===String(customId));name=row?.name||'قالب استعلامي';content=row?.content||data.settings.messageTemplates?.customBase||V23_TEMPLATE_DEFAULTS.customBase}
    openModal(builtin?`تعديل ${name}`:customId?'تعديل القالب المخصص':'إضافة قالب مخصص',`<form id="messageTemplateForm" data-key="${esc(key)}" data-id="${esc(customId)}"><div class="form-grid">${builtin?`<div class="field span-2"><span>اسم القالب</span><input value="${esc(name)}" readonly></div>`:inputField('templateName','اسم القالب','text',name,'مثال: تنبيه الصيانة')}<label class="field span-2 template-textarea"><span>نص القالب</span><textarea name="templateContent" rows="16" required>${esc(content)}</textarea></label></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ القالب</button></div></form>`,'messageTemplateForm');
  }
  function renderLanguageSettings(){
    ensureV23Settings();detail={kind:'settings-language'};setPageTitle('اللغة');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">لغة التطبيق</h1><p>اختر لغة الواجهة المفضلة.</p></div></div><div class="language-grid"><button class="language-card ${data.settings.appLanguage==='ar'?'active':''}" data-app-language="ar" type="button"><strong>العربية</strong><small>واجهة RTL الأساسية</small></button><button class="language-card ${data.settings.appLanguage==='en'?'active':''}" data-app-language="en" type="button"><strong>English</strong><small>واجهة LTR كاملة لجميع صفحات التطبيق</small></button></div>`;
  }
  function renderAppearanceSettings(){
    detail={kind:'settings-appearance'};setPageTitle('المظهر');const p=getUiPrefs(),swatches=[['teal','#1d9f91','تركوازي'],['blue','#3478c5','أزرق'],['violet','#7357c6','بنفسجي'],['amber','#b9892e','ذهبي'],['rose','#b84f68','وردي'],['green','#2f9663','أخضر']];
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">المظهر</h1><p>الوضع والثيم والجدولة الزمنية للوضع الداكن.</p></div></div><section class="settings-detail-card"><div class="theme-mode-switch"><button class="theme-mode-btn ${p.theme==='dark'?'active':''}" data-v23-theme="dark" type="button"><span>الوضع الداكن</span><small>خلفية داكنة عالية التباين</small></button><button class="theme-mode-btn ${p.theme==='light'?'active':''}" data-v23-theme="light" type="button"><span>الوضع الفاتح</span><small>واجهة بيضاء احترافية</small></button></div><div class="accent-title">ألوان الثيم</div><div class="accent-swatches">${swatches.map(([id,color,label])=>`<button class="accent-swatch ${p.accent===id?'active':''}" data-v23-accent="${id}" type="button"><i style="background:${color}"></i><span>${label}</span></button>`).join('')}</div><form id="appearanceScheduleForm" class="schedule-card"><label class="toggle-row"><span><strong>جدولة الوضع الداكن</strong><small>عند التفعيل يصبح الوضع داكناً داخل الفترة وفاتحاً خارجها.</small></span><input name="scheduleEnabled" type="checkbox" ${p.scheduleEnabled?'checked':''}></label><div class="form-grid">${inputField('scheduleStart','بداية الوضع الداكن','time',p.scheduleStart||'19:00','')}${inputField('scheduleEnd','نهاية الوضع الداكن','time',p.scheduleEnd||'06:00','')}</div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ الجدولة</button></div></form></section>`;
  }
  function renderSupportSettings(){
    ensureV23Settings();detail={kind:'settings-support'};setPageTitle('الدعم الفني');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">الدعم الفني</h1><p>تواصل مباشرة مع إدارة المنصة من حساب الشبكة.</p></div></div><section class="platform-support-card-v24"><div class="platform-support-identity"><span>${icon('message')}</span><div><strong>إدارة المنصة</strong><small><i></i> متصل بالدعم</small></div></div><p>محادثة الدعم الخاصة بحساب الشبكة.</p><button class="primary-btn compact" data-support-chat="platform" type="button">${icon('message')} فتح محادثة الدعم</button></section>`;
  }
  function renderNotificationsSettings(){
    ensureV23Settings();detail={kind:'settings-notifications'};setPageTitle('الإشعارات');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">الإشعارات</h1><p>تفعيل أو تعطيل الإشعارات مع جدول زمني.</p></div></div><form id="notificationSettingsForm" class="settings-detail-card"><label class="toggle-row"><span><strong>تفعيل الإشعارات</strong><small>إظهار تنبيهات النظام عندما تكون متاحة.</small></span><input name="notificationsEnabled" type="checkbox" ${data.settings.notificationsEnabled?'checked':''}></label><label class="toggle-row"><span><strong>تفعيل الجدولة الزمنية</strong><small>استخدم فترة محددة للسماح بالإشعارات.</small></span><input name="notificationScheduleEnabled" type="checkbox" ${data.settings.notificationScheduleEnabled?'checked':''}></label><div class="form-grid">${inputField('notificationStart','بداية الإشعارات','time',data.settings.notificationStart||'08:00','')}${inputField('notificationEnd','نهاية الإشعارات','time',data.settings.notificationEnd||'22:00','')}</div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ الإعدادات</button></div></form>`;
  }
  async function renderAccessSettings(){
    ensureV23Settings();detail={kind:'settings-access'};setPageTitle('إدارة الوصول');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">إدارة الوصول</h1><p>تجميد الحسابات ومراجعة نطاق المناطق للموظفين.</p></div></div><section class="settings-access-section"><div class="section-row-title"><div><strong>حسابات الموظفين</strong><small>تجميد أو إعادة تفعيل أي موظف</small></div></div><div id="settingsEmployeeAccess" class="cards-list"><div class="empty">جارٍ تحميل الموظفين...</div></div></section><section class="settings-access-section"><div class="section-row-title"><div><strong>حسابات المشتركين</strong><small>تجميد الحساب محلياً ومزامنته ضمن بيانات الشبكة</small></div></div><div class="cards-list">${data.subscribers.length?data.subscribers.map(s=>`<article class="row-card"><span class="row-icon">${icon('users')}</span><span><strong>${esc(s.name)}</strong><small>${esc(fullPhone(s)||'بدون هاتف')} • ${s.status==='frozen'?'مجمد':'نشط'}</small></span><button class="secondary-btn compact ${s.status==='frozen'?'':'danger-btn'}" data-toggle-subscriber-status="${s.id}" type="button">${s.status==='frozen'?'إعادة التفعيل':'تجميد'}</button></article>`).join(''):'<div class="empty">لا يوجد مشتركون.</div>'}</div></section>`;
    try{const rows=await AhmadiCloud.listEmployees(session.companyId),root=$('#settingsEmployeeAccess');if(root)root.innerHTML=rows.length?rows.map(e=>{const regs=(e.permissions||[]).filter(p=>String(p).startsWith('region:')).length;return `<article class="row-card"><span class="row-icon">${icon('userCog')}</span><span><strong>${esc(e.name)}</strong><small>${esc(e.username||'')} • ${e.status==='active'?'نشط':'مجمد'} • ${regs?`${regs} مناطق محددة`:'كل المناطق'}</small></span><button class="secondary-btn compact ${e.status==='active'?'danger-btn':''}" data-toggle-employee-status="${e.id}" data-status="${e.status}" type="button">${e.status==='active'?'تجميد':'إعادة التفعيل'}</button></article>`}).join(''):'<div class="empty">لا يوجد موظفون.</div>';}catch(err){toast(err.message,'خطأ')}
  }
  function renderExportSettings(){
    detail={kind:'settings-export'};setPageTitle('تصدير نسخة');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v23Back()}<h1 style="margin-top:12px">تصدير نسخة</h1><p>احفظ نسخة كاملة من بيانات الشبكة.</p></div></div><div class="export-grid"><button class="export-card" data-export-phone type="button"><span>${icon('download')}</span><strong>ملف الهاتف</strong><small>تنزيل نسخة JSON كاملة إلى الجهاز.</small></button><button class="export-card" data-export-drive type="button"><span>${icon('send')}</span><strong>Google Drive</strong><small>فتح قائمة المشاركة لاختيار Google Drive وحفظ النسخة.</small></button></div>`;
  }
  function v23BackupPayload(){const datasets={};DATASETS.forEach(ds=>datasets[ds]=data[ds]);return {app:'الأحمدي لإدارة الكهرباء',version:'24',createdAt:isoNow(),companyId:session?.companyId||'',subscriptionId:session?.subscriptionId||'',datasets}}
  function v23BackupFile(){const text=JSON.stringify(v23BackupPayload(),null,2),blob=new Blob([text],{type:'application/json'}),name=`ahmadi-backup-${dateOnly(new Date())}.json`;return {blob,name,text}}
  function exportBackupPhone(){const {blob,name}=v23BackupFile(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);toast('تم إنشاء ملف النسخة على الجهاز')}
  async function exportBackupDrive(){const {blob,name}=v23BackupFile();try{const file=new File([blob],name,{type:'application/json'});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'نسخة الأحمدي الاحتياطية',text:'اختر Google Drive لحفظ النسخة.',files:[file]});return}exportBackupPhone();toast('جهازك لا يدعم مشاركة الملفات مباشرة؛ تم تنزيل الملف ويمكن رفعه إلى Google Drive.','تنبيه')}catch(err){if(err?.name!=='AbortError')toast(err.message||'تعذر فتح المشاركة','خطأ')}
  }

  function renderSupportHub(){
    ensureV23Settings();detail={kind:'support-hub'};setPageTitle('الدعم الفني');
    $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" data-support-back="home" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">مركز الدعم الفني</h1><p>التواصل مع إدارة المنصة.</p></div></div><div class="support-hub-grid"><button class="support-hub-card" data-support-chat="platform" type="button"><span>${icon('message')}</span><strong>التواصل مع إدارة المنصة</strong><small>محادثة الدعم الخاصة بحساب الشبكة.</small></button></div>`;
  }
  function v23ChatMessages(thread){return (data.chats||[]).filter(x=>String(x.thread||'')===String(thread)).sort((a,b)=>new Date(a.date||0)-new Date(b.date||0))}
  function renderChatThread(thread,title,subId=''){
    thread='platform';title='إدارة المنصة';subId='';detail={kind:'support-chat',thread,subId};setPageTitle('الدعم الفني');const rows=v23ChatMessages(thread);
    $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" data-support-back="home" type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">إدارة المنصة</h1><p>قناة إدارة المنصة</p></div></div><section class="chat-panel"><div class="chat-messages">${rows.length?rows.map(m=>`<div class="chat-bubble ${m.from==='network'?'mine':'theirs'}"><strong>${esc(m.actorName||'')}</strong><p>${esc(m.text||'')}</p><small>${fmtDateTime(m.date)}</small></div>`).join(''):'<div class="empty">لا توجد رسائل بعد.</div>'}</div><form id="supportChatForm" data-thread="platform" data-sub="" class="chat-compose"><textarea name="chatText" rows="3" placeholder="اكتب رسالتك..." required></textarea><button class="primary-btn compact" type="submit">${icon('send')} إرسال</button></form></section>`;
  }
  function renderSubscriberChatPicker(){renderChatThread('platform','إدارة المنصة','')}

  let broadcastState={templateId:'',selected:[],search:''};
  function renderBroadcastMessages(){
    ensureV23Settings();detail={kind:'broadcast-messages'};setPageTitle('رسالة استعلامية');const custom=data.settings.customMessageTemplates||[];
    if(!broadcastState.templateId&&custom[0])broadcastState.templateId=custom[0].id;
    const items=custom.map(t=>({value:t.id,label:t.name||'قالب مخصص'}));const q=(broadcastState.search||'').trim().toLowerCase(),subs=data.subscribers.filter(s=>!q||`${s.name||''} ${fullPhone(s)||''}`.toLowerCase().includes(q)),sel=new Set(broadcastState.selected.map(String));
    $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" data-broadcast-back type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">إرسال رسالة استعلامية</h1><p>اختر قالباً ثم كل المشتركين أو بعضهم.</p></div><button class="primary-btn compact" data-add-custom-template type="button">${icon('plus')} إضافة قالب</button></div>${custom.length?`<div class="form-grid broadcast-template-picker">${pickerField('broadcastTemplate','قالب الرسالة',items,broadcastState.templateId,'اختر القالب')}</div>`:'<div class="settings-note">أضف قالباً مخصصاً أولاً من زر إضافة قالب.</div>'}<div class="subscriber-select-toolbar"><div class="list-search"><span>${icon('search')}</span><input id="broadcastSearch" type="search" value="${esc(broadcastState.search)}" placeholder="بحث عن مشترك..."></div><button class="secondary-btn compact" data-broadcast-all type="button">تحديد الكل</button><button class="secondary-btn compact" data-broadcast-clear type="button">إلغاء الكل</button></div><div class="report-subscriber-choices">${subs.map(s=>`<label class="report-subscriber-choice"><input type="checkbox" data-broadcast-sub="${s.id}" ${sel.has(String(s.id))?'checked':''}><span class="subscriber-avatar small">${esc((s.name||'م').charAt(0))}</span><span><strong>${esc(s.name)}</strong><small>${esc(fullPhone(s)||'بدون هاتف')}</small></span></label>`).join('')}</div><div class="report-generate-actions"><button class="primary-btn" data-broadcast-send-list type="button">${icon('send')} تجهيز الإرسال للمحدد (${broadcastState.selected.length})</button></div>`;
  }
  function openBroadcastSendList(){
    ensureV23Settings();const tpl=(data.settings.customMessageTemplates||[]).find(x=>String(x.id)===String(broadcastState.templateId));if(!tpl)return toast('اختر قالباً مخصصاً','تنبيه');if(!broadcastState.selected.length)return toast('اختر مشتركاً واحداً على الأقل','تنبيه');
    const rows=broadcastState.selected.map(id=>subscriberBy(id)).filter(s=>s?.id);
    openModal('قائمة إرسال الرسالة',`<div class="broadcast-send-list">${rows.map(s=>{const text=v23FillTemplate('customBase',{sub:s,template:tpl.content});return `<article class="broadcast-send-row"><div><strong>${esc(s.name)}</strong><small>${esc(fullPhone(s)||'بدون هاتف')}</small></div><button data-broadcast-channel="whatsapp" data-broadcast-sub="${s.id}" data-broadcast-template="${tpl.id}" type="button">${icon('whatsapp')} واتساب</button><button data-broadcast-channel="sms" data-broadcast-sub="${s.id}" data-broadcast-template="${tpl.id}" type="button">${icon('message')} SMS</button><textarea hidden data-broadcast-text="${s.id}">${esc(text)}</textarea></article>`}).join('')}</div>`);
  }

  function openSubscriberTransfer(preFrom=''){
    if(!guard('flows.transfer'))return;if(data.subscribers.length<2)return toast('أضف مشتركين على الأقل','تنبيه');const items=data.subscribers.map(s=>({value:s.id,label:`${s.name} — ${fullPhone(s)||''} — ${money(subscriberBalance(s.id))}`}));
    openModal('تحويل أموال بين حسابات المشتركين',`<form id="subscriberTransferForm"><div class="form-grid">${pickerField('fromSubscriberId','المشترك المحول منه',items,preFrom,'اختر المشترك')}${pickerField('toSubscriberId','المشترك المحول إليه',items,'','اختر المشترك')}${inputField('amount','المبلغ','number','','0','step="0.01" min="0.01" required')}${inputField('date','تاريخ التحويل','datetime-local',new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16),'')}<label class="field span-2"><span>ملاحظات التحويل</span><textarea name="notes" rows="3"></textarea></label></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('transfer')} تنفيذ التحويل</button></div></form>`,'subscriberTransferForm');
  }
  function openTransferMessages(row){
    const from=subscriberBy(row.fromSubscriberId),to=subscriberBy(row.toSubscriberId),a=v23FillTemplate('transferFrom',{sub:from,transfer:row}),b=v23FillTemplate('transferTo',{sub:to,transfer:row});
    openModal('إرسال رسائل التحويل',`<div class="transfer-message-grid"><section><strong>${esc(from.name)}</strong><small>رسالة المحول منه</small><div class="modal-actions"><button data-transfer-message-channel="whatsapp" data-transfer-message-sub="${from.id}" type="button">${icon('whatsapp')} واتساب</button><button data-transfer-message-channel="sms" data-transfer-message-sub="${from.id}" type="button">${icon('message')} SMS</button></div><textarea hidden data-transfer-message-text="${from.id}">${esc(a)}</textarea></section><section><strong>${esc(to.name)}</strong><small>رسالة المحول إليه</small><div class="modal-actions"><button data-transfer-message-channel="whatsapp" data-transfer-message-sub="${to.id}" type="button">${icon('whatsapp')} واتساب</button><button data-transfer-message-channel="sms" data-transfer-message-sub="${to.id}" type="button">${icon('message')} SMS</button></div><textarea hidden data-transfer-message-text="${to.id}">${esc(b)}</textarea></section></div>`);
  }

  const v23PrevBalance=subscriberBalance;
  subscriberBalance=function(id){
    let b=v23PrevBalance(id);for(const m of data.movements||[]){if(movementType(m)!=='subscriber_transfer')continue;const a=Number(m.amount||0);if(String(m.fromSubscriberId)===String(id))b+=a;if(String(m.toSubscriberId)===String(id))b-=a}return b;
  };
  const v23PrevBalanceScoped=subscriberBalanceScoped;
  subscriberBalanceScoped=function(id){
    let b=v23PrevBalanceScoped(id);for(const m of filtered('movements')){if(movementType(m)!=='subscriber_transfer')continue;const a=Number(m.amount||0);if(String(m.fromSubscriberId)===String(id))b+=a;if(String(m.toSubscriberId)===String(id))b-=a}return b;
  };

  const v23PrevOpenSimpleSelect=openSimpleSelect;
  openSimpleSelect=function(button){
    if(button.dataset.simpleSelect==='subscriber-status'){
      const hidden=button.closest('.field')?.querySelector('input[type=hidden]');if(!hidden)return;const id=uid('simplepick');pickers.set(id,{items:[{value:'active',label:'نشط'},{value:'frozen',label:'مجمد'}],name:hidden.name,placeholder:'اختر الحالة'});openPicker(id,button);return;
    }
    return v23PrevOpenSimpleSelect(button);
  };
  const v23PrevOpenAddSubscriber=openAddSubscriber;
  openAddSubscriber=function(edit=null){
    if(!guard('subscribers.add'))return;const prefixes=[{value:'+970',label:'+970 فلسطين'},{value:'+972',label:'+972'}],status=edit?.status||'active';
    openModal(edit?'تعديل المشترك':'إضافة مشترك',`<form id="subscriberForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم المشترك','text',edit?.name||'','اكتب الاسم الكامل')}${pickerField('prefix','مقدمة الهاتف',prefixes,edit?.prefix||'+970')}${inputField('phone','رقم هاتف المشترك','tel',edit?.phone||'','59xxxxxxx','inputmode="tel"')}${inputField('address','العنوان','text',edit?.address||'','المنطقة أو العنوان')}${inputField('createdAt','تاريخ إضافة المشترك','date',dateOnly(edit?.createdAt||new Date()),'')}<label class="field dropdown-field has-select"><span>حالة الحساب</span><input type="hidden" name="subscriberStatus" value="${esc(status)}"><button class="select-button" data-simple-select="subscriber-status" type="button"><b>${status==='frozen'?'مجمد':'نشط'}</b>${icon('chevron')}</button></label><label class="field span-2"><span>الملاحظات</span><textarea name="notes" rows="3">${esc(edit?.notes||'')}</textarea></label></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} ${edit?'حفظ التعديلات':'حفظ المشترك'}</button></div></form>`,'subscriberForm');
  };

  const v23PrevOpenAddEmployee=openAddEmployee;
  openAddEmployee=function(edit=null){
    if(!guard('employees.manage'))return;const perms=edit?.permissions||[],checked=new Set(perms),regions=new Set(perms.filter(p=>String(p).startsWith('region:')).map(p=>String(p).slice(7)));
    openModal(edit?'تعديل الموظف':'إضافة موظف',`<form id="employeeForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم الموظف','text',edit?.name||'','الاسم الظاهر داخل التطبيق')}${inputField('username','اسم المستخدم','text',edit?.username||'','اسم دخول خاص بالموظف','autocomplete="off" autocapitalize="none"')}${inputField('password','كلمة المرور','password','',edit?'اتركها فارغة لعدم التغيير':'كلمة مرور خاصة بالموظف')}<label class="field dropdown-field has-select"><span>الحالة</span><input type="hidden" name="status" value="${edit?.status||'active'}"><button class="select-button" data-simple-select="employee-status" type="button"><b>${edit?.status==='inactive'?'مجمد':'نشط'}</b>${icon('chevron')}</button></label></div><div class="employee-permission-section"><div class="eyebrow">الصلاحيات الدقيقة</div><div class="perm-grid">${permissionList.map(([v,l])=>`<label class="perm"><input type="checkbox" name="permissions" value="${v}" ${checked.has(v)?'checked':''}><span>${l}</span></label>`).join('')}</div></div><div class="employee-permission-section"><div class="eyebrow">مناطق العدادات المسموح بعرضها</div><small class="settings-subnote">إذا لم تحدد أي منطقة فسيتمكن الموظف من عرض جميع المناطق.</small><div class="perm-grid region-perm-grid">${data.regions.length?data.regions.map(r=>`<label class="perm"><input type="checkbox" name="regionIds" value="${r.id}" ${regions.has(String(r.id))?'checked':''}><span>${esc(r.name)} ${r.regionNumber?`— ${esc(r.regionNumber)}`:''}</span></label>`).join(''):'<div class="empty">لا توجد مناطق مضافة.</div>'}</div></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ الموظف</button>${edit?`<button class="secondary-btn danger-btn" data-delete-employee="${edit.id}" type="button">${icon('trash')} حذف</button>`:''}</div></form>`,'employeeForm');
  };
  function v23AllowedRegionIds(){if(session?.actorType!=='employee')return null;const ids=(session.permissions||[]).filter(p=>String(p).startsWith('region:')).map(p=>String(p).slice(7));return ids.length?new Set(ids):null}
  const v23PrevRenderMeters=renderMeters;
  renderMeters=function(){const ids=v23AllowedRegionIds();if(!ids)return v23PrevRenderMeters();const oldR=data.regions,oldB=data.distributionBoards,oldM=data.meters;data.regions=oldR.filter(r=>ids.has(String(r.id)));data.distributionBoards=oldB.filter(b=>ids.has(String(b.regionId)));data.meters=oldM.filter(m=>ids.has(String(m.regionId)));try{return v23PrevRenderMeters()}finally{data.regions=oldR;data.distributionBoards=oldB;data.meters=oldM}};
  const v23PrevOpenAddMeter=openAddMeter;
  openAddMeter=function(preselectedSubscriberId='',edit=null){const ids=v23AllowedRegionIds();if(!ids)return v23PrevOpenAddMeter(preselectedSubscriberId,edit);const oldR=data.regions,oldB=data.distributionBoards;data.regions=oldR.filter(r=>ids.has(String(r.id)));data.distributionBoards=oldB.filter(b=>ids.has(String(b.regionId)));try{return v23PrevOpenAddMeter(preselectedSubscriberId,edit)}finally{data.regions=oldR;data.distributionBoards=oldB}};

  const v23PrevHandleAction=handleAction;
  handleAction=function(a){if(a==='broadcast-message'){renderBroadcastMessages();hydrateIcons();renderFab();return}if(a==='support-hub'){renderSupportHub();hydrateIcons();renderFab();return}if(a==='subscriber-transfer'){openSubscriberTransfer();return}return v23PrevHandleAction(a)};
  const v23PrevRenderHome=renderHome;
  renderHome=function(){
    ensureV23Settings();v23PrevRenderHome();
    const quick=$('#mainContent .quick-grid');if(quick&&!quick.querySelector('[data-action="broadcast-message"]'))quick.insertAdjacentHTML('beforeend',`<button class="quick-action" data-action="broadcast-message" type="button"><span class="qa-icon">${icon('message')}</span><span>رسالة استعلامية</span></button>`);
    const hero=$('#mainContent .hero');if(hero&&!$('#homeSupportActions'))hero.insertAdjacentHTML('afterend',`<section id="homeSupportActions" class="home-support-actions platform-only"><button data-support-chat="platform" type="button"><span>${icon('message')}</span><div><strong>التواصل مع إدارة المنصة</strong><small>الدعم الفني</small></div></button></section>`);
  };
  const v23PrevFlowRow=flowRow;
  flowRow=function(m){
    if(movementType(m)==='subscriber_transfer'){
      const from=subscriberBy(m.fromSubscriberId),to=subscriberBy(m.toSubscriberId);
      return `<article class="row-card flow-row flow-type-transfer"><span class="row-icon flow-icon">${icon('users')}</span><span class="flow-copy"><strong>تحويل بين حسابات المشتركين</strong><small>${esc(from.name)} ← ${esc(to.name)}</small><small>${fmtDateTime(m.date)}${m.notes?` • ${esc(m.notes)}`:''}</small></span><span class="row-amount"><strong>${money(m.amount)}</strong><span class="badge">تحويل مشتركين</span></span></article>`;
    }
    return v23PrevFlowRow(m);
  };
  const v23PrevRenderFlows=renderFlows;
  renderFlows=function(){
    v23PrevRenderFlows();
    const actions=$('#mainContent .polished-actions');if(actions&&hasPerm('flows.transfer')&&!actions.querySelector('[data-action="subscriber-transfer"]'))actions.insertAdjacentHTML('beforeend',`<button class="secondary-btn compact action-subscriber-transfer" data-action="subscriber-transfer" type="button"><span class="action-icon">${icon('users')}</span><span>تحويل بين المشتركين</span></button>`);
    const q=detailSearch.toLowerCase();const rows=filtered('movements').filter(m=>['collection','send','expense','transfer','deposit','subscriber_transfer'].includes(movementType(m))).filter(m=>!q||`${subscriberBy(m.subscriberId).name} ${subscriberBy(m.fromSubscriberId).name} ${subscriberBy(m.toSubscriberId).name} ${m.notes||''}`.toLowerCase().includes(q)).sort((a,b)=>new Date(b.date||b.createdAt||0)-new Date(a.date||a.createdAt||0)).slice(0,5);
    const list=$('#mainContent .flow-list');if(list)list.innerHTML=rows.length?rows.map(flowRow).join(''):'<div class="empty">لا توجد حركات مالية.</div>';
    const count=$('#mainContent .latest-ops-title small');if(count)count.textContent=`آخر ${rows.length} حركات`;
  };
  const v23PrevRenderSubscriberProfile=renderSubscriberProfile;
  renderSubscriberProfile=function(id,tab=''){
    v23PrevRenderSubscriberProfile(id,tab);
    const actions=$('#mainContent .profile-actions');if(actions&&hasPerm('flows.transfer')&&!actions.querySelector('[data-profile-action="subscriber-transfer"]'))actions.insertAdjacentHTML('beforeend',`<button class="quick-action" data-profile-action="subscriber-transfer" data-profile-id="${esc(id)}" type="button"><span class="qa-icon">${icon('users')}</span>تحويل لمشترك</button>`);
    if(tab==='movements'){
      const rows=(data.movements||[]).filter(m=>movementType(m)==='subscriber_transfer'&&(String(m.fromSubscriberId)===String(id)||String(m.toSubscriberId)===String(id))).sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
      if(rows.length&&!$('#subscriberTransferHistory'))$('#mainContent').insertAdjacentHTML('beforeend',`<section id="subscriberTransferHistory" class="readings-history"><div class="section-row-title"><div><strong>تحويلات حساب المشترك</strong><small>${rows.length} حركة</small></div></div><div class="cards-list">${rows.map(flowRow).join('')}</div></section>`);
    }
  };
  const v23PrevRenderFab=renderFab;
  renderFab=function(){v23PrevRenderFab();const menu=$('#fabMenu');if(currentPage==='flows'&&menu&&hasPerm('flows.transfer')&&!menu.querySelector('[data-action="subscriber-transfer"]'))menu.insertAdjacentHTML('beforeend',`<button class="fab-item fab-subscriber-transfer" data-action="subscriber-transfer" type="button"><span class="fab-item-icon">${icon('users')}</span><span>تحويل بين المشتركين</span></button>`)};

  const v23PrevHandleSubmit=handleSubmit;
  handleSubmit=async function(form,submitter=null){
    const fd=new FormData(form),obj=Object.fromEntries(fd.entries());
    try{
      if(form.id==='networkDataForm'){ensureV23Settings();data.settings.networkName=String(obj.networkName||'').trim();data.settings.ownerName=String(obj.managerAccountName||'').trim();data.settings.networkLoginUsername=String(obj.networkLoginUsername||'').trim();data.settings.networkLoginPassword=String(obj.networkLoginPassword||'');data.settings.activationCode=String(obj.activationCode||'').trim();saveSettingsV23();if(session){session.companyName=data.settings.networkName||session.companyName;if(session.actorType==='owner'&&data.settings.ownerName)session.actorName=data.settings.ownerName;localStorage.setItem(SESSION_KEY,JSON.stringify(session))}logAction('تعديل بيانات الشبكة',data.settings.networkName||'بيانات الشبكة');toast('تم حفظ بيانات الشبكة');renderNetworkSettings();return}
      if(form.id==='printerSettingsForm'){const size=String(obj.printerPaperSize||'80');if(!['58','80','a4'].includes(size))throw Error('اختر مقاس طابعة صحيحاً.');setPrinterPaperSize(size);toast('تم حفظ إعدادات الطابعة على هذا الجهاز');renderPrinterSettings();return}
      if(form.id==='messageTemplateForm'){ensureV23Settings();const key=form.dataset.key,id=form.dataset.id,content=String(obj.templateContent||'').trim();if(!content)throw Error('اكتب نص القالب.');if(key){data.settings.messageTemplates[key]=content}else if(id){const row=data.settings.customMessageTemplates.find(x=>String(x.id)===String(id));if(row){row.name=String(obj.templateName||row.name||'قالب مخصص').trim();row.content=content}}else data.settings.customMessageTemplates.push({id:uid('tpl'),name:String(obj.templateName||'قالب مخصص').trim()||'قالب مخصص',content,createdAt:isoNow()});saveSettingsV23();logAction('تعديل قالب رسالة',key||obj.templateName||'قالب مخصص');toast('تم حفظ القالب');closeModal();renderTemplatesSettings();return}
      if(form.id==='appearanceScheduleForm'){const p={...getUiPrefs(),scheduleEnabled:fd.has('scheduleEnabled'),scheduleStart:obj.scheduleStart||'19:00',scheduleEnd:obj.scheduleEnd||'06:00'};localStorage.setItem(UI_PREFS_KEY,JSON.stringify(p));applyUiPrefs(p);toast('تم حفظ جدولة المظهر');renderAppearanceSettings();return}
      if(form.id==='supportSettingsForm'){ensureV23Settings();data.settings.subscriberSupportEnabled=fd.has('subscriberSupportEnabled');saveSettingsV23();logAction('تعديل إعدادات الدعم الفني',data.settings.subscriberSupportEnabled?'التواصل مع المشتركين مفعل':'التواصل مع المشتركين معطل');toast('تم حفظ إعدادات الدعم');renderSupportSettings();return}
      if(form.id==='notificationSettingsForm'){ensureV23Settings();data.settings.notificationsEnabled=fd.has('notificationsEnabled');data.settings.notificationScheduleEnabled=fd.has('notificationScheduleEnabled');data.settings.notificationStart=obj.notificationStart||'08:00';data.settings.notificationEnd=obj.notificationEnd||'22:00';saveSettingsV23();toast('تم حفظ إعدادات الإشعارات');renderNotificationsSettings();return}
      if(form.id==='supportChatForm'){const text=String(obj.chatText||'').trim();if(!text)throw Error('اكتب الرسالة.');data.chats.push({id:uid('chat'),thread:form.dataset.thread,subscriberId:form.dataset.sub||'',from:'network',actorName:v23Actor(),text,date:isoNow()});save('chats');logAction('إرسال رسالة دعم',form.dataset.thread);toast('تم إرسال الرسالة داخل سجل المحادثة');renderChatThread(form.dataset.thread,form.dataset.thread==='platform'?'إدارة المنصة':subscriberBy(form.dataset.sub).name,form.dataset.sub);return}
      if(form.id==='subscriberTransferForm'){const amount=Number(obj.amount||0);if(!obj.fromSubscriberId||!obj.toSubscriberId||String(obj.fromSubscriberId)===String(obj.toSubscriberId))throw Error('اختر مشتركين مختلفين.');if(!(amount>0))throw Error('أدخل مبلغاً صحيحاً.');const row={id:uid('mov'),type:'subscriber_transfer',fromSubscriberId:obj.fromSubscriberId,toSubscriberId:obj.toSubscriberId,amount,date:obj.date||isoNow(),notes:obj.notes||'',createdAt:isoNow()};data.movements.unshift(row);save('movements');logAction('تحويل بين حسابات المشتركين',`${subscriberBy(row.fromSubscriberId).name} ← ${subscriberBy(row.toSubscriberId).name} • ${money(amount)}`);closeModal();render();toast('تم تسجيل التحويل بين المشتركين');setTimeout(()=>openTransferMessages(row),80);return}
      if(form.id==='employeeForm'){const permissions=[...fd.getAll('permissions'),...fd.getAll('regionIds').map(id=>`region:${id}`)],id=form.dataset.id;if(id)await AhmadiCloud.updateEmployee(session.companyId,id,{name:obj.name,username:obj.username,password:obj.password,status:obj.status,permissions});else await AhmadiCloud.createEmployee(session.companyId,{name:obj.name,username:obj.username,password:obj.password,permissions});toast(id?'تم تعديل الموظف':'تمت إضافة الموظف');closeModal();if(detail?.kind==='settings-access')renderAccessSettings();else renderEmployees();return}
      if(form.id==='subscriberForm'){
        const id=form.dataset.id;if(id){const row=data.subscribers.find(x=>String(x.id)===String(id));if(row)row.status=obj.subscriberStatus||row.status||'active'}
        const result=await v23PrevHandleSubmit(form,submitter);if(!id){const newest=data.subscribers[0];if(newest){newest.status=obj.subscriberStatus||'active';save('subscribers')}}return result;
      }
    }catch(err){toast(err.message||'تعذر تنفيذ العملية','خطأ');return}
    return v23PrevHandleSubmit(form,submitter);
  };

  const v23PrevRender=render;
  render=function(){
    if(detail?.kind==='settings-network'){renderNav();renderNetworkSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-printer'){renderNav();renderPrinterSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-templates'){renderNav();renderTemplatesSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-language'){renderNav();renderLanguageSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-appearance'){renderNav();renderAppearanceSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-support'){renderNav();renderSupportSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-notifications'){renderNav();renderNotificationsSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-access'){renderNav();renderAccessSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='settings-export'){renderNav();renderExportSettings();hydrateIcons();renderFab();return}
    if(detail?.kind==='support-hub'){renderNav();renderSupportHub();hydrateIcons();renderFab();return}
    if(detail?.kind==='support-chat'){renderNav();renderChatThread(detail.thread,detail.thread==='platform'?'إدارة المنصة':subscriberBy(detail.subId).name,detail.subId);hydrateIcons();renderFab();return}
    if(detail?.kind==='support-subscriber-picker'){renderNav();renderSubscriberChatPicker();hydrateIcons();renderFab();return}
    if(detail?.kind==='broadcast-messages'){renderNav();renderBroadcastMessages();hydrateIcons();renderFab();return}
    return v23PrevRender();
  };

  document.addEventListener('click',async e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const pst=e.target.closest('[data-profile-action="subscriber-transfer"]');if(pst){e.preventDefault();e.stopPropagation();openSubscriberTransfer(pst.dataset.profileId||'');return}
    const sec=e.target.closest('[data-settings-section]');if(sec){e.preventDefault();e.stopPropagation();const id=sec.dataset.settingsSection;if(id==='logout'){document.getElementById('logoutBtn')?.click();return}const map={network:renderNetworkSettings,printer:renderPrinterSettings,templates:renderTemplatesSettings,language:renderLanguageSettings,appearance:renderAppearanceSettings,support:renderSupportSettings,notifications:renderNotificationsSettings,access:renderAccessSettings,export:renderExportSettings};map[id]?.();hydrateIcons();renderFab();return}
    if(e.target.closest('[data-settings-back]')){e.preventDefault();e.stopPropagation();detail=null;currentPage='settings';render();return}
    const te=e.target.closest('[data-template-edit]');if(te){e.preventDefault();e.stopPropagation();openTemplateEditor(te.dataset.templateEdit);return}
    const cte=e.target.closest('[data-custom-template-edit]');if(cte){e.preventDefault();e.stopPropagation();openTemplateEditor('',cte.dataset.customTemplateEdit);return}
    const add=e.target.closest('[data-add-custom-template]');if(add){e.preventDefault();e.stopPropagation();openTemplateEditor();return}
    const del=e.target.closest('[data-custom-template-delete]');if(del){e.preventDefault();e.stopPropagation();if(confirm('حذف هذا القالب المخصص؟')){data.settings.customMessageTemplates=data.settings.customMessageTemplates.filter(x=>String(x.id)!==String(del.dataset.customTemplateDelete));saveSettingsV23();renderTemplatesSettings()}return}
    const lang=e.target.closest('[data-app-language]');if(lang){e.preventDefault();e.stopPropagation();ensureV23Settings();data.settings.appLanguage=lang.dataset.appLanguage;saveSettingsV23();document.documentElement.lang=data.settings.appLanguage;document.documentElement.dir=data.settings.appLanguage==='en'?'ltr':'rtl';toast(data.settings.appLanguage==='en'?'تم اختيار English':'تم اختيار العربية');renderLanguageSettings();return}
    const th=e.target.closest('[data-v23-theme]');if(th){e.preventDefault();e.stopPropagation();const p={...getUiPrefs(),theme:th.dataset.v23Theme};localStorage.setItem(UI_PREFS_KEY,JSON.stringify(p));applyUiPrefs(p);renderAppearanceSettings();hydrateIcons();return}
    const ac=e.target.closest('[data-v23-accent]');if(ac){e.preventDefault();e.stopPropagation();const p={...getUiPrefs(),accent:ac.dataset.v23Accent};localStorage.setItem(UI_PREFS_KEY,JSON.stringify(p));applyUiPrefs(p);renderAppearanceSettings();hydrateIcons();return}
    if(e.target.closest('[data-open-support-hub]')){e.preventDefault();e.stopPropagation();renderSupportHub();hydrateIcons();renderFab();return}
    const sch=e.target.closest('[data-support-chat]');if(sch){e.preventDefault();e.stopPropagation();if(sch.dataset.supportChat==='platform')renderChatThread('platform','إدارة المنصة');else renderSubscriberChatPicker();hydrateIcons();renderFab();return}
    const os=e.target.closest('[data-open-subscriber-chat]');if(os){e.preventDefault();e.stopPropagation();const s=subscriberBy(os.dataset.openSubscriberChat);renderChatThread(`subscriber:${s.id}`,s.name,s.id);hydrateIcons();renderFab();return}
    const sb=e.target.closest('[data-support-back]');if(sb){e.preventDefault();e.stopPropagation();if(sb.dataset.supportBack==='home'){detail=null;currentPage='home';render()}else renderSupportHub();return}
    if(e.target.closest('[data-export-phone]')){e.preventDefault();e.stopPropagation();exportBackupPhone();return}
    if(e.target.closest('[data-export-drive]')){e.preventDefault();e.stopPropagation();await exportBackupDrive();return}
    const es=e.target.closest('[data-toggle-employee-status]');if(es){e.preventDefault();e.stopPropagation();const next=es.dataset.status==='active'?'inactive':'active';try{await AhmadiCloud.updateEmployee(session.companyId,es.dataset.toggleEmployeeStatus,{status:next});toast(next==='inactive'?'تم تجميد الموظف':'تم إعادة تفعيل الموظف');renderAccessSettings()}catch(err){toast(err.message,'خطأ')}return}
    const ss=e.target.closest('[data-toggle-subscriber-status]');if(ss){e.preventDefault();e.stopPropagation();const row=data.subscribers.find(x=>String(x.id)===String(ss.dataset.toggleSubscriberStatus));if(row){row.status=row.status==='frozen'?'active':'frozen';save('subscribers');logAction(row.status==='frozen'?'تجميد حساب مشترك':'إعادة تفعيل حساب مشترك',row.name);toast(row.status==='frozen'?'تم تجميد المشترك':'تم إعادة تفعيل المشترك');renderAccessSettings()}return}
    if(e.target.closest('[data-broadcast-back]')){e.preventDefault();e.stopPropagation();detail=null;currentPage='home';render();return}
    if(e.target.closest('[data-broadcast-all]')){e.preventDefault();e.stopPropagation();broadcastState.selected=data.subscribers.map(s=>String(s.id));renderBroadcastMessages();hydrateIcons();return}
    if(e.target.closest('[data-broadcast-clear]')){e.preventDefault();e.stopPropagation();broadcastState.selected=[];renderBroadcastMessages();hydrateIcons();return}
    if(e.target.closest('[data-broadcast-send-list]')){e.preventDefault();e.stopPropagation();openBroadcastSendList();return}
    const bc=e.target.closest('[data-broadcast-channel]');if(bc){e.preventDefault();e.stopPropagation();const s=subscriberBy(bc.dataset.broadcastSub),text=document.querySelector(`[data-broadcast-text="${CSS.escape(String(s.id))}"]`)?.value||'';contactSubscriber(s,bc.dataset.broadcastChannel,text);return}
    const tm=e.target.closest('[data-transfer-message-channel]');if(tm){e.preventDefault();e.stopPropagation();const s=subscriberBy(tm.dataset.transferMessageSub),text=document.querySelector(`[data-transfer-message-text="${CSS.escape(String(s.id))}"]`)?.value||'';contactSubscriber(s,tm.dataset.transferMessageChannel,text);return}
  },true);
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-broadcast-sub]')){const id=String(e.target.dataset.broadcastSub),set=new Set(broadcastState.selected.map(String));e.target.checked?set.add(id):set.delete(id);broadcastState.selected=[...set];const btn=$('[data-broadcast-send-list]');if(btn)btn.innerHTML=`${icon('send')} تجهيز الإرسال للمحدد (${broadcastState.selected.length})`}
    if(e.target.name==='broadcastTemplate'){broadcastState.templateId=e.target.value}
  },true);
  document.addEventListener('input',e=>{if(e.target.id==='broadcastSearch'){broadcastState.search=e.target.value;clearTimeout(window.__broadcastSearchT);window.__broadcastSearchT=setTimeout(()=>{renderBroadcastMessages();hydrateIcons()},140)}},true);
  const v23PrevPickerChange=handlePickerChange;
  handlePickerChange=function(name,value){if(name==='broadcastTemplate'){broadcastState.templateId=value;return}return v23PrevPickerChange(name,value)};

  // Make subscriber-transfer movements readable in timelines and lists without affecting financial-account totals.
  const v23PrevMovementType=movementType;
  movementType=function(m){const t=String(m?.type||'');return t==='subscriber_transfer'?'subscriber_transfer':v23PrevMovementType(m)};

})();

/* ==== v24 full English UI / platform support only / employee profiles ==== */
(function(){
  const V24_LANG_KEY='AHMADI_UI_LANGUAGE_V24';
  let v24EmployeesCache=[];

  function v24EnsureSettings(){
    data.settings=data.settings||{};
    if(!data.settings.employeeProfiles||typeof data.settings.employeeProfiles!=='object'||Array.isArray(data.settings.employeeProfiles))data.settings.employeeProfiles={};
    if(!data.settings.appLanguage)data.settings.appLanguage=localStorage.getItem(V24_LANG_KEY)||'ar';
  }
  function v24Lang(){
    const raw=(data?.settings?.appLanguage||localStorage.getItem(V24_LANG_KEY)||'ar').toLowerCase();
    return raw==='en'?'en':'ar';
  }
  function v24SetLanguage(lang,{saveGlobal=true}={}){
    lang=lang==='en'?'en':'ar';
    if(saveGlobal)localStorage.setItem(V24_LANG_KEY,lang);
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='en'?'ltr':'rtl';
    document.documentElement.dataset.language=lang;
    document.title=lang==='en'?'Al Ahmadi Electricity Management':'الأحمدي لإدارة الكهرباء';
    if(lang==='en')queueMicrotask(()=>v24TranslateDOM(document));
  }

  const V24_PHRASES=[
    ['تسجيل الدخول','Sign In'],
    ['تطبيق المستخدمين','Users Application'],
    ['إدارة المشتركين والكهرباء','Subscriber & Electricity Management'],
    ['استخدم اسم المستخدم وكلمة المرور التي تم إنشاؤهما لك من اشتراك منصة الأحمدي.','Use the username and password created for your Al Ahmadi subscription.'],
    ['أدخل اسم المستخدم','Enter username'],
    ['أدخل كلمة المرور','Enter password'],
    ['دخول إلى المنصة','Sign In to Platform'],
    ['بيانات الدخول هي نفسها الموجودة في تفاصيل الاشتراك. يعمل بدون إنترنت بعد أول تسجيل ناجح.','Use the credentials from your subscription details. Offline login works after the first successful sign-in.'],
    ['لوحة تشغيل الشبكة وإدارة المشتركين والفواتير والتدفقات المالية.','Network operations, subscribers, invoices and cash-flow management.'],
    ['إدارة الشبكة والرسائل والمظهر والنسخ والصلاحيات','Manage network data, messages, appearance, backups and access'],
    ['اسم الشبكة، حساب المدير، اسم المستخدم، كلمة المرور ورمز التفعيل.','Network name, manager account, username, password and activation code.'],
    ['7 قوالب أساسية قابلة للتعديل مع قوالب مخصصة إضافية.','7 editable core templates plus custom templates.'],
    ['اختيار لغة واجهة التطبيق.','Choose the application interface language.'],
    ['الوضع الداكن والفاتح والثيمات والجدولة الزمنية.','Dark/light modes, themes and scheduling.'],
    ['التواصل المباشر مع إدارة المنصة والدعم الفني.','Direct chat with platform administration and technical support.'],
    ['تفعيل الإشعارات وجدولتها زمنياً.','Enable notifications and schedule them.'],
    ['تجميد الموظفين والمشتركين وتحديد مناطق الموظفين.','Freeze employees/subscribers and limit employee regions.'],
    ['تصدير إلى ملف الهاتف أو المشاركة إلى Google Drive.','Export to a phone file or share to Google Drive.'],
    ['الخروج من حساب الشبكة على هذا الجهاز.','Sign out of the network account on this device.'],
    ['يمكن تعديل كل خانة ثم حفظ البيانات.','You can edit any field and save the data.'],
    ['كل قالب قابل للتعديل وإضافة نصوص جديدة مع الحفاظ على المتغيرات.','Every template can be edited and extended while keeping variables.'],
    ['اختر لغة الواجهة المفضلة.','Choose your preferred interface language.'],
    ['العربية','Arabic'],['واجهة RTL الأساسية','Standard RTL interface'],['تركوازي','Teal'],['أزرق','Blue'],['بنفسجي','Violet'],['ذهبي','Amber'],['وردي','Rose'],['أخضر','Green'],
    ['واجهة LTR كاملة لجميع صفحات التطبيق','Full LTR interface across the entire application'],
    ['الوضع والثيم والجدولة الزمنية للوضع الداكن.','Mode, theme and dark-mode scheduling.'],
    ['عند التفعيل يصبح الوضع داكناً داخل الفترة وفاتحاً خارجها.','When enabled, dark mode runs inside the selected period and light mode outside it.'],
    ['تواصل مباشرة مع إدارة المنصة من حساب الشبكة.','Chat directly with platform administration from the network account.'],
    ['محادثة الدعم الخاصة بحساب الشبكة.','Support conversation for this network account.'],
    ['تفعيل أو تعطيل الإشعارات مع جدول زمني.','Enable or disable notifications with a schedule.'],
    ['تجميد الحسابات ومراجعة نطاق المناطق للموظفين.','Freeze accounts and review employee region access.'],
    ['احفظ نسخة كاملة من بيانات الشبكة.','Save a complete backup of network data.'],
    ['حسابات الموظفين والصلاحيات','Employee accounts and permissions'],
    ['مهام الفريق والمتابعة','Team tasks and follow-up'],
    ['النقدية والبنكية والتحويلات','Cash, bank accounts and transfers'],
    ['كل العمليات المسجلة','All recorded operations'],
    ['التحصيل والإرسال والمصروفات والتحويلات','Collections, payments, expenses and transfers'],
    ['كل العدادات ولوحات التوزيع والمناطق','All meters, distribution boards and regions'],
    ['قناة إدارة المنصة','Platform Administration Channel'],
    ['إدارة المنصة','Platform Administration'],
    ['الدعم الفني','Technical Support'],
    ['التواصل مع إدارة المنصة','Contact Platform Administration'],
    ['مركز الدعم الفني','Technical Support Center'],
    ['فتح محادثة الدعم','Open Support Chat'],
    ['متصل بالدعم','Support online'],
    ['اكتب رسالتك...','Type your message...'],
    ['إرسال الرسالة','Send Message'],
    ['لا توجد رسائل بعد.','No messages yet.'],
    ['ابحث داخل المحادثة...','Search conversation...'],
    ['إدارة الموظفين','Employee Management'],
    ['إضافة موظف','Add Employee'],
    ['تعديل الموظف','Edit Employee'],
    ['حذف الموظف','Delete Employee'],
    ['اسم الموظف','Employee Name'],
    ['رقم جوال الموظف','Employee Phone'],
    ['عنوان السكن','Home Address'],
    ['تاريخ الإضافة','Date Added'],
    ['تاريخ بدء العمل','Work Start Date'],
    ['تاريخ العمل','Work Date'],
    ['اسم المستخدم','Username'],
    ['كلمة المرور','Password'],
    ['الحالة','Status'],
    ['الصلاحيات الدقيقة','Detailed Permissions'],
    ['مناطق العدادات المسموح بعرضها','Allowed Meter Regions'],
    ['إذا لم تحدد أي منطقة فسيتمكن الموظف من عرض جميع المناطق.','If no region is selected, the employee can view all regions.'],
    ['السجل الزمني الخاص بالموظف','Employee Timeline'],
    ['السجل الزمني الخاص بـ','Timeline for'],
    ['عدد الحركات','Number of Activities'],
    ['آخر حركة','Last Activity'],
    ['اتصال','Call'],
    ['رسالة','Message'],
    ['إرسال SMS','Send SMS'],
    ['تعديل','Edit'],
    ['حذف','Delete'],
    ['حفظ الموظف','Save Employee'],
    ['حفظ البيانات','Save Data'],
    ['حفظ الإعدادات','Save Settings'],
    ['حفظ الجدولة','Save Schedule'],
    ['حفظ','Save'],
    ['رجوع','Back'],
    ['إلغاء','Cancel'],
    ['إغلاق','Close'],
    ['إضافة','Add'],
    ['بحث في السجل...','Search timeline...'],
    ['بحث باسم الموظف أو رقم الجوال أو العنوان...','Search by employee name, phone or address...'],
    ['بحث باسم الحساب...','Search account name...'],
    ['بحث في المهام...','Search tasks...'],
    ['بحث بالاسم أو المبلغ أو الملاحظات...','Search by name, amount or notes...'],
    ['بحث بالاسم أو الهاتف أو العداد...','Search by name, phone or meter...'],
    ['بحث باسم أو رقم المنطقة...','Search region name or number...'],
    ['بحث باسم أو رقم اللوحة...','Search board name or number...'],
    ['بحث بالاسم أو رقم العداد أو المنطقة أو اللوحة...','Search by name, meter, region or board...'],
    ['بحث عن مشترك بالاسم أو الهاتف...','Search subscriber by name or phone...'],
    ['بحث في التقرير...','Search report...'],
    ['بحث...','Search...'],
    ['بحث','Search'],
    ['ترتيب','Sort'],
    ['تحديد الكل','Select All'],
    ['إلغاء الكل','Clear All'],
    ['عرض الكل','View All'],
    ['الكل','All'],
    ['اليوم','Today'],
    ['هذا الأسبوع','This Week'],
    ['هذا الشهر','This Month'],
    ['هذه السنة','This Year'],
    ['فترة مخصصة','Custom Range'],
    ['من','From'],
    ['إلى','To'],
    ['الرئيسية','Home'],
    ['المشتركين','Subscribers'],
    ['العدادات','Meters'],
    ['الفواتير','Invoices'],
    ['التدفقات المالية','Cash Flow'],
    ['الحسابات المالية','Financial Accounts'],
    ['السجل الزمني','Timeline'],
    ['التقارير','Reports'],
    ['الإعدادات','Settings'],
    ['إدارة الإعدادات','System Settings'],
    ['إدارة المهام','Task Management'],
    ['بيانات الشبكة','Network Data'],
    ['قوالب الرسائل','Message Templates'],
    ['اللغة','Language'],
    ['المظهر','Appearance'],
    ['الإشعارات','Notifications'],
    ['إدارة الوصول','Access Management'],
    ['تصدير نسخة','Export Backup'],
    ['تسجيل الخروج','Sign Out'],
    ['اسم الشبكة','Network Name'],
    ['اسم حساب المدير','Manager Account Name'],
    ['رمز التفعيل','Activation Code'],
    ['المتغيرات المتاحة','Available Variables'],
    ['قالب مخصص','Custom Template'],
    ['إضافة قالب مخصص','Add Custom Template'],
    ['القالب السابع — الرسالة الاستعلامية','Template 7 — Inquiry Message'],
    ['قالب الملخص','Summary Template'],
    ['قالب الفواتير','Invoice Template'],
    ['قالب الدفعات المالية','Collection Template'],
    ['قالب الإرسالات المالية','Payment Template'],
    ['تحويل بين المشتركين — المحول منه','Subscriber Transfer — Sender'],
    ['تحويل بين المشتركين — المحول إليه','Subscriber Transfer — Recipient'],
    ['الرسالة الاستعلامية','Inquiry Message'],
    ['الوضع الداكن','Dark Mode'],
    ['الوضع الفاتح','Light Mode'],
    ['الوضع الليلي','Dark Mode'],
    ['الوضع النهاري','Light Mode'],
    ['خلفية داكنة عالية التباين','High-contrast dark interface'],
    ['واجهة بيضاء احترافية','Professional white interface'],
    ['ألوان الثيم','Theme Colors'],
    ['لون الثيم','Theme Color'],
    ['جدولة الوضع الداكن','Schedule Dark Mode'],
    ['بداية الوضع الداكن','Dark Mode Start'],
    ['نهاية الوضع الداكن','Dark Mode End'],
    ['تفعيل الإشعارات','Enable Notifications'],
    ['تفعيل الجدولة الزمنية','Enable Scheduling'],
    ['بداية الإشعارات','Notifications Start'],
    ['نهاية الإشعارات','Notifications End'],
    ['حسابات الموظفين','Employee Accounts'],
    ['حسابات المشتركين','Subscriber Accounts'],
    ['تجميد أو إعادة تفعيل أي موظف','Freeze or reactivate any employee'],
    ['تجميد الحساب محلياً ومزامنته ضمن بيانات الشبكة','Freeze the account and sync it with network data'],
    ['إعادة التفعيل','Reactivate'],
    ['تجميد','Freeze'],
    ['نشط','Active'],
    ['موقوف','Disabled'],
    ['مجمد','Frozen'],
    ['كل المناطق','All Regions'],
    ['مناطق محددة','Selected Regions'],
    ['ملف الهاتف','Phone File'],
    ['تنزيل نسخة JSON كاملة إلى الجهاز.','Download a complete JSON backup to the device.'],
    ['فتح قائمة المشاركة لاختيار Google Drive وحفظ النسخة.','Open the share sheet to choose Google Drive and save the backup.'],
    ['تثبيت','Install'],
    ['تثبيت التطبيق','Install App'],
    ['تحديث البيانات','Refresh Data'],
    ['البيانات محدثة','Data Up to Date'],
    ['محفوظ محلياً','Saved Locally'],
    ['مرحباً بك،','Welcome,'],
    ['صاحب الحساب','Account Owner'],
    ['مدير الشبكة','Network Manager'],
    ['موظف','Employee'],
    ['إجراءات سريعة','Quick Actions'],
    ['إضافة مشترك','Add Subscriber'],
    ['إضافة عداد','Add Meter'],
    ['متابعة مشترك','Subscriber Follow-up'],
    ['إيداع دفعة','Receive Payment'],
    ['استقبال دفعة','Receive Payment'],
    ['تحصيل دفعة','Receive Payment'],
    ['إرسال دفعة','Send Payment'],
    ['إضافة مصروف','Add Expense'],
    ['مصروف','Expense'],
    ['تحويل بين الحسابات','Transfer Between Accounts'],
    ['تحويل بين المشتركين','Transfer Between Subscribers'],
    ['تحويل الأموال','Transfer Funds'],
    ['إضافة حساب','Add Account'],
    ['إضافة مهمة','Add Task'],
    ['رسالة استعلامية','Inquiry Message'],
    ['ملخص المشتركين','Subscribers Summary'],
    ['ملخص العدادات','Meters Summary'],
    ['ملخص استهلاك الكهرباء','Electricity Consumption Summary'],
    ['ملخص قائمة التدفقات النقدية','Cash Flow Summary'],
    ['ملخص الحسابات المالية','Financial Accounts Summary'],
    ['إجمالي المشتركين','Total Subscribers'],
    ['إجمالي العدادات','Total Meters'],
    ['إجمالي المناطق','Total Regions'],
    ['إجمالي لوحات التوزيع','Total Distribution Boards'],
    ['إجمالي استهلاك الكهرباء','Total Electricity Consumption'],
    ['إجمالي الاستهلاك','Total Consumption'],
    ['إجمالي ثمن الفواتير','Total Invoice Value'],
    ['إجمالي الفواتير','Total Invoices'],
    ['إجمالي المبلغ المدفوع','Total Paid'],
    ['إجمالي المبلغ المتبقي','Total Remaining'],
    ['إجمالي الأرصدة','Total Balances'],
    ['إجمالي الوارد','Total Incoming'],
    ['إجمالي الصادر','Total Outgoing'],
    ['الوارد','Incoming'],
    ['الصادر','Outgoing'],
    ['الرصيد الحالي','Current Balance'],
    ['الرصيد','Balance'],
    ['نقدي','Cash'],
    ['بنكي','Bank'],
    ['حساب بنكي','Bank Account'],
    ['حساب نقدي','Cash Account'],
    ['إجمالي عدد الحركات','Total Activities'],
    ['لا توجد عمليات في الفترة.','No activities in this period.'],
    ['لا توجد حركات مالية.','No financial transactions.'],
    ['لا توجد حسابات مالية.','No financial accounts.'],
    ['لا يوجد موظفون.','No employees.'],
    ['لا توجد بيانات مطابقة.','No matching data.'],['الموظف غير موجود.','Employee not found.'],['لا يوجد رقم جوال لهذا الموظف','This employee has no phone number'],['حركة داخل التطبيق','Application activity'],
    ['جارٍ تحميل الموظفين...','Loading employees...'],
    ['لا توجد مهام.','No tasks.'],
    ['لا توجد بيانات مطابقة لشروط التقرير.','No data matches the report filters.'],
    ['لا توجد مناطق مضافة.','No regions added.'],
    ['لا توجد لوحات في هذه المنطقة','No boards in this region'],
    ['غير محددة','Not specified'],
    ['بدون هاتف','No phone'],
    ['بدون عنوان','No address'],
    ['بدون موقع','No location'],
    ['الملاحظات','Notes'],
    ['ملاحظات','Notes'],
    ['العنوان','Address'],
    ['رقم الهاتف','Phone Number'],
    ['رقم الجوال','Mobile Number'],
    ['رقم جوال المشترك','Subscriber Phone'],
    ['اسم المشترك','Subscriber Name'],
    ['المبلغ المستحق عليه','Amount Due From Subscriber'],
    ['المبلغ المستحق له','Amount Due To Subscriber'],
    ['المستحق عليه','Due From'],
    ['المستحق له','Due To'],
    ['المدفوع','Paid'],
    ['المتبقي','Remaining'],
    ['نظرة عامة','Overview'],
    ['الحركات المالية','Financial Transactions'],
    ['جميع الحركات','All Transactions'],
    ['جميع الحركات الواردة','All Incoming Transactions'],
    ['جميع الحركات الصادرة','All Outgoing Transactions'],
    ['اسم العداد','Meter Name'],
    ['رقم العداد','Meter Number'],
    ['اسم المنطقة','Region Name'],
    ['رقم المنطقة','Region Number'],
    ['لوحة التوزيع','Distribution Board'],
    ['لوحات التوزيع','Distribution Boards'],
    ['مناطق لوحات التوزيع','Distribution Board Regions'],
    ['اسم اللوحة','Board Name'],
    ['رقم اللوحة','Board Number'],
    ['القراءة الافتتاحية','Opening Reading'],
    ['القراءة السابقة','Previous Reading'],
    ['القراءة الحالية','Current Reading'],
    ['القراءة الأخيرة','Latest Reading'],
    ['تاريخ القراءة الافتتاحية','Opening Reading Date'],
    ['تاريخ القراءة السابقة','Previous Reading Date'],
    ['تاريخ القراءة الحالية','Current Reading Date'],
    ['تاريخ القراءة الأخيرة','Latest Reading Date'],
    ['الاستهلاك','Consumption'],
    ['سعر الكيلو','kW Price'],
    ['سعر KW','kW Price'],
    ['الخصم','Discount'],
    ['مبلغ الفاتورة','Invoice Amount'],
    ['معاينة الفاتورة','Invoice Preview'],
    ['صورة قراءة العداد','Meter Reading Image'],
    ['التقاط صورة','Take Photo'],
    ['اختيار من المعرض','Choose from Gallery'],
    ['إضافة فاتورة','Add Invoice'],
    ['تقرير الفواتير العام','General Invoice Report'],
    ['تقرير الفواتير المفصل','Detailed Invoice Report'],
    ['كشف حساب المشتركين','Subscriber Statement Report'],
    ['تقارير المشتركين','Subscriber Reports'],
    ['تقارير الفواتير','Invoice Reports'],
    ['تقارير الحسابات المالية','Financial Account Reports'],
    ['تقارير العدادات','Meter Reports'],
    ['تقارير المصروفات','Expense Reports'],
    ['تقارير السجل الزمني','Timeline Reports'],
    ['تقارير الملخصات','Summary Reports'],
    ['التقرير الإجمالي للمصروفات','Total Expense Report'],
    ['التقرير المفصل للمصروفات','Detailed Expense Report'],
    ['الفترة الزمنية','Date Range'],
    ['فترة التقرير','Report Period'],
    ['فترة الصرف','Expense Period'],
    ['إنشاء التقرير','Generate Report'],
    ['إنشاء التقرير للمحدد','Generate Report for Selected'],
    ['نوع المصروف','Expense Type'],
    ['قيمة المصروف','Expense Amount'],
    ['إجمالي المصروفات','Total Expenses'],
    ['حقوق الملكية','Owner Equity'],
    ['صافي التدفق المالي','Net Cash Flow'],
    ['أحدث العمليات','Latest Transactions'],
    ['آخر','Last'],
    ['حركة','activity'],
    ['حركات','activities'],
    ['فاتورة','invoice'],
    ['فواتير','invoices'],
    ['مشترك','subscriber'],
    ['مشتركين','subscribers'],
    ['عداد','meter'],
    ['عدادات','meters'],
    ['منطقة','region'],
    ['مناطق','regions'],
    ['لوحة','board'],
    ['حساب','account'],
    ['حسابات','accounts'],
    ['تقرير','report'],
    ['تقارير','reports'],
    ['قالب','template'],
    ['قوالب','templates'],
    ['صلاحية','permission'],
    ['صلاحيات','permissions'],
    ['معلقة','Pending'],
    ['ناجحة','Completed'],
    ['فاشلة','Failed'],
    ['إضافة','Add'],
    ['تعديل','Edit'],
    ['حذف','Delete'],
    ['مالية','Financial'],
    ['جلسة','Session'],
    ['تنبيه','Notice'],
    ['خطأ','Error'],
    ['تم','Done'],
    ['إدارة','Management'],['جميع','All'],['إجمالي','Total'],['عدد','Count'],['اسم','Name'],['رقم','Number'],['تاريخ','Date'],['تفاصيل','Details'],['نوع','Type'],['قيمة','Value'],['متوسط','Average'],['مبلغ','Amount'],['الفترة','Period'],['فترة','Period'],['المحددة','Selected'],['المختار','Selected'],['المختارة','Selected'],['السابقة','Previous'],['الحالية','Current'],['الأخيرة','Latest'],['الافتتاحية','Opening'],['الكهرباء','Electricity'],['الاستهلاك','Consumption'],['المدير','Manager'],['المدراء','Managers'],['الموظفين','Employees'],['المستخدم','User'],['الصفة','Role'],['المناطق','Regions'],['المنطقة','Region'],['اللوحات','Boards'],['اللوحة','Board'],['المصروفات','Expenses'],['الدفعات','Payments'],['الإيداعات','Deposits'],['الارسالات','Outgoing Payments'],['الإرسالات','Outgoing Payments'],['الفاتورة','Invoice'],['العداد','Meter'],['القراءة','Reading'],['الفلترة','Filtering'],['الزمنية','Time'],['إنشاء','Generate'],['اختر','Choose'],['عرض','View'],['فتح','Open'],['إرسال','Send'],['استلام','Receive'],['استقبال','Receive'],['تحصيل','Collection'],['تحويل','Transfer'],['مخصص','Custom'],['مخصصة','Custom'],['المختصر','Summary'],['الملخص','Summary'],['المفصل','Detailed'],['العام','General'],['الاجمالي','Total'],['الإجمالي','Total'],['الوضع','Mode'],['الثيم','Theme'],['الجدولة','Scheduling'],['تفعيل','Enable'],['تعطيل','Disable'],['بيانات','Data'],['ملاحظات','Notes'],['الهاتف','Phone'],['الجوال','Mobile'],['السكن','Address'],['العمل','Work'],['الدخول','Login'],['الخروج','Logout'],['الدعم','Support'],['الفني','Technical'],['المنصة','Platform'],['الشبكة','Network'],['الحساب','Account'],['الحسابات','Accounts'],['المشترك','Subscriber'],['التقرير','Report'],['التاريخ','Date'],['الحركة','Transaction'],['الحركات','Transactions'],['توزيع','Distribution'],['صورة','Image'],['المبلغ','Amount'],['المستحق','Due'],['التطبيق','Application'],['اختيار','Selection'],['تكلفة','Cost'],['إعدادات','Settings'],['الأحدث','Newest'],['الأقدم','Oldest'],['نتيجة','Result'],['إجماليات','Totals'],['كشف','Statement'],['المطلوب','Required'],['خيارات','Options'],['صافي','Net'],['سعر','Price'],['إيداع','Deposit'],['ملاحظة','Note'],['مستحق','Due'],['مسجلة','Recorded'],['الأعلى','Highest'],['الأقل','Lowest'],['البنكية','Bank'],['النقدية','Cash'],['مشتركون','Subscribers'],['مستخدم','User'],['البداية','Start'],['النهاية','End'],['المالية','Financial'],['القيمة','Value'],['المصروف','Expense'],['التحويل','Transfer'],['القالب','Template'],['الموظف','Employee'],['الاسم','Name'],['المرسل','Sender'],['المحول','Transfer Party'],['لوحات','Boards'],['استهلاك','Consumption'],['إرفاق','Attach'],['سجل','Log'],['تشغيل','Operation'],['عملية','Operation'],['العملية','Operation'],['مطابقة','Matching'],['واحداً','One'],['واحد','One'],['مرحبا','Hello'],['الآن','Now'],['داخل','Inside'],['خلال','During'],['حسب','By'],['بدون','Without'],['لهذا','For this'],['مشتركاً','Subscribers'],['إليه','To'],['منه','From'],['عليه','Due'],['له','Credit'],['جديد','New'],['جديدة','New'],['خاص','Specific'],['الخاصة','Specific'],['المختارين','Selected'],['المحدد','Selected'],['وتاريخها','and its date'],['تاريخها','its date'],['وتاريخه','and its date'],['تاريخه','its date'],['ورقمها','and its number'],['ورقمه','and its number'],['والتوقيت','and time'],['والتاريخ','and date'],['التوقيت','Time']
  ].sort((a,b)=>b[0].length-a[0].length);

  const V24_MONTHS=[
    ['يناير','January'],['فبراير','February'],['مارس','March'],['أبريل','April'],['مايو','May'],['يونيو','June'],['يوليو','July'],['أغسطس','August'],['سبتمبر','September'],['أكتوبر','October'],['نوفمبر','November'],['ديسمبر','December']
  ];
  function v24WesternDigits(s){
    const map={'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};
    return String(s).replace(/[٠-٩۰-۹]/g,c=>map[c]||c);
  }
  function v24TranslateText(value){
    let out=String(value??'');
    if(!/[\u0600-\u06ff]/.test(out))return v24WesternDigits(out);
    const rxEscape=v=>String(v).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    for(const [ar,en] of V24_PHRASES){
      if(!out.includes(ar))continue;
      if(!/\s/.test(ar)){
        const rx=new RegExp(`(^|[^\u0600-\u06FF])${rxEscape(ar)}(?=$|[^\u0600-\u06FF])`,'gu');
        out=out.replace(rx,(m,prefix)=>prefix+en);
      }else out=out.split(ar).join(en);
    }
    for(const [ar,en] of V24_MONTHS)if(out.includes(ar))out=out.split(ar).join(en);
    out=out.replace(/\bص\b/g,'AM').replace(/\bم\b/g,'PM');
    out=v24WesternDigits(out);
    return out;
  }
  function v24SkipTextNode(node){
    const el=node.parentElement;if(!el)return true;
    return !!el.closest('script,style,textarea,.chat-bubble p,.template-card p,.template-textarea,.broadcast-send-row [data-broadcast-text],.transfer-message-grid [data-transfer-message-text]');
  }
  function v24TranslateDOM(root=document){
    if(v24Lang()!=='en')return;
    const base=root.nodeType===1||root.nodeType===9?root:document;
    const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){if(v24SkipTextNode(node))continue;const next=v24TranslateText(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;}
    const els=(base.querySelectorAll?base.querySelectorAll('input,textarea,button,[aria-label],[title]'):[]);
    els.forEach(el=>{
      for(const attr of ['placeholder','aria-label','title'])if(el.hasAttribute?.(attr)){const v=el.getAttribute(attr),n=v24TranslateText(v);if(n!==v)el.setAttribute(attr,n)}
    });
    document.documentElement.lang='en';document.documentElement.dir='ltr';document.documentElement.dataset.language='en';
  }
  let v24TranslationPending=false;
  function v24ScheduleTranslation(){if(v24Lang()!=='en'||v24TranslationPending)return;v24TranslationPending=true;queueMicrotask(()=>{v24TranslationPending=false;v24TranslateDOM(document)});}
  const v24Observer=new MutationObserver(()=>v24ScheduleTranslation());
  v24Observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:false});

  function v24EmployeeMeta(row){
    v24EnsureSettings();const p=data.settings.employeeProfiles?.[row?.id]||{};
    return {phone:p.phone||'',address:p.address||'',addedDate:p.addedDate||dateOnly(row?.created_at||row?.createdAt||new Date())||dateOnly(new Date()),workDate:p.workDate||''};
  }
  function v24SaveEmployeeMeta(id,meta){
    v24EnsureSettings();data.settings.employeeProfiles[id]={...(data.settings.employeeProfiles[id]||{}),...meta};save('settings');
  }
  function v24EmployeeDate(row){const p=v24EmployeeMeta(row);return p.addedDate||dateOnly(row.created_at||row.createdAt||new Date())}
  function v24EmployeeInRange(row){if(!timeBounds())return true;return inRange(v24EmployeeDate(row));}
  function v24EmployeeMatches(row){const q=detailSearch.trim().toLowerCase(),p=v24EmployeeMeta(row);return !q||`${row.name||''} ${row.username||''} ${p.phone||''} ${p.address||''}`.toLowerCase().includes(q)}
  function v24EmployeePhoneHref(phone,type='tel'){
    const p=String(phone||'').trim().replace(/\s+/g,'');if(!p)return '';return `${type}:${p}`;
  }
  function v24EmployeeCard(e){
    const p=v24EmployeeMeta(e),regs=(e.permissions||[]).filter(x=>String(x).startsWith('region:')).length,status=e.status==='active'?'نشط':'مجمد';
    return `<article class="employee-card-v24" data-employee-timeline="${esc(e.id)}" tabindex="0" role="button"><div class="employee-card-head"><span class="employee-avatar-v24">${icon('userCog')}</span><div class="employee-card-copy"><strong>${esc(e.name||'موظف')}</strong><small>${esc(p.phone||'بدون هاتف')} • ${status}</small></div><span class="badge ${e.status==='active'?'good':'bad'}">${status}</span></div><div class="employee-card-info"><span><small>عنوان السكن</small><b>${esc(p.address||'بدون عنوان')}</b></span><span><small>تاريخ الإضافة</small><b>${fmtDate(p.addedDate)}</b></span><span><small>تاريخ بدء العمل</small><b>${fmtDate(p.workDate)}</b></span><span><small>نطاق المناطق</small><b>${regs?`${regs} مناطق محددة`:'كل المناطق'}</b></span></div><div class="employee-card-actions"><button data-employee-contact="call" data-employee-phone="${esc(p.phone)}" type="button">${icon('phone')}<span>اتصال</span></button><button data-employee-contact="sms" data-employee-phone="${esc(p.phone)}" type="button">${icon('message')}<span>رسالة</span></button>${hasPerm('employees.manage')?`<button data-employee-edit="${esc(e.id)}" type="button">${icon('edit')}<span>تعديل</span></button>`:''}</div></article>`;
  }

  renderEmployees=function(){
    setPageTitle('إدارة الموظفين');if(!guardSilent('employees.view'))return renderNoPermission();
    $('#mainContent').innerHTML=`${pageHead('إدارة الموظفين','حسابات الموظفين والصلاحيات')} ${timeFilterHtml()} ${listToolbar('بحث باسم الموظف أو رقم الجوال أو العنوان...')}<div id="employeeList" class="employee-grid-v24"><div class="empty">جارٍ تحميل الموظفين...</div></div>`;
    loadEmployees();v24ScheduleTranslation();
  };
  loadEmployees=async function(){
    try{
      const rows=await AhmadiCloud.listEmployees(session.companyId);v24EmployeesCache=rows;
      const filteredRows=rows.filter(v24EmployeeInRange).filter(v24EmployeeMatches).sort((a,b)=>new Date(v24EmployeeDate(b)||0)-new Date(v24EmployeeDate(a)||0));
      const root=$('#employeeList');if(!root)return;
      root.innerHTML=filteredRows.length?filteredRows.map(v24EmployeeCard).join(''):`<div class="empty">لا يوجد موظفون.</div>`;v24ScheduleTranslation();
    }catch(e){toast(e.message,'خطأ')}
  };

  openAddEmployee=function(edit=null){
    if(!guard('employees.manage'))return;v24EnsureSettings();const checked=new Set((edit?.permissions||[]).filter(p=>!String(p).startsWith('region:'))),regions=new Set((edit?.permissions||[]).filter(p=>String(p).startsWith('region:')).map(p=>String(p).slice(7))),meta=v24EmployeeMeta(edit||{}),today=dateOnly(new Date());
    openModal(edit?'تعديل الموظف':'إضافة موظف',`<form id="employeeForm" data-id="${esc(edit?.id||'')}"><div class="form-grid">${inputField('name','اسم الموظف','text',edit?.name||'','الاسم الظاهر داخل التطبيق')}${inputField('phone','رقم جوال الموظف','tel',meta.phone||'','مثال: +97059xxxxxxx','inputmode="tel"')}${inputField('address','عنوان السكن','text',meta.address||'','عنوان سكن الموظف')}${inputField('addedDate','تاريخ الإضافة','date',meta.addedDate||today,'')}${inputField('workDate','تاريخ بدء العمل','date',meta.workDate||today,'')}${inputField('username','اسم المستخدم','text',edit?.username||'','اسم دخول خاص بالموظف','autocomplete="off" autocapitalize="none"')}${inputField('password','كلمة المرور','password','',edit?'اتركها فارغة لعدم التغيير':'كلمة مرور خاصة بالموظف')}<label class="field dropdown-field has-select"><span>الحالة</span><input type="hidden" name="status" value="${edit?.status||'active'}"><button class="select-button" data-simple-select="employee-status" type="button"><b>${edit?.status==='inactive'?'مجمد':'نشط'}</b>${icon('chevron')}</button></label></div><div class="employee-permission-section"><div class="eyebrow">الصلاحيات الدقيقة</div><div class="perm-grid">${permissionList.map(([v,l])=>`<label class="perm"><input type="checkbox" name="permissions" value="${v}" ${checked.has(v)?'checked':''}><span>${l}</span></label>`).join('')}</div></div><div class="employee-permission-section"><div class="eyebrow">مناطق العدادات المسموح بعرضها</div><small class="settings-subnote">إذا لم تحدد أي منطقة فسيتمكن الموظف من عرض جميع المناطق.</small><div class="perm-grid region-perm-grid">${data.regions.length?data.regions.map(r=>`<label class="perm"><input type="checkbox" name="regionIds" value="${r.id}" ${regions.has(String(r.id))?'checked':''}><span>${esc(r.name)} ${r.regionNumber?`— ${esc(r.regionNumber)}`:''}</span></label>`).join(''):'<div class="empty">لا توجد مناطق مضافة.</div>'}</div></div><div class="modal-actions"><button class="primary-btn" type="submit">${icon('save')} حفظ الموظف</button>${edit?`<button class="secondary-btn danger-btn" data-delete-employee="${edit.id}" type="button">${icon('trash')} حذف</button>`:''}</div></form>`,'employeeForm');v24ScheduleTranslation();
  };

  async function renderEmployeeTimeline(id){
    detail={kind:'employee-timeline',id};setPageTitle('السجل الزمني الخاص بالموظف');
    let row=v24EmployeesCache.find(x=>String(x.id)===String(id));
    if(!row){try{const rows=await AhmadiCloud.listEmployees(session.companyId);v24EmployeesCache=rows;row=rows.find(x=>String(x.id)===String(id))}catch(err){toast(err.message,'خطأ')}}
    if(!row){$('#mainContent').innerHTML=`<div class="empty">الموظف غير موجود.</div>`;return}
    const p=v24EmployeeMeta(row),q=detailSearch.trim().toLowerCase();
    let logs=(data.logs||[]).filter(l=>String(l.actorId||'')===String(row.id)||String(l.actor||'').trim()===String(row.name||'').trim()).filter(l=>inRange(l.date));
    if(q)logs=logs.filter(l=>`${l.title||''} ${l.meta||''} ${l.actor||''}`.toLowerCase().includes(q));
    logs.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    $('#mainContent').innerHTML=`<div class="page-head"><div><button class="secondary-btn compact" data-employee-back type="button">${icon('back')} رجوع</button><h1 style="margin-top:12px">${esc(row.name)}</h1><p>السجل الزمني الخاص بالموظف</p></div><div class="head-meta">${logs.length} حركة</div></div><section class="employee-profile-v24"><div class="employee-profile-main"><span class="employee-avatar-v24 large">${icon('userCog')}</span><div><strong>${esc(row.name)}</strong><small>${esc(p.phone||'بدون هاتف')} • ${row.status==='active'?'نشط':'مجمد'}</small></div></div><div class="employee-profile-data"><span><small>عنوان السكن</small><b>${esc(p.address||'بدون عنوان')}</b></span><span><small>تاريخ الإضافة</small><b>${fmtDate(p.addedDate)}</b></span><span><small>تاريخ بدء العمل</small><b>${fmtDate(p.workDate)}</b></span><span><small>اسم المستخدم</small><b>${esc(row.username||'—')}</b></span></div><div class="employee-card-actions profile"><button data-employee-contact="call" data-employee-phone="${esc(p.phone)}" type="button">${icon('phone')} اتصال</button><button data-employee-contact="sms" data-employee-phone="${esc(p.phone)}" type="button">${icon('message')} رسالة</button>${hasPerm('employees.manage')?`<button data-employee-edit="${esc(row.id)}" type="button">${icon('edit')} تعديل</button>`:''}</div></section>${timeFilterHtml()}${listToolbar('بحث في السجل...')}<div class="count-banner"><div><small>عدد الحركات</small><strong>${logs.length}</strong></div><span class="badge">${fmtDate(dashboardFilter.from||p.addedDate)} — ${fmtDate(dashboardFilter.to||new Date())}</span></div><div class="cards-list">${logs.length?logs.map(l=>`<article class="row-card"><span class="row-icon">${icon('clock')}</span><span><strong>${esc(l.title||'حركة داخل التطبيق')}</strong><small>${fmtDateTime(l.date)}</small>${l.meta?`<small>${esc(l.meta)}</small>`:''}</span><span class="badge">${esc(l.kind||'')}</span></article>`).join(''):'<div class="empty">لا توجد عمليات في الفترة.</div>'}</div>`;v24ScheduleTranslation();
  }

  const v24PrevHandleSubmit=handleSubmit;
  handleSubmit=async function(form,submitter=null){
    if(form?.id==='employeeForm'){
      const fd=new FormData(form),obj=Object.fromEntries(fd.entries());
      try{
        const permissions=[...fd.getAll('permissions'),...fd.getAll('regionIds').map(id=>`region:${id}`)],id=form.dataset.id;
        let row;
        if(id)row=await AhmadiCloud.updateEmployee(session.companyId,id,{name:obj.name,username:obj.username,password:obj.password,status:obj.status,permissions});
        else{row=await AhmadiCloud.createEmployee(session.companyId,{name:obj.name,username:obj.username,password:obj.password,permissions});if(obj.status==='inactive')row=await AhmadiCloud.updateEmployee(session.companyId,row.id,{status:'inactive'});}
        v24SaveEmployeeMeta(row.id,{phone:String(obj.phone||'').trim(),address:String(obj.address||'').trim(),addedDate:obj.addedDate||dateOnly(new Date()),workDate:obj.workDate||''});
        logAction(id?'تعديل بيانات الموظف':'إضافة موظف',`${row.name||obj.name} • ${obj.phone||''}`);toast(id?'تم تعديل الموظف':'تمت إضافة الموظف');closeModal();
        if(detail?.kind==='employee-timeline')renderEmployeeTimeline(row.id);else if(detail?.kind==='settings-access')v24RenderAccessSettings();else renderEmployees();return;
      }catch(err){toast(err.message||'تعذر حفظ الموظف','خطأ');return}
    }
    return v24PrevHandleSubmit(form,submitter);
  };

  const v24PrevLogAction=logAction;
  logAction=function(title,meta=''){
    data.logs.unshift({id:uid('log'),title,meta,actor:session?.actorName||'',actorId:session?.actorId||session?.employeeId||'',actorType:session?.actorType||'',date:isoNow()});
    save('logs');
  };

  function v24Back(){return `<button class="secondary-btn compact" data-settings-back type="button">${icon('back')} رجوع</button>`}
  function v24ChatMessages(thread='platform'){return (data.chats||[]).filter(x=>String(x.thread||'')===String(thread)).sort((a,b)=>new Date(a.date||0)-new Date(b.date||0))}
  const v24PrevRenderSettings=renderSettings;
  renderSettings=function(){
    v24PrevRenderSettings();const card=$('[data-settings-section="support"]');if(card){const s=card.querySelector('strong'),d=card.querySelector('small'),b=card.querySelector('b');if(s)s.textContent='الدعم الفني';if(d)d.textContent='التواصل المباشر مع إدارة المنصة والدعم الفني.';if(b)b.remove();}v24ScheduleTranslation();
  };
  function v24RenderSupportSettings(){
    detail={kind:'settings-support'};setPageTitle('الدعم الفني');
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v24Back()}<h1 style="margin-top:12px">الدعم الفني</h1><p>تواصل مباشرة مع إدارة المنصة من حساب الشبكة.</p></div></div><section class="platform-support-card-v24"><div class="platform-support-identity"><span>${icon('message')}</span><div><strong>إدارة المنصة</strong><small><i></i> متصل بالدعم</small></div></div><p>محادثة الدعم الخاصة بحساب الشبكة.</p><button class="primary-btn compact" data-support-chat="platform" type="button">${icon('message')} فتح محادثة الدعم</button></section>`;v24ScheduleTranslation();
  };
  function v24RenderSupportHub(){v24RenderChatThread('platform','إدارة المنصة')}
  function v24RenderChatThread(thread='platform',title='إدارة المنصة'){
    thread='platform';title='إدارة المنصة';detail={kind:'support-chat',thread:'platform',subId:''};setPageTitle('الدعم الفني');
    const q=detailSearch.trim().toLowerCase();let rows=v24ChatMessages('platform').filter(m=>inRange(m.date));if(q)rows=rows.filter(m=>`${m.actorName||''} ${m.text||''}`.toLowerCase().includes(q));
    $('#mainContent').innerHTML=`<div class="support-chat-page-v24"><div class="support-chat-top-v24"><button class="icon-btn" data-support-back="home" type="button" aria-label="رجوع">${icon('back')}</button><div class="support-chat-avatar-v24">${icon('message')}</div><div class="support-chat-title-v24"><strong>إدارة المنصة</strong><small><i></i> متصل بالدعم</small></div></div><div class="support-chat-filters-v24">${timeFilterHtml()}${listToolbar('ابحث داخل المحادثة...')}</div><section class="chat-panel chat-panel-v24"><div class="chat-messages chat-messages-v24">${rows.length?rows.map(m=>`<div class="chat-bubble ${m.from==='network'?'mine':'theirs'}"><p>${esc(m.text||'')}</p><div class="chat-bubble-meta"><span>${esc(m.actorName||'')}</span><small>${fmtDateTime(m.date)}</small></div></div>`).join(''):`<div class="chat-empty-v24">${icon('message')}<strong>لا توجد رسائل بعد.</strong></div>`}</div><form id="supportChatForm" data-thread="platform" data-sub="" class="chat-compose chat-compose-v24"><textarea name="chatText" rows="1" placeholder="اكتب رسالتك..." required></textarea><button class="chat-send-v24" type="submit" aria-label="إرسال الرسالة">${icon('send')}</button></form></section></div>`;
    requestAnimationFrame(()=>{const box=$('.chat-messages-v24');if(box)box.scrollTop=box.scrollHeight});v24ScheduleTranslation();
  };

  const v24PrevRenderHome=renderHome;
  renderHome=function(){
    v24PrevRenderHome();const root=$('#homeSupportActions');if(root){root.classList.add('platform-only');const buttons=[...root.querySelectorAll('button')];buttons.forEach((btn,i)=>{if(i>0)btn.remove()});const btn=root.querySelector('button');if(btn){btn.removeAttribute('data-action');btn.dataset.supportChat='platform';const st=btn.querySelector('strong'),sm=btn.querySelector('small');if(st)st.textContent='التواصل مع إدارة المنصة';if(sm)sm.textContent='الدعم الفني';}}v24ScheduleTranslation();
  };

  const v24PrevRenderAccounts=renderAccounts;
  renderAccounts=function(){
    setPageTitle('الحسابات المالية');let rows=(data.accounts||[]).filter(a=>!timeBounds()||inRange(a.createdAt||a.date||a.addedDate));const q=detailSearch.trim().toLowerCase();if(q)rows=rows.filter(a=>`${a.name||''} ${a.number||''} ${a.type||''} ${a.notes||''}`.toLowerCase().includes(q));if(detailSort==='amount-desc')rows.sort((a,b)=>accountBalance(b.id)-accountBalance(a.id));else if(detailSort==='amount-asc')rows.sort((a,b)=>accountBalance(a.id)-accountBalance(b.id));else if(detailSort==='date-asc')rows.sort((a,b)=>new Date(a.createdAt||a.date||0)-new Date(b.createdAt||b.date||0));else rows.sort((a,b)=>new Date(b.createdAt||b.date||0)-new Date(a.createdAt||a.date||0));const total=rows.reduce((s,a)=>s+accountBalance(a.id),0);
    $('#mainContent').innerHTML=`${pageHead('الحسابات المالية','النقدية والبنكية والتحويلات',money(total))}${timeFilterHtml()}${listToolbar('بحث باسم الحساب...')}<div class="count-banner"><div><small>إجمالي الأرصدة</small><strong>${money(total)}</strong></div><span class="badge">${rows.length} حساب</span></div><div class="cards-list">${rows.length?rows.map(a=>`<article class="row-card" data-account="${a.id}"><span class="row-icon">${icon(a.type==='bank'?'bank':'wallet')}</span><span><strong>${esc(a.name)}</strong><small>${a.type==='bank'?'حساب بنكي':'حساب نقدي'} ${a.number?`• ${esc(a.number)}`:''}</small></span><span class="row-amount"><strong>${money(accountBalance(a.id))}</strong></span></article>`).join(''):'<div class="empty">لا توجد حسابات مالية.</div>'}</div>`;v24ScheduleTranslation();
  };
  renderTasks=function(){
    setPageTitle('إدارة المهام');if(!guardSilent('tasks.view'))return renderNoPermission();let rows=(data.tasks||[]).filter(t=>!timeBounds()||inRange(t.dueAt||t.createdAt||t.date));const q=detailSearch.trim().toLowerCase();if(q)rows=rows.filter(t=>`${t.title||''} ${t.status||''} ${t.notes||''}`.toLowerCase().includes(q));rows.sort((a,b)=>new Date(b.dueAt||b.createdAt||0)-new Date(a.dueAt||a.createdAt||0));
    $('#mainContent').innerHTML=`${pageHead('إدارة المهام','مهام الفريق والمتابعة')}${timeFilterHtml()}${listToolbar('بحث في المهام...')}<div class="cards-list">${rows.length?rows.map(t=>`<div class="row-card"><span class="row-icon">${icon('clipboard')}</span><span><strong>${esc(t.title)}</strong><small>${fmtDateTime(t.dueAt)} • ${esc(t.status||'معلقة')}</small></span><span class="badge ${t.status==='ناجحة'?'good':t.status==='فاشلة'?'bad':'warn'}">${esc(t.status||'معلقة')}</span></div>`).join(''):'<div class="empty">لا توجد مهام.</div>'}</div>`;v24ScheduleTranslation();
  };

  async function v24RenderAccessSettings(){
    v24EnsureSettings();detail={kind:'settings-access'};setPageTitle('إدارة الوصول');
    const q=detailSearch.trim().toLowerCase();const subs=(data.subscribers||[]).filter(s=>!timeBounds()||inRange(s.createdAt||s.date)).filter(s=>!q||`${s.name||''} ${fullPhone(s)||''} ${s.address||''}`.toLowerCase().includes(q));
    $('#mainContent').innerHTML=`<div class="page-head"><div>${v24Back()}<h1 style="margin-top:12px">إدارة الوصول</h1><p>تجميد الحسابات ومراجعة نطاق المناطق للموظفين.</p></div></div>${timeFilterHtml()}${listToolbar('بحث...')}<section class="settings-access-section"><div class="section-row-title"><div><strong>حسابات الموظفين</strong><small>تجميد أو إعادة تفعيل أي موظف</small></div></div><div id="settingsEmployeeAccess" class="cards-list"><div class="empty">جارٍ تحميل الموظفين...</div></div></section><section class="settings-access-section"><div class="section-row-title"><div><strong>حسابات المشتركين</strong><small>تجميد الحساب محلياً ومزامنته ضمن بيانات الشبكة</small></div></div><div class="cards-list">${subs.length?subs.map(s=>`<article class="row-card"><span class="row-icon">${icon('users')}</span><span><strong>${esc(s.name)}</strong><small>${esc(fullPhone(s)||'بدون هاتف')} • ${s.status==='frozen'?'مجمد':'نشط'}</small></span><button class="secondary-btn compact ${s.status==='frozen'?'':'danger-btn'}" data-toggle-subscriber-status="${s.id}" type="button">${s.status==='frozen'?'إعادة التفعيل':'تجميد'}</button></article>`).join(''):'<div class="empty">لا توجد بيانات مطابقة.</div>'}</div></section>`;
    try{const rows=await AhmadiCloud.listEmployees(session.companyId);v24EmployeesCache=rows;const filteredRows=rows.filter(v24EmployeeInRange).filter(v24EmployeeMatches),root=$('#settingsEmployeeAccess');if(root)root.innerHTML=filteredRows.length?filteredRows.map(e=>{const p=v24EmployeeMeta(e),regs=(e.permissions||[]).filter(x=>String(x).startsWith('region:')).length;return `<article class="row-card" data-employee-timeline="${e.id}"><span class="row-icon">${icon('userCog')}</span><span><strong>${esc(e.name)}</strong><small>${esc(p.phone||'بدون هاتف')} • ${e.status==='active'?'نشط':'مجمد'} • ${regs?`${regs} مناطق محددة`:'كل المناطق'}</small></span><button class="secondary-btn compact ${e.status==='active'?'danger-btn':''}" data-toggle-employee-status="${e.id}" data-status="${e.status}" type="button">${e.status==='active'?'تجميد':'إعادة التفعيل'}</button></article>`}).join(''):'<div class="empty">لا يوجد موظفون.</div>';}catch(err){toast(err.message,'خطأ')}v24ScheduleTranslation();
  };

  const v24PrevRender=render;
  render=function(){
    if(detail?.kind==='employee-timeline'){renderNav();renderEmployeeTimeline(detail.id);hydrateIcons();renderFab();v24ScheduleTranslation();return}
    if(detail?.kind==='settings-support'){renderNav();v24RenderSupportSettings();hydrateIcons();renderFab();v24ScheduleTranslation();return}
    if(detail?.kind==='settings-access'){renderNav();v24RenderAccessSettings();hydrateIcons();renderFab();v24ScheduleTranslation();return}
    if(detail?.kind==='support-hub'||detail?.kind==='support-chat'||detail?.kind==='support-subscriber-picker'){renderNav();v24RenderChatThread('platform','إدارة المنصة');hydrateIcons();renderFab();v24ScheduleTranslation();return}
    const result=v24PrevRender();v24SetLanguage(v24Lang(),{saveGlobal:false});v24ScheduleTranslation();return result;
  };

  document.addEventListener('click',async e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const settingsSection=e.target.closest('[data-settings-section]');
    if(settingsSection?.dataset.settingsSection==='support'){e.preventDefault();v24RenderSupportSettings();hydrateIcons();renderFab();v24ScheduleTranslation();return}
    if(settingsSection?.dataset.settingsSection==='access'){e.preventDefault();v24RenderAccessSettings();hydrateIcons();renderFab();v24ScheduleTranslation();return}
    const supportChat=e.target.closest('[data-support-chat]');
    if(supportChat){e.preventDefault();v24RenderChatThread('platform','إدارة المنصة');hydrateIcons();renderFab();v24ScheduleTranslation();return}
    const lang=e.target.closest('[data-app-language]');
    if(lang){const next=lang.dataset.appLanguage==='en'?'en':'ar';localStorage.setItem(V24_LANG_KEY,next);if(data.settings){data.settings.appLanguage=next;save('settings')}setTimeout(()=>{v24SetLanguage(next);if(next==='ar')render();else v24TranslateDOM(document)},0);return}
    const delEmp=e.target.closest('[data-delete-employee]');if(delEmp){e.preventDefault();e.stopImmediatePropagation();if(confirm('حذف الموظف نهائياً؟')){try{await AhmadiCloud.deleteEmployee(session.companyId,delEmp.dataset.deleteEmployee);v24EnsureSettings();delete data.settings.employeeProfiles[delEmp.dataset.deleteEmployee];save('settings');logAction('حذف موظف',delEmp.dataset.deleteEmployee);toast('تم حذف الموظف');closeModal();detail=null;currentPage='employees';render()}catch(err){toast(err.message||'تعذر حذف الموظف','خطأ')}}return}
    const edit=e.target.closest('[data-employee-edit]');if(edit){e.preventDefault();e.stopImmediatePropagation();try{let row=v24EmployeesCache.find(x=>String(x.id)===String(edit.dataset.employeeEdit));if(!row){const rows=await AhmadiCloud.listEmployees(session.companyId);v24EmployeesCache=rows;row=rows.find(x=>String(x.id)===String(edit.dataset.employeeEdit))}openAddEmployee(row)}catch(err){toast(err.message,'خطأ')}return}
    const contact=e.target.closest('[data-employee-contact]');if(contact){e.preventDefault();e.stopImmediatePropagation();const phone=String(contact.dataset.employeePhone||'').trim();if(!phone){toast('لا يوجد رقم جوال لهذا الموظف','تنبيه');return}location.href=v24EmployeePhoneHref(phone,contact.dataset.employeeContact==='sms'?'sms':'tel');return}
    const card=e.target.closest('[data-employee-timeline]');if(card&&!e.target.closest('[data-toggle-employee-status]')){e.preventDefault();e.stopImmediatePropagation();renderEmployeeTimeline(card.dataset.employeeTimeline);return}
    if(e.target.closest('[data-employee-back]')){e.preventDefault();e.stopImmediatePropagation();detail=null;currentPage='employees';render();return}
  },true);

  document.addEventListener('keydown',e=>{const card=e.target.closest?.('[data-employee-timeline]');if(card&&e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();renderEmployeeTimeline(card.dataset.employeeTimeline)}},true);

  // Persisted language also applies to login and to the first screen before cloud data loads.
  v24SetLanguage(localStorage.getItem(V24_LANG_KEY)||'ar',{saveGlobal:false});
})();


/* ==== V24-R2 image storage patch: Cloudflare R2 / 50KB + offline queue ==== */
(function(){
  const V24_R2_BYTES=50*1024;
  let v24R2MigrationRunning=false;

  function v24R2English(){return document.documentElement.lang==='en'}
  function v24R2Text(ar,en){return v24R2English()?en:ar}
  function v24R2Safe(v){return String(v||'network').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'network'}
  function v24R2Folder(kind){return `ahmadi/${v24R2Safe(session?.companyId||session?.subscriptionId||'network')}/${kind}`}
  function v24R2Ready(){return !!window.AhmadiR2}
  function v24R2IsLocalImage(v){return /^data:image\//i.test(String(v||''))}

  function progressTarget(kind){
    if(String(kind).includes('network'))return document.getElementById('networkLogoProgress');
    if(String(kind).includes('movement'))return document.getElementById('movementPhotoPreview');
    return document.getElementById('invoicePhotoPreview');
  }
  function progressHtml(text,pct=8){
    return `<div class="image-mini-progress-inline"><div class="image-mini-progress-copy"><span>${esc(text)}</span><b>${Math.max(0,Math.min(100,Math.round(pct)))}%</b></div><div class="image-mini-progress-track"><i style="width:${Math.max(2,Math.min(100,Math.round(pct)))}%"></i></div></div>`;
  }
  function setProgress(kind,pct,text){
    const el=progressTarget(kind);if(!el)return;
    if(el.id==='networkLogoProgress'){
      el.classList.remove('hidden');el.innerHTML=progressHtml(text,pct);return;
    }
    el.innerHTML=progressHtml(text,pct);
  }
  function clearProgress(kind){const el=progressTarget(kind);if(el?.id==='networkLogoProgress'){el.classList.add('hidden');el.innerHTML=''}}
  function appendLocalBadge(kind,text){
    const el=progressTarget(kind);if(!el||el.id==='networkLogoProgress')return;
    const badge=document.createElement('span');badge.className='image-local-badge';badge.textContent=text;el.appendChild(badge);
  }
  window.AhmadiImageProgress={
    start(kind){setProgress(kind,8,v24R2Text('جاري تجهيز الصورة...','Preparing image...'))},
    stage(kind,pct,text){setProgress(kind,pct,text||v24R2Text('جاري تجهيز الصورة...','Preparing image...'))},
    done(kind,text){const el=progressTarget(kind),local=!!el?.querySelector?.('img[src^="data:image"]');clearProgress(kind);if(local&&text)appendLocalBadge(kind,v24R2Text('محفوظ محلياً • سيُرفع تلقائياً عند عودة الإنترنت','Saved locally • uploads automatically when internet returns'))},
    fail(kind){clearProgress(kind)}
  };

  async function v24R2PrepareFile(file,kind='attachments'){
    if(!v24R2Ready())throw Error(v24R2Text('خدمة تخزين الصور لم تُحمّل.','Image storage service did not load.'));
    const online=navigator.onLine!==false;
    if(online){
      try{
        const uploaded=await window.AhmadiR2.uploadImage(file,{
          folder:v24R2Folder(kind),
          targetBytes:V24_R2_BYTES,
          onStage:stage=>window.AhmadiImageProgress?.stage(kind,stage==='uploading'?62:18,stage==='uploading'?v24R2Text('جاري رفع الصورة...','Uploading image...'):v24R2Text('جاري تجهيز الصورة...','Preparing image...')),
          onProgress:p=>window.AhmadiImageProgress?.stage(kind,62+(p*.38),v24R2Text('جاري رفع الصورة...','Uploading image...'))
        });
        if(uploaded.size>V24_R2_BYTES)throw Error(v24R2Text('تعذر تجهيز الصورة ضمن 50KB.','Could not prepare the image within 50KB.'));
        return uploaded;
      }catch(err){
        // If connectivity disappears during the upload, keep the compressed image locally.
        // The Turso pre-push hook will retry R2 first and only then send the public URL.
        console.warn('R2 upload deferred:',err);
        window.AhmadiImageProgress?.stage(kind,30,v24R2Text('سيتم حفظ الصورة محلياً...','Saving image locally...'));
        const local=await window.AhmadiR2.prepareLocalImage(file,{targetBytes:V24_R2_BYTES,onStage:()=>{}});
        window.AhmadiImageProgress?.stage(kind,100,v24R2Text('تم حفظ الصورة محلياً','Saved locally'));
        return local;
      }
    }
    window.AhmadiImageProgress?.stage(kind,22,v24R2Text('جاري تجهيز الصورة...','Preparing image...'));
    const local=await window.AhmadiR2.prepareLocalImage(file,{targetBytes:V24_R2_BYTES,onStage:()=>{}});
    window.AhmadiImageProgress?.stage(kind,100,v24R2Text('تم حفظ الصورة محلياً','Saved locally'));
    return local;
  }

  // Existing forms expect a URL-like string. Online = R2 URL, offline = compressed local data URL.
  // Before Turso pushes the dataset, local data URLs are uploaded to R2 and replaced with public URLs.
  compressInvoiceImage=async function(file,maxBytes=V24_R2_BYTES,kind='attachments'){
    if(!file)return '';
    const uploaded=await v24R2PrepareFile(file,kind);
    return uploaded.url;
  };

  function v24R2ApplyNetworkLogo(){
    const url=data?.settings?.networkLogo||'';
    const key=data?.settings?.networkLogoKey||'';
    const drawer=document.getElementById('drawerLogo')||document.querySelector('.drawer-head img');
    const brand=document.querySelector('.brand-logo');
    for(const img of [drawer,brand].filter(Boolean)){
      if(url&&window.AhmadiR2?.setImageSource)window.AhmadiR2.setImageSource(img,url,key);
      else img.src=url||'logo.jpg';
    }
    const fav=document.querySelector('link[rel="icon"]');if(fav&&url)fav.href=url;
    window.AhmadiR2?.refreshImages?.(document);
  }

  function v24R2LogoBlock(){
    const url=data?.settings?.networkLogo||'';
    const local=v24R2IsLocalImage(url);
    const status=url
      ? (local?v24R2Text('محفوظ محلياً وسيتم رفعه تلقائياً عند عودة الإنترنت','Saved locally and will upload automatically when internet returns'):v24R2Text('الشعار محفوظ على Cloudflare R2','Logo stored on Cloudflare R2'))
      : v24R2Text('لم يتم رفع شعار خاص بالشبكة','No custom network logo uploaded');
    return `<section class="network-logo-storage span-2">
      <div class="network-logo-preview">${url?`<img src="${esc(url)}" data-r2-key="${esc(data?.settings?.networkLogoKey||'')}" alt="${v24R2Text('شعار الشبكة','Network logo')}">`:`<img src="logo.jpg" alt="${v24R2Text('الشعار الافتراضي','Default logo')}">`}</div>
      <div class="network-logo-copy"><strong>${v24R2Text('شعار الشبكة','Network Logo')}</strong><small>${status} • ${v24R2Text('تجهيز تلقائي حتى 50KB','Automatically prepared up to 50KB')}</small></div>
      <div class="network-logo-actions">
        <label class="secondary-btn compact" for="networkLogoInput">${icon('image')} ${url?v24R2Text('تغيير الشعار','Change Logo'):v24R2Text('رفع الشعار','Upload Logo')}<input id="networkLogoInput" type="file" accept="image/*" hidden></label>
        ${url?`<button class="tiny-action danger-btn" data-remove-network-logo type="button">${icon('trash')} ${v24R2Text('إزالة','Remove')}</button>`:''}
      </div>
      <div id="networkLogoProgress" class="image-mini-progress hidden"></div>
    </section>`;
  }

  function v24R2InjectNetworkLogo(replace=false){
    data.settings=data.settings||{};
    const form=document.getElementById('networkDataForm');
    const grid=form?.querySelector('.form-grid');
    if(!grid)return false;
    const old=grid.querySelector('.network-logo-storage');
    if(old&&replace)old.outerHTML=v24R2LogoBlock();
    else if(!old)grid.insertAdjacentHTML('beforeend',v24R2LogoBlock());
    v24R2ApplyNetworkLogo();
    return true;
  }
  const v24R2Observer=new MutationObserver(()=>v24R2InjectNetworkLogo(false));
  const v24R2Main=document.getElementById('mainContent');
  if(v24R2Main)v24R2Observer.observe(v24R2Main,{childList:true,subtree:true});

  async function v24R2UploadLogo(file){
    if(!file)return;
    window.AhmadiImageProgress?.start('network-logo');
    const localPrint=window.AhmadiR2?.prepareLocalImage?await window.AhmadiR2.prepareLocalImage(file,{targetBytes:50*1024}).catch(()=>null):null;
    const uploaded=await v24R2PrepareFile(file,'network-logo');
    data.settings=data.settings||{};
    if(localPrint?.url)persistPrintLogo(localPrint.url);
    else if(uploaded?.url)persistPrintLogo(uploaded.url);
    const oldKey=data.settings.networkLogoKey||'';
    data.settings.networkLogo=uploaded.url;
    data.settings.networkLogoKey=uploaded.key||'';
    data.settings.networkLogoName=file.name||uploaded.name||'logo.jpg';
    data.settings.networkLogoSize=uploaded.size||0;
    data.settings.networkLogoPending=!!uploaded.pending;
    save('settings');
    v24R2ApplyNetworkLogo();
    if(oldKey&&oldKey!==uploaded.key&&uploaded.key)window.AhmadiR2.deleteObject(oldKey).catch(()=>{});
    logAction(v24R2Text('تحديث شعار الشبكة','Network logo updated'),uploaded.pending?v24R2Text('محفوظ محلياً بانتظار الإنترنت','Saved locally pending internet'):`${uploaded.size} bytes`);
    window.AhmadiImageProgress?.done('network-logo');
    v24R2InjectNetworkLogo(true);
    toast(uploaded.pending?v24R2Text('تم حفظ الشعار محلياً وسيتم رفعه تلقائياً عند عودة الإنترنت.','Logo saved locally and will upload automatically when internet returns.'):v24R2Text('تم تحديث شعار الشبكة وحفظ رابط الصورة.','Network logo updated and image URL saved.'));
  }

  function folderFor(dataset,key){
    if(dataset==='settings'&&/logo/i.test(key))return 'network-logo';
    if(dataset==='invoices')return 'invoice-readings';
    if(dataset==='movements')return 'movement-proofs';
    return `${v24R2Safe(dataset)}-attachments`;
  }

  function collectLocalImages(value,dataset,path=[],out=[]){
    if(out.length>=120||value==null)return out;
    if(Array.isArray(value)){
      value.forEach((v,i)=>collectLocalImages(v,dataset,path.concat(i),out));return out;
    }
    if(typeof value!=='object')return out;
    for(const [key,val] of Object.entries(value)){
      if(typeof val==='string'&&v24R2IsLocalImage(val)){
        out.push({parent:value,key,val,dataset,path:path.concat(key)});
      }else if(val&&typeof val==='object'&&!/backup/i.test(key))collectLocalImages(val,dataset,path.concat(key),out);
      if(out.length>=120)break;
    }
    return out;
  }

  async function prepareDatasets(names,markRemote=false){
    if(!navigator.onLine||!v24R2Ready())return false;
    const wanted=[...new Set((names||[]).filter(n=>DATASETS.includes(n)&&n!=='backups'))];
    let changed=0;
    for(const ds of wanted){
      const items=collectLocalImages(data[ds],ds);
      if(!items.length)continue;
      for(const item of items){
        const base=String(item.key||'image').replace(/Image$/i,'').replace(/[^a-zA-Z0-9_-]+/g,'-')||'offline-image';
        const up=await window.AhmadiR2.uploadDataUrl(item.val,{folder:v24R2Folder(folderFor(ds,item.key)),targetBytes:V24_R2_BYTES,name:`${base}.jpg`});
        item.parent[item.key]=up.url;
        const stem=item.key.replace(/Image$/i,'Image');
        if(item.key==='readingImage'){item.parent.readingImageKey=up.key;item.parent.readingImageSize=up.size;item.parent.readingImagePending=false;}
        else if(item.key==='proofImage'){item.parent.proofImageKey=up.key;item.parent.proofImageSize=up.size;item.parent.proofImagePending=false;}
        else if(ds==='settings'&&item.key==='networkLogo'){item.parent.networkLogoKey=up.key;item.parent.networkLogoSize=up.size;item.parent.networkLogoPending=false;}
        else {item.parent[`${stem}Key`]=up.key;item.parent[`${stem}Size`]=up.size;}
        changed++;
        save(ds,false);
      }
      if(markRemote)save(ds,true);
    }
    if(changed)v24R2ApplyNetworkLogo();
    return changed>0;
  }

  // Turso calls this before serializing a pending dataset. If an offline image exists,
  // it must become an R2 public URL first, so Turso stores URLs rather than Base64 image data.
  window.AhmadiImageSync={prepareDatasets};

  async function v24R2MigrateLegacyImages(){
    if(v24R2MigrationRunning||!navigator.onLine||!v24R2Ready()||!session)return;
    v24R2MigrationRunning=true;
    try{
      const changed=await prepareDatasets(DATASETS.filter(x=>x!=='backups'),true);
      if(changed)toast(v24R2Text('تم رفع الصور المحلية وحفظ روابطها للمزامنة.','Local images uploaded and their URLs queued for sync.'));
    }catch(err){
      console.warn('R2 image migration:',err);
    }finally{v24R2MigrationRunning=false;}
  }

  function imageStatus(value){
    if(!value)return '';
    return v24R2IsLocalImage(value)?`<span class="image-sync-badge pending">${v24R2Text('محفوظ محلياً • بانتظار الإنترنت','Saved locally • waiting for internet')}</span>`:`<span class="image-sync-badge synced">${v24R2Text('الصورة مرفوعة ومزامنة','Image uploaded and synced')}</span>`;
  }

  function v24R2InvoiceModal(inv){
    const sub=subscriberBy(inv.subscriberId),m=meterBy(inv.meterId);
    return `<div class="record-detail-modal">
      <div class="record-detail-summary"><span>${icon('receipt')}</span><div><strong>${esc(sub.name||'مشترك')}</strong><small>${esc(m?.label||m?.meterNumber||'عداد')} • ${fmtDateTime(inv.date||inv.createdAt)}</small></div><b>${money(invoiceNet(inv))}</b></div>
      <div class="profile-data-grid"><span>${v24R2Text('رقم المشترك','Subscriber Phone')}<b dir="ltr">${esc(fullPhone(sub)||'—')}</b></span><span>${v24R2Text('رقم العداد','Meter Number')}<b>${esc(m?.meterNumber||'—')}</b></span><span>${v24R2Text('القراءة السابقة','Previous Reading')}<b>${num(inv.openingReading)} KW</b></span><span>${v24R2Text('القراءة الحالية','Current Reading')}<b>${num(inv.closingReading)} KW</b></span><span>${v24R2Text('الاستهلاك','Consumption')}<b>${num(inv.consumption)} KW</b></span><span>${v24R2Text('سعر الكيلو','KW Price')}<b>${money(inv.unitPrice||0)}</b></span><span>${v24R2Text('الخصم','Discount')}<b>${money(inv.discount||0)}</b></span><span>${v24R2Text('مبلغ الفاتورة','Invoice Total')}<b>${money(invoiceNet(inv))}</b></span></div>
      ${inv.notes?`<div class="profile-note">${esc(inv.notes)}</div>`:''}
      ${inv.readingImage?`<div class="record-attachment"><div class="section-row-title"><div><strong>${v24R2Text('الصورة المرفقة','Attached Image')}</strong><small>${imageStatus(inv.readingImage)}</small></div></div><img src="${esc(inv.readingImage)}" data-r2-key="${esc(inv.readingImageKey||'')}" alt="${v24R2Text('صورة قراءة العداد','Meter reading image')}"></div>`:''}
    </div>`;
  }

  function v24R2MovementModal(m){
    const mt=movementType(m),sub=m.subscriberId?subscriberBy(m.subscriberId):null;
    const labels={collection:v24R2Text('استقبال دفعة','Received Payment'),send:v24R2Text('إرسال دفعة','Sent Payment'),expense:v24R2Text('مصروف','Expense'),deposit:v24R2Text('إيداع','Deposit'),transfer:v24R2Text('تحويل بين الحسابات','Account Transfer'),subscriber_transfer:v24R2Text('تحويل بين المشتركين','Subscriber Transfer')};
    const account=accountBy(m.accountId||m.fromAccountId||m.toAccountId);
    const fromSub=m.fromSubscriberId?subscriberBy(m.fromSubscriberId):null,toSub=m.toSubscriberId?subscriberBy(m.toSubscriberId):null;
    return `<div class="record-detail-modal">
      <div class="record-detail-summary"><span>${icon(mt==='expense'?'expense':mt==='send'?'arrowUp':mt.includes('transfer')?'transfer':'arrowDown')}</span><div><strong>${esc(labels[mt]||v24R2Text('حركة مالية','Financial Transaction'))}</strong><small>${fmtDateTime(m.date||m.createdAt)}</small></div><b>${money(m.amount||0)}</b></div>
      <div class="profile-data-grid">${sub?`<span>${v24R2Text('المشترك','Subscriber')}<b>${esc(sub.name)}</b></span><span>${v24R2Text('رقم المشترك','Subscriber Phone')}<b dir="ltr">${esc(fullPhone(sub)||'—')}</b></span>`:''}${fromSub?`<span>${v24R2Text('المحول منه','From Subscriber')}<b>${esc(fromSub.name)}</b></span>`:''}${toSub?`<span>${v24R2Text('المحول إليه','To Subscriber')}<b>${esc(toSub.name)}</b></span>`:''}<span>${v24R2Text('الحساب المالي','Financial Account')}<b>${esc(account?.name||'—')}</b></span><span>${v24R2Text('تاريخ الحركة','Transaction Date')}<b>${fmtDateTime(m.date||m.createdAt)}</b></span><span>${v24R2Text('المبلغ','Amount')}<b>${money(m.amount||0)}</b></span><span>${v24R2Text('نوع الحركة','Transaction Type')}<b>${esc(labels[mt]||mt)}</b></span></div>
      ${m.notes?`<div class="profile-note">${esc(m.notes)}</div>`:''}
      ${m.proofImage?`<div class="record-attachment"><div class="section-row-title"><div><strong>${v24R2Text('صورة الإشعار المرفقة','Attached Notification Image')}</strong><small>${imageStatus(m.proofImage)}</small></div></div><img src="${esc(m.proofImage)}" data-r2-key="${esc(m.proofImageKey||'')}" alt="${v24R2Text('صورة الإشعار','Notification image')}"></div>`:''}
    </div>`;
  }

  // Give every financial row a stable movement id without rewriting all existing pages/reports.
  const v24R2PrevFlowRow=flowRow;
  flowRow=function(m){
    const html=v24R2PrevFlowRow(m);
    return html.replace(/<(article|div)\s+/,`<$1 data-movement="${esc(m.id)}" `);
  };

  // Existing subscriber movement tab also becomes clickable.
  const v24R2PrevSubscriberProfile=renderSubscriberProfile;
  renderSubscriberProfile=function(id,tab=''){
    const result=v24R2PrevSubscriberProfile(id,tab);
    const active=tab||(detail?.kind==='subscriber-profile'?detail.tab:'');
    if(active==='movements'){
      const moves=data.movements.filter(m=>String(m.subscriberId||'')===String(id)).sort((a,b)=>new Date(b.date||b.createdAt)-new Date(a.date||a.createdAt));
      [...document.querySelectorAll('#mainContent .profile-tab-list .row-card')].forEach((el,i)=>{if(moves[i])el.dataset.movement=moves[i].id});
    }
    return result;
  };

  document.addEventListener('change',async e=>{
    if(e.target?.id!=='networkLogoInput')return;
    try{await v24R2UploadLogo(e.target.files?.[0]);}
    catch(err){window.AhmadiImageProgress?.fail('network-logo');toast(err?.message||v24R2Text('تعذر تجهيز الشعار.','Could not prepare logo.'),v24R2Text('خطأ','Error'));}
    finally{e.target.value='';}
  },true);

  document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v30-action]'))return;
    const rm=e.target.closest?.('[data-remove-network-logo]');if(rm){
      e.preventDefault();e.stopPropagation();
      const key=data.settings?.networkLogoKey||'';
      data.settings.networkLogo='';data.settings.networkLogoKey='';data.settings.networkLogoName='';data.settings.networkLogoSize=0;data.settings.networkLogoPending=false;save('settings');try{localStorage.removeItem(`ahmadi-print-logo:${session?.companyId||session?.subscriptionId||'default'}`)}catch(_){}
      v24R2ApplyNetworkLogo();if(key&&v24R2Ready()&&navigator.onLine)window.AhmadiR2.deleteObject(key).catch(()=>{});
      toast(v24R2Text('تم إزالة شعار الشبكة.','Network logo removed.'));v24R2InjectNetworkLogo(true);return;
    }

    // Clicking a normal invoice/payment/expense record opens full details, including its image.
    if(e.target.closest('input,select,textarea,label,[data-edit],[data-invoice-contact],[data-view-reading-image],[data-expense-proof],[data-contact],[data-send-channel]'))return;
    const movementEl=e.target.closest?.('[data-movement]');
    if(movementEl){
      const m=data.movements.find(x=>String(x.id)===String(movementEl.dataset.movement));
      if(m){e.preventDefault();e.stopPropagation();openModal(v24R2Text('تفاصيل الحركة المالية','Financial Transaction Details'),v24R2MovementModal(m));return;}
    }
    const invoiceEl=e.target.closest?.('[data-invoice]');
    if(invoiceEl){
      const inv=data.invoices.find(x=>String(x.id)===String(invoiceEl.dataset.invoice));
      if(inv){e.preventDefault();e.stopPropagation();openModal(v24R2Text('تفاصيل الفاتورة','Invoice Details'),v24R2InvoiceModal(inv));return;}
    }
  },true);

  const v24R2PrevRender=render;
  render=function(){const result=v24R2PrevRender();queueMicrotask(()=>{v24R2ApplyNetworkLogo();v24R2InjectNetworkLogo(false);window.AhmadiR2?.refreshImages?.(document)});return result;};

  const v24R2PrevStartSession=startSession;
  startSession=async function(...args){const result=await v24R2PrevStartSession(...args);v24R2ApplyNetworkLogo();setTimeout(v24R2MigrateLegacyImages,1200);return result;};

  window.addEventListener('online',()=>setTimeout(v24R2MigrateLegacyImages,1200));
})();


/* ===== V30 robust invoice printing / image-PDF-Excel export / desktop sidebar ===== */
(() => {
  const V30='30.0.0';
  ICONS.print='<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/><path d="M18 12h.01"/>';
  ICONS.filePdf='<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M8 16h8M8 12h5"/>';
  ICONS.fileExcel='<path d="M5 3h14v18H5z"/><path d="m8 9 4 6m0-6-4 6M14 9h2M14 15h2"/>';
  const ar=()=>document.documentElement.lang!=='en';
  const tx=(a,e)=>ar()?a:e;
  const safe=(v='')=>String(v??'');
  const nw=()=>safe(data.settings?.networkName||session?.companyName||data.settings?.platformName||'شبكة الأحمدي لتوزيع الطاقة الكهربائية').trim();
  const owner=()=>safe(data.settings?.ownerName||session?.actorName||session?.ownerName||'مدير النظام').trim();
  const subtitle=()=>tx('منظومة توليد وتوزيع الطاقة الكهربائية','Electric power generation and distribution system');
  const printerFormat=()=>getPrinterPaperSize();
  const isDesktop=()=>window.innerWidth>=1050;
  function syncDesktopSidebar(){
    const shell=document.getElementById('appView'),drawer=document.getElementById('drawer'),back=document.getElementById('drawerBackdrop');
    if(!shell||!drawer)return;
    shell.classList.toggle('desktop-sidebar-v30',isDesktop());
    if(isDesktop()){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');back?.classList.remove('show')}
  }
  const _openDrawer=openDrawer,_closeDrawer=closeDrawer;
  openDrawer=function(){if(isDesktop()){syncDesktopSidebar();return}return _openDrawer()};
  closeDrawer=function(){if(isDesktop()){syncDesktopSidebar();return}return _closeDrawer()};
  window.addEventListener('resize',()=>setTimeout(syncDesktopSidebar,30));

  const dlBlob=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)};
  const slug=v=>safe(v||'file').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'file';
  const dnum=v=>{const d=new Date(v||Date.now());if(Number.isNaN(d.getTime()))return '—';return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`};
  const rounded=(ctx,x,y,w,h,r,fill,stroke)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}};
  const line=(ctx,x1,y1,x2,y2,color='#d9e2ea',width=2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()};
  function wrapText(ctx,text,maxWidth){
    const lines=[];
    for(const paragraph of safe(text).split(/\n+/)){
      const words=paragraph.split(/\s+/).filter(Boolean);let cur='';
      for(const word of words){const next=cur?`${cur} ${word}`:word;if(ctx.measureText(next).width<=maxWidth||!cur)cur=next;else{lines.push(cur);cur=word}}
      if(cur)lines.push(cur);
    }
    return lines.length?lines:[''];
  }
  function fitImageBox(ctx,img,cx,y,maxW,maxH){
    const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1,k=Math.min(maxW/iw,maxH/ih,1),w=Math.max(1,iw*k),h=Math.max(1,ih*k);ctx.drawImage(img,cx-w/2,y,w,h);return h;
  }
  async function waitFonts(){try{await document.fonts?.ready}catch(_){}}
  async function loadDrawable(src,key=''){
    const candidates=[];
    if(src&&/^data:|^blob:/i.test(src))candidates.push(src);
    if(navigator.onLine&&window.AhmadiR2?.signedUrl){const k=key||window.AhmadiR2.keyFromUrl?.(src);if(k)try{candidates.push(await window.AhmadiR2.signedUrl(k))}catch(_){}}
    if(src)candidates.push(src);
    candidates.push('logo.jpg');
    for(const url of [...new Set(candidates.filter(Boolean))]){
      try{
        let drawableUrl=url;
        if(/^https?:/i.test(url)){
          try{const res=await fetch(url,{mode:'cors',cache:'no-store'});if(res.ok){const blob=await res.blob();drawableUrl=URL.createObjectURL(blob)}}catch(_){}
        }
        const img=await new Promise((resolve,reject)=>{const i=new Image();if(/^https?:/i.test(drawableUrl))i.crossOrigin='anonymous';i.onload=()=>resolve(i);i.onerror=reject;i.src=drawableUrl});
        return img;
      }catch(_){}
    }
    return null;
  }
  function currentPrintLogoKeys(){
    const ids=[session?.companyId,session?.subscriptionId,'default','last'].filter(Boolean);
    return [...new Set(ids.map(v=>`ahmadi-print-logo:${v}`))];
  }
  function persistPrintLogo(url=''){
    if(!url)return;
    try{for(const key of currentPrintLogoKeys())localStorage.setItem(key,url)}catch(_){}
  }
  async function networkLogo(){
    const candidates=[];
    try{
      for(const key of currentPrintLogoKeys()){
        const v=localStorage.getItem(key)||'';
        if(v)candidates.push([v,'']);
      }
    }catch(_){}
    const liveBrand=document.querySelector('.brand-logo')?.currentSrc||document.querySelector('.brand-logo')?.src||'';
    const livePreview=document.querySelector('.network-logo-preview img')?.currentSrc||document.querySelector('.network-logo-preview img')?.src||'';
    const liveDrawer=document.getElementById('drawerLogo')?.currentSrc||document.getElementById('drawerLogo')?.src||'';
    if(liveBrand)candidates.push([liveBrand,'']);
    if(livePreview)candidates.push([livePreview,data.settings?.networkLogoKey||'']);
    if(liveDrawer)candidates.push([liveDrawer,'']);
    if(data.settings?.networkLogo)candidates.push([data.settings.networkLogo,data.settings?.networkLogoKey||'']);
    candidates.push(['logo.jpg','']);
    for(const [src,key] of candidates){
      const img=await loadDrawable(src,key);
      if(img){
        try{persistPrintLogo(src)}catch(_){}
        return img;
      }
    }
    return null;
  }
  function invoiceNo(inv){
    const year=new Date(inv.date||inv.createdAt||Date.now()).getFullYear();
    const arr=[...data.invoices].sort((a,b)=>new Date(a.date||a.createdAt||0)-new Date(b.date||b.createdAt||0));
    const ix=Math.max(0,arr.findIndex(x=>String(x.id)===String(inv.id)));
    return `INV-${year}-${String(ix+1).padStart(3,'0')}`;
  }
  function invoicePaid(inv){
    const invs=data.invoices.filter(x=>String(x.subscriberId)===String(inv.subscriberId)).sort((a,b)=>new Date(a.date||a.createdAt||0)-new Date(b.date||b.createdAt||0));
    const movs=data.movements.filter(m=>String(m.subscriberId)===String(inv.subscriberId));
    const paidPool=Math.max(0,movs.filter(m=>['collection','deposit'].includes(movementType(m))).reduce((s,m)=>s+Number(m.amount||0),0)-movs.filter(m=>movementType(m)==='send').reduce((s,m)=>s+Number(m.amount||0),0));
    let pool=paidPool;
    for(const x of invs){const amount=invoiceNet(x),paid=Math.min(amount,pool);if(String(x.id)===String(inv.id))return {paid,remaining:Math.max(0,amount-paid)};pool=Math.max(0,pool-amount)}
    return {paid:0,remaining:invoiceNet(inv)};
  }
  function invoiceSize(format){
    if(format==='80')return {w:1280,h:2900,scale:1.36};
    if(format==='58')return {w:920,h:2760,scale:1.02};
    return {w:1440,h:3000,scale:1.46};
  }
  async function drawInvoice(inv,format='a4'){
    await waitFonts();const s=invoiceSize(format),c=document.createElement('canvas');c.width=s.w;c.height=s.h;const ctx=c.getContext('2d');ctx.direction='rtl';
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);
    const sc=s.scale, pad=64*sc, W=c.width, center=W/2;
    const logo=await networkLogo();let y=44*sc;
    if(logo){
      const boxW=92*sc,boxH=92*sc;
      const used=fitImageBox(ctx,logo,center,y,boxW,boxH);
      y+=Math.max(used,boxH*.75)+20*sc;
      line(ctx,center-72*sc,y,center+72*sc,y,'#d6dee8',1.8*sc);
      y+=32*sc;
    }else{
      y+=18*sc;
    }
    ctx.textAlign='center';ctx.fillStyle='#0c1b35';ctx.font=`800 ${40*sc}px Cairo, Arial`;
    const nameLines=wrapText(ctx,nw(),W-pad*2).slice(0,3);for(const txt of nameLines){ctx.fillText(txt,center,y);y+=48*sc}
    y+=8*sc;ctx.fillStyle='#7f8da1';ctx.font=`500 ${20*sc}px Cairo, Arial`;
    const subLines=wrapText(ctx,subtitle(),W-pad*2).slice(0,2);for(const txt of subLines){ctx.fillText(txt,center,y);y+=30*sc}
    y+=28*sc;
    ctx.font=`800 ${28*sc}px Cairo, Arial`;ctx.fillStyle='#cf7b0a';ctx.fillText(`${tx('فاتورة رقم','Invoice No')}: ${invoiceNo(inv)}`,center,y);y+=44*sc;
    ctx.font=`500 ${20*sc}px Cairo, Arial`;ctx.fillStyle='#8d99aa';ctx.fillText(`${tx('تاريخ الإصدار','Issue Date')}: ${dnum(inv.date||inv.createdAt)}`,center,y);y+=58*sc;
    ctx.setLineDash([10*sc,8*sc]);line(ctx,pad,y,W-pad,y,'#cfd8e2',3*sc);ctx.setLineDash([]);y+=48*sc;
    const sub=subscriberBy(inv.subscriberId),m=meterBy(inv.meterId)||{};
    const labels=[tx('المشترك:','Subscriber:'),tx('رقم الهاتف:','Phone:'),tx('العداد:','Meter:'),tx('الموقع:','Location:')];
    const values=[sub.name||'—',fullPhone(sub)||'—',`${m.label||tx('عداد','Meter')} ${m.meterNumber?`(${m.meterNumber})`:''}`,m.location||sub.address||'—'];
    ctx.textAlign='right';ctx.font=`700 ${23*sc}px Cairo, Arial`;ctx.fillStyle='#75859a';
    for(let i=0;i<labels.length;i++){ctx.fillText(labels[i],W-pad,y+i*44*sc)}
    ctx.textAlign='left';ctx.font=`800 ${23*sc}px Cairo, Arial`;ctx.fillStyle='#0c1b35';
    for(let i=0;i<values.length;i++){const lines=wrapText(ctx,values[i],W*.52);ctx.fillText(lines[0],pad,y+i*44*sc)}
    y+=labels.length*44*sc+34*sc;line(ctx,pad,y,W-pad,y,'#dbe3ea',2*sc);y+=38*sc;
    const cols=[W-pad,pad+W*.34,pad], rowH=68*sc;
    ctx.textAlign='right';ctx.font=`800 ${20*sc}px Cairo, Arial`;ctx.fillStyle='#6e7f94';ctx.fillText(tx('البيان','Description'),cols[0],y);ctx.textAlign='center';ctx.fillText(tx('القراءة','Reading'),cols[1],y);ctx.textAlign='left';ctx.fillText(tx('القيمة','Value'),cols[2],y);y+=24*sc;line(ctx,pad,y,W-pad,y,'#cbd5df',2*sc);y+=rowH*.68;
    const rows=[
      [tx('القراءة الحالية','Current Reading'),`KW ${num(inv.closingReading||0)}`,dnum(inv.periodTo||inv.date)],
      [tx('القراءة السابقة','Previous Reading'),`KW ${num(inv.openingReading||0)}`,dnum(inv.periodFrom||inv.date)],
      [tx('كمية الاستهلاك','Consumption'),`KW ${num(inv.consumption||0)}`,`${tx('سعر','Price')} ${money(inv.unitPrice||0)}`]
    ];
    rows.forEach((r,i)=>{if(i===2){ctx.fillStyle='#fbf7ed';ctx.fillRect(pad,y-rowH*.60,W-pad*2,rowH*.84)}ctx.font=`${i===2?'800':'600'} ${20*sc}px Cairo, Arial`;ctx.fillStyle=i===2?'#8c4f0d':'#182841';ctx.textAlign='right';ctx.fillText(r[0],cols[0],y);ctx.textAlign='center';ctx.fillText(r[1],cols[1],y);ctx.textAlign='left';ctx.fillText(r[2],cols[2],y);y+=rowH;line(ctx,pad,y-rowH*.38,W-pad,y-rowH*.38,'#e4e9ee',1.4*sc)});
    y+=18*sc;ctx.setLineDash([10*sc,8*sc]);line(ctx,pad,y,W-pad,y,'#cfd8e2',3*sc);ctx.setLineDash([]);y+=48*sc;
    const gross=Number(inv.subtotal||Number(inv.consumption||0)*Number(inv.unitPrice||0)),settle=invoicePaid(inv),totals=[
      [tx('إجمالي ثمن الفاتورة:','Invoice Total:'),money(gross),'#0d1b34',500],
      [tx('الخصم الممنوح:','Discount:'),`- ${money(inv.discount||0)}`,'#7e22ce',500],
      [tx('صافي الفاتورة المستحق:','Net Invoice Due:'),money(invoiceNet(inv)),'#0d1b34',800],
      [tx('المبلغ المسدد:','Paid Amount:'),money(settle.paid),'#0c8b68',600],
      [tx('المبلغ المتبقي:','Remaining Amount:'),money(settle.remaining),'#c80745',800]
    ];
    totals.forEach(([lab,val,color,weight],i)=>{ctx.font=`${weight} ${(i===2||i===4?29:23)*sc}px Cairo, Arial`;ctx.fillStyle=color;ctx.textAlign='right';ctx.fillText(lab,W-pad,y);ctx.textAlign='left';ctx.fillText(val,pad,y);y+=(i===2?56:48)*sc;if(i===1||i===2)line(ctx,pad,y-18*sc,W-pad,y-18*sc,'#e0e6ec',1.3*sc)});
    y+=18*sc;line(ctx,pad,y,W-pad,y,'#dbe3ea',2*sc);y+=54*sc;ctx.textAlign='center';ctx.font=`500 ${19*sc}px Cairo, Arial`;ctx.fillStyle='#8292a6';ctx.fillText(tx('شاكـرين لكم التزامكم بالسداد ودعم استمرارية التوليد','Thank you for your payment and continued support'),center,y);
    // Crop unused white area while leaving comfortable footer space.
    const cropH=Math.min(c.height,Math.ceil(y+65*sc));if(cropH<c.height){const out=document.createElement('canvas');out.width=c.width;out.height=cropH;out.getContext('2d').drawImage(c,0,0);return out}
    return c;
  }
  function canvasBlob(canvas,type='image/png',quality=.95){return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(Error(tx('تعذر إنشاء الملف.','Could not create file.'))),type,quality))}
  function imageData(canvas,type='image/jpeg',quality=.94){return canvas.toDataURL(type,quality)}
  function bytesFromDataUrl(url){const b64=url.split(',')[1]||'',bin=atob(b64),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
  function asciiBytes(s){return new TextEncoder().encode(s)}
  function concatBytes(parts){const len=parts.reduce((s,p)=>s+p.length,0),out=new Uint8Array(len);let o=0;for(const p of parts){out.set(p,o);o+=p.length}return out}
  function pdfFromCanvases(canvases,thermal='a4'){
    const imgs=canvases.map(c=>({data:bytesFromDataUrl(imageData(c,'image/jpeg',.92)),w:c.width,h:c.height}));
    const pageSize=im=>{if(thermal==='80')return [226.77,226.77*im.h/im.w];if(thermal==='58')return [164.41,164.41*im.h/im.w];return [595.28,841.89]};
    const n=imgs.length,pagesObj=2,parts=[],offsets=[0];let length=0;const add=p=>{parts.push(p);length+=p.length};const addS=s=>add(asciiBytes(s));
    addS('%PDF-1.4\n');
    offsets[1]=length;addS('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    const kids=[];for(let i=0;i<n;i++)kids.push(`${3+i*3} 0 R`);
    offsets[2]=length;addS(`2 0 obj\n<< /Type /Pages /Count ${n} /Kids [${kids.join(' ')}] >>\nendobj\n`);
    for(let i=0;i<n;i++){
      const im=imgs[i],page=3+i*3,imgObj=4+i*3,contentObj=5+i*3,[pw,ph]=pageSize(im);let dw=pw,dh=ph,dx=0,dy=0;
      if(thermal==='a4'){const r=Math.min((pw-30)/im.w,(ph-30)/im.h);dw=im.w*r;dh=im.h*r;dx=(pw-dw)/2;dy=(ph-dh)/2}
      offsets[page]=length;addS(`${page} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw.toFixed(2)} ${ph.toFixed(2)}] /Resources << /XObject << /Im0 ${imgObj} 0 R >> >> /Contents ${contentObj} 0 R >>\nendobj\n`);
      offsets[imgObj]=length;addS(`${imgObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.data.length} >>\nstream\n`);add(im.data);addS('\nendstream\nendobj\n');
      const stream=`q\n${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${dx.toFixed(2)} ${dy.toFixed(2)} cm\n/Im0 Do\nQ\n`;offsets[contentObj]=length;addS(`${contentObj} 0 obj\n<< /Length ${asciiBytes(stream).length} >>\nstream\n${stream}endstream\nendobj\n`);
    }
    const xref=length,maxObj=2+n*3;addS(`xref\n0 ${maxObj+1}\n0000000000 65535 f \n`);for(let i=1;i<=maxObj;i++)addS(`${String(offsets[i]||0).padStart(10,'0')} 00000 n \n`);addS(`trailer\n<< /Size ${maxObj+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);return new Blob(parts,{type:'application/pdf'});
  }
  async function printCanvas(canvas,format='a4',title='invoice'){
    const url=imageData(canvas,'image/png',1),page=format==='80'?'80mm auto':format==='58'?'58mm auto':'A4',imgW=format==='80'?'76mm':format==='58'?'54mm':'82mm';
    const frame=document.createElement('iframe');frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;left:-10000px;top:0;width:900px;height:1200px;border:0;opacity:.01;pointer-events:none;z-index:-1;background:#fff';document.body.appendChild(frame);
    const cleanup=()=>setTimeout(()=>{try{frame.remove()}catch(_){}},1200);
    try{
      const doc=frame.contentDocument||frame.contentWindow?.document;if(!doc)throw Error(tx('تعذر فتح خدمة الطباعة.','Could not open print service.'));
      doc.open();doc.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:${page};margin:0}*{box-sizing:border-box}html,body{margin:0!important;padding:0!important;background:#fff!important;width:100%}body{display:flex;justify-content:center;align-items:flex-start;overflow:visible}img{display:block;width:${imgW};height:auto;max-width:100%;margin:${format==='a4'?'10mm auto':'0 auto'};object-fit:contain}@media print{html,body{background:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><img id="invoicePrintImage" alt="invoice" src="${url}"></body></html>`);doc.close();
      const img=doc.getElementById('invoicePrintImage');
      await new Promise((resolve,reject)=>{let done=false;const ok=()=>{if(done)return;done=true;resolve()};const bad=()=>{if(done)return;done=true;reject(Error(tx('تعذر تجهيز صورة الفاتورة للطباعة.','Could not prepare invoice image for printing.')))};if(img?.complete&&img.naturalWidth)ok();else if(img){img.onload=ok;img.onerror=bad}else bad();setTimeout(()=>{if(!done&&img?.naturalWidth)ok()},900)});
      await new Promise(r=>setTimeout(r,80));const win=frame.contentWindow;if(!win)throw Error(tx('تعذر تشغيل أمر الطباعة.','Could not start printing.'));win.onafterprint=cleanup;win.focus();win.print();setTimeout(cleanup,15000);
    }catch(err){cleanup();throw err}
  }
  async function invoiceAction(inv,mode,format='a4'){
    toast(tx('جاري تجهيز الفاتورة...','Preparing invoice...'),tx('تجهيز','Preparing'));
    const canvas=await drawInvoice(inv,format),base=slug(invoiceNo(inv));
    if(mode==='image'){dlBlob(await canvasBlob(canvas,'image/png'),`${base}-${format}.png`);return}
    if(mode==='pdf'){dlBlob(pdfFromCanvases([canvas],format),`${base}-${format}.pdf`);return}
    if(mode==='print')return printCanvas(canvas,format,base);
  }
  async function previewInvoice(inv,format=printerFormat()){
    openModal(tx('معاينة إيصال الفاتورة للطباعة','Invoice print preview'),`<div class="v30-preview-tools"><div class="v30-format"><button data-v30-action="format" data-id="${esc(inv.id)}" data-format="a4" class="${format==='a4'?'active':''}">A4</button><button data-v30-action="format" data-id="${esc(inv.id)}" data-format="80" class="${format==='80'?'active':''}">80mm</button><button data-v30-action="format" data-id="${esc(inv.id)}" data-format="58" class="${format==='58'?'active':''}">58mm</button></div><div class="v30-preview-actions"><button class="primary-btn" data-v30-action="invoice-print" data-id="${esc(inv.id)}" data-format="${format}">${icon('print')} ${tx('طباعة','Print')}</button><button class="secondary-btn" data-v30-action="invoice-image" data-id="${esc(inv.id)}" data-format="${format}">${icon('image')} ${tx('صورة','Image')}</button><button class="secondary-btn" data-v30-action="invoice-pdf" data-id="${esc(inv.id)}" data-format="${format}">${icon('filePdf')} PDF</button></div></div><div id="v30Preview" class="v30-preview-box"><div class="v30-export-loading">${tx('جاري تجهيز المعاينة...','Preparing preview...')}</div></div>`);hydrateIcons(document.getElementById('modalRoot'));
    try{const c=await drawInvoice(inv,format),img=new Image();img.className='v30-preview-image';img.src=imageData(c,'image/png',1);const root=document.getElementById('v30Preview');if(root){root.innerHTML='';root.appendChild(img)}}catch(err){const root=document.getElementById('v30Preview');if(root)root.innerHTML=`<div class="empty">${esc(err.message||tx('تعذر تجهيز المعاينة','Preview failed'))}</div>`}
  }

  function xmlEsc(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function excelBlob(cfg){
    const cols=cfg.columns||[],rows=cfg.rows||[];
    const sheet=`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#DDEBF7" ss:Pattern="Solid"/></Style><Style ss:ID="Title"><Font ss:Bold="1" ss:Size="14"/></Style></Styles><Worksheet ss:Name="Report"><Table><Row ss:StyleID="Title"><Cell ss:MergeAcross="${Math.max(0,cols.length-1)}"><Data ss:Type="String">${xmlEsc(cfg.title||'Report')}</Data></Cell></Row><Row>${cols.map(c=>`<Cell ss:StyleID="Header"><Data ss:Type="String">${xmlEsc(c.label)}</Data></Cell>`).join('')}</Row>${rows.map(r=>`<Row>${cols.map(c=>`<Cell><Data ss:Type="String">${xmlEsc(r[c.key]??'')}</Data></Cell>`).join('')}</Row>`).join('')}</Table></Worksheet></Workbook>`;
    return new Blob(['\ufeff',sheet],{type:'application/vnd.ms-excel;charset=utf-8'});
  }
  function pageConfig(){
    const q=safe(detailSearch).trim().toLowerCase();
    if(currentPage==='subscribers'&&!detail){let rows=data.subscribers.filter(s=>!q||`${s.name} ${fullPhone(s)} ${s.address||''}`.toLowerCase().includes(q));return {title:tx('سجل المشتركين','Subscribers Report'),file:'subscribers',columns:[['name',tx('الاسم','Name')],['phone',tx('الهاتف','Phone')],['address',tx('العنوان','Address')],['meters',tx('العدادات','Meters')],['balance',tx('الرصيد','Balance')]].map(([key,label])=>({key,label})),rows:rows.map(s=>({name:s.name,phone:fullPhone(s),address:s.address||'',meters:data.meters.filter(m=>String(m.subscriberId)===String(s.id)).length,balance:money(subscriberBalance(s.id))}))}}
    if(currentPage==='meters'&&!detail){let rows=data.meters.filter(m=>{const s=subscriberBy(m.subscriberId),r=regionBy(m.regionId),b=boardBy(m.boardId);return !q||`${s.name} ${m.label||''} ${m.meterNumber||''} ${r.name||''} ${b.name||''}`.toLowerCase().includes(q)});return {title:tx('سجل العدادات','Meters Report'),file:'meters',columns:[['subscriber',tx('المشترك','Subscriber')],['meter',tx('العداد','Meter')],['number',tx('رقم العداد','Meter No')],['region',tx('المنطقة','Region')],['board',tx('اللوحة','Board')],['consumption',tx('الاستهلاك','Consumption')]].map(([key,label])=>({key,label})),rows:rows.map(m=>({subscriber:subscriberBy(m.subscriberId).name,meter:m.label||'',number:m.meterNumber||'',region:regionBy(m.regionId).name||'',board:boardBy(m.boardId).name||'',consumption:`${num(meterConsumption(m.id,true))} KW`}))}}
    if(currentPage==='invoices'&&!detail){let rows=filtered('invoices').filter(i=>{const s=subscriberBy(i.subscriberId),m=meterBy(i.meterId);return !q||`${s.name} ${fullPhone(s)} ${m?.label||''} ${m?.meterNumber||''}`.toLowerCase().includes(q)});rows=sortRows(rows,'amount','date');return {title:tx('سجل الفواتير','Invoices Report'),file:'invoices',meta:[`${tx('عدد الفواتير','Invoices')}: ${rows.length}`,`${tx('الإجمالي','Total')}: ${money(rows.reduce((a,i)=>a+invoiceNet(i),0))}`],columns:[['no',tx('رقم الفاتورة','Invoice No')],['subscriber',tx('المشترك','Subscriber')],['phone',tx('الهاتف','Phone')],['meter',tx('العداد','Meter')],['date',tx('التاريخ','Date')],['consumption',tx('الاستهلاك','Consumption')],['price',tx('سعر KW','KW Price')],['discount',tx('الخصم','Discount')],['total',tx('الصافي','Net')]].map(([key,label])=>({key,label})),rows:rows.map(i=>{const s=subscriberBy(i.subscriberId),m=meterBy(i.meterId);return {no:invoiceNo(i),subscriber:s.name,phone:fullPhone(s),meter:`${m?.label||''} ${m?.meterNumber||''}`.trim(),date:dnum(i.date||i.createdAt),consumption:`${num(i.consumption)} KW`,price:money(i.unitPrice),discount:money(i.discount),total:money(invoiceNet(i))}})}}
    if(currentPage==='flows'&&!detail){let rows=filtered('movements').filter(m=>!q||`${subscriberBy(m.subscriberId).name} ${m.notes||''} ${m.payee||''}`.toLowerCase().includes(q));return {title:tx('سجل التدفقات المالية','Financial Movements'),file:'financial-movements',columns:[['type',tx('النوع','Type')],['party',tx('المشترك/الجهة','Party')],['account',tx('الحساب','Account')],['date',tx('التاريخ','Date')],['amount',tx('المبلغ','Amount')],['notes',tx('الملاحظات','Notes')]].map(([key,label])=>({key,label})),rows:rows.map(m=>({type:moveLabel(m),party:m.subscriberId?subscriberBy(m.subscriberId).name:(m.payee||'—'),account:accountBy(m.accountId||m.fromAccountId||m.toAccountId).name||'—',date:fmtDateTime(m.date||m.createdAt),amount:money(m.amount),notes:m.notes||''}))}}
    if(currentPage==='accounts'&&!detail){const rows=data.accounts.filter(a=>!q||`${a.name} ${a.number||''} ${a.notes||''}`.toLowerCase().includes(q));return {title:tx('الحسابات المالية','Financial Accounts'),file:'accounts',columns:[['name',tx('اسم الحساب','Account')],['type',tx('النوع','Type')],['number',tx('الرقم','Number')],['date',tx('تاريخ الإضافة','Created')],['balance',tx('الرصيد','Balance')],['notes',tx('الملاحظات','Notes')]].map(([key,label])=>({key,label})),rows:rows.map(a=>({name:a.name,type:a.type==='bank'?tx('بنكي','Bank'):tx('نقدي','Cash'),number:a.number||'',date:dnum(a.createdAt),balance:money(accountBalance(a.id)),notes:a.notes||''}))}}
    if(currentPage==='logs'&&!detail){const rows=filtered('logs','date').filter(l=>!q||`${l.title||''} ${l.actor||''} ${l.meta||''}`.toLowerCase().includes(q));return {title:tx('السجل الزمني','Timeline Log'),file:'timeline',columns:[['title',tx('العملية','Action')],['actor',tx('الحساب','Account')],['date',tx('التاريخ','Date')],['meta',tx('التفاصيل','Details')]].map(([key,label])=>({key,label})),rows:rows.map(l=>({title:l.title||'',actor:l.actor||'',date:fmtDateTime(l.date||l.createdAt),meta:l.meta||''}))}}
    if(currentPage==='tasks'&&!detail){const rows=data.tasks.filter(t=>!q||`${t.title||''} ${t.details||''}`.toLowerCase().includes(q));return {title:tx('سجل المهام','Tasks Report'),file:'tasks',columns:[['title',tx('المهمة','Task')],['date',tx('التاريخ','Date')],['status',tx('الحالة','Status')],['details',tx('التفاصيل','Details')]].map(([key,label])=>({key,label})),rows:rows.map(t=>({title:t.title||'',date:fmtDateTime(t.dueAt||t.createdAt),status:t.status||'',details:t.details||''}))}}
    return visibleConfig();
  }
  function moveLabel(m){return ({collection:tx('استقبال دفعة','Received payment'),send:tx('إرسال دفعة','Sent payment'),expense:tx('مصروف','Expense'),transfer:tx('تحويل أموال','Transfer'),deposit:tx('إيداع','Deposit'),subscriber_transfer:tx('تحويل بين المشتركين','Subscriber transfer')})[movementType(m)]||movementType(m)}
  function visibleConfig(){
    const main=document.getElementById('mainContent'),title=document.getElementById('pageTitle')?.textContent?.trim()||tx('تقرير','Report');if(!main)return null;
    const cards=[...main.querySelectorAll('.metric,.row-card,.report-card,.report-main-card,.report-menu-card,.report-command-card,.v18-summary-card,.v18-report-section,.v20-expense-type-card,.timeline-report-log')].filter(el=>el.offsetParent!==null).slice(0,300);
    const rows=cards.map((el,i)=>({no:i+1,content:safe(el.innerText).replace(/\s*\n\s*/g,' • ').replace(/\s+/g,' ').trim()})).filter(x=>x.content);
    return {title,file:'report',columns:[{key:'no',label:'#'},{key:'content',label:tx('البيانات الظاهرة','Visible Data')}],rows};
  }
  async function drawReportPage(cfg,rows,page,pageCount){
    await waitFonts();const c=document.createElement('canvas');c.width=1240;c.height=1754;const ctx=c.getContext('2d');ctx.direction='rtl';ctx.fillStyle='#f3f6f8';ctx.fillRect(0,0,c.width,c.height);rounded(ctx,45,45,1150,1664,28,'#ffffff','#dde5eb');
    const logo=await networkLogo();if(logo){ctx.save();ctx.beginPath();ctx.roundRect(90,82,88,88,22);ctx.clip();ctx.drawImage(logo,90,82,88,88);ctx.restore()}
    ctx.fillStyle='#10223d';ctx.textAlign='right';ctx.font='700 38px Cairo, Arial';ctx.fillText(cfg.title||tx('تقرير','Report'),1140,108);ctx.font='400 18px Cairo, Arial';ctx.fillStyle='#718399';ctx.fillText(nw(),1140,145);
    ctx.font='500 16px Cairo, Arial';ctx.fillStyle='#536a83';ctx.fillText(`${tx('الحساب','Account')}: ${owner()}  •  ${tx('تاريخ التصدير','Export Date')}: ${dnum(new Date())}`,1140,178);
    let y=230;(cfg.meta||[]).forEach((m,i)=>{rounded(ctx,90+i*260,y,240,42,21,'#edf3f6','#dce5eb');ctx.fillStyle='#425973';ctx.textAlign='center';ctx.font='500 15px Cairo, Arial';ctx.fillText(safe(m),210+i*260,y+27)});y+=(cfg.meta?.length?72:20);
    const cols=cfg.columns||[], totalW=1040,x0=100;const colW=cols.map((_,i)=>i===0&&cols.length>2?Math.max(100,totalW*.12):totalW/cols.length);let sum=colW.reduce((a,b)=>a+b,0);if(sum!==totalW)colW[colW.length-1]+=totalW-sum;
    rounded(ctx,x0,y,totalW,56,10,'#eef4f7','#d9e3ea');let xr=x0+totalW;ctx.font='700 16px Cairo, Arial';ctx.fillStyle='#5d7289';ctx.textAlign='right';for(let i=0;i<cols.length;i++){ctx.fillText(cols[i].label,xr-14,y+35);xr-=colW[i]}
    y+=56;const rh=58;ctx.font='500 14px Cairo, Arial';rows.forEach((r,ri)=>{if(ri%2===1){ctx.fillStyle='#fbfcfd';ctx.fillRect(x0,y,totalW,rh)}xr=x0+totalW;for(let i=0;i<cols.length;i++){ctx.fillStyle='#152945';ctx.textAlign='right';let val=safe(r[cols[i].key]??'');if(val.length>55)val=val.slice(0,52)+'…';ctx.fillText(val,xr-14,y+36);xr-=colW[i]}line(ctx,x0,y+rh,x0+totalW,y+rh,'#e5ebef',1);y+=rh});
    ctx.font='400 14px Cairo, Arial';ctx.textAlign='center';ctx.fillStyle='#8494a6';ctx.fillText(`${tx('صفحة','Page')} ${page}/${pageCount}`,620,1665);return c;
  }
  async function reportCanvases(cfg){const per=22,all=cfg.rows||[],chunks=[];for(let i=0;i<Math.max(1,Math.ceil(all.length/per));i++)chunks.push(all.slice(i*per,(i+1)*per));const out=[];for(let i=0;i<chunks.length;i++)out.push(await drawReportPage(cfg,chunks[i],i+1,chunks.length));return out}
  async function exportPage(mode){const cfg=pageConfig();if(!cfg){toast(tx('لا توجد بيانات قابلة للتصدير هنا.','Nothing to export here.'),'تنبيه');return}toast(tx('جاري تجهيز الملف...','Preparing file...'),tx('تجهيز','Preparing'));
    if(mode==='excel'){dlBlob(excelBlob(cfg),`${slug(cfg.file||cfg.title)}.xls`);return}
    const canvases=await reportCanvases(cfg);if(mode==='pdf'){dlBlob(pdfFromCanvases(canvases,'a4'),`${slug(cfg.file||cfg.title)}.pdf`);return}
    if(canvases.length===1){dlBlob(await canvasBlob(canvases[0]),`${slug(cfg.file||cfg.title)}.png`);return}
    // For multi-page image exports, download numbered pages so no records are omitted.
    for(let i=0;i<canvases.length;i++){await new Promise(r=>setTimeout(r,120));dlBlob(await canvasBlob(canvases[i]),`${slug(cfg.file||cfg.title)}-${String(i+1).padStart(2,'0')}.png`)}
  }
  async function recordCanvas(kind,id){
    let title='',fields=[],attachment='';
    if(kind==='subscriber'){const s=subscriberBy(id);title=s.name;fields=[[tx('الهاتف','Phone'),fullPhone(s)||'—'],[tx('العنوان','Address'),s.address||'—'],[tx('تاريخ الإضافة','Created'),fmtDate(s.createdAt)],[tx('عدد العدادات','Meters'),String(data.meters.filter(m=>String(m.subscriberId)===String(id)).length)],[tx('الرصيد','Balance'),money(subscriberBalance(id))]]}
    if(kind==='meter'){const m=meterBy(id),s=subscriberBy(m.subscriberId);title=m.label||m.meterNumber||tx('عداد','Meter');fields=[[tx('المشترك','Subscriber'),s.name],[tx('رقم العداد','Meter No'),m.meterNumber||'—'],[tx('المنطقة','Region'),regionBy(m.regionId).name||'—'],[tx('لوحة التوزيع','Board'),boardBy(m.boardId).name||'—'],[tx('القراءة الافتتاحية','Opening Reading'),`${num(m.openingReading)} KW`],[tx('آخر قراءة','Last Reading'),`${num(m.lastReading??m.openingReading)} KW`],[tx('الاستهلاك','Consumption'),`${num(meterConsumption(m.id,false))} KW`]]}
    if(kind==='account'){const a=accountBy(id);title=a.name;fields=[[tx('نوع الحساب','Type'),a.type==='bank'?tx('بنكي','Bank'):tx('نقدي','Cash')],[tx('رقم الحساب','Number'),a.number||'—'],[tx('تاريخ الإضافة','Created'),fmtDate(a.createdAt)],[tx('الرصيد الحالي','Balance'),money(accountBalance(a.id))],[tx('الملاحظات','Notes'),a.notes||'—']]}
    if(kind==='movement'){const m=data.movements.find(x=>String(x.id)===String(id));title=moveLabel(m);fields=[[tx('التاريخ','Date'),fmtDateTime(m.date||m.createdAt)],[tx('المبلغ','Amount'),money(m.amount)],[tx('المشترك/الجهة','Party'),m.subscriberId?subscriberBy(m.subscriberId).name:(m.payee||'—')],[tx('الحساب','Account'),accountBy(m.accountId||m.fromAccountId||m.toAccountId).name||'—'],[tx('الملاحظات','Notes'),m.notes||'—']];attachment=m.proofImage||''}
    if(kind==='region'){const r=regionBy(id);title=r.name;fields=[[tx('رقم المنطقة','Region No'),r.regionNumber||'—'],[tx('لوحات التوزيع','Boards'),String(regionBoards(id).length)],[tx('العدادات','Meters'),String(regionMeters(id).length)],[tx('الاستهلاك','Consumption'),`${num(regionMeters(id).reduce((s,m)=>s+meterConsumption(m.id,true),0))} KW`],[tx('الملاحظات','Notes'),r.notes||'—']]}
    if(kind==='board'){const b=boardBy(id);title=b.name||b.boardNumber;fields=[[tx('رقم اللوحة','Board No'),b.boardNumber||'—'],[tx('المنطقة','Region'),regionBy(b.regionId).name||'—'],[tx('العدادات','Meters'),String(boardMeters(id).length)],[tx('الاستهلاك','Consumption'),`${num(boardMeters(id).reduce((s,m)=>s+meterConsumption(m.id,true),0))} KW`],[tx('الملاحظات','Notes'),b.notes||'—']]}
    if(kind==='invoice'){const inv=data.invoices.find(x=>String(x.id)===String(id));return drawInvoice(inv,'a4')}
    await waitFonts();const h=760+Math.max(0,fields.length-5)*70+(attachment?300:0),c=document.createElement('canvas');c.width=1100;c.height=h;const ctx=c.getContext('2d');ctx.direction='rtl';ctx.fillStyle='#f3f6f8';ctx.fillRect(0,0,c.width,c.height);rounded(ctx,40,40,1020,h-80,28,'#fff','#dce5eb');const logo=await networkLogo();if(logo){ctx.save();ctx.beginPath();ctx.roundRect(80,75,86,86,22);ctx.clip();ctx.drawImage(logo,80,75,86,86);ctx.restore()}ctx.textAlign='right';ctx.fillStyle='#10223d';ctx.font='700 36px Cairo, Arial';ctx.fillText(title||tx('سجل','Record'),1020,105);ctx.font='400 17px Cairo, Arial';ctx.fillStyle='#75879b';ctx.fillText(`${nw()} • ${owner()}`,1020,145);let y=215;for(const [k,v] of fields){rounded(ctx,80,y,940,62,13,'#f9fbfc','#e1e8ed');ctx.font='500 17px Cairo, Arial';ctx.fillStyle='#738399';ctx.textAlign='right';ctx.fillText(k,990,y+39);ctx.fillStyle='#142842';ctx.textAlign='left';ctx.font='700 17px Cairo, Arial';let vv=safe(v);if(vv.length>60)vv=vv.slice(0,57)+'…';ctx.fillText(vv,110,y+39);y+=75}if(attachment){const img=await loadDrawable(attachment,window.AhmadiR2?.keyFromUrl?.(attachment)||'');if(img){const maxW=500,maxH=260,k=Math.min(maxW/img.width,maxH/img.height);const w=img.width*k,hh=img.height*k;ctx.drawImage(img,(1100-w)/2,y+10,w,hh);y+=hh+30}}ctx.font='400 14px Cairo, Arial';ctx.textAlign='center';ctx.fillStyle='#8a9aaa';ctx.fillText(`${tx('تاريخ التصدير','Export Date')}: ${dnum(new Date())}`,550,h-75);return c;
  }
  async function exportRecord(kind,id,mode){const canvas=await recordCanvas(kind,id),base=slug(`${kind}-${id}`);if(mode==='image'){dlBlob(await canvasBlob(canvas),`${base}.png`)}else{dlBlob(pdfFromCanvases([canvas],'a4'),`${base}.pdf`)}}
  function injectRowTools(){
    const main=document.getElementById('mainContent');if(!main)return;
    const defs=[['invoice','[data-invoice]'],['movement','[data-movement]'],['subscriber','article[data-subscriber]'],['meter','article[data-meter]'],['account','article[data-account]'],['region','article[data-region]'],['board','article[data-board]']];
    defs.forEach(([kind,sel])=>main.querySelectorAll(sel).forEach(el=>{if(el.closest('.v30-mini-tools')||el.querySelector(':scope .v30-mini-tools'))return;const id=el.dataset[kind]||el.dataset.invoice||el.dataset.movement||el.dataset.subscriber||el.dataset.meter||el.dataset.account||el.dataset.region||el.dataset.board;if(!id)return;const host=el.querySelector('.row-main')||el.querySelector(':scope > span:nth-child(2)')||el;const box=document.createElement('div');box.className='v30-mini-tools';box.innerHTML=kind==='invoice'?`<button data-v30-action="invoice-print" data-id="${esc(id)}" data-format="${printerFormat()}" title="${tx('طباعة','Print')}">${icon('print')}</button><button data-v30-action="invoice-image" data-id="${esc(id)}" data-format="${printerFormat()}" title="${tx('صورة','Image')}">${icon('image')}</button><button data-v30-action="invoice-pdf" data-id="${esc(id)}" data-format="${printerFormat()}" title="PDF">${icon('filePdf')}</button>`:`<button data-v30-action="record-image" data-kind="${kind}" data-id="${esc(id)}" title="${tx('صورة','Image')}">${icon('image')}</button><button data-v30-action="record-pdf" data-kind="${kind}" data-id="${esc(id)}" title="PDF">${icon('filePdf')}</button>`;host.appendChild(box)}));hydrateIcons(main);
  }
  function injectPageExport(){
    const main=document.getElementById('mainContent');if(!main)return;main.querySelectorAll(':scope > .v30-export-bar').forEach(x=>x.remove());const head=main.querySelector(':scope > .page-head');if(!head)return;
    if(['settings','platform','home'].includes(currentPage)&&!detail)return;
    const bar=document.createElement('div');bar.className='v30-export-bar';bar.innerHTML=`<button data-v30-action="page-image" class="secondary-btn">${icon('image')} ${tx('صورة','Image')}</button><button data-v30-action="page-pdf" class="secondary-btn">${icon('filePdf')} PDF</button><button data-v30-action="page-excel" class="secondary-btn">${icon('fileExcel')} Excel</button>`;head.insertAdjacentElement('afterend',bar);hydrateIcons(bar);
  }
  function injectModalTools(){
    const modal=document.querySelector('#modalRoot .record-detail-modal');if(!modal||modal.querySelector('.v30-record-export'))return;const title=document.querySelector('#modalRoot .modal-head strong')?.textContent||'';let kind='',id='';
    // Resolve the record from the visible modal text using latest clicked row if available.
    if(window.__v30LastRecord){kind=window.__v30LastRecord.kind;id=window.__v30LastRecord.id}
    if(!kind||!id)return;const div=document.createElement('div');div.className='v30-record-export';div.innerHTML=kind==='invoice'?`<button class="primary-btn" data-v30-action="invoice-print" data-id="${esc(id)}" data-format="${printerFormat()}">${icon('print')} ${tx('طباعة الفاتورة','Print Invoice')}</button><button class="secondary-btn" data-v30-action="invoice-image" data-id="${esc(id)}" data-format="${printerFormat()}">${icon('image')} ${tx('حفظ صورة','Save Image')}</button><button class="secondary-btn" data-v30-action="invoice-pdf" data-id="${esc(id)}" data-format="${printerFormat()}">${icon('filePdf')} PDF</button>`:`<button class="secondary-btn" data-v30-action="record-image" data-kind="${kind}" data-id="${esc(id)}">${icon('image')} ${tx('حفظ صورة','Save Image')}</button><button class="secondary-btn" data-v30-action="record-pdf" data-kind="${kind}" data-id="${esc(id)}">${icon('filePdf')} PDF</button>`;modal.appendChild(div);hydrateIcons(div)
  }
  document.addEventListener('pointerdown',e=>{const row=e.target.closest?.('[data-invoice],[data-movement]');if(row&&!e.target.closest('[data-v30-action]'))window.__v30LastRecord=row.dataset.invoice?{kind:'invoice',id:row.dataset.invoice}:{kind:'movement',id:row.dataset.movement}},true);
  document.addEventListener('click',async e=>{
    const b=e.target.closest?.('[data-v30-action]');if(!b)return;e.preventDefault();e.stopPropagation();const act=b.dataset.v30Action,id=b.dataset.id,fmt=b.dataset.format||printerFormat();try{
      if(act==='invoice-preview'){const inv=data.invoices.find(x=>String(x.id)===String(id));if(inv)await previewInvoice(inv,fmt);return}
      if(act==='format'){const inv=data.invoices.find(x=>String(x.id)===String(id));if(inv)await previewInvoice(inv,fmt);return}
      if(act==='invoice-print'||act==='invoice-image'||act==='invoice-pdf'){const inv=data.invoices.find(x=>String(x.id)===String(id));if(inv)await invoiceAction(inv,act.replace('invoice-',''),fmt);return}
      if(act==='record-image'||act==='record-pdf'){await exportRecord(b.dataset.kind,id,act.endsWith('image')?'image':'pdf');return}
      if(act==='page-image'||act==='page-pdf'||act==='page-excel'){await exportPage(act.replace('page-',''));return}
    }catch(err){console.error('V30 export',err);toast(err?.message||tx('تعذر إنشاء الملف.','Could not create file.'),'خطأ')}
  },true);
  const observer=new MutationObserver(()=>{injectModalTools()});observer.observe(document.getElementById('modalRoot'),{childList:true,subtree:true});
  const _render=render;render=function(){const out=_render();queueMicrotask(()=>{syncDesktopSidebar();injectPageExport();injectRowTools()});return out};
  setTimeout(()=>{syncDesktopSidebar();injectPageExport();injectRowTools()},180);
})();

applyUiPrefs();

bindEvents();hydrateIcons();restoreSession();
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
