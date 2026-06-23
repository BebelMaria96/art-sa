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

/* Streak: dias consecutivos com páginas escritas (terminando hoje ou ontem) */
function streak() {
  let count = 0;
  const d = new Date();
  // se ainda não escreveu hoje, conta a partir de ontem (não quebra o streak durante o dia)
  if (pageText().trim().length === 0) d.setDate(d.getDate() - 1);
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (Store.get("pages." + key, "").trim().length > 0) { count++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return count;
}
function totalDiasEscritos() {
  return Object.keys(localStorage).filter(k => k.startsWith("atelie.pages.") && (Store.get(k.slice(7), "") + "").trim().length > 0).length;
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
      (["encontro", "jardim", "foco", "conquistas"].includes(r) && b.dataset.route === "mais")));
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
  const feito = wroteHoje();
  el.innerHTML = `
    <p class="eyebrow today__date">${esc(prettyDate())}</p>
    <h1 class="greeting">${greeting()}.<br/>Vamos sintonizar?</h1>
    <div class="streak-pill">☼ <span>sequência</span> <b>${s}</b> ${s === 1 ? "dia" : "dias"}</div>

    <div class="tile tap ${feito ? "tile--done" : ""}" data-go="paginas">
      <div class="tile__txt">
        <h3>Páginas Matinais</h3>
        <p>${feito ? "Você já escreveu hoje. ✦" : "Três páginas livres para começar o dia."}</p>
      </div>
      <span class="tile__arrow">${feito ? "✦" : "→"}</span>
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
  bindGo(el);
};

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
  `;
  const paper = el.querySelector("#paper");
  const bar = el.querySelector("#bar");
  const count = el.querySelector("#count");
  const save = el.querySelector("#save");
  const GOAL = 750; // ~3 páginas à mão

  const update = () => {
    const words = paper.value.trim() ? paper.value.trim().split(/\s+/).length : 0;
    count.textContent = `${words} ${words === 1 ? "palavra" : "palavras"}${words >= GOAL ? " · três páginas ✦" : ""}`;
    bar.style.width = Math.min(100, (words / GOAL) * 100) + "%";
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
      <div class="tool tap" data-go="encontro"><span class="tool__icon">❋</span><div><p class="tool__t">Encontro com o Artista</p><p class="tool__d">Um passeio criativo só seu, toda semana.</p></div></div>
      <div class="tool tap" data-go="jardim"><span class="tool__icon">✿</span><div><p class="tool__t">Jardim de Ideias</p><p class="tool__d">Capture sementes antes que elas fujam.</p></div></div>
      <div class="tool tap" data-go="foco"><span class="tool__icon">◷</span><div><p class="tool__t">Cronômetro de Foco</p><p class="tool__d">Sente e deixe a obra acontecer.</p></div></div>
      <div class="tool tap" data-go="conquistas"><span class="tool__icon">✦</span><div><p class="tool__t">Conquistas</p><p class="tool__d">Suas vitórias e sua sequência.</p></div></div>
    </div>
    <div class="rule"></div>
    <div class="card card--quiet">
      <p class="eyebrow">Lembrete diário</p>
      <p class="muted" style="margin-top:.5rem;font-size:.92rem" id="rem-status">As Páginas Matinais funcionam melhor como hábito.</p>
      <div class="btn-row" style="margin-top:.9rem">
        <button class="btn btn--ghost btn--sm" id="rem-btn">Ativar lembrete</button>
      </div>
    </div>
    <p class="faint" style="font-size:.78rem;text-align:center;margin-top:2rem">Tudo é salvo apenas neste aparelho.<br/>Nada sai daqui sem você querer.</p>
  `;
  bindGo(el);
  setupReminder(el);
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
      <div class="stat"><p class="stat__n">${totalDiasEscritos()}</p><p class="stat__l">dias escritos</p></div>
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
   Lembrete diário (Notification API)
   Observação: sem servidor, o lembrete dispara quando o app
   está aberto perto do horário. Push em segundo plano exige
   backend (fica para a fase 2).
   ============================================================ */
function setupReminder(el) {
  const status = el.querySelector("#rem-status");
  const btn = el.querySelector("#rem-btn");
  const refresh = () => {
    const on = Store.get("reminder", null);
    if (!("Notification" in window)) { status.textContent = "Este navegador não suporta notificações."; btn.style.display = "none"; return; }
    if (Notification.permission === "granted" && on) {
      status.textContent = `Lembrete ativo para ${on}. (Funciona com o app aberto.)`;
      btn.textContent = "Desativar";
    } else {
      status.textContent = "As Páginas Matinais funcionam melhor como hábito.";
      btn.textContent = "Ativar lembrete";
    }
  };
  btn.onclick = async () => {
    if (Store.get("reminder", null) && Notification.permission === "granted") {
      Store.del("reminder"); toast("Lembrete desativado"); refresh(); return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      Store.set("reminder", "07:30");
      new Notification("Art Sã", { body: "Pronto! Vou te lembrar das Páginas Matinais. ☼" });
      toast("Lembrete ativado ☼"); refresh();
    } else { toast("Permissão negada"); }
  };
  refresh();
}
// verifica o horário do lembrete enquanto o app está aberto
setInterval(() => {
  const on = Store.get("reminder", null);
  if (!on || Notification.permission !== "granted") return;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const last = Store.get("reminderLast", "");
  if (hhmm === on && last !== today() && !wroteHoje()) {
    Store.set("reminderLast", today());
    new Notification("Art Sã ☼", { body: "Um momento para as suas Páginas Matinais." });
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
setTimeout(() => document.getElementById("splash").classList.add("hide"), 2400);

/* ---------- Service worker (offline) ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
