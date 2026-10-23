'use client';

import { useEffect, useRef } from "react";
import { Poppins } from "next/font/google";

// Declared here rather than in lib/fonts.ts (which the root layout imports) so
// the font is only preloaded on the landing page.
const poppins = Poppins({ subsets: ["latin"], weight: ["800"], display: "swap" });

/**
 * Animated "Youssef Rajeh" for the landing page (ported from the standalone
 * youssef-rajeh-intro.html). The letters drop in, an amber ball bounces over
 * "h" and "e" and lands as the dot of the "j", the two "s" become geese, the
 * "Y" dances, the "u" breathes and a signature underline is drawn.
 *
 * The letters are built imperatively because every position is measured from
 * the rendered font (canvas ink bounds), then animated with the Web
 * Animations API. Clicking the name replays it. The <h1> keeps the plain name
 * for SEO and screen readers; the animated letters are aria-hidden.
 */

type Part = { w: HTMLSpanElement; g: HTMLSpanElement; ch: string; cls: "c" | "h" };
type Goose = { p: Part; head: HTMLSpanElement; feet: HTMLSpanElement };

const NAME = "Youssef Rajeh";

// Goose head (neck, head, beak, eye) and webbed feet for the two "s". The neck
// takes the letter's ink colour (.neck) so it follows the theme.
const HEAD = '<svg viewBox="0 0 100 110" aria-hidden="true"><path class="neck" d="M21,112 C17,94 31,76 25,60 C22,52 20,47 22,40" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M8,44 C2,26 16,9 36,9 C51,9 61,17 65,25 L67,34 C57,39 45,45 30,47 C19,48 10,47 8,44 Z" fill="#ffd21f"/><path d="M14,42 C24,44 40,42 52,37 C46,44 30,48 18,47 Z" fill="#e0b000"/><path d="M60,21 C71,22 86,26 97,33 C99,35 97,38 93,38 C82,39 70,38 62,38 Z" fill="#f07c12"/><path d="M63,32 C74,33 84,35 93,36" stroke="#a84a00" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M91,32.5 C95,33 98,35 96,37.5 C94,38.5 91,38 90.5,36 Z" fill="#3a2a1a"/><circle cx="42" cy="23" r="4.2" fill="#141417"/><circle cx="43.4" cy="21.8" r="1.4" fill="#fff"/></svg>';
const FEET = '<svg viewBox="0 0 64 12" aria-hidden="true"><g><path d="M2,1 C4,1 6,2 7,3 C13,4 22,5 28,7 C29,8 28,9 27,9 C20,10 12,11 7,10 C4,9 2,6 2,1 Z" fill="#f07c12"/><path d="M8,4 L26,8 M8,5 L22,10" stroke="#c45c06" stroke-width=".8" fill="none"/></g><g transform="translate(30,1)"><path d="M2,1 C4,1 6,2 7,3 C13,4 22,5 28,7 C29,8 28,9 27,9 C20,10 12,11 7,10 C4,9 2,6 2,1 Z" fill="#f07c12"/><path d="M8,4 L26,8 M8,5 L22,10" stroke="#c45c06" stroke-width=".8" fill="none"/></g></svg>';
const DUR = 2800; // the dot's entrance
const T = 13400; // whole sequence, before the camera settles

export default function IntroName() {
  const cameraRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const sigRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const camera = cameraRef.current, word = wordRef.current, sig = sigRef.current;
    if (!camera || !word || !sig) return;

    const family = poppins.style.fontFamily;
    const parts: Part[] = [];
    const created: HTMLElement[] = [];
    const add = (ch: string, cls: Part["cls"]) => {
      const w = document.createElement("span"); w.className = `ch ${cls}`;
      const g = document.createElement("span"); g.className = "g"; g.textContent = ch;
      w.append(g); word.appendChild(w); created.push(w);
      const p = { w, g, ch, cls }; parts.push(p); return p;
    };
    [..."Youssef"].forEach(c => add(c, "c"));
    const gap = document.createElement("span"); gap.className = "gap"; word.appendChild(gap); created.push(gap);
    [..."Rajeh"].forEach(c => add(c, "h"));

    const J = parts.find(p => p.ch === "j")!;
    const E = parts.find(p => p.ch === "e" && p.cls === "h")!;
    const H = parts.find(p => p.ch === "h" && p.cls === "h")!;
    const dot = document.createElement("span"); dot.className = "dot"; J.w.appendChild(dot);
    const geese: Goose[] = parts.filter(p => p.ch === "s").map(p => {
      p.w.classList.add("goose");
      const head = document.createElement("span"); head.className = "ghead"; head.innerHTML = HEAD;
      const feet = document.createElement("span"); feet.className = "gfeet"; feet.innerHTML = FEET;
      p.g.append(head, feet); return { p, head, feet };
    });

    // Measure a glyph's first ink blob (for "j", its dot) from the font itself, in em.
    const S = 400;
    const ink = (ch: string) => {
      const cv = document.createElement("canvas"); cv.width = S * 2; cv.height = S * 2;
      const x = cv.getContext("2d")!; x.font = `800 ${S}px ${family}`; x.fillStyle = "#000";
      x.textBaseline = "alphabetic"; const ox = S / 2, oy = S * 1.4; x.fillText(ch, ox, oy);
      const d = x.getImageData(0, 0, cv.width, cv.height).data;
      const rowInk = (r: number): [number, number] | null => {
        let mn = 1e9, mx = -1;
        for (let c = 0; c < cv.width; c++) {
          if (d[(r * cv.width + c) * 4 + 3] > 128) { if (c < mn) mn = c; if (c > mx) mx = c; }
        }
        return mx < 0 ? null : [mn, mx];
      };
      let top = -1;
      for (let r = 0; r < cv.height; r++) { if (rowInk(r)) { top = r; break; } }
      let bot = top, l = 1e9, rr = -1;
      for (let r = top; r < cv.height; r++) {
        const k = rowInk(r); if (!k) break;
        bot = r; l = Math.min(l, k[0]); rr = Math.max(rr, k[1]);
      }
      return { top: (oy - top) / S, bottom: (oy - bot - 1) / S, left: (l - ox) / S, right: (rr + 1 - ox) / S };
    };

    let geo: { xe: number; xh: number; ye: number; yh: number } | null = null;
    const layout = () => {
      const jd = ink("j");
      const et = ink("e").top, ht = ink("h").top;
      // baseline of the j's box
      const b = document.createElement("span"); b.className = "base"; J.g.appendChild(b);
      const fs = parseFloat(getComputedStyle(word).fontSize);
      const gr = J.g.getBoundingClientRect(), br = b.getBoundingClientRect(); b.remove();
      const baseY = (br.top - gr.top) / fs;
      const dia = Math.max(jd.right - jd.left, jd.top - jd.bottom) + 0.012;
      // hide the j's own dot; the amber ball replaces it
      const cut = baseY - (jd.bottom - 0.045);
      J.g.style.clipPath = `inset(${cut.toFixed(3)}em -1em -1em -1em)`;
      dot.style.width = dot.style.height = `${dia}em`;
      dot.style.left = `${jd.left + (jd.right - jd.left) / 2 - dia / 2}em`;
      dot.style.top = `${baseY - jd.top - 0.006}em`;
      const sb = ink("s");
      geese.forEach(({ head, feet }) => {
        head.style.left = `${sb.right - 0.17}em`;
        head.style.top = `${baseY - sb.top - 0.39}em`;
        feet.style.left = `${(sb.left + sb.right) / 2 - 0.1}em`;
        feet.style.top = `${baseY - 0.005}em`;
      });
      const jx = J.w.getBoundingClientRect(), ex = E.w.getBoundingClientRect(), hx = H.w.getBoundingClientRect();
      const cx = (r: DOMRect) => (r.left + r.width / 2) / fs;
      geo = {
        xe: cx(ex) - cx(jx), xh: cx(hx) - cx(jx),
        ye: jd.bottom - et, yh: jd.bottom - ht, // positive = lower than final rest
      };
    };

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let anims: Animation[] = [];
    const A = (el: Element, kf: Keyframe[], opt: KeyframeAnimationOptions) => {
      const a = el.animate(kf, { fill: "both", ...opt }); anims.push(a); return a;
    };

    const dropLetter = (p: Part, delay: number) => {
      A(p.g, [
        { transform: "translateY(-5em) scale(.88,1.18)", opacity: 0, easing: "cubic-bezier(.55,0,1,.45)" },
        { offset: .5, transform: "translateY(0) scale(1.28,.68)", opacity: 1, easing: "cubic-bezier(.2,.7,.4,1)" },
        { offset: .7, transform: "translateY(-.38em) scale(.93,1.09)", easing: "cubic-bezier(.55,0,1,.45)" },
        { offset: .84, transform: "translateY(0) scale(1.09,.92)", easing: "ease-out" },
        { offset: .93, transform: "translateY(0) scale(.98,1.02)" },
        { transform: "translateY(0) scale(1,1)", opacity: 1 },
      ], { duration: 1000, delay });
    };
    const squish = (p: Part, delay: number, amt: number) => {
      A(p.g, [
        { transform: "scale(1,1)" },
        { offset: .3, transform: `scale(${1 + amt},${1 - amt * 1.4})` },
        { offset: .65, transform: `scale(${1 - amt * .4},${1 + amt * .5})` },
        { transform: "scale(1,1)" },
      ], { duration: 460, delay, easing: "ease-out", fill: "forwards" });
    };

    const dotEntrance = (delay: number) => {
      const { xe, xh, ye, yh } = geo!;
      // [offset, x, y, sx, sy]
      const pts: [number, number, number, number, number][] = [
        [0, xh + 3.2, -3.4, .85, 1.2],
        [.17, xh, yh, 1.4, .62],
        [.30, (xh + xe) / 2, -1.1, .88, 1.14],
        [.43, xe, ye, 1.4, .62],
        [.58, xe * .45, -1.45, .88, 1.14],
        [.72, 0, 0, 1.45, .6],
        [.80, 0, -.42, .9, 1.12],
        [.88, 0, 0, 1.2, .8],
        [.94, 0, 0, .96, 1.04],
        [1, 0, 0, 1, 1],
      ];
      A(dot, pts.map(([o, x, y, sx, sy], i) => ({
        offset: o,
        transform: `translate(${x.toFixed(3)}em,${y.toFixed(3)}em) scale(${sx},${sy})`,
        opacity: i === 0 ? 0 : 1,
        easing: (i % 2 === 0 && i < 6) || i === 6 ? "cubic-bezier(.15,.6,.45,1)" : "cubic-bezier(.45,0,.9,.5)",
      })), { duration: DUR, delay });
      squish(H, delay + Math.round(.17 * DUR) - 40, .08);
      squish(E, delay + Math.round(.43 * DUR) - 40, .1);
      squish(J, delay + Math.round(.72 * DUR) - 40, .12);
      squish(J, delay + Math.round(.88 * DUR) - 40, .06);
    };
    const celebrate = (delay: number) => {
      A(dot, [
        { transform: "translate(0,0) scale(1,1)" },
        { offset: .12, transform: "translate(0,0) scale(1.25,.75)" },
        { offset: .3, transform: "translate(0,-.5em) scale(.9,1.12)" },
        { offset: .45, transform: "translate(0,0) scale(1.2,.8)" },
        { offset: .55, transform: "translate(0,-.28em) scale(.95,1.06)" },
        { offset: .68, transform: "translate(0,0) scale(1.1,.9)" },
        { offset: .8, transform: "translate(0,0) scale(.98,1.02)" },
        { transform: "translate(0,0) scale(1,1)" },
      ], { duration: 1300, delay, easing: "ease-in-out", fill: "forwards" });
      squish(J, delay + Math.round(.45 * 1300) - 40, .06);
      A(dot, [
        { boxShadow: "0 .02em 0 #b97803,0 .032em 0 #b97803,0 0 0 rgba(242,165,22,0)" },
        { offset: .5, boxShadow: "0 .02em 0 #b97803,0 .032em 0 #b97803,0 0 .35em rgba(242,165,22,.85)" },
        { boxShadow: "0 .02em 0 #b97803,0 .032em 0 #b97803,0 0 .1em rgba(242,165,22,.25)" },
      ], { duration: 1400, delay: delay + 1300, easing: "ease-in-out", fill: "forwards" });
    };

    // The "Y" dances a short ballet: plié, relevé, double pirouette, leap, arabesque, bow.
    const ballet = (p: Part, delay: number) => {
      const io = "cubic-bezier(.45,0,.55,1)", out = "cubic-bezier(.2,.7,.3,1)", inn = "cubic-bezier(.55,0,.9,.45)";
      // [offset, x, y, rotate, rotateY, skewX, sx, sy, easing]
      const k: [number, number, number, number, number, number, number, number, string][] = [
        [0, 0, 0, 0, 0, 0, 1, 1, io],
        [.07, 0, 0, 0, 0, 0, 1.1, .86, io], // plié
        [.14, 0, -.05, 0, 0, 0, .93, 1.12, io], // relevé, up on pointe
        [.17, 0, -.05, 0, 0, 0, .93, 1.12, "cubic-bezier(.3,0,.7,1)"],
        [.36, 0, -.05, 0, 720, 0, .93, 1.12, io], // double pirouette
        [.41, 0, 0, 0, 720, 0, 1.12, .84, out], // plié to prepare
        [.49, 0, -.75, -8, 720, -10, .9, 1.16, inn], // grand jeté
        [.57, 0, 0, 0, 720, 0, 1.16, .82, out], // land
        [.62, 0, -.04, 0, 720, 0, .95, 1.08, io],
        [.68, 0, -.05, 16, 720, -8, .94, 1.1, io], // arabesque
        [.78, 0, -.05, 16, 720, -8, .94, 1.1, io], // hold
        [.84, 0, 0, 0, 720, 0, 1, 1, io],
        [.91, 0, 0, -20, 720, 0, 1, .9, io], // bow
        [.95, 0, 0, -20, 720, 0, 1, .9, io],
        [1, 0, 0, 0, 720, 0, 1, 1, io],
      ];
      k.forEach(r => { r[0] = +(r[0] * .76).toFixed(3); });
      k.push([1, 0, 0, 0, 720, 0, 1, 1, io]); // rest, then dance again
      A(p.g, k.map(([o, x, y, r, ry, sk, sx, sy, e]) => ({
        offset: o, easing: e,
        transform: `perspective(6em) translate(${x}em,${y}em) rotate(${r}deg) rotateY(${ry}deg) skewX(${sk}deg) scale(${sx},${sy})`,
      })), { duration: 5600, delay, fill: "forwards", iterations: Infinity });
      // the neighbours lean in to watch, then react to the bow
      const i = parts.indexOf(p), nb = parts[i + 1] || parts[i - 1], d = parts[i + 1] ? -1 : 1;
      A(nb.g, [
        { transform: "rotate(0deg)" }, { offset: .06, transform: `rotate(${6 * d}deg)` }, { offset: .65, transform: `rotate(${6 * d}deg)` },
        { offset: .71, transform: `rotate(${-3 * d}deg) scale(1.04,.96)` }, { offset: .78, transform: "rotate(0deg)" }, { transform: "rotate(0deg)" },
      ], { duration: 5600, delay, easing: "ease-in-out", fill: "forwards", iterations: Infinity });
    };

    // The "u" breathes slowly in and out, for as long as the page is open.
    const breathe = (p: Part, delay: number) => {
      A(p.g, [
        { transform: "translateY(0) scale(1,1)", easing: "cubic-bezier(.45,0,.55,1)" },
        { offset: .45, transform: "translateY(-.015em) scale(.965,1.055)", easing: "cubic-bezier(.45,0,.55,1)" },
        { offset: .55, transform: "translateY(-.015em) scale(.965,1.055)", easing: "cubic-bezier(.45,0,.55,1)" },
        { transform: "translateY(0) scale(1,1)" },
      ], { duration: 3400, delay, iterations: Infinity, fill: "none" });
    };

    // The two "s" become geese: yellow heads pop out, feet appear, then they waddle and peck.
    const geeseShow = (delay: number) => {
      geese.forEach(({ p, head, feet }, i) => {
        const d = delay + i * 260;
        A(head, [
          { transform: "scale(0) rotate(-30deg)", opacity: 0 },
          { offset: .55, transform: "scale(1.3) rotate(10deg)", opacity: 1 },
          { offset: .8, transform: "scale(.9) rotate(-4deg)", opacity: 1 },
          { transform: "scale(1) rotate(0deg)", opacity: 1 },
        ], { duration: 600, delay: d, easing: "cubic-bezier(.2,.7,.3,1)" });
        A(feet, [{ transform: "scaleY(0)", opacity: 0 }, { offset: .6, transform: "scaleY(1.4)", opacity: 1 }, { transform: "scaleY(1)", opacity: 1 }],
          { duration: 450, delay: d + 150, easing: "ease-out" });
        // pop-up surprise on the body
        A(p.g, [{ transform: "translateY(0) rotate(0) scale(1,1)" }, { offset: .35, transform: "translateY(-.12em) rotate(0) scale(.94,1.08)" },
          { offset: .7, transform: "translateY(0) rotate(0) scale(1.06,.94)" }, { transform: "translateY(0) rotate(0) scale(1,1)" }],
          { duration: 600, delay: d, easing: "ease-out", fill: "forwards" });
        // waddle forever
        A(p.g, [
          { transform: "translateY(0) rotate(-4deg) scale(1,1)" },
          { offset: .25, transform: "translateY(-.02em) rotate(0deg) scale(1,1)" },
          { offset: .5, transform: "translateY(0) rotate(4deg) scale(1,1)" },
          { offset: .75, transform: "translateY(-.02em) rotate(0deg) scale(1,1)" },
          { transform: "translateY(0) rotate(-4deg) scale(1,1)" },
        ], { duration: 1100, delay: d + 700 + i * 180, iterations: Infinity, easing: "ease-in-out", fill: "none" });
        // peck / look around forever, out of step with each other
        A(head, [
          { transform: "rotate(0deg)" },
          { offset: .12, transform: "rotate(28deg) translateY(.02em)" },
          { offset: .2, transform: "rotate(0deg)" },
          { offset: .3, transform: "rotate(26deg) translateY(.02em)" },
          { offset: .38, transform: "rotate(0deg)" },
          { offset: .6, transform: "rotate(-12deg)" },
          { offset: .75, transform: "rotate(-12deg)" },
          { transform: "rotate(0deg)" },
        ], { duration: 2600, delay: d + 900 + i * 700, iterations: Infinity, easing: "ease-in-out", fill: "none" });
      });
    };

    const play = () => {
      anims.forEach(a => a.cancel()); anims = [];
      layout();
      if (reduce) {
        sig.style.strokeDashoffset = "0"; dot.style.opacity = "1";
        geese.forEach(g => { g.head.style.opacity = "1"; g.feet.style.opacity = "1"; });
        return;
      }
      A(camera, [{ transform: "scale(1.06)" }, { offset: .85, transform: "scale(1)" }, { transform: "scale(1.02)" }],
        { duration: T + 900, easing: "cubic-bezier(.33,0,.25,1)" });
      const c = parts.filter(p => p.cls === "c"), h = parts.filter(p => p.cls === "h");
      c.forEach((p, i) => dropLetter(p, 600 + i * 100));
      h.forEach((p, i) => dropLetter(p, 1450 + i * 115));
      dotEntrance(2800);
      celebrate(2800 + DUR + 250);
      ballet(c[0], 7200);
      breathe(c[2], 1900);
      geeseShow(4200);
      A(sig, [{ strokeDashoffset: 1 }, { offset: .15, strokeDashoffset: .9 }, { offset: .85, strokeDashoffset: .08 }, { strokeDashoffset: 0 }],
        { duration: 1700, delay: 11600, easing: "cubic-bezier(.4,0,.3,1)" });
    };

    let rt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (!geo) return;
        const keep = anims.every(a => a.playState === "finished" || a.effect?.getTiming().iterations === Infinity);
        layout();
        if (keep) dot.style.opacity = "1";
      }, 150);
    };
    addEventListener("resize", onResize);
    word.addEventListener("click", play);

    let cancelled = false;
    const start = () => { if (!cancelled) play(); };
    (document.fonts?.load ? document.fonts.load(`800 100px ${family}`).then(() => document.fonts.ready) : Promise.resolve())
      .then(start, start);

    return () => {
      cancelled = true;
      clearTimeout(rt);
      removeEventListener("resize", onResize);
      word.removeEventListener("click", play);
      anims.forEach(a => a.cancel());
      created.forEach(el => el.remove());
    };
  }, []);

  return (
    <h1 className="intro-name">
      <style>{`
        .intro-name {
          --in-ink: var(--text);
          --in-ink-deep: color-mix(in srgb, var(--text) 55%, #000);
          --in-cobalt: #2f5bea; --in-cobalt-deep: #1a3796;
          --in-amber: #f2a516; --in-amber-deep: #b97803;
          margin: 0 0 clamp(10px, 2vh, 16px) 0;
          font-size: clamp(2.4rem, 8vw, 4.6rem);
          font-weight: 800;
          line-height: 1;
          max-width: 100%;
        }
        /* dark-background themes (everything except the four light ones) */
        :root:not([data-theme='light']):not([data-theme='neu']):not([data-theme='brutal']):not([data-theme='sepia']) .intro-name {
          --in-ink-deep: color-mix(in srgb, var(--text) 45%, var(--bg));
          --in-cobalt: #5b82ff; --in-cobalt-deep: #2f5bea;
        }
        .intro-name .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .intro-name .camera { display: inline-block; transform-origin: 50% 56%; }
        .intro-name .word { position: relative; display: flex; align-items: flex-end; letter-spacing: -.025em; padding-bottom: .18em; cursor: pointer; user-select: none; }
        .intro-name .ch { position: relative; display: inline-block; }
        .intro-name .g { display: inline-block; transform-origin: 50% 100%; will-change: transform; }
        .intro-name .gap { width: .26em; }
        .intro-name .c .g { color: var(--in-ink); text-shadow: 0 .008em 0 var(--in-ink-deep), 0 .016em 0 var(--in-ink-deep), 0 .024em 0 var(--in-ink-deep), 0 .032em 0 var(--in-ink-deep); }
        .intro-name .h .g { color: var(--in-cobalt); text-shadow: 0 .008em 0 var(--in-cobalt-deep), 0 .016em 0 var(--in-cobalt-deep), 0 .024em 0 var(--in-cobalt-deep), 0 .032em 0 var(--in-cobalt-deep); }
        .intro-name .base { display: inline-block; width: 0; height: 0; vertical-align: baseline; }
        .intro-name .dot { position: absolute; border-radius: 50%; background: var(--in-amber); box-shadow: 0 .02em 0 var(--in-amber-deep), 0 .032em 0 var(--in-amber-deep); transform-origin: 50% 100%; opacity: 0; will-change: transform; }
        .intro-name .goose .g { position: relative; }
        .intro-name .ghead { position: absolute; width: .38em; height: .42em; transform-origin: 21% 100%; opacity: 0; }
        .intro-name .ghead svg, .intro-name .gfeet svg { display: block; width: 100%; height: 100%; overflow: visible; }
        .intro-name .ghead .neck { stroke: var(--in-ink); }
        .intro-name .gfeet { position: absolute; width: .24em; height: .06em; opacity: 0; transform-origin: 50% 0; }
        .intro-name .sig { position: absolute; left: -3%; width: 106%; bottom: -.12em; height: .42em; overflow: visible; pointer-events: none; }
        .intro-name .sig path { fill: none; stroke: var(--in-cobalt); stroke-width: .05em; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; }
      `}</style>
      <span className="sr">{NAME}</span>
      <span className="camera" ref={cameraRef} aria-hidden="true">
        <span className={`word ${poppins.className}`} ref={wordRef} title="Replay">
          <svg className="sig" viewBox="0 0 1000 80" preserveAspectRatio="none">
            <path ref={sigRef} pathLength={1} d="M18,46 C60,14 96,62 58,64 C24,66 40,30 120,36 C300,52 520,58 700,40 C800,30 880,26 930,36 C960,42 975,34 992,14" />
          </svg>
        </span>
      </span>
    </h1>
  );
}
