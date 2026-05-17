// ATLAS Dashboard — Extracted JS (Phase 1 Foundation Refactor)
// All logic from atlas-dashboard.html inline <script> moved here

// ══════ Init ══════
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initCharts();
  startTelemetrySimulation();
  startFlightTimer();
  populateEventStream();
});

// ══════ Navigation ══════
function showView(viewId, btn, label) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const view = document.getElementById('view-' + viewId);
  if (view) view.classList.add('active');
  if (btn) btn.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.textContent.trim().startsWith(label?.slice(0,8) || '?')) n.classList.add('active');
    });
  }
  document.getElementById('breadcrumb-view').textContent = label || viewId;
  lucide.createIcons();
}

// ══════ Tabs ══════
function switchTab(viewId, tabId, btn) {
  const prefix = viewId + '-tab-';
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(t => t.classList.remove('active'));
  document.getElementById(prefix + tabId)?.classList.add('active');
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ══════ Modals ══════
function openModal(id) {
  document.getElementById('modal-' + id)?.classList.add('open');
}
function closeModalById(id) {
  document.getElementById('modal-' + id)?.classList.remove('open');
}
function closeModal(e, id) {
  if (e.target === document.getElementById('modal-' + id)) closeModalById(id);
}
function toggleModal(id) {
  const el = document.getElementById('modal-' + id);
  if (el) el.classList.toggle('open');
  if (id === 'cmdpal') setTimeout(() => document.getElementById('cmdpal-input')?.focus(), 50);
}
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggleModal('cmdpal'); }
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

// ══════ Policy Selection ══════
function selectPolicy(item) {
  item.closest('.panel-body').querySelectorAll('.policy-item').forEach(p => p.classList.remove('selected'));
  item.classList.add('selected');
}

// ══════ Toast ══════
function showToast(msg, type='info', duration=3500) {
  const colors = { ok:'var(--green)', warn:'var(--amber)', error:'var(--red)', info:'var(--cyan)' };
  const icons = { ok:'check-circle', warn:'alert-triangle', error:'x-circle', info:'info' };
  const t = document.createElement('div');
  t.style.cssText = `display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border-2);border-left:3px solid ${colors[type]};border-radius:var(--radius-lg);padding:var(--space-3) var(--space-4);font-size:var(--text-sm);box-shadow:var(--shadow-lg);pointer-events:all;min-width:260px;max-width:380px;animation:slideInToast 0.25s var(--ease-out);color:var(--text);`;
  t.innerHTML = `<i data-lucide="${icons[type]}" style="width:15px;height:15px;color:${colors[type]};flex-shrink:0;"></i><span>${msg}</span>`;
  const container = document.getElementById('toast-container');
  container.appendChild(t);
  lucide.createIcons();
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(() => t.remove(), 300); }, duration);
}
const style = document.createElement('style');
style.textContent = `@keyframes slideInToast { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);

// ══════ Commands ══════
function sendCommand(cmd) {
  const labels = { ARM:'Vehicle armed ✓', DISARM:'Vehicle disarmed', TAKEOFF:'Takeoff commanded', LAND:'Landing initiated', RTL:'Return to Launch activated', LOITER:'Loiter hold active', PAUSE:'Mission paused', RESUME:'Mission resumed', KILL_MOTORS:'⚠ Motor kill executed', PATH_PROMOTE:'Mission path promoted to vehicle', LINK:'Vehicle link initiated', LAND_NOW:'Immediate landing commanded', CHANGE_ALT:'Altitude change requested', LINK:'Vehicle linking…' };
  const types = { KILL_MOTORS:'error', RTL:'warn', DISARM:'warn', LAND:'warn', LAND_NOW:'warn' };
  const msg = labels[cmd] || `${cmd} sent`;
  const type = types[cmd] || (cmd==='ARM'||cmd==='RESUME'||cmd==='TAKEOFF'?'ok':'info');
  showToast(`<strong>[CMD]</strong> ${msg}`, type);
  addCmdLog(cmd, msg, type);
}

function addCmdLog(cmd, msg, type) {
  const log = document.getElementById('cmd-log');
  if (!log) return;
  const now = new Date().toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const typeLabel = {ok:'ACK',warn:'RTL',error:'KILL',info:'CMD'}[type]||'CMD';
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">${now}</span><span class="log-type ${type}">${typeLabel}</span><span class="log-msg"><strong>${cmd}</strong> — ${msg}</span>`;
  log.insertBefore(entry, log.firstChild);
  if (log.children.length > 10) log.removeChild(log.lastChild);
}

function savePanel(id) { showToast(`${id.charAt(0).toUpperCase()+id.slice(1)} settings saved`, 'ok'); }
function exportEvidence() { showToast('Generating evidence bundle… (0.8MB)', 'info'); setTimeout(()=>showToast('Bundle ready — EXP-004 created','ok'),2000); }
function exportBrief() { showToast('Generating stakeholder brief PDF…', 'info'); setTimeout(()=>showToast('PDF ready to download','ok'),1500); }
function sendDisclosure() { showToast('Disclosure submitted to HKCAD', 'ok'); }
function createSession() { closeModalById('new-session-modal'); showToast('New session created — SID-' + Math.random().toString(36).slice(2,10).toUpperCase(), 'ok'); }

// ══════ Theme Toggle ══════
(function(){
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = 'dark'; r.setAttribute('data-theme', d);
  t && t.addEventListener('click', () => {
    d = d==='dark'?'light':'dark';
    r.setAttribute('data-theme', d);
    t.innerHTML = d==='dark'
      ? '<i data-lucide="moon" style="width:16px;height:16px;"></i>'
      : '<i data-lucide="sun" style="width:16px;height:16px;"></i>';
    lucide.createIcons();
    showToast(d==='dark'?'Dark mode activated':'Light mode activated','info',1500);
  });
})();

// ══════ Live Telemetry Simulation ══════
let telState = { alt: 42.3, spd: 8.4, hdg: 247, roll: -1.2, pitch: 2.8, battery: 78, wind: 18 };
function startTelemetrySimulation() {
  setInterval(() => {
    telState.alt = +(telState.alt + (Math.random()-0.5)*0.4).toFixed(1);
    telState.spd = Math.max(0, +(telState.spd + (Math.random()-0.5)*0.3).toFixed(1));
    telState.hdg = Math.round((telState.hdg + (Math.random()-0.5)*2 + 360) % 360);
    telState.roll = +((Math.random()-0.5)*3).toFixed(1);
    telState.pitch = +((Math.random()-0.5)*4).toFixed(1);
    // Update telem strip
    const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    set('telem-alt', telState.alt + 'm');
    set('telem-spd', telState.spd + 'm/s');
    set('telem-hdg', telState.hdg + '°');
    set('telem-roll', telState.roll + '°');
    set('telem-pitch', telState.pitch + '°');
    // Live telemetry view
    set('lt-alt', telState.alt);
    set('lt-spd', telState.spd);
    set('lt-hdg', telState.hdg + '°');
    set('lt-roll', telState.roll + '°');
    set('lt-pitch', telState.pitch + '°');
    set('lt-yaw', telState.hdg + '°');
    // Push to event stream
    pushEventStream();
    // Update charts
    updateCharts();
  }, 1000);
}

// ══════ Flight Timer ══════
let flightSeconds = 522;
function startFlightTimer() {
  setInterval(() => {
    flightSeconds++;
    const h = String(Math.floor(flightSeconds/3600)).padStart(2,'0');
    const m = String(Math.floor((flightSeconds%3600)/60)).padStart(2,'0');
    const s = String(flightSeconds%60).padStart(2,'0');
    const fmt = `${h}:${m}:${s}`;
    const set = (id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
    set('telem-fltime', fmt); set('fs-elapsed', fmt);
  }, 1000);
}

// ══════ Event Stream ══════
const atlasEvents = ['telemetry', 'telemetry', 'telemetry', 'mission.waypoint', 'flight.status', 'telemetry', 'sensors.battery'];
function populateEventStream() {
  const stream = document.getElementById('event-stream');
  if (!stream) return;
  for (let i = 0; i < 6; i++) pushEventStream();
}
function pushEventStream() {
  const stream = document.getElementById('event-stream');
  if (!stream) return;
  const events = [
    { type:'telemetry', color:'var(--cyan)', payload:`{"alt":${telState.alt},"spd":${telState.spd},"hdg":${telState.hdg},"roll":${telState.roll},"pitch":${telState.pitch}}` },
    { type:'flight.status', color:'var(--green)', payload:`{"mode":"AUTO","armed":true,"wp_current":7}` },
    { type:'sensors.battery', color:'var(--amber)', payload:`{"voltage":22.4,"current":18.2,"remaining":${telState.battery}}` },
  ];
  const ev = events[Math.floor(Math.random()*events.length)];
  const now = new Date().toLocaleTimeString('en-GB');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.style.fontFamily = 'var(--font-mono)';
  entry.innerHTML = `<span class="log-time">${now}</span><span class="log-type info" style="background:rgba(0,212,255,0.1);color:${ev.color};">${ev.type}</span><span class="log-msg" style="font-family:var(--font-mono);font-size:var(--text-xs);">${ev.payload}</span>`;
  stream.insertBefore(entry, stream.firstChild);
  if (stream.children.length > 20) stream.removeChild(stream.lastChild);
}
function clearLog() {
  const stream = document.getElementById('event-stream');
  if(stream) stream.innerHTML = '';
  showToast('Event log cleared','info',1500);
}

// ══════ Replay Controls ══════
let replayPlaying = false;
let replayPct = 42;
function toggleReplay() {
  replayPlaying = !replayPlaying;
  const btn = document.getElementById('replay-play-btn');
  if (replayPlaying) {
    btn.innerHTML = '<i data-lucide="pause" style="width:14px;height:14px;"></i>Pause';
    lucide.createIcons();
    replayInterval = setInterval(() => {
      replayPct = Math.min(100, replayPct + 0.5);
      const bar = document.getElementById('replay-bar');
      if (bar) bar.style.width = replayPct + '%';
      if (replayPct >= 100) { clearInterval(replayInterval); replayPlaying = false; btn.innerHTML = '<i data-lucide="refresh-cw" style="width:14px;height:14px;"></i>Replay'; lucide.createIcons(); }
    }, 500);
  } else {
    clearInterval(replayInterval);
    btn.innerHTML = '<i data-lucide="play" style="width:14px;height:14px;"></i>Play';
    lucide.createIcons();
  }
}
function replayControl(dir) { replayPct = dir==='prev'?Math.max(0,replayPct-10):Math.min(100,replayPct+10); const bar=document.getElementById('replay-bar');if(bar)bar.style.width=replayPct+'%'; }
function replaySpeed(v) { showToast('Replay speed: '+v,'info',1500); }
function exportTelemetry() { showToast('Exporting telemetry CSV…','info'); setTimeout(()=>showToast('telemetry_SID-4F2A_full.csv ready','ok'),1200); }

// ══════ Command Palette Filter ══════
function filterCmdPal(val) { /* basic — full filter omitted for brevity */ }

// ══════ Charts ══════
let altChart, windChart, replayChart;
let altHistory = Array(20).fill(0).map((_,i)=>42+Math.sin(i*0.3)*3);
let spdHistory = Array(20).fill(0).map((_,i)=>8+Math.sin(i*0.4));
let windHistory = Array(20).fill(0).map((_,i)=>16+Math.sin(i*0.5)*2);

const chartDefaults = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor:'rgba(15,18,24,0.9)', borderColor:'rgba(255,255,255,0.12)', borderWidth:1, titleColor:'#8b9ab5', bodyColor:'#e2e8f0', padding:10 }},
  scales: {
    x: { display:false },
    y: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#4a5568', font:{ size:10, family:"'JetBrains Mono'" } } }
  }
};

function initCharts() {
  const labels = Array(20).fill(0).map((_,i)=>i);
  const ctx1 = document.getElementById('altChart')?.getContext('2d');
  if(ctx1) altChart = new Chart(ctx1, {
    type:'line',
    data:{ labels, datasets:[{ data:altHistory, borderColor:'#00d4ff', backgroundColor:'rgba(0,212,255,0.08)', borderWidth:1.5, fill:true, tension:0.4, pointRadius:0 }]},
    options:{...chartDefaults}
  });
  const ctx2 = document.getElementById('windChart')?.getContext('2d');
  if(ctx2) windChart = new Chart(ctx2, {
    type:'line',
    data:{ labels, datasets:[
      { data:windHistory, borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.08)', borderWidth:1.5, fill:true, tension:0.4, pointRadius:0, label:'Wind' },
      { data:spdHistory, borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.05)', borderWidth:1.5, fill:false, tension:0.4, pointRadius:0, label:'Speed' }
    ]},
    options:{...chartDefaults, plugins:{...chartDefaults.plugins, legend:{display:true, labels:{color:'#8b9ab5', font:{size:10}}}}}
  });
  const ctx3 = document.getElementById('replayChart')?.getContext('2d');
  if(ctx3) replayChart = new Chart(ctx3, {
    type:'line',
    data:{ labels:Array(30).fill(0).map((_,i)=>i), datasets:[{ data:Array(30).fill(0).map((_,i)=>38+i*0.15+Math.sin(i*0.5)*2), borderColor:'#00d4ff', backgroundColor:'rgba(0,212,255,0.08)', borderWidth:1.5, fill:true, tension:0.4, pointRadius:0 }]},
    options:{...chartDefaults}
  });
}

function updateCharts() {
  altHistory.shift(); altHistory.push(telState.alt);
  windHistory.shift(); windHistory.push(telState.wind + (Math.random()-0.5));
  spdHistory.shift(); spdHistory.push(telState.spd);
  if(altChart) { altChart.data.datasets[0].data = [...altHistory]; altChart.update('none'); }
  if(windChart) { windChart.data.datasets[0].data = [...windHistory]; windChart.data.datasets[1].data = [...spdHistory]; windChart.update('none'); }
}
