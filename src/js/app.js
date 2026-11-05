(function(){
  var cv=document.getElementById('shader'),B=document.body;
  var gl=cv.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl||matchMedia('(prefers-reduced-motion:reduce)').matches){B.classList.add('no-gl');cv.style.display='none';return}
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs='precision mediump float;uniform vec2 R;uniform float T;uniform vec2 M;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
  'void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;'+
  'float t=T*.06;vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6-t+5.2));'+
  'vec2 r=vec2(fbm(p*1.8+q*2.2+vec2(1.7,9.2)+t*1.3),fbm(p*1.8+q*2.2+vec2(8.3,2.8)-t));'+
  'float f=fbm(p*1.5+r*2.4);'+
  'vec3 c0=vec3(.018,.045,.027),c1=vec3(.055,.24,.12),c2=vec3(.20,.58,.32),c3=vec3(.58,.96,.68);'+
  'vec3 col=mix(c0,c1,smoothstep(.2,.75,f));col=mix(col,c2,smoothstep(.55,.95,f*r.x*1.5)*.55);'+
  'col+=c3*pow(max(0.,f*r.y-.28),2.)*1.1;'+
  'float d=length(uv-M);col+=vec3(.20,.72,.38)*.18*exp(-d*5.);'+
  'col*=.55+.45*smoothstep(1.2,.1,length(uv-.5));'+
  'col+=(h(gl_FragCoord.xy+T)-.5)*.02;'+
  'gl_FragColor=vec4(col,1.);}';
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
  var v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);
  if(!v||!f){B.classList.add('no-gl');cv.style.display='none';return}
  var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);gl.useProgram(pr);
  var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
  var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uM=gl.getUniformLocation(pr,'M');
  var S=innerWidth<650?.32:.4,mx=.5,my=.5,tx=.5,ty=.5;
  function size(){cv.width=Math.max(2,Math.floor(innerWidth*S));cv.height=Math.max(2,Math.floor(innerHeight*S));gl.viewport(0,0,cv.width,cv.height)}
  size();addEventListener('resize',size);
  addEventListener('pointermove',function(e){tx=e.clientX/innerWidth;ty=1-e.clientY/innerHeight},{passive:true});
  var last=0,run=true,t0=performance.now();
  document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)requestAnimationFrame(fr)});
  function fr(now){if(!run)return;requestAnimationFrame(fr);if(now-last<33)return;last=now;
    mx+=(tx-mx)*.06;my+=(ty-my)*.06;
    gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,(now-t0)/1000);gl.uniform2f(uM,mx,my);gl.drawArrays(gl.TRIANGLES,0,3)}
  requestAnimationFrame(fr);
})();

/* ===== Next original script block ===== */

const plans = [
  { id:'day', title:'1 день', duration:'24 часа доступа', rage:15, legit:13, tag:'Быстрый старт', desc:'Попробуй доступ на короткий срок.' },
  { id:'week', title:'7 дней', duration:'Неделя доступа', rage:50, legit:44, tag:'Оптимальный выбор', desc:'Сбалансированный вариант на неделю.', featured:true },
  { id:'month', title:'30 дней', duration:'Месяц доступа', rage:150, legit:132, tag:'На каждый день', desc:'Комфортный доступ на целый месяц.' },
  { id:'forever', title:'Навсегда', duration:'Бессрочный доступ', rage:450, legit:396, tag:'Максимум', desc:'Один раз — и без ограничения по сроку.' }
];
let activeKind = 'rage';
let selected = null;
const ADMIN_NICK = 'zirassov';
const ADMIN_PASSWORD = 'soda67DLC';
let authMode = 'login';
let currentUser = null;
function readAccounts(){try{return JSON.parse(localStorage.getItem('sodadlc_accounts')||'[]')}catch(e){return (typeof _mem!=='undefined'&&_mem)||[]}}
var _mem=null;function saveAccounts(accounts){_mem=accounts;try{localStorage.setItem('sodadlc_accounts',JSON.stringify(accounts))}catch(_){}}
function openAuth(mode){authMode=mode;document.getElementById('authTitle').textContent=mode==='login'?'Вход в аккаунт':'Создать аккаунт';document.getElementById('authSubmit').textContent=mode==='login'?'Войти в аккаунт':'Зарегистрироваться';document.getElementById('authSwitch').innerHTML=mode==='login'?'Нет аккаунта? <button type="button" onclick="openAuth(\'register\')">Зарегистрироваться</button>':'Уже есть аккаунт? <button type="button" onclick="openAuth(\'login\')">Войти</button>';const confirmWrap=document.getElementById('authConfirmWrap');const confirmInput=document.getElementById('authConfirmPassword');confirmWrap.hidden=mode!=='register';confirmInput.required=mode==='register';confirmInput.disabled=mode!=='register';confirmInput.value='';document.getElementById('authError').textContent='';document.getElementById('authPassword').value='';document.getElementById('authModal').classList.add('show')}
function closeAuth(){document.getElementById('authModal').classList.remove('show')}
function updateAuthActions(){const el=document.getElementById('authActions');if(!el)return;el.innerHTML=currentUser?`<button class="auth-btn primary" onclick="openCabinet()">Кабинет · ${escapeText(currentUser.nick)}</button>`:'<button class="auth-btn" onclick="openAuth(\'login\')">Войти</button><button class="auth-btn primary" onclick="openAuth(\'register\')">Регистрация</button>'}
function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openCabinet(){if(!currentUser)return;const owner=currentUser.nick.toLowerCase()===ADMIN_NICK&&currentUser.role==='admin';const admin=currentUser.role==='admin';const accounts=readAccounts();const adminAccounts=accounts.filter(a=>a.role==='admin');const total=accounts.length+1;document.getElementById('cabinetContent').innerHTML=`<div class="cabinet-body"><section class="cabinet-hero"><div class="cabinet-user"><div class="cabinet-avatar">${escapeText(currentUser.nick.slice(0,1).toUpperCase())}</div><div><div class="cabinet-greeting">Добро пожаловать в SodaDLC</div><h4>${escapeText(currentUser.nick)}</h4><p>${owner?'Владелец магазина · полный контроль':admin?'Команда SodaDLC · права администратора':'Ваш персональный профиль магазина'}</p></div></div><span class="role-chip">${owner?'OWNER ACCESS':admin?'ADMIN ACCESS':'MEMBER'}</span></section><div class="cabinet-section-title"><div><h4>Обзор аккаунта</h4><p>Основная информация и состояние профиля</p></div></div><div class="cabinet-metrics"><div class="cabinet-metric"><span>Уровень доступа</span><strong>${owner?'Владелец':admin?'Администратор':'Пользователь'}</strong><small>${owner?'Главный аккаунт':admin?'Назначенная роль':'Стандартные возможности'}</small></div><div class="cabinet-metric"><span>Профиль</span><strong>Активен</strong><small>Вы вошли в систему</small></div><div class="cabinet-metric"><span>Участники</span><strong>${total}</strong><small>Аккаунтов в этом браузере</small></div></div><div class="cabinet-section-title"><div><h4>Данные профиля</h4><p>Информация о текущем аккаунте</p></div></div><div class="cabinet-content-grid"><div class="cabinet-info-card"><h4>Личные данные</h4><div class="cabinet-info-row"><span>Никнейм</span><strong>${escapeText(currentUser.nick)}</strong></div><div class="cabinet-info-row"><span>Роль</span><strong>${owner?'Владелец':admin?'Администратор':'Пользователь'}</strong></div></div><div class="cabinet-info-card"><h4>Безопасность и сессия</h4><div class="cabinet-info-row"><span>Статус сессии</span><strong>Активна</strong></div><div class="cabinet-info-row"><span>Хранение</span><strong>Этот браузер</strong></div></div></div>${admin?`<section class="admin-panel"><h4>${owner?'Управление администраторами':'Панель администратора'}</h4><p>${owner?'Введи никнейм уже зарегистрированного пользователя, чтобы выдать ему права администратора.':'У вас есть права администратора магазина. Управление списком администраторов доступно только владельцу.'}</p>${owner?`<form id="adminCreateForm"><div class="admin-create-grid"><label>Никнейм зарегистрированного пользователя<input class="field" id="newAdminNick" required minlength="3" maxlength="24" autocomplete="off" placeholder="Ник пользователя на сайте"></label><button class="auth-btn primary" type="submit">＋ Выдать права</button></div><div class="auth-error" id="adminCreateError" role="alert"></div></form><div class="admin-list">${`<div class="admin-list-item"><div><strong>${escapeText(ADMIN_NICK)}</strong><span>Главный владелец · полный доступ</span></div><span class="admin-owner-tag">OWNER</span></div>`}${adminAccounts.map(a=>`<div class="admin-list-item"><div><strong>${escapeText(a.nick)}</strong><span>Назначенный администратор</span></div><span>ADMIN</span></div>`).join('')||''}</div><div class="admin-notice">Назначение хранится локально в этом браузере. Для реального публичного сайта управление ролями необходимо перенести на защищённый сервер.</div>`:''}</section>`:''}<div class="cabinet-footer"><span>SODADLC · PERSONAL WORKSPACE</span><div class="cabinet-actions"><button class="auth-btn" onclick="closeCabinet()">На сайт</button><button class="auth-btn primary" onclick="logout()">Выйти из аккаунта</button></div></div></div>`;const form=document.getElementById('adminCreateForm');if(form)form.addEventListener('submit',createAdminAccount);document.getElementById('cabinetModal').classList.add('show')}
function createAdminAccount(e){e.preventDefault();if(!currentUser||currentUser.role!=='admin'||currentUser.nick.toLowerCase()!==ADMIN_NICK)return;const nick=document.getElementById('newAdminNick').value.trim();const error=document.getElementById('adminCreateError');if(nick.toLowerCase()===ADMIN_NICK){error.textContent='Этот никнейм уже закреплён за владельцем.';return}const accounts=readAccounts();const account=accounts.find(a=>a.nick.toLowerCase()===nick.toLowerCase());if(!account){error.textContent='Пользователь с таким никнеймом не зарегистрирован на сайте.';return}if(account.role==='admin'){error.textContent='У этого пользователя уже есть права администратора.';return}account.role='admin';saveAccounts(accounts);showToast('Права администратора выданы');openCabinet()}
function closeCabinet(){document.getElementById('cabinetModal').classList.remove('show')}
function logout(){currentUser=null;try{sessionStorage.removeItem('sodadlc_session')}catch(_){};closeCabinet();updateAuthActions();showToast('Вы вышли из аккаунта')}
document.getElementById('authForm').addEventListener('submit',e=>{e.preventDefault();const nick=document.getElementById('authNick').value.trim();const password=document.getElementById('authPassword').value;const confirmPassword=document.getElementById('authConfirmPassword').value;const error=document.getElementById('authError');if(authMode==='register'){if(password!==confirmPassword){error.textContent='Пароли не совпадают. Проверь подтверждение.';return}if(nick.toLowerCase()===ADMIN_NICK){error.textContent='Этот никнейм зарезервирован.';return}const accounts=readAccounts();if(accounts.some(a=>a.nick.toLowerCase()===nick.toLowerCase())){error.textContent='Аккаунт с таким никнеймом уже занят.';return}accounts.push({nick,password,role:'user'});saveAccounts(accounts);currentUser={nick,role:'user'};}else if(nick.toLowerCase()===ADMIN_NICK&&password.trim()===ADMIN_PASSWORD){currentUser={nick:ADMIN_NICK,role:'admin'};}else{const account=readAccounts().find(a=>a.nick.toLowerCase()===nick.toLowerCase()&&a.password===password);if(!account){error.textContent='Неверный никнейм или пароль.';return}currentUser={nick:account.nick,role:account.role==='admin'?'admin':'user'};}try{sessionStorage.setItem('sodadlc_session',JSON.stringify(currentUser))}catch(_){}closeAuth();updateAuthActions();openCabinet();});
document.getElementById('authModal').addEventListener('click',e=>{if(e.target.id==='authModal')closeAuth()});
document.getElementById('cabinetModal').addEventListener('click',e=>{if(e.target.id==='cabinetModal')closeCabinet()});
try{const saved=JSON.parse(sessionStorage.getItem('sodadlc_session')||'null');if(saved&&saved.nick){if(saved.nick.toLowerCase()===ADMIN_NICK)currentUser=saved.role==='admin'?{nick:ADMIN_NICK,role:'admin'}:null;else{const account=readAccounts().find(a=>a.nick.toLowerCase()===saved.nick.toLowerCase());if(account)currentUser={nick:account.nick,role:account.role==='admin'?'admin':'user'};}}}catch(e){}updateAuthActions();
const grid = document.getElementById('productGrid');
const formatPrice = n => String(Math.round(n));
const planIcons = [
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.3v5.1l3.4 2"/><path d="M8.1 2.9 6.7 4.3M15.9 2.9l1.4 1.4" opacity=".65"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M7.5 3v4M16.5 3v4M3.8 9.3h16.4"/><path d="m8.2 14 2.1 2.1 5-4.7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M7.5 2.8v3.5M16.5 2.8v3.5M3.4 9h17.2"/><path d="M7.5 12.5h.1M12 12.5h.1M16.5 12.5h.1M7.5 16.5h.1M12 16.5h.1M16.5 16.5h.1" stroke-width="2.4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 8.2c-2.4-2.4-5.2-.8-5.2 3.8s2.8 6.2 5.2 3.8l9.6-9.6c2.4-2.4 5.2-.8 5.2 3.8s-2.8 6.2-5.2 3.8L7.2 4.2"/></svg>'
];
function renderPlans() {
  grid.innerHTML = plans.map((p,i) => {
    const price = activeKind === 'rage' ? p.rage : p.legit;
    const name = activeKind.toUpperCase();
    return `<article class="product-card ${p.featured ? 'featured' : ''}" style="animation:rise .55s ${i*.07}s both">
      ${p.featured ? '<span class="popular">ПОПУЛЯРНЫЙ</span>' : ''}
      <div class="product-top"><div class="product-icon">${planIcons[i]}</div><span class="product-tag">${p.tag}</span></div>
      <h3>${name} ${p.title}</h3><p class="desc">${p.desc}</p>
      <div class="price-row"><span class="price">${formatPrice(price)}</span><span class="currency">⭐ звёзд</span></div>
      <div class="price-note">${p.duration}</div>
      <button class="buy-btn" data-plan="${p.id}">Выбрать тариф <span>→</span></button>
    </article>`;
  }).join('');
  document.getElementById('discountNote').hidden = activeKind !== 'legit';
}
document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  activeKind = btn.dataset.kind;
  document.querySelectorAll('.tab').forEach(b => { const on = b === btn; b.classList.toggle('active',on); b.setAttribute('aria-selected',String(on)); });
  renderPlans();
}));
grid.addEventListener('click', e => {
  const btn = e.target.closest('[data-plan]'); if (!btn) return;
  const plan = plans.find(p => p.id === btn.dataset.plan);
  const price = activeKind === 'rage' ? plan.rage : plan.legit;
  selected = {kind:activeKind.toUpperCase(), plan, price};
  document.getElementById('summaryName').textContent = `${selected.kind} · ${plan.title}`;
  document.getElementById('summaryPrice').textContent = `${formatPrice(price)} ⭐`;
  document.getElementById('modal').classList.add('show');
});
function closeModal(){document.getElementById('modal').classList.remove('show');}
document.getElementById('closeModal').addEventListener('click',closeModal);
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}
document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>q.parentElement.classList.toggle('open')));
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
renderPlans();
(function(){
  var L=document.getElementById('loader'),started=false,loaded=false,t0=Date.now();
  function hide(){L.classList.add('done')}
  function fit(){var w=L.querySelector('.loader-word');var max=Math.min(innerWidth*.86,820),size=100;w.style.fontSize=size+'px';
    for(var i=0;i<4;i++){var r=w.getBoundingClientRect().width||1;size=Math.max(30,Math.min(260,size*max/r));w.style.fontSize=size+'px';if(Math.abs(r-max)<2)break}}
  if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',fit);
  setTimeout(fit,300);setTimeout(fit,1500);
  addEventListener('resize',fit);
  function start(){if(started)return;started=true;fit();L.classList.add('go');setTimeout(function(){if(loaded)hide();else window.addEventListener('load',hide,{once:true})},4600);setTimeout(hide,8000)}
  window.addEventListener('load',function(){loaded=true});
  var f=(document.fonts&&document.fonts.load)?Promise.all([document.fonts.load('120px "Ballet"','odaDLC'),document.fonts.load('120px "SodaScript"','S')]).catch(function(){}):Promise.resolve();
  Promise.race([f,new Promise(function(r){setTimeout(r,2600)})]).then(start);
})();

/* ===== Next original script block ===== */

(function(){
  var bar=document.getElementById('scrollBar');
  function sp(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
  var tk=false;addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){sp();tk=false})}},{passive:true});sp();
})();

/* ===== Next original script block ===== */

(function(){var c=document.getElementById('sparkles');if(!c||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var n=innerWidth<650?10:22,h='';for(var i=0;i<n;i++){h+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*100).toFixed(1)+'%;--d:'+(4+Math.random()*5).toFixed(1)+'s;--l:-'+(Math.random()*8).toFixed(1)+'s"></i>'}c.innerHTML=h})();

/* ===== Next original script block ===== */

(function(){
  var nav=document.getElementById('xnav'),glow=document.getElementById('glow');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>20)},{passive:true});
  var fine=matchMedia('(pointer:fine)').matches;
  if(fine){
    var gx=0,gy=0,raf=0;
    addEventListener('pointermove',function(e){gx=e.clientX;gy=e.clientY;glow.style.opacity=1;if(!raf)raf=requestAnimationFrame(function(){raf=0;glow.style.transform='translate3d('+gx+'px,'+gy+'px,0)'})},{passive:true});
    document.querySelectorAll('.x-tilt').forEach(function(c){
      c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
        c.style.setProperty('--ry',((px-.5)*14).toFixed(1)+'deg');c.style.setProperty('--rx',((.5-py)*14).toFixed(1)+'deg');c.style.setProperty('--gx',(px*100)+'%');c.style.setProperty('--gy',(py*100)+'%')});
      c.addEventListener('pointerleave',function(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
    });
  }
})();

/* ===== Next original script block ===== */

(function(){
  /* ---- static marble bitmap for cards (generated once) ---- */
  function marble(N){var c=document.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d'),im=x.createImageData(N,N);
    function r(i,j){var n=Math.sin(i*127.1+j*311.7)*43758.5453;return n-Math.floor(n)}
    function vn(px,py){var gx=Math.floor(px),gy=Math.floor(py),fx=px-gx,fy=py-gy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
      var a=r(gx,gy),b=r(gx+1,gy),c2=r(gx,gy+1),d=r(gx+1,gy+1);return a+(b-a)*fx+(c2-a)*fy+(a-b-c2+d)*fx*fy}
    function fbm(px,py){var f=0,a=.5;for(var o=0;o<5;o++){f+=a*vn(px,py);px=px*2.02+3.1;py=py*2.02+1.7;a*=.5}return f}
    for(var y=0;y<N;y++)for(var xx=0;xx<N;xx++){var u=xx/N*3,v=y/N*3;
      var w=fbm(u+fbm(u*1.3,v*1.3)*1.6,v+fbm(u*1.3+4,v*1.3+9)*1.6);
      var vein=Math.pow(1-Math.abs(Math.sin((u*1.1+v*.8+w*3.2)*Math.PI)),9);
      var vein2=Math.pow(1-Math.abs(Math.sin((u*.6-v*1.2+w*4.4)*Math.PI)),14);
      var cloud=w*.55,i=(y*N+xx)*4;
      var R=120+vein*135+vein2*100+cloud*60,G=70+vein*120+vein2*70+cloud*30,B=210+vein*45+vein2*30;
      im.data[i]=Math.min(255,R);im.data[i+1]=Math.min(255,G);im.data[i+2]=Math.min(255,B);
      im.data[i+3]=Math.round(Math.min(1,.08+cloud*.16+vein*.2+vein2*.14)*255)}
    x.putImageData(im,0,0);return 'url('+c.toDataURL('image/png')+')'}
  try{document.documentElement.style.setProperty('--marble',marble(innerWidth<650?160:256))}catch(e){}

  /* ---- tiny shader helper: low-res, 30fps, paused off-screen/hidden tab ---- */
  var VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var HEAD='precision mediump float;uniform vec2 R;uniform float T;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}';
  function shader(cv,body,scale,cap){
    if(!cv||matchMedia('(prefers-reduced-motion:reduce)').matches){if(cv)cv.style.display='none';return}
    var gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'low-power'});
    if(!gl){cv.style.display='none';return}
    function cp(t,src){var o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
    var v=cp(gl.VERTEX_SHADER,VS),f=cp(gl.FRAGMENT_SHADER,HEAD+body);if(!v||!f){cv.style.display='none';return}
    var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);gl.useProgram(pr);
    var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T');
    function size(){var w=Math.max(2,Math.floor(cv.clientWidth*scale)),hh=Math.max(2,Math.floor(cv.clientHeight*scale));if(cv.width!==w||cv.height!==hh){cv.width=w;cv.height=hh}gl.viewport(0,0,cv.width,cv.height)}
    var vis=false,last=0,t0=performance.now();
    function fr(now){if(!vis||document.hidden)return;requestAnimationFrame(fr);if(now-last<(1000/(cap||30)))return;last=now;size();
      gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,(now-t0)/1000);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3)}
    new IntersectionObserver(function(e){var on=e[0].isIntersecting;if(on&&!vis){vis=true;requestAnimationFrame(fr)}vis=on},{rootMargin:'60px'}).observe(cv);
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&vis)requestAnimationFrame(fr)});
  }
  var MARB='float marb(vec2 p,float t){vec2 q=vec2(fbm(p*1.4+t),fbm(p*1.4+5.2-t));float w=fbm(p*1.3+q*1.8);'+
    'float v1=pow(1.-abs(sin((p.x*1.6+p.y*1.1+w*3.4+t*.6)*3.14159)),7.);float v2=pow(1.-abs(sin((p.x*.9-p.y*1.5+w*4.6-t*.4)*3.14159)),12.);return v1*.85+v2*.7;}';
  /* hero: iridescent liquid-marble orb */
  shader(document.querySelector('.x-orb'),MARB+
    'void main(){vec2 p=(gl_FragCoord.xy-.5*R)/R.y;float t=T*.05;float m=marb(p*1.2,t);'+
    'vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6-t+3.));float w=fbm(p*1.5+q*1.6);'+
    'vec3 deep=vec3(.025,.10,.05),mid=vec3(.10,.42,.22),hi=vec3(.82,1.,.88),pk=vec3(.35,.85,.52);'+
    'vec3 col=mix(deep,mid,w);col+=hi*m*.8;col+=pk*pow(max(0.,w-.5),2.)*1.4*(.5+.5*sin(T*.4+p.x*3.));'+
    'float a=smoothstep(.62,.05,length(p*vec2(.62,1.15)));a*=.85;gl_FragColor=vec4(col*a,a);}',.42,30);
  /* CTA: flowing marble veins */
  shader(document.querySelector('.x-marble'),MARB+
    'void main(){vec2 p=(gl_FragCoord.xy-.5*R)/R.y;float t=T*.045;float m=marb(p*1.1,t);'+
    'float w=fbm(p*1.2+t);vec3 col=mix(vec3(.015,.05,.025),vec3(.08,.30,.16),w)+vec3(.65,.95,.75)*m*.55+vec3(.25,.8,.42)*pow(m,3.)*.4;'+
    'float a=.9*smoothstep(1.3,.2,length(p*vec2(.55,1.))+0.);gl_FragColor=vec4(col*a,a);}',.35,24);
})();

/* ===== Next original script block ===== */

(function(){
  var cv=document.querySelector('.x-cards'),wrap=cv&&cv.parentNode,grid=document.getElementById('productGrid');
  if(!cv||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'low-power'});
  if(!gl)return;
  var VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FS='precision highp float;uniform vec2 R;uniform float T;uniform float D;uniform vec4 C[4];uniform float N;uniform float H;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
  'float sdb(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return min(max(q.x,q.y),0.)+length(max(q,0.))-r;}'+
  'vec3 pal(float t){return vec3(.12,.48,.25)+vec3(.24,.30,.22)*cos(6.2832*(vec3(1.,1.,1.)*t+vec3(0.,.12,.27)));}'+
  'void main(){vec2 fp=gl_FragCoord.xy;float dd=-1.;float best=-1.;vec2 lc=vec2(0.);vec2 sz=vec2(1.);float idx=0.;'+
  'for(int i=0;i<4;i++){if(float(i)>=N)break;vec4 c=C[i];vec2 ctr=vec2(c.x+c.z*.5,R.y-(c.y+c.w*.5));float d=sdb(fp-ctr,vec2(c.z,c.w)*.5,22.*D);if(d<dd||best<0.){if(d<0.||best<0.){dd=d;best=1.;lc=fp-ctr;sz=vec2(c.z,c.w);idx=float(i);}}}'+
  'if(dd>1.5){gl_FragColor=vec4(0.);return;}'+
  'float t=T*.07;vec2 p=lc/(380.*D)+idx*3.7;'+
  'vec2 q=vec2(fbm(p*1.5+t),fbm(p*1.5+5.2-t));float w=fbm(p*1.3+q*1.9);'+
  'float v1=pow(1.-abs(sin((p.x*1.5+p.y*1.0+w*3.6+t*1.2)*3.14159)),8.);float v2=pow(1.-abs(sin((p.x*.8-p.y*1.4+w*4.8-t)*3.14159)),14.);'+
  'vec3 base=mix(vec3(.015,.045,.025),vec3(.06,.22,.11),w);'+
  'vec3 iri=pal(w*.9+t*1.6+p.x*.25);'+
  'vec3 col=base+iri*.22*smoothstep(.25,.8,w)+vec3(.75,1.,.82)*(v1*.36+v2*.3)+vec3(.25,.8,.42)*pow(v1,3.)*.28;'+
  'float hv=(abs(H-idx)<.5)?1.:0.;col*=1.+hv*.22;col+=iri*hv*.12;'+
  'float fade=smoothstep(0.,-26.*D,dd);col+=vec3(.35,.8,.48)*(1.-fade)*.22;'+
  'col*=.86+.14*smoothstep(1.2,0.,length(lc/sz*2.));'+
  'float a=smoothstep(1.,-1.,dd);gl_FragColor=vec4(col*a,a);}';
  function cp(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
  var v=cp(gl.VERTEX_SHADER,VS),f=cp(gl.FRAGMENT_SHADER,FS);if(!v||!f)return;
  var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);gl.useProgram(pr);
  var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
  var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uD=gl.getUniformLocation(pr,'D'),uC=gl.getUniformLocation(pr,'C'),uN=gl.getUniformLocation(pr,'N'),uH=gl.getUniformLocation(pr,'H');
  wrap.classList.add('gl');
  var dpr=Math.min(window.devicePixelRatio||1,innerWidth<650?1.5:1.75),vis=false,last=0,t0=performance.now(),hov=-1,arr=new Float32Array(16);
  grid.addEventListener('pointermove',function(e){var c=e.target.closest('.product-card');hov=c?Array.prototype.indexOf.call(grid.children,c):-1},{passive:true});
  grid.addEventListener('pointerleave',function(){hov=-1});
  function fr(now){if(!vis||document.hidden)return;requestAnimationFrame(fr);if(now-last<33)return;last=now;
    var br=cv.getBoundingClientRect(),w=Math.max(2,Math.round(br.width*dpr)),hh=Math.max(2,Math.round(br.height*dpr));
    if(cv.width!==w||cv.height!==hh){cv.width=w;cv.height=hh}gl.viewport(0,0,w,hh);
    var cards=grid.children,k=0;arr.fill(0);
    for(var i=0;i<cards.length&&k<4;i++){var r=cards[i].getBoundingClientRect();if(r.width<2)continue;arr[k*4]=(r.left-br.left)*dpr;arr[k*4+1]=(r.top-br.top)*dpr;arr[k*4+2]=r.width*dpr;arr[k*4+3]=r.height*dpr;k++}
    gl.uniform2f(uR,w,hh);gl.uniform1f(uT,(now-t0)/1000);gl.uniform1f(uD,dpr);gl.uniform4fv(uC,arr);gl.uniform1f(uN,k);gl.uniform1f(uH,hov);
    gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3)}
  new IntersectionObserver(function(e){var on=e[0].isIntersecting;if(on&&!vis){vis=true;requestAnimationFrame(fr)}vis=on},{rootMargin:'80px'}).observe(wrap);
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&vis)requestAnimationFrame(fr)});
})();

/* ===== Next original script block ===== */

(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var targets='.modal,.cabinet-hero,.cabinet-metric,.cabinet-info-card,.admin-panel,.product-card,.feature,.step,.hero-panel,.x-tilt,.x-cta,.pricing-card,.faq-item,.stat-card';
  var last=0;
  document.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch')return;
    var now=performance.now();if(now-last<24)return;last=now;
    var el=e.target&&e.target.closest?e.target.closest(targets):null;
    if(!el)return;
    var r=el.getBoundingClientRect();
    el.style.setProperty('--shader-mx',Math.max(0,Math.min(100,(e.clientX-r.left)/Math.max(1,r.width)*100))+'%');
    el.style.setProperty('--shader-my',Math.max(0,Math.min(100,(e.clientY-r.top)/Math.max(1,r.height)*100))+'%');
  },{passive:true});
})();

/* ===== Next original script block ===== */

(function(){
  if(!window.WebGLRenderingContext||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var VS='attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  var FS='precision mediump float;varying vec2 uv;uniform vec2 R;uniform float T;'+
  'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(7.1,3.7);a*=.5;}return v;}'+
  'void main(){vec2 p=(uv-.5)*vec2(R.x/max(1.,R.y),1.);float t=T*.075;'+
  'vec2 q=vec2(fbm(p*2.2+vec2(t,-t*.6)),fbm(p*2.2+vec2(4.3-t*.5,t)));'+
  'float n=fbm(p*3.4+q*2.4+vec2(t*.7,-t*.4));'+
  'float wave=pow(max(0.,sin((p.x*3.2+p.y*2.1+n*4.2+t)*3.14159)),5.);'+
  'float wave2=pow(max(0.,sin((p.x*1.8-p.y*3.1+n*3.4-t*.7)*3.14159)),8.);'+
  'vec3 c=mix(vec3(.025,.09,.045),vec3(.08,.42,.25),n);'+
  'c+=vec3(.25,.75,.42)*wave*.48+vec3(.35,.9,.62)*wave2*.35;'+
  'c+=vec3(.12,.48,.25)*smoothstep(.35,.9,fbm(p*1.3-vec2(t)));'+
  'float edge=smoothstep(1.05,.15,length(p*vec2(.8,1.2)));float a=(.12+n*.14+wave*.13+wave2*.10)*edge;'+
  'gl_FragColor=vec4(c,a);}';
  function attach(modal){
    if(!modal||modal.querySelector('.soda-shader-canvas'))return;
    var cv=document.createElement('canvas');cv.className='soda-shader-canvas';cv.setAttribute('aria-hidden','true');modal.insertBefore(cv,modal.firstChild);
    var gl;try{gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'low-power'});}catch(e){}
    if(!gl){cv.remove();return;}
    function compile(type,src){var sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){gl.deleteShader(sh);return null;}return sh;}
    var v=compile(gl.VERTEX_SHADER,VS),f=compile(gl.FRAGMENT_SHADER,FS);if(!v||!f){cv.remove();return;}
    var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.remove();return;}gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var ur=gl.getUniformLocation(pr,'R'),ut=gl.getUniformLocation(pr,'T');
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    var visible=false,last=0,start=performance.now(),raf=0,dpr= Math.min(devicePixelRatio||1,1.5);
    function resize(){var r=modal.getBoundingClientRect(),w=Math.max(2,Math.round(r.width*dpr)),h=Math.max(2,Math.round(r.height*dpr));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h);}}
    function frame(now){raf=0;if(!visible||document.hidden)return;if(now-last<40){raf=requestAnimationFrame(frame);return;}last=now;resize();gl.uniform2f(ur,cv.width,cv.height);gl.uniform1f(ut,(now-start)/1000);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);raf=requestAnimationFrame(frame);}
    function sync(){var show=modal.classList.contains('show')&&modal.getBoundingClientRect().width>0;visible=show;if(show&&!raf){resize();raf=requestAnimationFrame(frame);}else if(!show&&raf){cancelAnimationFrame(raf);raf=0;}}
    new MutationObserver(sync).observe(modal,{attributes:true,attributeFilter:['class']});
    if(window.ResizeObserver)new ResizeObserver(function(){if(visible)resize();}).observe(modal);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)sync();else if(raf){cancelAnimationFrame(raf);raf=0;}});
    sync();
  }
  function init(){attach(document.querySelector('#authModal .modal'));attach(document.querySelector('#cabinetModal .modal.cabinet'));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();