/* Pinoy Health Tips — shared interactions */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close when a link is chosen or the viewport grows
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Highlight the current page in the nav ---------- */
  var here = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (target === here) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Category filters (blog + tips) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var scopeSel = group.getAttribute("data-filter-group");
    var scope = document.querySelector(scopeSel);
    if (!scope) return;

    group.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      group.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      var value = btn.getAttribute("data-filter");
      var shown = 0;

      scope.querySelectorAll("[data-category]").forEach(function (item) {
        var cats = (item.getAttribute("data-category") || "").split(/\s+/);
        var match = value === "all" || cats.indexOf(value) !== -1;
        item.style.display = match ? "" : "none";
        if (match) shown++;
      });

      var counter = document.querySelector("[data-filter-count]");
      if (counter) counter.textContent = shown;
    });
  });

  /* ---------- Newsletter signup ---------- */
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type='email']");
      var msg = form.parentElement.querySelector(".form-msg");
      var value = (input.value || "").trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        msg.textContent = "Please enter a valid email address, like juan@email.com.";
        msg.className = "form-msg err";
        input.focus();
        return;
      }
      msg.textContent = "Salamat! You're subscribed to the Pinoy Health Tips weekly digest.";
      msg.className = "form-msg ok";
      form.reset();
    });
  });

  /* ---------- Contact form validation ---------- */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var setError = function (field, message) {
      field.classList.add("invalid");
      var err = field.querySelector(".field-error");
      if (err) err.textContent = message;
    };

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      contactForm.querySelectorAll(".field").forEach(function (field) {
        field.classList.remove("invalid");
        var control = field.querySelector("input, select, textarea");
        if (!control || !control.required) return;

        var value = (control.value || "").trim();

        if (!value) {
          setError(field, "This field is required.");
          ok = false;
        } else if (control.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          setError(field, "Please enter a valid email address.");
          ok = false;
        } else if (control.tagName === "TEXTAREA" && value.length < 15) {
          setError(field, "Please write at least 15 characters so we can help.");
          ok = false;
        }
      });

      if (!ok) {
        var firstBad = contactForm.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var success = contactForm.querySelector(".form-success");
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      contactForm.reset();
    });

    contactForm.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field) field.classList.remove("invalid");
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- Back to top ---------- */
  var backTop = document.querySelector(".back-top");
  if (backTop) {
    var onScroll = function () {
      backTop.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
