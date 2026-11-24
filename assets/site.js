/* FUTURE KIT — site behaviour */
(() => {
  "use strict";

  /* ============================================================
     بيانات التواصل — عدّلها هنا فقط، وتنعكس على الموقع كله.
     whatsapp: بالصيغة الدولية بدون + أو مسافات، مثال: "9665XXXXXXXX"
     ============================================================ */
  const CONFIG = {
    whatsapp: "",   // مثال: "9665XXXXXXXX"
    phone: "",      // مثال: "+966 5X XXX XXXX"
    address: "",    // مثال: "طريق الملك عبدالعزيز، حي ...، الرياض"
    hours: ""       // مثال: "السبت – الخميس · 4 م – 10 م"
  };
  const PENDING = "يُضاف قريباً";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- config placeholders ---------- */
  $$(".cfg").forEach(el => {
    const v = CONFIG[el.dataset.cfg];
    if (v) {
      if (el.dataset.cfg === "whatsapp") el.innerHTML = `<a href="https://wa.me/${v}" target="_blank" rel="noopener">+${v}</a>`;
      else if (el.dataset.cfg === "phone") el.innerHTML = `<a href="tel:${v.replace(/\s/g, "")}">${v}</a>`;
      else el.textContent = v;
    } else { el.textContent = PENDING; el.classList.add("is-pending"); el.removeAttribute("dir"); }
  });
  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- toast ---------- */
  const toastEl = $("#toast"); let toastT;
  const toast = (msg, ms = 3800) => {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-on"), ms);
  };

  /* ---------- send via WhatsApp (or copy when no number yet) ---------- */
  const sendMessage = async (text) => {
    if (CONFIG.whatsapp) {
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return "sent";
    }
    try { await Promise.race([navigator.clipboard.writeText(text), new Promise(r => setTimeout(r, 700))]); } catch (_) {}
    return "copied";
  };

  /* ---------- header ---------- */
  const head = $(".site-head"), burger = $("#burger"), nav = $("#nav"), fab = $("#wa-fab");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    head.classList.toggle("is-solid", y > 40);
    const menuOpen = nav.classList.contains("is-open");
    head.classList.toggle("is-hidden", !menuOpen && y > 700 && y > lastY + 4);
    if (y < lastY - 4) head.classList.remove("is-hidden");
    fab.classList.toggle("is-on", y > innerHeight * .8);
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open); head.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  if (CONFIG.whatsapp) { fab.href = `https://wa.me/${CONFIG.whatsapp}`; fab.target = "_blank"; fab.rel = "noopener"; }

  /* active nav link */
  const links = $$('.nav a[href^="#"]:not(.nav-cta)');
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(l => { const s = $(l.getAttribute("href")); if (s) secIO.observe(s); });

  /* ---------- reveal ---------- */
  const revIO = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = $$(".reveal:not(.in)", e.target.parentElement);
      const i = Math.max(0, sibs.indexOf(e.target));
      e.target.style.transitionDelay = reduce ? "0ms" : Math.min(i, 6) * 80 + "ms";
      e.target.classList.add("in"); revIO.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  $$(".reveal").forEach(el => revIO.observe(el));

  /* ---------- generic tabs (roving) ---------- */
  const tabs = (list, onSelect) => {
    const btns = $$('[role="tab"]', list);
    const select = (b, focus) => {
      btns.forEach(x => { const on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
      if (focus) b.focus();
      onSelect(b);
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", e => {
        const vertical = getComputedStyle(list).flexDirection === "column";
        const next = vertical ? "ArrowDown" : "ArrowLeft", prev = vertical ? "ArrowUp" : "ArrowRight";
        let j = null;
        if (e.key === next) j = (i + 1) % btns.length;
        if (e.key === prev) j = (i - 1 + btns.length) % btns.length;
        if (e.key === "Home") j = 0; if (e.key === "End") j = btns.length - 1;
        if (j !== null) { e.preventDefault(); select(btns[j], true); }
      });
    });
  };

  /* styles */
  tabs($(".style-tabs"), b => {
    $$(".style-panel").forEach(p => { const on = p.id === b.getAttribute("aria-controls"); p.hidden = !on; p.classList.toggle("is-on", on); });
  });

  /* ---------- layouts planner ---------- */
  const LAYS = {
    L: { name: "حرف L", desc: "خزائن على جدارين متجاورين، تترك وسط المطبخ مفتوحاً للحركة أو لطاولة طعام صغيرة.",
      fit: "تكون المساحة متوسطة أو مربعة، أو المطبخ مفتوحاً على الصالة من جهتين.",
      pro: "مثلث عمل قصير ومريح، وزاوية يمكن استغلالها بوحدة دوّارة.",
      care: "تصميم وحدة الزاوية جيداً حتى لا تضيع مساحة التخزين فيها.",
      cabs: [[20,20,280,24],[20,20,24,200]], pts: { "ثلاجة":[40,190], "مغسلة":[160,40], "موقد":[40,100] } },
    U: { name: "حرف U", desc: "خزائن على ثلاثة جدران تحيط بمن يطبخ، مع أكبر مساحة أسطح وتخزين ممكنة.",
      fit: "يكون المطبخ مغلقاً أو شبه مغلق، وعرضه يسمح بممر لا يقل عن متر وعشرين سنتيمتراً تقريباً.",
      pro: "أكبر سعة تخزين وأسطح عمل، وكل شيء في متناول اليد.",
      care: "عرض الممر الأوسط، ووجود زاويتين تحتاجان حلولاً ذكية.",
      cabs: [[20,20,280,24],[20,20,24,200],[276,20,24,200]], pts: { "ثلاجة":[40,180], "مغسلة":[160,40], "موقد":[280,140] } },
    I: { name: "مع جزيرة", desc: "مخطط L أو مستقيم تضاف إليه جزيرة مستقلة للتحضير أو الجلسة أو المغسلة.",
      fit: "تكون المساحة واسعة ومفتوحة، وتريد مكاناً للجلوس والتجمع في المطبخ نفسه.",
      pro: "يجمع العمل والضيافة، ويصبح المطبخ مركز البيت.",
      care: "ترك مسافة حركة كافية حول الجزيرة من كل الجهات، وتخطيط الكهرباء والسباكة لها مبكراً.",
      cabs: [[20,20,280,24],[20,20,24,200],[110,110,130,50,"island"]], pts: { "ثلاجة":[40,190], "موقد":[160,40], "مغسلة":[175,135] } },
    P: { name: "متوازي", desc: "صفّان متقابلان من الخزائن بينهما ممر، وهو مخطط المطابخ الاحترافية.",
      fit: "يكون المطبخ طويلاً وضيقاً نسبياً، أو بابه في أحد الطرفين.",
      pro: "حركة قصيرة جداً بين المغسلة والموقد، وكفاءة عالية في العمل.",
      care: "ألا يكون ممراً لعبور أهل البيت، وأن يكون عرضه مريحاً لشخصين.",
      cabs: [[20,20,280,24],[20,196,280,24]], pts: { "ثلاجة":[60,40], "مغسلة":[220,40], "موقد":[150,205] } },
    S: { name: "مستقيم", desc: "كل الخزائن والأجهزة على جدار واحد، بتصميم نظيف يوفر المساحة.",
      fit: "تكون المساحة محدودة، أو يكون المطبخ جزءاً من صالة مفتوحة أو ملحق.",
      pro: "أبسط تنفيذاً وأقل تكلفة، ويترك باقي المساحة حرة.",
      care: "مسافات المشي على خط واحد، ونستعين غالباً بوحدات طولية لزيادة التخزين.",
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
  const UPPERS = { same: "علوي بنفس اللون", contrast: "علوي بلون مكمّل", glass: "علوي زجاجي مضاء", shelves: "رفوف مفتوحة" };
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
    const msg = `مرحباً فيوتشر كيت، صممت واجهة مطبخ في موقعكم وأرغب في عرض سعر:\n${designSummary()}`;
    const r = await sendMessage(msg);
    if (r === "copied") toast("نسخنا اختياراتك. أكمل بياناتك في نموذج التواصل لإرسال الطلب.");
    $("#contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(() => $('#contact-form input[name="name"]').focus({ preventScroll: true }), 700);
  });

  /* ---------- contact form ---------- */
  const cfForm = $("#contact-form"), st = $("#f-status"), cf = cfForm.elements;
  cfForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = cf.namedItem("name").value.trim(), phone = cf.phone.value.replace(/[\s-]/g, "");
    cf.namedItem("name").setAttribute("aria-invalid", !name); cf.phone.setAttribute("aria-invalid", !/^(\+?966|0)?5\d{8}$/.test(phone));
    if (!name) { st.className = "f-status err"; st.textContent = "اكتب اسمك من فضلك."; cf.namedItem("name").focus(); return; }
    if (!/^(\+?966|0)?5\d{8}$/.test(phone)) { st.className = "f-status err"; st.textContent = "رقم الجوال غير صحيح. مثال: 05XXXXXXXX"; cf.phone.focus(); return; }
    const lines = [
      "طلب زيارة قياس — فيوتشر كيت",
      `الاسم: ${name}`, `الجوال: ${phone}`,
      cf.district.value.trim() && `الحي: ${cf.district.value.trim()}`,
      `نوع المشروع: ${cf.type.value}`,
      cf.msg.value.trim() && `التفاصيل: ${cf.msg.value.trim()}`,
      cf.attach.checked && `\nاختياراتي من استوديو التصميم:\n${designSummary()}`
    ].filter(Boolean).join("\n");
    const r = await sendMessage(lines);
    st.className = "f-status";
    st.textContent = r === "sent" ? "فتحنا واتساب برسالتك جاهزة، اضغط إرسال لإتمام الطلب." : "تم تجهيز طلبك ونسخه. سيُفعَّل الإرسال المباشر عبر واتساب فور إضافة رقم التواصل.";
  });

  /* ---------- gallery filter + lightbox ---------- */
  const tiles = $$(".tile");
  $$(".filters button").forEach(b => b.addEventListener("click", () => {
    $$(".filters button").forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b); });
    tiles.forEach(t => t.classList.toggle("is-out", b.dataset.f !== "all" && t.dataset.cat !== b.dataset.f));
  }));
  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let cur = 0, lastFocus = null;
  const visible = () => tiles.filter(t => !t.classList.contains("is-out"));
  const show = (i) => {
    const v = visible(); cur = (i + v.length) % v.length; const t = v[cur];
    const im = $("img", t);
    lbImg.src = $("button", t).dataset.full; lbImg.alt = im.alt; lbCap.textContent = $("figcaption", t).textContent;
  };
  const openLb = (t) => { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = "hidden"; show(visible().indexOf(t)); $(".lb-close", lb).focus(); };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; lbImg.src = ""; lastFocus && lastFocus.focus(); };
  tiles.forEach(t => $("button", t).addEventListener("click", () => openLb(t)));
  $(".lb-close", lb).addEventListener("click", closeLb);
  $(".lb-next", lb).addEventListener("click", () => show(cur + 1));
  $(".lb-prev", lb).addEventListener("click", () => show(cur - 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(cur + 1);
    if (e.key === "ArrowRight") show(cur - 1);
    if (e.key === "Tab") { const f = $$("button", lb); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
})();
