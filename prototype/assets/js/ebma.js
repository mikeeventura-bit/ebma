/* ==========================================================================
   EBMA, Behaviour
   Shared by the prototype AND the Squarespace build (pasted into
   Settings -> Advanced -> Code Injection -> Footer, wrapped in <script>).

   Three jobs, all progressive enhancements. If this file fails to load the
   site is still complete and readable: nothing here reveals content that
   isn't already in the markup.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- 1. Sticky header state ------------------------------------------- */
  function initHeader() {
    var header = document.querySelector("[data-ebma-header]");
    if (!header) return;
    var trigger = document.querySelector("[data-ebma-header-trigger]");

    // No dark hero on this page -> header is solid from the start.
    if (!trigger) { header.classList.add("is-stuck"); return; }

    var io = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });
    io.observe(trigger);
  }

  /* --- 2. Scroll reveal --------------------------------------------------
     Content is visible by default in CSS. We only opt in to hiding it once
     we know we can animate it back: and even then a safety timer guarantees
     nothing stays hidden if the observer never fires.                      */
  function initReveal() {
    var els = document.querySelectorAll(".ebma-reveal");
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) return; // stays visible

    document.documentElement.classList.add("ebma-js");

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });

    // Safety net: whatever has not revealed within 4s is shown unconditionally.
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  }

  /* --- 3. Stat count-up --------------------------------------------------
     Counts to the value already present in the markup, so the real number is
     in the DOM for screen readers and for anyone with JS off.
     Ranges ("30-50") and any prefix/suffix are preserved verbatim.          */
  function initCounters() {
    var els = document.querySelectorAll("[data-ebma-count]");
    if (!els.length || reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  function countUp(el) {
    var finalText = el.textContent;
    // Grab every integer in the label and animate them together.
    var numbers = finalText.match(/\d[\d,]*/g);
    if (!numbers) return;

    var targets = numbers.map(function (n) { return parseInt(n.replace(/,/g, ""), 10); });
    var hasSeparator = numbers.map(function (n) { return n.indexOf(",") > -1; });
    var duration = 1400;
    var start = null;

    el.setAttribute("aria-label", finalText.trim());

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutExpo: fast start, soft landing.
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      var i = -1;
      el.textContent = finalText.replace(/\d[\d,]*/g, function () {
        i++;
        var v = Math.round(targets[i] * eased);
        return hasSeparator[i] ? v.toLocaleString("en-US") : String(v);
      });
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  /* --- 4. Navigation dropdowns -------------------------------------------
     The menus were pure CSS: :hover plus :focus-within. Clicking a toggle
     gives the button focus, :focus-within stays true, and the menu is stuck
     open until focus moves elsewhere. aria-expanded was also hardcoded false,
     so assistive technology was told "closed" while the menu was open.

     Ownership moves to JS. CSS keeps a :hover fallback for pointer devices so
     the menus still work if this never runs.                                */
  function initNav() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".p-nav__item"));
    if (!items.length) return;

    document.documentElement.classList.add("ebma-nav-js");

    function close(item) {
      item.classList.remove("is-open");
      var t = item.querySelector(".p-nav__toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    }
    function closeAll(except) {
      items.forEach(function (i) { if (i !== except) close(i); });
    }

    items.forEach(function (item) {
      var toggle = item.querySelector(".p-nav__toggle");
      if (!toggle) return;
      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = item.classList.contains("is-open");
        closeAll(item);
        item.classList.toggle("is-open", !open);
        toggle.setAttribute("aria-expanded", String(!open));
      });

      // Tabbing out of the menu entirely closes it.
      item.addEventListener("focusout", function (e) {
        if (!item.contains(e.relatedTarget)) close(item);
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".p-nav__item")) closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = document.querySelector(".p-nav__item.is-open");
      if (!open) return;
      close(open);
      var t = open.querySelector(".p-nav__toggle");
      if (t) t.focus();
    });
  }

  /* --- 5. Mobile navigation ----------------------------------------------
     Below 940px the desktop nav is display:none and the Menu button was wired
     to nothing at all, leaving a phone with no navigation. Most of EBMA's
     visitors arrive on a phone, so this was the worst defect on the page.

     The panel is hidden with the `hidden` attribute rather than CSS alone, so
     its links stay out of the tab order while closed.                        */
  function initMobileNav() {
    var btn = document.querySelector(".p-menu-btn");
    var panel = document.getElementById("mobile-nav");
    if (!btn || !panel) return;

    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("p-nav-open", open);
    }

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      setOpen(!open);
      if (!open) {
        var first = panel.querySelector("a");
        if (first) first.focus();
      }
    });

    // Following a link closes the panel, which matters for same-page anchors
    // where no navigation happens to close it for us.
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        btn.focus();
      }
    });

    // Crossing back to the desktop breakpoint must not leave the body locked.
    var mq = window.matchMedia("(min-width: 940px)");
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* --- 6. Marquee ---------------------------------------------------------
     A seamless loop needs one repeat of the content to be at least as wide as
     the visible area. With six 180px tiles the set was 1080px against a
     1440px viewport, so translateX(-50%) scrolled past the end and exposed a
     gap: the "stop" that was reported.

     So: repeat the original set until the track is at least twice the
     container, then translate by exactly one set width. Seamless at any tile
     size, logo count or viewport. Duration scales with distance so the speed
     stays constant as logos are added.                                       */
  function initMarquee() {
    document.querySelectorAll("[data-ebma-marquee]").forEach(function (track) {
      if (track.dataset.ebmaMarqueeReady) return;

      var originals = Array.prototype.slice.call(track.children);
      if (!originals.length) return;

      var container = track.parentElement;
      var setWidth = track.scrollWidth;
      if (!setWidth) return;

      var needed = Math.max(2, Math.ceil((container.offsetWidth * 2) / setWidth) + 1);
      for (var copy = 1; copy < needed; copy++) {
        originals.forEach(function (node) {
          var clone = node.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          track.appendChild(clone);
        });
      }

      // One set is the distance to travel before the loop repeats exactly.
      track.style.setProperty("--ebma-marquee-shift", setWidth + "px");
      track.style.setProperty("--ebma-marquee-duration", Math.round(setWidth / 45) + "s");
      track.dataset.ebmaMarqueeReady = "1";
    });
  }

  function init() {
    initHeader();
    initNav();
    initMobileNav();
    initReveal();
    initCounters();
    initMarquee();
  }

  // Re-measure the marquee when the viewport changes width.
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.querySelectorAll("[data-ebma-marquee]").forEach(function (t) {
        var shift = parseFloat(t.style.getPropertyValue("--ebma-marquee-shift"));
        if (!shift) return;
        var container = t.parentElement;
        if (t.scrollWidth < container.offsetWidth * 2) {
          delete t.dataset.ebmaMarqueeReady;
          initMarquee();
        }
      });
    }, 250);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
