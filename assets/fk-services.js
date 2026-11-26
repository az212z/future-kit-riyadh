/* FUTURE KIT · online services (shared by v4 and v5) */
(() => {
  "use strict";

  /* ============================================================
     بيانات التواصل لنسختي v4 و v5: عدلها هنا فقط.
     whatsapp بالصيغة الدولية بدون + أو مسافات، مثال: "9665XXXXXXXX"
     ============================================================ */
  const CONFIG = { whatsapp: "", phone: "", address: "", hours: "" };
  const PENDING = "يضاف قريبا";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  };

  /* ---------- config ---------- */
  $$(".cfg").forEach(el => {
    const v = CONFIG[el.dataset.cfg];
    if (v) {
      if (el.dataset.cfg === "whatsapp") el.innerHTML = `<a href="https://wa.me/${v}" target="_blank" rel="noopener">+${v}</a>`;
      else if (el.dataset.cfg === "phone") el.innerHTML = `<a href="tel:${v.replace(/\s/g, "")}">${v}</a>`;
      else el.textContent = v;
    } else { el.textContent = PENDING; el.classList.add("is-pending"); el.removeAttribute("dir"); }
  });
  $$(".yr").forEach(e => e.textContent = new Date().getFullYear());

  /* ---------- toast + send ---------- */
  const toastEl = $("#toast"); let toastT;
  const toast = (m, ms = 4200) => { if (!toastEl) return; toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-on"), ms); };
  const copy = async (text) => { try { await Promise.race([navigator.clipboard.writeText(text), new Promise((_, j) => setTimeout(j, 900))]); return true; } catch (_) { return false; } };
  const sendMessage = async (text) => {
    if (CONFIG.whatsapp) { window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener"); return "sent"; }
    await copy(text); return "copied";
  };
  const goTo = (sel) => { const el = typeof sel === "string" ? $(sel) : sel; if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); };
  if (CONFIG.whatsapp) $$("[data-wa]").forEach(a => { a.href = `https://wa.me/${CONFIG.whatsapp}`; a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- header, nav, top button ---------- */
  const hd = $("#hd"), nav = $("#nav"), navBtn = $("#nav-btn"), topBtn = $("#top-btn");
  const onScroll = () => {
    if (hd) hd.classList.toggle("is-solid", scrollY > 40);
    if (topBtn) topBtn.classList.toggle("is-on", scrollY > innerHeight);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (nav && navBtn) {
    const lbl = $(".nb-lbl", navBtn);
    const setNav = (open) => {
      nav.classList.toggle("is-open", open); navBtn.setAttribute("aria-expanded", String(open));
      if (lbl) lbl.textContent = open ? "إغلاق" : "القائمة";
      document.body.classList.toggle("nav-open", open);
    };
    navBtn.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
    $$("a", nav).forEach(a => a.addEventListener("click", () => setNav(false)));
    addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); navBtn.focus(); } });
    document.addEventListener("click", e => { if (nav.classList.contains("is-open") && !e.target.closest("#hd")) setNav(false); });
    const links = $$('a[href^="#"]', nav);
    const secIO = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle("is-on", l.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(l => { const s = $(l.getAttribute("href")); if (s) secIO.observe(s); });
  }

  /* ---------- reveals ---------- */
  const revIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sib = $$(".rv:not(.in)", e.target.parentElement);
    e.target.style.transitionDelay = reduce ? "0ms" : Math.min(Math.max(0, sib.indexOf(e.target)), 5) * 80 + "ms";
    e.target.classList.add("in"); revIO.unobserve(e.target);
  }), { rootMargin: "0px 0px -6% 0px", threshold: .05 });
  $$(".rv").forEach(el => revIO.observe(el));

  /* ---------- tabs helper ---------- */
  const tabs = (list, onSelect) => {
    const btns = $$('[role="tab"]', list);
    const select = (b, focus) => { btns.forEach(x => { const on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; }); if (focus) b.focus(); onSelect(b); };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", e => {
        let j = null;
        if (e.key === "ArrowLeft") j = (i + 1) % btns.length;
        if (e.key === "ArrowRight") j = (i - 1 + btns.length) % btns.length;
        if (e.key === "Home") j = 0; if (e.key === "End") j = btns.length - 1;
        if (j !== null) { e.preventDefault(); select(btns[j], true); }
      });
    });
  };

  /* ---------- layouts planner ---------- */
  const LAYS = {
    L: { name: "حرف L", desc: "خزائن على جدارين متجاورين، تترك وسط المطبخ مفتوحا للحركة أو لطاولة طعام صغيرة.",
      fit: "تكون المساحة متوسطة أو مربعة، أو المطبخ مفتوحا على الصالة من جهتين.",
      pro: "مثلث عمل قصير ومريح، وزاوية يمكن استغلالها بوحدة دوارة.",
      care: "تصميم وحدة الزاوية جيدا حتى لا تضيع مساحة التخزين فيها.",
      cabs: [[20,20,280,24],[20,20,24,200]], pts: { "ثلاجة":[40,190], "مغسلة":[160,40], "موقد":[40,100] } },
    U: { name: "حرف U", desc: "خزائن على ثلاثة جدران تحيط بمن يطبخ، مع أكبر مساحة أسطح وتخزين ممكنة.",
      fit: "يكون المطبخ مغلقا أو شبه مغلق، وعرضه يسمح بممر لا يقل عن متر وعشرين سنتيمترا تقريبا.",
      pro: "أكبر سعة تخزين وأسطح عمل، وكل شيء في متناول اليد.",
      care: "عرض الممر الأوسط، ووجود زاويتين تحتاجان حلولا مناسبة.",
      cabs: [[20,20,280,24],[20,20,24,200],[276,20,24,200]], pts: { "ثلاجة":[40,180], "مغسلة":[160,40], "موقد":[280,140] } },
    I: { name: "مع جزيرة", desc: "مخطط L أو مستقيم تضاف إليه جزيرة مستقلة للتحضير أو الجلسة أو المغسلة.",
      fit: "تكون المساحة واسعة ومفتوحة، وتريد مكانا للجلوس والتجمع في المطبخ نفسه.",
      pro: "يجمع العمل والضيافة، ويصبح المطبخ مركز البيت.",
      care: "ترك مسافة حركة كافية حول الجزيرة من كل الجهات، وتخطيط الكهرباء والسباكة لها مبكرا.",
      cabs: [[20,20,280,24],[20,20,24,200],[110,110,130,50,"island"]], pts: { "ثلاجة":[40,190], "موقد":[160,40], "مغسلة":[175,135] } },
    P: { name: "متوازي", desc: "صفان متقابلان من الخزائن بينهما ممر، ويستخدم كثيرا في المطابخ الاحترافية.",
      fit: "يكون المطبخ طويلا وضيقا نسبيا، أو بابه في أحد الطرفين.",
      pro: "حركة قصيرة جدا بين المغسلة والموقد، وكفاءة عالية في العمل.",
      care: "ألا يكون ممرا لعبور أهل البيت، وأن يكون عرضه مريحا لشخصين.",
      cabs: [[20,20,280,24],[20,196,280,24]], pts: { "ثلاجة":[60,40], "مغسلة":[220,40], "موقد":[150,205] } },
    S: { name: "مستقيم", desc: "كل الخزائن والأجهزة على جدار واحد، بتصميم نظيف يوفر المساحة.",
      fit: "تكون المساحة محدودة، أو يكون المطبخ جزءا من صالة مفتوحة أو ملحق.",
      pro: "أبسط تنفيذا وأقل تكلفة، ويترك باقي المساحة حرة.",
      care: "مسافات المشي على خط واحد، ونستعين غالبا بوحدات طولية لزيادة التخزين.",
      cabs: [[20,20,280,24]], pts: { "ثلاجة":[50,40], "مغسلة":[160,40], "موقد":[260,40] } }
  };
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const drawLay = (k) => {
    const L = LAYS[k], g = $("#lay-shapes"), d = $("#lay-dots");
    g.innerHTML = ""; d.innerHTML = "";
    L.cabs.forEach(([x, y, w, h, c]) => g.appendChild(svgEl("rect", { x, y, width: w, height: h, class: c || "" })));
    const P = Object.entries(L.pts);
    $("#lay-tri").setAttribute("d", "M" + P.map(([, p]) => p.join(" ")).join("L") + "Z");
    P.forEach(([label, [x, y]]) => {
      d.appendChild(svgEl("circle", { cx: x, cy: y, r: 5 }));
      const ty = y > 120 ? y - 12 : y + 20;
      const t = svgEl("text", { x, y: ty, "text-anchor": "middle" }); t.textContent = label; d.appendChild(t);
    });
    $("#lay-name").textContent = L.name; $("#lay-desc").textContent = L.desc;
    $("#lay-fit").textContent = L.fit; $("#lay-pro").textContent = L.pro; $("#lay-care").textContent = L.care;
    const info = $(".lay-info"); info.classList.remove("lay-anim"); void info.offsetWidth; info.classList.add("lay-anim");
  };
  tabs($(".lay-list"), b => drawLay(b.dataset.lay));
  drawLay("L");

  /* ---------- design studio ---------- */
  const FRONTS = {
    green:   { n: "أخضر عميق", fill: "#144131", dark: true,  contrast: "cream", splash: "#E9E4D8" },
    sage:    { n: "مريمي",     fill: "#8D9788", dark: false, contrast: "cream", splash: "#EFEBE1" },
    cream:   { n: "كريمي",     fill: "#ECE6D6", dark: false, contrast: "green", splash: "#DCD5C4" },
    white:   { n: "أبيض ثلجي", fill: "#F8F7F3", dark: false, contrast: "oak",   splash: "#E3DFD6" },
    charcoal:{ n: "فحمي",      fill: "#2B2E2C", dark: true,  contrast: "oak",   splash: "#D9D4C8" },
    oak:     { n: "بلوط",      fill: "url(#woodOak)",    dark: false, contrast: "cream", splash: "#EEEAE0" },
    walnut:  { n: "جوز",       fill: "url(#woodWalnut)", dark: true,  contrast: "cream", splash: "#E9E4D8" }
  };
  const TOPS = { quartz: ["كوارتز أبيض", "url(#mQuartz)"], calacatta: ["رخام كالاكاتا", "url(#mCalacatta)"], porcelain: ["بورسلان رمادي", "url(#mPorcelain)"], granite: ["جرانيت أسود", "url(#mGranite)"] };
  const HANDLES = { gold: ["مقابض ذهبية", "#B6A379"], black: ["مقابض سوداء", "#1D1F1E"], gola: ["مقابض مخفية", null] };
  const UPPERS = { same: "علوي بنفس اللون", contrast: "علوي بلون مكمل", glass: "علوي زجاجي مضاء", shelves: "رفوف مفتوحة" };
  const LAYN = { L: "حرف L", U: "حرف U", I: "مع جزيرة", P: "متوازي", S: "مستقيم" };

  const form = $("#studio-form"), K = $("#kitchen");
  const state = () => {
    const f = new FormData(form);
    return { front: f.get("front"), upper: f.get("upper"), top: f.get("top"), handle: f.get("handle"), led: f.get("led") === "on", hood: f.get("hood") === "on", layout: f.get("layout") };
  };
  // handle geometry: [x, y, w, h] per door/drawer
  const H_LOWER = [[160,322,4,34],[190,322,4,34],[368,316,40,4],[368,358,40,4],[368,400,40,4],[480,322,4,34]];
  const H_UPPER = [[156,160,4,30],[184,160,4,30],[488,160,4,30]];
  const H_TALL  = [[620,90,4,60],[620,350,4,60]];
  const H_MID   = [[386,148,8,4]];

  const render = () => {
    const s = state(), F = FRONTS[s.front];
    const upFill = s.upper === "contrast" ? FRONTS[F.contrast].fill : F.fill;
    $$("#k-lower .fr, #k-tall .fr", K).forEach(r => r.setAttribute("fill", F.fill));
    $$("#k-upper .fr", K).forEach(r => r.setAttribute("fill", upFill));
    $("#k-midcab").setAttribute("fill", upFill);
    $$("#k-shelves .sh", K).forEach(r => r.setAttribute("fill", s.front === "walnut" ? "url(#woodWalnut)" : "url(#woodOak)"));
    $("#tileBase").setAttribute("fill", F.splash);
    $("#k-counter").setAttribute("fill", TOPS[s.top][1]);

    const ups = $$("#k-upper .fr", K);
    $("#k-upper-glass").toggleAttribute("hidden", s.upper !== "glass");
    $("#k-shelves").toggleAttribute("hidden", s.upper !== "shelves");
    ups[0].style.display = ups[1].style.display = s.upper === "shelves" ? "none" : "";

    $("#k-hood").style.display = s.hood ? "" : "none";
    $("#k-midcab").toggleAttribute("hidden", s.hood);

    const glow = s.led || s.upper === "glass";
    $("#k-led").setAttribute("opacity", s.led ? ".75" : "0");
    $("#k-led-bar").setAttribute("opacity", s.led ? "1" : "0");
    $("#k-upper-glass").querySelectorAll("rect").forEach((r, i) => { if (i < 2) r.setAttribute("fill", glow ? "rgba(255,236,190,.55)" : "rgba(255,250,235,.35)"); });

    const hg = $("#k-handles"); hg.innerHTML = "";
    const hc = HANDLES[s.handle][1];
    $("#k-gola").toggleAttribute("hidden", !!hc);
    if (hc) {
      let list = [...H_LOWER, ...H_TALL];
      if (s.upper !== "shelves") list.push(H_UPPER[0], H_UPPER[1]);
      list.push(H_UPPER[2]);
      if (!s.hood) list.push(H_MID[0]);
      list.forEach(([x, y, w, h]) => hg.appendChild(svgEl("rect", { x, y, width: w, height: h, rx: 1.5, fill: hc })));
    }
    $("#stage-tag").textContent = `${F.n} · ${TOPS[s.top][0]} · ${HANDLES[s.handle][0]}${s.led ? " · إضاءة LED" : ""}`;
  };
  form.addEventListener("change", render);
  render();

  const designSummary = () => {
    const s = state();
    return [
      `• المخطط: ${LAYN[s.layout]}`,
      `• لون الواجهات: ${FRONTS[s.front].n}`,
      `• الوحدات العلوية: ${UPPERS[s.upper]}`,
      `• السطح: ${TOPS[s.top][0]}`,
      `• المقابض: ${HANDLES[s.handle][0]}`,
      `• إضاءة LED: ${s.led ? "نعم" : "لا"}`,
      `• الشفاط: ${s.hood ? "ظاهر" : "مخفي / مدمج"}`
    ].join("\n");
  };

  const COMBOS = [
    { front: "green", upper: "glass", top: "calacatta", handle: "gold", led: true, hood: true },
    { front: "oak", upper: "same", top: "porcelain", handle: "gola", led: true, hood: false },
    { front: "charcoal", upper: "contrast", top: "quartz", handle: "black", led: true, hood: true },
    { front: "sage", upper: "shelves", top: "quartz", handle: "gold", led: false, hood: true },
    { front: "cream", upper: "contrast", top: "calacatta", handle: "gold", led: true, hood: true },
    { front: "walnut", upper: "same", top: "granite", handle: "gola", led: true, hood: false },
    { front: "white", upper: "contrast", top: "porcelain", handle: "black", led: true, hood: true }
  ];
  let combo = 0;
  $("#shuffle").addEventListener("click", () => {
    combo = (combo + 1) % COMBOS.length; const c = COMBOS[combo];
    ["front", "upper", "top", "handle"].forEach(n => { form.querySelector(`input[name="${n}"][value="${c[n]}"]`).checked = true; });
    form.querySelector('input[name="led"]').checked = c.led; form.querySelector('input[name="hood"]').checked = c.hood;
    render();
  });

  $("#send-design").addEventListener("click", () => {
    const w = $('#wizard input[name="w_design"]'); if (w) w.checked = true;
    toast("أرفقنا تصميمك بطلب عرض السعر. أكمل الخطوات لإرساله.");
    goTo("#request");
  });





  /* ---------- share a studio design by link ---------- */
  const studioForm = $("#studio-form");
  const KEYS = ["front", "upper", "top", "handle", "layout"];
  const encodeDesign = () => { const s = state(); return [...KEYS.map(k => s[k]), s.led ? 1 : 0, s.hood ? 1 : 0].join("."); };
  const applyDesign = (code) => {
    const p = String(code).split("."); if (p.length !== 7) return false;
    let ok = true;
    KEYS.forEach((k, i) => { const inp = studioForm.querySelector(`input[name="${k}"][value="${p[i]}"]`); if (inp) inp.checked = true; else ok = false; });
    studioForm.querySelector('input[name="led"]').checked = p[5] === "1";
    studioForm.querySelector('input[name="hood"]').checked = p[6] === "1";
    render(); return ok;
  };
  if (studioForm) {
    const d = new URLSearchParams(location.search).get("d");
    if (d && applyDesign(d)) setTimeout(() => { goTo("#studio"); toast("تم فتح التصميم المشارك معك."); }, 400);
    const shareBtn = $("#share-design");
    if (shareBtn) shareBtn.addEventListener("click", async () => {
      const url = `${location.origin}${location.pathname}?d=${encodeDesign()}#studio`;
      if (navigator.share && matchMedia("(pointer: coarse)").matches) { try { await navigator.share({ title: "تصميم مطبخي من فيوتشر كيت", url }); return; } catch (_) {} }
      toast(await copy(url) ? "تم نسخ رابط التصميم، يمكنك مشاركته مع أي شخص." : url, 6000);
    });
  }

  /* ---------- favourites ---------- */
  let favs = store.get("fk-favs", []);
  const favCount = $$(".fav-count");
  const syncFavs = () => {
    $$(".fav").forEach(b => { const on = favs.includes(b.dataset.id); b.setAttribute("aria-pressed", on); b.classList.toggle("is-on", on); });
    favCount.forEach(c => c.textContent = favs.length);
    const lbl = $("#w-favs-n"); if (lbl) lbl.textContent = favs.length;
  };
  $$(".fav").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id;
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    store.set("fk-favs", favs); syncFavs();
    toast(favs.includes(id) ? "أضيفت الصورة إلى المحفوظات، وسترفق مع طلبك." : "أزيلت الصورة من المحفوظات.");
  }));
  const favCaptions = () => favs.map(id => { const b = $(`.fav[data-id="${id}"]`); return b ? b.dataset.cap : null; }).filter(Boolean);
  syncFavs();

  /* ---------- wall length calculator ---------- */
  const mIn = $$(".m-in"), mOut = $("#m-total");
  const measure = () => {
    const vals = mIn.map(i => Math.max(0, parseFloat(String(i.value).replace(",", ".")) || 0));
    const total = vals.reduce((a, b) => a + b, 0);
    if (mOut) mOut.textContent = total ? total.toFixed(2).replace(/\.00$/, "") + " م" : "0 م";
    return { total, vals };
  };
  mIn.forEach(i => i.addEventListener("input", measure)); measure();

  /* ---------- quote wizard ---------- */
  const wz = $("#wizard");
  if (wz) {
    const steps = $$(".wz-step", wz), bar = $("#wz-bar"), cnt = $("#wz-count"), back = $("#wz-back"), next = $("#wz-next"), submit = $("#wz-submit"), st = $("#wz-status");
    let i = 0;
    const dateIn = $('input[name="w_date"]', wz);
    if (dateIn) { const t = new Date(); t.setDate(t.getDate() + 1); dateIn.min = t.toISOString().slice(0, 10); }
    const show = (n, focus) => {
      i = n; steps.forEach((s, k) => { s.hidden = k !== i; });
      bar.style.transform = `scaleX(${(i + 1) / steps.length})`;
      cnt.textContent = `الخطوة ${i + 1} من ${steps.length}`;
      back.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
      st.textContent = ""; st.className = "wz-status";
      if (focus) { const lg = $("legend, h3", steps[i]); if (lg) { lg.tabIndex = -1; lg.focus({ preventScroll: true }); } wz.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); }
    };
    const val = (n) => { const el = wz.querySelector(`input[name="${n}"]:checked`); return el ? el.value : ""; };
    const need = { 0: ["w_type"], 1: ["w_style"], 3: ["w_budget", "w_time"] };
    const check = () => {
      const miss = (need[i] || []).filter(n => !val(n));
      if (miss.length) { st.className = "wz-status err"; st.textContent = "يرجى اختيار إجابة للمتابعة."; return false; }
      return true;
    };
    next.addEventListener("click", () => { if (check()) show(i + 1, true); });
    back.addEventListener("click", () => show(i - 1, true));
    wz.addEventListener("change", () => { if (st.classList.contains("err")) { st.textContent = ""; st.className = "wz-status"; } });
    const phoneRe = /^(\+?966|0)?5\d{8}$/;
    wz.addEventListener("submit", async e => {
      e.preventDefault();
      const f = wz.elements, nm = f.namedItem("w_name"), ph = f.namedItem("w_phone");
      const name = nm.value.trim(), phone = ph.value.replace(/[\s-]/g, "");
      nm.setAttribute("aria-invalid", !name); ph.setAttribute("aria-invalid", !phoneRe.test(phone));
      if (!name) { st.className = "wz-status err"; st.textContent = "يرجى كتابة الاسم."; nm.focus(); return; }
      if (!phoneRe.test(phone)) { st.className = "wz-status err"; st.textContent = "رقم الجوال غير صحيح. مثال: 05XXXXXXXX"; ph.focus(); return; }
      const m = measure();
      const lines = [
        "طلب عرض سعر | فيوتشر كيت",
        `الاسم: ${name}`, `الجوال: ${phone}`,
        f.namedItem("w_district").value.trim() && `الحي: ${f.namedItem("w_district").value.trim()}`,
        `نوع المشروع: ${val("w_type")}`, `الأسلوب: ${val("w_style")}`,
        m.total ? `أطوال الجدران: ${m.vals.filter(Boolean).join(" + ")} = ${m.total.toFixed(2)} م` : "",
        `الميزانية التقريبية: ${val("w_budget")}`, `موعد التنفيذ المطلوب: ${val("w_time")}`,
        f.namedItem("w_date").value && `اليوم المفضل للزيارة: ${f.namedItem("w_date").value}`,
        val("w_slot") && `الوقت المفضل: ${val("w_slot")}`,
        f.namedItem("w_msg").value.trim() && `ملاحظات: ${f.namedItem("w_msg").value.trim()}`,
        f.namedItem("w_design").checked && studioForm && `\nاختيارات استوديو التصميم:\n${designSummary()}\nرابط التصميم: ${location.origin}${location.pathname}?d=${encodeDesign()}#studio`,
        f.namedItem("w_favs").checked && favs.length && `\nصور محفوظة أعجبتني:\n${favCaptions().map(c => "• " + c).join("\n")}`
      ].filter(Boolean).join("\n");
      st.className = "wz-status"; st.textContent = "جار تجهيز الطلب";
      const r = await sendMessage(lines);
      st.textContent = r === "sent" ? "تم فتح واتساب والرسالة جاهزة، اضغط إرسال لإتمام الطلب." : "تم تجهيز طلبك ونسخه، وسيفعل الإرسال المباشر عبر واتساب فور إضافة رقم التواصل.";
    });
    show(0, false);
  }

  /* ---------- gallery filter + lightbox ---------- */
  const tiles = $$(".g");
  $$(".g-filter button").forEach(b => b.addEventListener("click", () => {
    $$(".g-filter button").forEach(x => x.setAttribute("aria-pressed", x === b));
    const f = b.dataset.f;
    tiles.forEach(t => { t.hidden = !(f === "all" || (f === "fav" ? favs.includes($(".fav", t)?.dataset.id) : t.dataset.cat === f)); });
  }));
  const lb = $("#lb");
  if (lb && tiles.length) {
    const lbImg = $("img", lb), lbCap = $("figcaption", lb);
    let cur = 0, lastFocus = null;
    const vis = () => tiles.filter(t => !t.hidden);
    const show = n => { const v = vis(); cur = (n + v.length) % v.length; const t = v[cur]; lbImg.src = $(".g-open", t).dataset.full; lbImg.alt = $("img", t).alt; lbCap.textContent = $("figcaption", t).textContent; };
    const open = t => { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = "hidden"; show(vis().indexOf(t)); $(".lb-x", lb).focus(); };
    const close = () => { lb.hidden = true; document.body.style.overflow = ""; lbImg.src = ""; if (lastFocus) lastFocus.focus(); };
    tiles.forEach(t => $(".g-open", t).addEventListener("click", () => open(t)));
    $(".lb-x", lb).addEventListener("click", close);
    $(".lb-n", lb).addEventListener("click", () => show(cur + 1));
    $(".lb-p", lb).addEventListener("click", () => show(cur - 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur + 1);
      if (e.key === "ArrowRight") show(cur - 1);
      if (e.key === "Tab") { const f = $$("button", lb); const k = f.indexOf(document.activeElement); if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
  }

  /* ---------- services list with swapping image ---------- */
  const svxImg = $("#svx-img");
  if (svxImg) {
    const rows = $$(".svx-row[data-img]");
    rows.forEach(r => {
      const on = () => { svxImg.src = `../assets/img/${r.dataset.img}-sm.webp`; rows.forEach(x => x.classList.toggle("is-on", x === r)); };
      r.addEventListener("mouseenter", on); r.addEventListener("focus", on); r.addEventListener("click", on);
    });
  }

  /* ---------- generic tab groups ---------- */
  $$("[data-tabs]").forEach(list => tabs(list, b => {
    $$('[role="tab"]', list).forEach(t => { const p = document.getElementById(t.getAttribute("aria-controls")); if (p) p.hidden = t !== b; });
  }));

  /* ---------- printable checklist ---------- */
  const pr = $("#print-checklist");
  if (pr) pr.addEventListener("click", () => { document.body.classList.add("print-checklist"); window.print(); setTimeout(() => document.body.classList.remove("print-checklist"), 500); });
})();
