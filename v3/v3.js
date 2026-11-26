/* FUTURE KIT · v3 */
(() => {
  "use strict";

  /* ============================================================
     بيانات التواصل: عدلها هنا فقط، وتنعكس على الصفحة كلها.
     whatsapp بالصيغة الدولية بدون + أو مسافات، مثال: "9665XXXXXXXX"
     ============================================================ */
  const CONFIG = { whatsapp: "", phone: "", address: "", hours: "" };
  const PENDING = "يضاف قريبا";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const goTo = (sel) => { const el = $(sel); if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); };

  /* ---------- header ---------- */
  const hd = $("#hd"), nav = $("#nav"), navBtn = $("#nav-btn"), topBtn = $("#top-btn");
  const utilH = () => $(".util").offsetHeight;
  const measure = () => {
    const solid = hd.classList.contains("is-solid");
    if (solid) hd.classList.remove("is-solid");
    document.documentElement.style.setProperty("--hd-h", hd.offsetHeight + "px");
    if (solid) hd.classList.add("is-solid");
  };
  const onScroll = () => {
    hd.style.top = Math.max(0, utilH() - scrollY) + "px";
    hd.classList.toggle("is-solid", scrollY > 160);
    topBtn.classList.toggle("is-on", scrollY > innerHeight);
  };
  measure(); addEventListener("scroll", onScroll, { passive: true }); onScroll();
  addEventListener("resize", () => { measure(); onScroll(); });
  if (document.fonts) document.fonts.ready.then(measure);
  addEventListener("load", measure);
  const setNav = (open) => {
    nav.classList.toggle("is-open", open); navBtn.setAttribute("aria-expanded", String(open));
    $(".nb-lbl").textContent = open ? "إغلاق" : "القائمة";
  };
  navBtn.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setNav(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); navBtn.focus(); } });
  document.addEventListener("click", e => { if (nav.classList.contains("is-open") && !e.target.closest(".hd")) setNav(false); });

  const links = $$('.nav a');
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle("is-on", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  links.forEach(l => { const s = $(l.getAttribute("href")); if (s) secIO.observe(s); });

  /* ---------- reveals ---------- */
  const revIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sib = $$(".rv:not(.in)", e.target.parentElement);
    e.target.style.transitionDelay = reduce ? "0ms" : Math.min(Math.max(0, sib.indexOf(e.target)), 4) * 70 + "ms";
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

  /* ---------- gallery lightbox ---------- */
  const tiles = $$(".g"), lb = $("#lb"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let cur = 0, lastFocus = null;
  const show = i => { cur = (i + tiles.length) % tiles.length; const t = tiles[cur]; lbImg.src = $("button", t).dataset.full; lbImg.alt = $("img", t).alt; lbCap.textContent = $("figcaption", t).textContent; };
  const openLb = i => { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = "hidden"; show(i); $(".lb-x").focus(); };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; lbImg.src = ""; if (lastFocus) lastFocus.focus(); };
  tiles.forEach((t, i) => $("button", t).addEventListener("click", () => openLb(i)));
  $(".lb-x").addEventListener("click", closeLb);
  $(".lb-n").addEventListener("click", () => show(cur + 1));
  $(".lb-p").addEventListener("click", () => show(cur - 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(cur + 1);
    if (e.key === "ArrowRight") show(cur - 1);
    if (e.key === "Tab") { const f = $$("button", lb); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });

  /* ---------- request form ---------- */
  const cfForm = $("#contact-form"), stEl = $("#f-status"), cf = cfForm.elements;
  const phoneRe = /^(\+?966|0)?5\d{8}$/;
  cfForm.addEventListener("submit", async e => {
    e.preventDefault();
    const nm = cf.namedItem("name"), name = nm.value.trim(), phone = cf.phone.value.replace(/[\s-]/g, "");
    nm.setAttribute("aria-invalid", !name); cf.phone.setAttribute("aria-invalid", !phoneRe.test(phone));
    if (!name) { stEl.className = "f-status err"; stEl.textContent = "يرجى كتابة الاسم."; nm.focus(); return; }
    if (!phoneRe.test(phone)) { stEl.className = "f-status err"; stEl.textContent = "رقم الجوال غير صحيح. مثال: 05XXXXXXXX"; cf.phone.focus(); return; }
    const lines = [
      "طلب زيارة قياس | فيوتشر كيت", `الاسم: ${name}`, `الجوال: ${phone}`,
      cf.district.value.trim() && `الحي: ${cf.district.value.trim()}`,
      `نوع المشروع: ${cf.type.value}`,
      cf.msg.value.trim() && `التفاصيل: ${cf.msg.value.trim()}`,
    ].filter(Boolean).join("\n");
    stEl.className = "f-status"; stEl.textContent = "جار تجهيز الطلب";
    const r = await sendMessage(lines);
    stEl.textContent = r === "sent" ? "تم فتح واتساب والرسالة جاهزة، يرجى الضغط على إرسال لإتمام الطلب." : "تم تجهيز الطلب ونسخه، وسيفعل الإرسال المباشر عبر واتساب فور إضافة رقم التواصل.";
  });
})();
