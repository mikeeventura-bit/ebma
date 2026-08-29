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

  /* --- 4. Marquee duplication --------------------------------------------
     A seamless loop needs the track's content twice. Duplicating in JS keeps
     the markup (and the editable content in Squarespace) written only once.
     The duplicate is aria-hidden so it is not announced twice.              */
  function initMarquee() {
    document.querySelectorAll("[data-ebma-marquee]").forEach(function (track) {
      if (track.dataset.ebmaMarqueeReady) return;
      var clone = track.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      while (clone.firstChild) track.appendChild(clone.firstChild);
      track.dataset.ebmaMarqueeReady = "1";
    });
  }

  function init() {
    initHeader();
    initReveal();
    initCounters();
    initMarquee();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
