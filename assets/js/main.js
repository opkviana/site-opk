/* ============================================================
   OPK VIANA — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Bloqueia pinch-zoom / double-tap-zoom (alguns navegadores ignoram
         user-scalable=no), evitando o site "travar" deslocado ---- */
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (evt) {
    document.addEventListener(evt, function (e) { e.preventDefault(); }, { passive: false });
  });
  document.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  var lastTouchEnd = 0;
  document.addEventListener("touchend", function (e) {
    var now = Date.now();
    if (now - lastTouchEnd <= 350) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  /* ---- Year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Navbar scroll state ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var mobile = document.getElementById("navMobile");
  function closeMenu() {
    burger.classList.remove("is-open");
    mobile.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var open = burger.classList.toggle("is-open");
    mobile.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Clip facade: load YouTube only on click ---- */
  var facade = document.getElementById("clipFacade");
  var clipFrame = document.getElementById("clipFrame");
  if (facade && clipFrame) {
    facade.addEventListener("click", function () {
      var id = facade.getAttribute("data-id");
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1";
      iframe.title = "Clipe oficial — OPK VIANA";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      clipFrame.innerHTML = "";
      clipFrame.appendChild(iframe);
    });
  }

  /* ---- Contact form: monta um e-mail padronizado e legível ---- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (document.getElementById("name") || {}).value || "";
      var email = (document.getElementById("email") || {}).value || "";
      var subject = (document.getElementById("subject") || {}).value || "Contato";
      var message = (document.getElementById("message") || {}).value || "";

      // Assunto com prefixo fixo para reconhecer o padrão na caixa de entrada
      var mailSubject = "[Site OPK VIANA] " + subject + (name ? " — " + name : "");

      // Corpo formatado (CRLF para compatibilidade com clientes de e-mail)
      var lines = [
        "Olá, OPK VIANA!",
        "",
        "• Nome: " + name,
        "• E-mail: " + email,
        "• Assunto: " + subject,
        "",
        "Mensagem:",
        message,
        "",
        "——",
        "Enviado pelo formulário do site oficial."
      ];
      var mailBody = lines.join("\r\n");

      var href =
        "mailto:opkviana@gmail.com" +
        "?subject=" + encodeURIComponent(mailSubject) +
        "&body=" + encodeURIComponent(mailBody);

      window.location.href = href;

      if (note) note.textContent = "Abrindo seu app de e-mail com a mensagem pronta… obrigado pelo contato!";
    });
  }
})();
