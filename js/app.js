/* ============================================================
   Art Sã - aplicação
   SPA local-first. Tudo é salvo no aparelho (localStorage).
   ============================================================ */

/* ---------- Armazenamento ---------- */
const Store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("atelie." + key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem("atelie." + key, JSON.stringify(val)); },
  del(key) { localStorage.removeItem("atelie." + key); }
};

/* ---------- Datas ---------- */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
function prettyDate() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
function dayIndex(len) {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = (new Date() - start) / 86400000;
  return Math.floor(diff) % len;
}

/* ---------- Estado derivado ---------- */
function ensureStart() {
  let s = Store.get("startDate", null);
  if (!s) { s = today(); Store.set("startDate", s); }
  return s;
}
function currentWeek() {
  const start = new Date(ensureStart());
  const days = Math.floor((new Date() - start) / 86400000);
  return Math.min(12, Math.max(1, Math.floor(days / 7) + 1));
}
function pageText(date) { return Store.get("pages." + (date || today()), ""); }
function wroteHoje() { return pageText().trim().length > 0; }

/* ---------- Hábito angular: deixa, rotina, recompensa ---------- */
function getHabit() {
  return Store.get("habit", { routine: "Páginas Matinais", custom: false, anchor: "tomar o café da manhã", time: "07:30" });
}
function saveHabit(h) { Store.set("habit", h); }
function markDoneToday() { Store.set("done." + today(), true); }
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* Um dia conta como feito se houve páginas escritas OU a prática foi marcada (dia mínimo viável). */
function dayDone(key) {
  return (Store.get("pages." + key, "") + "").trim().length > 0 || Store.get("done." + key, false) === true;
}
function feitoHoje() { return dayDone(today()); }

/* Corrente: dias consecutivos com a prática feita (terminando hoje ou ontem) */
function streak() {
  let count = 0;
  const d = new Date();
  if (!dayDone(dateKey(d))) d.setDate(d.getDate() - 1); // hoje em aberto não quebra a corrente
  while (dayDone(dateKey(d))) { count++; d.setDate(d.getDate() - 1); }
  return count;
}
/* Últimos n dias para a "corrente" visual */
function ultimosDias(n) {
  const out = [];
  const d = new Date(); d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) { const key = dateKey(d); out.push({ done: dayDone(key), hoje: key === today() }); d.setDate(d.getDate() + 1); }
  return out;
}
function totalDiasFeitos() {
  const set = new Set();
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith("atelie.pages.") && (Store.get(k.slice(7), "") + "").trim().length > 0) set.add(k.slice(13));
    if (k.startsWith("atelie.done.") && Store.get(k.slice(7), false) === true) set.add(k.slice(12));
  });
  return set.size;
}

/* ---------- Utilidades de UI ---------- */
const $view = document.getElementById("view");
const CHECK = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#f7f5f0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const esc = s => (s + "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let toastTimer;
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1900);
}

/* ============================================================
   ROTEADOR
   ============================================================ */
const routes = {};
function go(route, param) {
  location.hash = param != null ? `#${route}/${param}` : `#${route}`;
}
function render() {
  const [route, param] = location.hash.replace(/^#/, "").split("/");
  const r = route || "hoje";
  $view.innerHTML = "";
  (routes[r] || routes.hoje)($view, param);
  $view.style.animation = "none"; void $view.offsetWidth; $view.style.animation = "";
  document.querySelectorAll(".nav__item").forEach(b =>
    b.classList.toggle("is-active", b.dataset.route === r ||
      (r === "semana" && b.dataset.route === "jornada") ||
      (["encontro", "jardim", "foco", "conquistas", "trocar", "habito"].includes(r) && b.dataset.route === "mais")));
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

/* ============================================================
   TELA: HOJE
   ============================================================ */
routes.hoje = (el) => {
  const wk = DATA.weeks[currentWeek() - 1];
  const ref = DATA.tune[dayIndex(DATA.tune.length)];
  const s = streak();
  const habit = getHabit();
  const feito = feitoHoje();
  const remOn = Store.get("reminder", null);
  const chain = ultimosDias(7).map(d =>
    `<span class="bead ${d.done ? "bead--on" : ""} ${d.hoje ? "bead--hoje" : ""}"></span>`).join("");

  // ROTINA (hábito angular): Páginas abre a escrita; hábito próprio marca como feito
  const rotinaTile = habit.custom
    ? `<div class="tile tap ${feito ? "tile--done" : ""}" id="rotina">
         <div class="tile__txt"><h3>${esc(habit.routine)}</h3>
           <p>${feito ? "Prática de hoje registrada. ✦" : "Seu hábito angular. Toque ao concluir."}</p></div>
         <span class="tile__arrow">${feito ? "✦" : "○"}</span>
       </div>`
    : `<div class="tile tap ${feito ? "tile--done" : ""}" data-go="paginas">
         <div class="tile__txt"><h3>Páginas Matinais</h3>
           <p>${feito ? "Você já escreveu hoje. ✦" : "Três páginas livres para começar o dia."}</p></div>
         <span class="tile__arrow">${feito ? "✦" : "→"}</span>
       </div>`;

  el.innerHTML = `
    <p class="eyebrow today__date">${esc(prettyDate())}</p>
    <h1 class="greeting">${greeting()}.<br/>Vamos sintonizar?</h1>

    <div class="loop-cue tap" data-go="habito">
      <span class="loop-cue__k">sua deixa</span>
      <span class="loop-cue__v">Depois de ${esc(habit.anchor)}${remOn ? `, às ${esc(remOn)}` : ""}.</span>
      <span class="loop-cue__edit">editar</span>
    </div>

    ${rotinaTile}

    <div class="momentum">
      <div class="momentum__top">
        <span class="momentum__k">sua corrente</span>
        <span class="momentum__n">${s} ${s === 1 ? "dia" : "dias"}</span>
      </div>
      <div class="chain">${chain}</div>
      <p class="momentum__hint">${feito
        ? "Corrente mantida hoje. ✦ Pequenos passos, todo dia."
        : "Um dia mínimo já conta: até uma linha mantém a corrente viva."}</p>
    </div>

    <div class="reflection">
      <p class="reflection__k">Reflexão do dia · Sintonizar</p>
      <p class="reflection__t">${esc(ref.t)}</p>
      <p class="reflection__b">${esc(ref.b)}</p>
    </div>

    <div class="tile tap" data-go="semana/${wk.n}" style="margin-top:1rem">
      <div class="tile__txt">
        <h3>Semana ${wk.n} · ${esc(wk.theme)}</h3>
        <p>${esc(wk.essence)}</p>
      </div>
      <span class="tile__arrow">→</span>
    </div>
  `;

  const rotina = el.querySelector("#rotina");
  if (rotina) rotina.addEventListener("click", () => {
    if (feitoHoje()) return;
    markDoneToday(); reward(); render();
  });
  bindGo(el);
};

/* ---------- Recompensa: ritual de fechamento ---------- */
function reward() {
  const s = streak();
  const ov = document.createElement("div");
  ov.className = "reward";
  ov.innerHTML = `
    <div class="reward__card">
      <div class="reward__mark">✦</div>
      <p class="reward__t">Feito.</p>
      <p class="reward__s">Sua corrente: <b>${s} ${s === 1 ? "dia" : "dias"}</b></p>
      <input class="reward__in" id="rw" placeholder="uma pequena vitória de hoje (opcional)" autocomplete="off" />
      <div class="btn-row" style="justify-content:center;margin-top:.2rem">
        <button class="btn btn--sm" id="rw-save">Guardar e fechar</button>
        <button class="btn btn--ghost btn--sm" id="rw-close">Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add("show"));
  const close = () => { ov.classList.remove("show"); setTimeout(() => ov.remove(), 320); };
  ov.querySelector("#rw-close").onclick = close;
  ov.querySelector("#rw-save").onclick = () => {
    const v = ov.querySelector("#rw").value.trim();
    if (v) { const w = Store.get("wins", []); w.unshift({ id: Date.now(), text: v, ts: today() }); Store.set("wins", w); }
    close();
  };
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
}

/* ============================================================
   TELA: PÁGINAS MATINAIS
   ============================================================ */
routes.paginas = (el) => {
  const key = today();
  const saved = pageText(key);
  el.innerHTML = `
    <div class="page-head">
      <p class="eyebrow">${esc(prettyDate())}</p>
      <h2 class="h2" style="margin-top:.2rem">Páginas Matinais</h2>
    </div>
    <p class="lead" style="margin-top:.5rem">Escreva sem pensar, sem corrigir, sem reler. Deixe a mão ir na frente da cabeça.</p>
    <div class="progress" style="margin-top:1.2rem"><div class="progress__bar" id="bar"></div></div>
    <div class="pages-head" style="margin-top:.5rem">
      <span class="pages-meta" id="count">0 palavras</span>
      <span class="save-state" id="save">salvo</span>
    </div>
    <textarea class="writing" id="paper" placeholder="Comece por qualquer lugar. Até 'não sei o que escrever' já é um começo…">${esc(saved)}</textarea>
    <div class="btn-row" id="pg-foot" style="justify-content:center;margin-top:1rem;display:none">
      <button class="btn btn--sm" id="concluir">Concluir as páginas de hoje ✦</button>
    </div>
  `;
  const paper = el.querySelector("#paper");
  const bar = el.querySelector("#bar");
  const count = el.querySelector("#count");
  const save = el.querySelector("#save");
  const foot = el.querySelector("#pg-foot");
  const GOAL = 750; // ~3 páginas à mão

  const update = () => {
    const words = paper.value.trim() ? paper.value.trim().split(/\s+/).length : 0;
    count.textContent = `${words} ${words === 1 ? "palavra" : "palavras"}${words >= GOAL ? " · três páginas ✦" : ""}`;
    bar.style.width = Math.min(100, (words / GOAL) * 100) + "%";
    foot.style.display = words > 0 ? "flex" : "none";
  };
  let t;
  const persist = () => {
    save.textContent = "escrevendo…";
    clearTimeout(t);
    t = setTimeout(() => {
      Store.set("pages." + key, paper.value);
      save.textContent = "salvo no aparelho";
    }, 500);
  };
  paper.addEventListener("input", () => { update(); persist(); });
  el.querySelector("#concluir").onclick = () => {
    clearTimeout(t); Store.set("pages." + key, paper.value); // garante salvo
    reward(); go("hoje");
  };
  update();
  setTimeout(() => paper.focus(), 100);
};

/* ============================================================
   TELA: JORNADA (lista de semanas)
   ============================================================ */
routes.jornada = (el) => {
  const cur = currentWeek();
  const tasksState = Store.get("tasks", {});
  el.innerHTML = `
    <p class="eyebrow">12 semanas</p>
    <h2 class="h2" style="margin-top:.2rem">A jornada</h2>
    <p class="lead" style="margin-top:.5rem">Uma semana de cada vez. Sem pressa: o caminho aparece ao caminhar.</p>
    <div class="week-list">
      ${DATA.weeks.map(w => {
        const done = tasksState[w.n] ? Object.values(tasksState[w.n]).filter(Boolean).length : 0;
        const cls = w.n === cur ? "week-row--current" : (w.n > cur ? "week-row--locked" : "");
        return `<div class="week-row tap ${cls}" data-go="semana/${w.n}">
          <span class="week-num">${w.n}</span>
          <div class="week-row__t">
            <h3>${esc(w.theme)}</h3>
            <p>${esc(w.essence)}</p>
          </div>
          <span class="week-tag">${w.n === cur ? "agora" : (done > 0 ? done + "/" + w.tasks.length : "")}</span>
        </div>`;
      }).join("")}
    </div>
  `;
  bindGo(el);
};

/* ---------- Detalhe da semana ---------- */
routes.semana = (el, param) => {
  const n = parseInt(param, 10) || 1;
  const w = DATA.weeks[n - 1];
  const state = Store.get("tasks", {});
  const wkState = state[n] || {};
  el.innerHTML = `
    <button class="back" data-go="jornada">← Jornada</button>
    <p class="eyebrow">Semana ${w.n}</p>
    <h2 class="h1" style="font-size:clamp(1.8rem,7vw,2.4rem);margin-top:.1rem">${esc(w.theme)}</h2>
    <p class="serif-quote" style="font-size:1.15rem;color:var(--ink-soft);margin-top:.6rem">${esc(w.essence)}</p>
    <div class="card card--quiet" style="margin-top:1.3rem">
      <p class="reflection__b" style="font-family:var(--reading)">${esc(w.intro)}</p>
    </div>
    <p class="eyebrow" style="margin-top:1.8rem">Tarefas da semana</p>
    <div id="tasks" style="margin-top:.4rem">
      ${w.tasks.map((tk, i) => `
        <div class="task ${wkState[i] ? "task--done" : ""}" data-i="${i}">
          <span class="task__box">${CHECK}</span>
          <span class="task__txt">${esc(tk)}</span>
        </div>`).join("")}
    </div>
    <div class="dot-rule">· · ·</div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn btn--ghost btn--sm" data-go="encontro">Marcar Encontro com o Artista</button>
    </div>
  `;
  el.querySelector("#tasks").addEventListener("click", e => {
    const row = e.target.closest(".task"); if (!row) return;
    const i = +row.dataset.i;
    const st = Store.get("tasks", {}); st[n] = st[n] || {};
    st[n][i] = !st[n][i]; Store.set("tasks", st);
    row.classList.toggle("task--done", st[n][i]);
    if (st[n][i]) toast("Feito ✦");
  });
  bindGo(el);
};

/* ============================================================
   TELA: SINTONIZAR (baralho de reflexões)
   ============================================================ */
routes.sintonizar = (el) => {
  let i = Store.get("tuneIdx", dayIndex(DATA.tune.length));
  const draw = () => {
    const c = DATA.tune[i % DATA.tune.length];
    el.innerHTML = `
      <p class="eyebrow">Sintonizar · no espírito de O Ato Criativo</p>
      <h2 class="h2" style="margin-top:.2rem">Uma pausa antes de criar</h2>
      <div class="deck">
        <div class="tune-card">
          <p class="tune-card__k">${esc(c.k)}</p>
          <p class="tune-card__t">${esc(c.t)}</p>
          <p class="tune-card__b">${esc(c.b)}</p>
          <p class="tune-card__p">${c.p}</p>
        </div>
      </div>
      <div class="btn-row" style="justify-content:center;margin-top:1.3rem">
        <button class="btn btn--ghost" id="next">Outra reflexão ↻</button>
      </div>
    `;
    el.querySelector("#next").onclick = () => { i = (i + 1) % DATA.tune.length; Store.set("tuneIdx", i); draw(); };
  };
  draw();
};

/* ============================================================
   TELA: MAIS (ferramentas)
   ============================================================ */
routes.mais = (el) => {
  el.innerHTML = `
    <p class="eyebrow">Ferramentas</p>
    <h2 class="h2" style="margin-top:.2rem">Seu ateliê</h2>
    <div class="tool-grid">
      <div class="tool tap" data-go="habito"><span class="tool__icon">◎</span><div><p class="tool__t">Meu hábito</p><p class="tool__d">Sua deixa, sua rotina e seu lembrete.</p></div></div>
      <div class="tool tap" data-go="trocar"><span class="tool__icon">⟳</span><div><p class="tool__t">Trocar um hábito</p><p class="tool__d">A Regra de Ouro para destravar a criação.</p></div></div>
      <div class="tool tap" data-go="encontro"><span class="tool__icon">❋</span><div><p class="tool__t">Encontro com o Artista</p><p class="tool__d">Um passeio criativo só seu, toda semana.</p></div></div>
      <div class="tool tap" data-go="jardim"><span class="tool__icon">✿</span><div><p class="tool__t">Jardim de Ideias</p><p class="tool__d">Capture sementes antes que elas fujam.</p></div></div>
      <div class="tool tap" data-go="foco"><span class="tool__icon">◷</span><div><p class="tool__t">Cronômetro de Foco</p><p class="tool__d">Sente e deixe a obra acontecer.</p></div></div>
      <div class="tool tap" data-go="conquistas"><span class="tool__icon">✦</span><div><p class="tool__t">Conquistas</p><p class="tool__d">Suas vitórias e sua corrente.</p></div></div>
    </div>
    <p class="faint" style="font-size:.78rem;text-align:center;margin-top:2rem">Tudo é salvo apenas neste aparelho.<br/>Nada sai daqui sem você querer.</p>
  `;
  bindGo(el);
};

/* ============================================================
   TELA: ENCONTRO COM O ARTISTA
   ============================================================ */
routes.encontro = (el) => {
  const log = Store.get("artistLog", []);
  const idea = DATA.artistDates[dayIndex(DATA.artistDates.length)];
  el.innerHTML = `
    <button class="back" data-go="mais">← Ferramentas</button>
    <p class="eyebrow">Encontro com o Artista</p>
    <h2 class="h2" style="margin-top:.2rem">Um encontro só seu</h2>
    <p class="lead" style="margin-top:.5rem">Uma vez por semana, leve a criança criativa pra passear. Sozinho, sem render nada. Só nutrir.</p>
    <div class="card" style="margin-top:1.3rem">
      <p class="reflection__k">Sugestão de hoje</p>
      <p class="reflection__t" style="font-size:1.2rem">${esc(idea)}</p>
      <div class="btn-row" style="margin-top:.8rem">
        <button class="btn btn--sm" id="mark">Vou nesse ✦</button>
        <button class="btn btn--ghost btn--sm" id="other">Outra ideia ↻</button>
      </div>
    </div>
    <p class="eyebrow" style="margin-top:1.8rem">Seus encontros</p>
    <div id="log" style="margin-top:.4rem">${renderArtistLog(log)}</div>
  `;
  let cur = idea;
  el.querySelector("#other").onclick = () => {
    cur = DATA.artistDates[Math.floor((cur.length * 7) % DATA.artistDates.length)];
    // simples rotação determinística sem random
    const idx = (DATA.artistDates.indexOf(cur) + 1) % DATA.artistDates.length;
    cur = DATA.artistDates[idx];
    el.querySelector(".reflection__t").textContent = cur;
  };
  el.querySelector("#mark").onclick = () => {
    const l = Store.get("artistLog", []);
    l.unshift({ id: Date.now(), idea: cur, ts: today() });
    Store.set("artistLog", l);
    el.querySelector("#log").innerHTML = renderArtistLog(l);
    toast("Encontro marcado ❋");
  };
  bindGo(el);
};
function renderArtistLog(log) {
  if (!log.length) return `<div class="empty"><p class="empty__icon">❋</p><p>Seu primeiro encontro ainda vai acontecer.</p></div>`;
  return log.map(e => `<div class="seed"><span class="seed__sprout">❋</span><span class="seed__txt">${esc(e.idea)}<br><span class="seed__time">${esc(e.ts)}</span></span></div>`).join("");
}

/* ============================================================
   TELA: JARDIM DE IDEIAS
   ============================================================ */
routes.jardim = (el) => {
  el.innerHTML = `
    <button class="back" data-go="mais">← Ferramentas</button>
    <p class="eyebrow">Jardim de Ideias</p>
    <h2 class="h2" style="margin-top:.2rem">Sementes</h2>
    <p class="lead" style="margin-top:.5rem">Uma ideia não precisa ser boa, precisa só existir. Plante sem julgar.</p>
    <div class="seed-input">
      <input id="seed-in" placeholder="uma frase, uma imagem, um talvez…" autocomplete="off" />
      <button class="btn btn--sm" id="seed-add">Plantar</button>
    </div>
    <div id="seeds" style="margin-top:1.2rem"></div>
  `;
  const inp = el.querySelector("#seed-in");
  const list = el.querySelector("#seeds");
  const draw = () => {
    const seeds = Store.get("seeds", []);
    list.innerHTML = seeds.length
      ? seeds.map(s => `<div class="seed"><span class="seed__sprout">✿</span><span class="seed__txt">${esc(s.text)}<br><span class="seed__time">${esc(s.ts)}</span></span><button class="seed__del" data-id="${s.id}">×</button></div>`).join("")
      : `<div class="empty"><p class="empty__icon">✿</p><p>O jardim está esperando a primeira semente.</p></div>`;
  };
  const add = () => {
    const v = inp.value.trim(); if (!v) return;
    const seeds = Store.get("seeds", []);
    seeds.unshift({ id: Date.now(), text: v, ts: today() });
    Store.set("seeds", seeds); inp.value = ""; draw(); inp.focus();
  };
  el.querySelector("#seed-add").onclick = add;
  inp.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
  list.addEventListener("click", e => {
    if (e.target.classList.contains("seed__del")) {
      const id = +e.target.dataset.id;
      Store.set("seeds", Store.get("seeds", []).filter(s => s.id !== id)); draw();
    }
  });
  draw();
  bindGo(el);
};

/* ============================================================
   TELA: CRONÔMETRO DE FOCO
   ============================================================ */
routes.foco = (el) => {
  el.innerHTML = `
    <button class="back" data-go="mais">← Ferramentas</button>
    <p class="eyebrow">Cronômetro de Foco</p>
    <h2 class="h2" style="margin-top:.2rem">Apenas comece</h2>
    <p class="lead" style="margin-top:.5rem">Não precisa render. Só ficar com a obra pelo tempo escolhido.</p>
    <div class="timer">
      <p class="timer__ring" id="phase">pronto quando você estiver</p>
      <div class="timer__clock" id="clock">25:00</div>
    </div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn" id="startstop">Começar</button>
      <button class="btn btn--ghost" id="reset">Zerar</button>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:1rem">
      ${[10, 25, 45].map(m => `<button class="btn btn--ghost btn--sm pick" data-m="${m}">${m} min</button>`).join("")}
    </div>
  `;
  let total = 25 * 60, left = total, running = false, iv = null;
  const clock = el.querySelector("#clock");
  const phase = el.querySelector("#phase");
  const ss = el.querySelector("#startstop");
  const show = () => clock.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const stop = () => { running = false; clearInterval(iv); ss.textContent = "Continuar"; };
  ss.onclick = () => {
    if (running) { stop(); phase.textContent = "pausa"; return; }
    running = true; ss.textContent = "Pausar"; phase.textContent = "criando…";
    iv = setInterval(() => {
      left--; show();
      if (left <= 0) {
        clearInterval(iv); running = false; ss.textContent = "Começar";
        phase.textContent = "tempo ✦"; left = total; toast("Sessão concluída ✦");
        if ("Notification" in window && Notification.permission === "granted")
          new Notification("Art Sã", { body: "Sua sessão de foco terminou. ✦" });
      }
    }, 1000);
  };
  el.querySelector("#reset").onclick = () => { stop(); left = total; show(); phase.textContent = "pronto quando você estiver"; ss.textContent = "Começar"; };
  el.querySelectorAll(".pick").forEach(b => b.onclick = () => {
    stop(); total = +b.dataset.m * 60; left = total; show(); ss.textContent = "Começar"; phase.textContent = "pronto quando você estiver";
  });
  show();
  bindGo(el);
};

/* ============================================================
   TELA: CONQUISTAS
   ============================================================ */
routes.conquistas = (el) => {
  const tasksState = Store.get("tasks", {});
  const tarefasFeitas = Object.values(tasksState).reduce((a, w) => a + Object.values(w).filter(Boolean).length, 0);
  el.innerHTML = `
    <button class="back" data-go="mais">← Ferramentas</button>
    <p class="eyebrow">Conquistas</p>
    <h2 class="h2" style="margin-top:.2rem">O que você já plantou</h2>
    <div class="stat-row">
      <div class="stat"><p class="stat__n">${streak()}</p><p class="stat__l">sequência (dias)</p></div>
      <div class="stat"><p class="stat__n">${totalDiasFeitos()}</p><p class="stat__l">dias de prática</p></div>
      <div class="stat"><p class="stat__n">${tarefasFeitas}</p><p class="stat__l">tarefas feitas</p></div>
    </div>
    <p class="eyebrow" style="margin-top:1.8rem">Registrar uma vitória</p>
    <div class="seed-input">
      <input id="win-in" placeholder="terminei um esboço, ousei mostrar pra alguém…" autocomplete="off" />
      <button class="btn btn--sm" id="win-add">Guardar</button>
    </div>
    <div id="wins" style="margin-top:1.2rem"></div>
  `;
  const inp = el.querySelector("#win-in"), list = el.querySelector("#wins");
  const draw = () => {
    const wins = Store.get("wins", []);
    list.innerHTML = wins.length
      ? wins.map(w => `<div class="seed"><span class="seed__sprout">✦</span><span class="seed__txt">${esc(w.text)}<br><span class="seed__time">${esc(w.ts)}</span></span><button class="seed__del" data-id="${w.id}">×</button></div>`).join("")
      : `<div class="empty"><p class="empty__icon">✦</p><p>Toda vitória conta. Comece pela de hoje.</p></div>`;
  };
  const add = () => {
    const v = inp.value.trim(); if (!v) return;
    const wins = Store.get("wins", []); wins.unshift({ id: Date.now(), text: v, ts: today() });
    Store.set("wins", wins); inp.value = ""; draw(); toast("Guardado ✦");
  };
  el.querySelector("#win-add").onclick = add;
  inp.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
  list.addEventListener("click", e => {
    if (e.target.classList.contains("seed__del")) {
      Store.set("wins", Store.get("wins", []).filter(w => w.id !== +e.target.dataset.id)); draw();
    }
  });
  draw();
  bindGo(el);
};

/* ============================================================
   TELA: MEU HÁBITO (deixa, rotina, recompensa, lembrete)
   ============================================================ */
routes.habito = (el) => {
  const h = getHabit();
  el.innerHTML = `
    <button class="back" data-go="mais">← Ferramentas</button>
    <p class="eyebrow">Meu hábito</p>
    <h2 class="h2" style="margin-top:.2rem">Desenhe seu loop</h2>
    <p class="lead" style="margin-top:.5rem">Um hábito gruda com uma deixa clara, uma rotina simples e uma recompensa sentida.</p>

    <div class="field">
      <label class="field__k">Rotina · seu hábito angular</label>
      <div class="seg" id="seg">
        <button class="seg__b ${!h.custom ? "is-on" : ""}" data-v="paginas">Páginas Matinais</button>
        <button class="seg__b ${h.custom ? "is-on" : ""}" data-v="custom">Outro</button>
      </div>
      <input class="field__in" id="routine" placeholder="ex: desenhar 10 minutos" value="${h.custom ? esc(h.routine) : ""}" autocomplete="off" style="margin-top:.6rem;${h.custom ? "" : "display:none"}" />
    </div>

    <div class="field">
      <label class="field__k">Deixa · o gatilho</label>
      <div class="field__row"><span class="field__pre">Depois de</span>
        <input class="field__in" id="anchor" list="cues" value="${esc(h.anchor)}" autocomplete="off" /></div>
      <datalist id="cues">${DATA.cueSuggestions.map(c => `<option value="${esc(c)}">`).join("")}</datalist>
    </div>

    <div class="field">
      <label class="field__k">Horário</label>
      <input class="field__in" id="time" type="time" value="${esc(h.time)}" />
    </div>

    <div class="btn-row" style="margin-top:.4rem">
      <button class="btn" id="save-habit">Salvar</button>
      <button class="btn btn--ghost" id="rem-btn2">Ativar lembrete</button>
    </div>
    <p class="save-state" id="rem-note" style="margin-top:.9rem"></p>
  `;
  let custom = h.custom;
  const routineIn = el.querySelector("#routine");
  el.querySelector("#seg").addEventListener("click", e => {
    const b = e.target.closest(".seg__b"); if (!b) return;
    custom = b.dataset.v === "custom";
    el.querySelectorAll(".seg__b").forEach(x => x.classList.toggle("is-on", x === b));
    routineIn.style.display = custom ? "block" : "none";
    if (custom) routineIn.focus();
  });
  el.querySelector("#save-habit").onclick = () => {
    const anchor = el.querySelector("#anchor").value.trim() || "tomar o café da manhã";
    const time = el.querySelector("#time").value || "07:30";
    const routine = custom ? (routineIn.value.trim() || "Minha prática") : "Páginas Matinais";
    saveHabit({ routine, custom, anchor, time });
    if (Store.get("reminder", null)) Store.set("reminder", time);
    toast("Hábito salvo ✦"); go("hoje");
  };
  const note = el.querySelector("#rem-note");
  const remBtn = el.querySelector("#rem-btn2");
  const refreshRem = () => {
    const on = Store.get("reminder", null);
    if (!("Notification" in window)) { remBtn.style.display = "none"; note.textContent = "Este navegador não suporta notificações."; return; }
    remBtn.textContent = on ? "Desativar lembrete" : "Ativar lembrete";
    note.textContent = on ? `Lembrete às ${on}, enquanto o app estiver aberto.` : "Sem lembrete por enquanto.";
  };
  remBtn.onclick = async () => {
    if (Store.get("reminder", null)) { Store.del("reminder"); toast("Lembrete desativado"); refreshRem(); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      Store.set("reminder", el.querySelector("#time").value || getHabit().time || "07:30");
      new Notification("Art Sã", { body: "Pronto! Vou te lembrar da sua prática. ☼" });
      toast("Lembrete ativado ☼"); refreshRem();
    } else toast("Permissão negada");
  };
  refreshRem();
  bindGo(el);
};

/* ============================================================
   TELA: TROCAR UM HÁBITO (a Regra de Ouro)
   ============================================================ */
routes.trocar = (el) => {
  const draft = Store.get("goldenDraft", {});
  el.innerHTML = `
    <button class="back" data-go="mais">← Ferramentas</button>
    <p class="eyebrow">A Regra de Ouro</p>
    <h2 class="h2" style="margin-top:.2rem">Trocar um hábito</h2>
    <p class="lead" style="margin-top:.5rem">Você não apaga um hábito, você troca a rotina. Mantenha a mesma deixa e a mesma recompensa, e ponha a criação no lugar.</p>
    <div style="margin-top:1.2rem">
      ${DATA.golden.map((g, i) => `
        <div class="field">
          <label class="field__k">${esc(g.t)}</label>
          <p class="field__help">${esc(g.h)}</p>
          <textarea class="field__area" data-i="${i}" rows="2" placeholder="${esc(g.ph)}">${esc(draft[i] || "")}</textarea>
        </div>`).join("")}
    </div>
    <div class="btn-row" style="margin-top:.2rem">
      <button class="btn" id="g-save">Guardar este plano</button>
    </div>
    <p class="eyebrow" style="margin-top:1.8rem">Planos guardados</p>
    <div id="swaps" style="margin-top:.4rem"></div>
  `;
  const areas = [...el.querySelectorAll(".field__area")];
  const saveDraft = () => { const d = {}; areas.forEach(a => d[a.dataset.i] = a.value); Store.set("goldenDraft", d); };
  areas.forEach(a => a.addEventListener("input", saveDraft));
  const drawSwaps = () => {
    const list = Store.get("habitSwaps", []);
    el.querySelector("#swaps").innerHTML = list.length
      ? list.map(s => `<div class="seed"><span class="seed__sprout">⟳</span><span class="seed__txt"><b>${esc(s.plan)}</b><br><span class="seed__time">no lugar de: ${esc(s.routine)} · ${esc(s.ts)}</span></span><button class="seed__del" data-id="${s.id}">×</button></div>`).join("")
      : `<div class="empty"><p class="empty__icon">⟳</p><p>Seu primeiro plano de troca aparece aqui.</p></div>`;
  };
  el.querySelector("#g-save").onclick = () => {
    const routine = areas[0].value.trim(), plan = areas[3].value.trim();
    if (!routine || !plan) { toast("Preencha ao menos a rotina e o plano"); return; }
    const list = Store.get("habitSwaps", []);
    list.unshift({ id: Date.now(), routine, plan, ts: today() });
    Store.set("habitSwaps", list); Store.del("goldenDraft");
    areas.forEach(a => a.value = ""); drawSwaps(); toast("Plano guardado ⟳");
  };
  el.querySelector("#swaps").addEventListener("click", e => {
    if (e.target.classList.contains("seed__del")) {
      Store.set("habitSwaps", Store.get("habitSwaps", []).filter(s => s.id !== +e.target.dataset.id)); drawSwaps();
    }
  });
  drawSwaps();
  bindGo(el);
};

/* ============================================================
   ONBOARDING: desenhar a deixa na primeira vez
   ============================================================ */
function maybeOnboard() {
  if (Store.get("onboarded", false)) return;
  const ov = document.createElement("div");
  ov.className = "onb";
  ov.innerHTML = `
    <div class="onb__card">
      <p class="onb__k">Bem-vinda ao Art Sã</p>
      <h2 class="onb__t">Vamos desenhar seu hábito de criar</h2>
      <p class="onb__lead">Um hábito gruda com uma <b>deixa</b> clara, uma <b>rotina</b> simples e uma <b>recompensa</b> sentida. Sua rotina começa pelas Páginas Matinais. Falta só a deixa:</p>
      <label class="field__k">Depois de…</label>
      <input class="field__in" id="onb-anchor" list="onb-cues" value="tomar o café da manhã" autocomplete="off" />
      <datalist id="onb-cues">${DATA.cueSuggestions.map(c => `<option value="${esc(c)}">`).join("")}</datalist>
      <label class="field__k" style="margin-top:.8rem">…às</label>
      <input class="field__in" id="onb-time" type="time" value="07:30" />
      <div class="btn-row" style="margin-top:1.3rem;justify-content:center">
        <button class="btn" id="onb-go">Começar minha prática</button>
      </div>
      <button class="onb__skip" id="onb-skip">pular por agora</button>
    </div>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add("show"));
  const finish = () => {
    const anchor = ov.querySelector("#onb-anchor").value.trim() || "tomar o café da manhã";
    const time = ov.querySelector("#onb-time").value || "07:30";
    saveHabit({ routine: "Páginas Matinais", custom: false, anchor, time });
    Store.set("onboarded", true);
    ov.classList.remove("show"); setTimeout(() => ov.remove(), 320);
    render();
  };
  ov.querySelector("#onb-go").onclick = finish;
  ov.querySelector("#onb-skip").onclick = () => { Store.set("onboarded", true); ov.classList.remove("show"); setTimeout(() => ov.remove(), 320); };
}

/* ============================================================
   Lembrete diário (Notification API)
   Sem servidor, o lembrete dispara com o app aberto perto do
   horário. Push em segundo plano exige backend (fase 2).
   Configurado em "Meu hábito".
   ============================================================ */
// verifica o horário do lembrete enquanto o app está aberto
setInterval(() => {
  const on = Store.get("reminder", null);
  if (!on || Notification.permission !== "granted") return;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const last = Store.get("reminderLast", "");
  if (hhmm === on && last !== today() && !feitoHoje()) {
    Store.set("reminderLast", today());
    new Notification("Art Sã ☼", { body: "Um momento para a sua prática de hoje." });
  }
}, 30000);

/* ---------- Liga elementos com data-go ---------- */
function bindGo(scope) {
  scope.querySelectorAll("[data-go]").forEach(b =>
    b.addEventListener("click", () => {
      const [r, p] = b.dataset.go.split("/");
      go(r, p);
    }));
}

/* ---------- Navegação inferior ---------- */
document.getElementById("nav").addEventListener("click", e => {
  const b = e.target.closest(".nav__item"); if (!b) return;
  go(b.dataset.route);
});

/* ---------- Início ---------- */
ensureStart();
render();
setTimeout(() => { document.getElementById("splash").classList.add("hide"); maybeOnboard(); }, 2400);

/* ---------- Service worker (offline) ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
