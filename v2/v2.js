/* FUTURE KIT · v2 */
(() => {
  "use strict";

  /* ============================================================
     بيانات التواصل: عدلها هنا فقط، وتنعكس على الموقع كله.
     whatsapp بالصيغة الدولية بدون + أو مسافات، مثال: "9665XXXXXXXX"
     ============================================================ */
  const CONFIG = { whatsapp: "", phone: "", address: "", hours: "" };
  const PENDING = "يضاف قريبا";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const hasGsap = () => window.gsap && window.ScrollTrigger;

  /* ---------- config ---------- */
  $$(".cfg").forEach(el => {
    const v = CONFIG[el.dataset.cfg];
    if (v) {
      if (el.dataset.cfg === "whatsapp") el.innerHTML = `<a href="https://wa.me/${v}" target="_blank" rel="noopener">+${v}</a>`;
      else if (el.dataset.cfg === "phone") el.innerHTML = `<a href="tel:${v.replace(/\s/g, "")}">${v}</a>`;
      else el.textContent = v;
    } else { el.textContent = PENDING; el.classList.add("is-pending"); el.removeAttribute("dir"); }
  });
  $("#yr").textContent = new Date().getFullYear();

  /* ---------- toast + send ---------- */
  const toastEl = $("#toast"); let toastT;
  const toast = (m, ms = 4000) => { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-on"), ms); };
  const sendMessage = async (text) => {
    if (CONFIG.whatsapp) { window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener"); return "sent"; }
    try { await Promise.race([navigator.clipboard.writeText(text), new Promise(r => setTimeout(r, 700))]); } catch (_) {}
    return "copied";
  };

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  const hdH = () => $("#hd").offsetHeight;
  const goTo = (target) => {
    const el = typeof target === "string" ? $(target) : target; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === "top" ? 0 : -hdH() + 1, duration: 1.6 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - (el.id === "top" ? 0 : hdH()), behavior: reduce ? "auto" : "smooth" });
  };
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href"); if (id.length < 2 || !$(id)) return;
    e.preventDefault(); closeMenu(); goTo(id);
    if (id !== "#top") history.replaceState(null, "", id);
  });

  /* ---------- header + fab ---------- */
  const hd = $("#hd"), fab = $("#fab");
  let lastY = 0;
  const onScroll = (y = scrollY) => {
    hd.classList.toggle("is-solid", y > 60);
    if (!document.body.classList.contains("menu-open")) hd.classList.toggle("is-hidden", y > 900 && y > lastY + 3);
    if (y < lastY - 3) hd.classList.remove("is-hidden");
    fab.classList.toggle("is-on", y > innerHeight);
    lastY = y;
  };
  addEventListener("scroll", () => onScroll(), { passive: true });
  if (CONFIG.whatsapp) { fab.href = `https://wa.me/${CONFIG.whatsapp}`; fab.target = "_blank"; fab.rel = "noopener"; }

  const navLinks = $$(".hd-nav a");
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle("is-on", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach(l => { const s = $(l.getAttribute("href")); if (s) secIO.observe(s); });

  /* ---------- menu ---------- */
  const menu = $("#menu"), mBtn = $("#menu-btn"), mImg = $("#menu-img");
  function openMenu() {
    menu.hidden = false; requestAnimationFrame(() => menu.classList.add("is-open"));
    document.body.classList.add("menu-open"); mBtn.setAttribute("aria-expanded", "true"); $(".menu-lbl").textContent = "إغلاق";
    hd.classList.remove("is-hidden"); lenis && lenis.stop();
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.classList.remove("is-open"); document.body.classList.remove("menu-open");
    mBtn.setAttribute("aria-expanded", "false"); $(".menu-lbl").textContent = "القائمة";
    lenis && lenis.start(); setTimeout(() => { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 900);
  }
  mBtn.addEventListener("click", () => menu.classList.contains("is-open") ? closeMenu() : openMenu());
  $$(".menu-nav a").forEach(a => a.addEventListener("mouseenter", () => { mImg.src = `../assets/img/${a.dataset.img}-sm.webp`; }));
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ---------- reveals ---------- */
  const revIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sib = $$(".rv:not(.in)", e.target.parentElement);
    e.target.style.transitionDelay = reduce ? "0ms" : Math.min(Math.max(0, sib.indexOf(e.target)), 5) * 90 + "ms";
    e.target.classList.add("in"); revIO.unobserve(e.target);
  }), { rootMargin: "0px 0px -10% 0px", threshold: .05 });
  const armReveals = () => $$(".rv,.rv-m").filter(el => !el.closest(".hero")).forEach(el => revIO.observe(el));

  /* ---------- hero ---------- */
  const slides = $$(".hs"), caps = ["مجموعة الأخضر العميق", "مجموعة المودرن الرخامي", "مجموعة الداكن الفاخر"];
  let si = 0, sTimer;
  const prog = $("#hs-prog");
  const runProg = () => {
    prog.style.transition = "none"; prog.style.transform = "scaleX(0)";
    requestAnimationFrame(() => requestAnimationFrame(() => { prog.style.transition = "transform 6.5s linear"; prog.style.transform = "scaleX(1)"; }));
  };
  const go = (i) => {
    slides[si].classList.remove("is-on"); si = (i + slides.length) % slides.length; slides[si].classList.add("is-on");
    $("#hs-n").textContent = String(si + 1).padStart(2, "0"); $("#hs-cap").textContent = caps[si]; runProg();
  };
  const startHero = () => {
    $(".hero-t").classList.add("in"); $$(".hero .rv").forEach((el, i) => { el.style.transitionDelay = 250 + i * 140 + "ms"; el.classList.add("in"); });
    if (!reduce) { runProg(); sTimer = setInterval(() => go(si + 1), 6500); }
  };
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearInterval(sTimer); else if (!reduce) { clearInterval(sTimer); sTimer = setInterval(() => go(si + 1), 6500); } });

  /* ---------- statement words ---------- */
  const st = $(".statement");
  st.innerHTML = st.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");

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

  $("#send-design").addEventListener("click", async () => {
    const msg = `مرحبا فيوتشر كيت، صممت واجهة مطبخ في موقعكم وأرغب في عرض سعر:\n${designSummary()}`;
    const r = await sendMessage(msg);
    if (r === "copied") toast("تم نسخ اختياراتك. أكمل بياناتك في نموذج التواصل لإرسال الطلب.");
    goTo("#contact");
    setTimeout(() => $('#contact-form input[name="name"]').focus({ preventScroll: true }), 700);
  });



  /* ---------- services hover image ---------- */
  const fl = $("#sv-float"), flImg = $("img", fl);
  let fx = 0, fy = 0, tx = 0, ty = 0, flOn = false;
  if (fine && innerWidth > 1023) {
    $$(".sv").forEach(r => {
      r.addEventListener("mouseenter", () => { flImg.src = `../assets/img/${r.dataset.img}-sm.webp`; fl.classList.add("is-on"); flOn = true; });
      r.addEventListener("mouseleave", () => { fl.classList.remove("is-on"); flOn = false; });
    });
  }

  /* ---------- cursor ---------- */
  const cur = $("#cursor");
  let cx = -100, cy = -100, kx = -100, ky = -100;
  if (fine) {
    addEventListener("pointermove", e => { cx = e.clientX; cy = e.clientY; tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.addEventListener("pointerover", e => {
      const view = e.target.closest(".g button, .cc-img");
      const link = !view && e.target.closest("a, button, label, summary, select");
      cur.classList.toggle("is-view", !!view); cur.classList.toggle("is-link", !!link);
    });
  }
  const loop = () => {
    kx += (cx - kx) * .2; ky += (cy - ky) * .2;
    if (fine) cur.style.transform = `translate3d(${kx}px,${ky}px,0)`;
    if (flOn) { fx += (tx - fx) * .12; fy += (ty - fy) * .12; fl.style.transform = `translate3d(${fx - 150}px,${fy - 190}px,0) scale(1)`; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- process (fallback marker) ---------- */
  const prIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("is-on", e.isIntersecting || e.boundingClientRect.top < 0)), { rootMargin: "0px 0px -45% 0px" });
  $$(".pr").forEach(p => prIO.observe(p));

  /* ---------- gallery lightbox ---------- */
  const tiles = $$(".g"), lb = $("#lb"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let cur2 = 0, lastFocus = null;
  const show = i => { cur2 = (i + tiles.length) % tiles.length; const t = tiles[cur2]; lbImg.src = $("button", t).dataset.full; lbImg.alt = $("img", t).alt; lbCap.textContent = $("figcaption", t).textContent; };
  const openLb = i => { lastFocus = document.activeElement; lb.hidden = false; lenis && lenis.stop(); document.body.style.overflow = "hidden"; show(i); $(".lb-x").focus(); };
  const closeLb = () => { lb.hidden = true; lenis && lenis.start(); document.body.style.overflow = ""; lbImg.src = ""; lastFocus && lastFocus.focus(); };
  tiles.forEach((t, i) => $("button", t).addEventListener("click", () => openLb(i)));
  $(".lb-x").addEventListener("click", closeLb);
  $(".lb-n").addEventListener("click", () => show(cur2 + 1));
  $(".lb-p").addEventListener("click", () => show(cur2 - 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(cur2 + 1);
    if (e.key === "ArrowRight") show(cur2 - 1);
    if (e.key === "Tab") { const f = $$("button", lb); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });

  /* ---------- contact form ---------- */
  const cfForm = $("#contact-form"), stEl = $("#f-status"), cf = cfForm.elements;
  const phoneRe = /^(\+?966|0)?5\d{8}$/;
  cfForm.addEventListener("submit", async e => {
    e.preventDefault();
    const nm = cf.namedItem("name"), name = nm.value.trim(), phone = cf.phone.value.replace(/[\s-]/g, "");
    nm.setAttribute("aria-invalid", !name); cf.phone.setAttribute("aria-invalid", !phoneRe.test(phone));
    if (!name) { stEl.className = "f-status err"; stEl.textContent = "اكتب اسمك من فضلك."; nm.focus(); return; }
    if (!phoneRe.test(phone)) { stEl.className = "f-status err"; stEl.textContent = "رقم الجوال غير صحيح. مثال: 05XXXXXXXX"; cf.phone.focus(); return; }
    const lines = [
      "طلب زيارة قياس | فيوتشر كيت", `الاسم: ${name}`, `الجوال: ${phone}`,
      cf.district.value.trim() && `الحي: ${cf.district.value.trim()}`,
      `نوع المشروع: ${cf.type.value}`,
      cf.msg.value.trim() && `التفاصيل: ${cf.msg.value.trim()}`,
      cf.attach.checked && `\nاختياراتي من استوديو التصميم:\n${designSummary()}`
    ].filter(Boolean).join("\n");
    stEl.className = "f-status"; stEl.textContent = "جار تجهيز الطلب";
    const r = await sendMessage(lines);
    stEl.textContent = r === "sent" ? "تم فتح واتساب ورسالتك جاهزة، اضغط إرسال لإتمام الطلب." : "تم تجهيز طلبك ونسخه. سيفعل الإرسال المباشر عبر واتساب فور إضافة رقم التواصل.";
  });

  /* ---------- GSAP motion ---------- */
  const initMotion = () => {
    if (!hasGsap() || reduce) { $$(".statement .w").forEach(w => w.style.opacity = 1); $("#proc-fill") && ($("#proc-fill").style.transform = "scaleY(1)"); return; }
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on("scroll", ({ scroll }) => { ScrollTrigger.update(); onScroll(scroll); });
      gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    }
    // statement word scrub
    gsap.to(".statement .w", { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: ".statement", start: "top 78%", end: "bottom 45%", scrub: true } });
    // hero parallax
    gsap.to(".hero-c", { yPercent: 22, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    // collections horizontal (desktop)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const track = $("#coll-track");
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: () => dist(), ease: "none", scrollTrigger: { trigger: ".coll-pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => { $("#coll-prog").style.transform = `scaleX(${s.progress})`; } } });
      $$(".cc-img img").forEach(img => gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: ".coll-pin", start: "top top", end: () => "+=" + dist(), scrub: true } }));
    });
    // process line
    gsap.to("#proc-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#proc-l", start: "top 60%", end: "bottom 60%", scrub: true } });
    // gallery parallax
    $$(".g-in").forEach(el => gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.closest(".g"), start: "top bottom", end: "bottom top", scrub: true } }));
    // band parallax
    gsap.fromTo(".band-img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true } });
    // materials swatches subtle lift
    $$(".mt-sw").forEach(el => gsap.fromTo(el, { clipPath: "inset(18% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "power2.out", duration: 1.4, scrollTrigger: { trigger: el, start: "top 88%" } }));
    addEventListener("load", () => ScrollTrigger.refresh());
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  };

  /* ---------- boot ---------- */
  const loader = $("#loader");
  const seen = (() => { try { return sessionStorage.getItem("fk-v2-seen"); } catch (_) { return null; } })();
  const finish = () => {
    if (loader.classList.contains("is-done")) return;
    loader.classList.add("is-done"); try { sessionStorage.setItem("fk-v2-seen", "1"); } catch (_) {}
    setTimeout(() => loader.remove(), 1200);
    startHero(); armReveals();
  };
  const boot = () => {
    initMotion(); onScroll();
    if (location.hash && $(location.hash)) setTimeout(() => goTo(location.hash), 60);
    const min = seen || reduce ? 150 : 1500;
    const t0 = performance.now();
    const done = () => setTimeout(finish, Math.max(0, min - (performance.now() - t0)));
    if (document.readyState === "complete") done(); else { addEventListener("load", done, { once: true }); setTimeout(finish, 4000); }
  };
  boot();
})();
