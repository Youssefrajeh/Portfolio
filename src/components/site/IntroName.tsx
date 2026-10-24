'use client';

import { useEffect, useRef } from "react";
import { Manrope } from "next/font/google";

// Declared here rather than in lib/fonts.ts (which the root layout imports) so
// the font is only preloaded on the landing page.
const manrope = Manrope({ subsets: ["latin"], weight: ["800"], display: "swap" });

/**
 * Animated "Youssef Rajeh" signature for the landing page. A cursor appears,
 * the name decodes in letter by letter with the cursor running ahead, then the
 * cursor lifts off and lands as the dot of the "j", a live status light.
 *
 * The letters are built imperatively because the dot's position is measured
 * from the rendered font (canvas ink bounds), then animated with the Web
 * Animations API. Clicking the name replays it. The <h1> keeps the plain name
 * for SEO and screen readers; the animated lockup is aria-hidden.
 */

type Part = { w: HTMLSpanElement; g: HTMLSpanElement; ch: string };
type Geo = {
  fs: number; baseline: number; cw: number; chh: number; startX: number; after: number[];
  dot: { x: number; y: number; d: number };
};

const NAME = "Youssef Rajeh";
const GLYPHS = "01<>/{}[]#$%&*+=?";
const HOLD = 3000; // finished signature stays on screen this long before looping
const FADE = 500; // fade-out before the sequence starts again

export default function IntroName() {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const lockupRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const pingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current, lockup = lockupRef.current, word = wordRef.current, caret = caretRef.current,
      ping = pingRef.current;
    if (!root || !lockup || !word || !caret || !ping) return;

    const family = manrope.style.fontFamily;
    const parts: Part[] = [];
    const created: HTMLElement[] = [];
    const add = (ch: string, cls: "y" | "r") => {
      const w = document.createElement("span"); w.className = `ch ${cls}`;
      const g = document.createElement("span"); g.className = "g"; g.textContent = ch;
      w.append(g); word.insertBefore(w, caret); created.push(w); parts.push({ w, g, ch });
    };
    [..."Youssef"].forEach(c => add(c, "y"));
    const gap = document.createElement("span"); gap.className = "gap"; word.insertBefore(gap, caret); created.push(gap);
    [..."Rajeh"].forEach(c => add(c, "r"));
    const J = parts.find(p => p.ch === "j")!;
    const split = 7; // index of the first letter of the surname

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers: ReturnType<typeof setTimeout>[] = [], anims: Animation[] = [], amb: Animation[] = [];
    let geo: Geo | null = null, done = false;
    const later = (fn: () => void, t: number) => { timers.push(setTimeout(fn, t)); };
    const A = (el: Element, kf: Keyframe[], opt: KeyframeAnimationOptions) => {
      const a = el.animate(kf, { fill: "both", ...opt }); anims.push(a); return a;
    };
    const px = (v: number) => `${v}px`;

    // Ink blobs of a glyph, top to bottom, in em relative to its origin and baseline (heights are positive above baseline).
    const blobs = (ch: string) => {
      const S = 400, cv = document.createElement("canvas"); cv.width = S * 2; cv.height = S * 2;
      const x = cv.getContext("2d")!; x.font = `800 ${S}px ${family}`; x.textBaseline = "alphabetic";
      const ox = S / 2, oy = S * 1.4; x.fillText(ch, ox, oy);
      const d = x.getImageData(0, 0, cv.width, cv.height).data, W = cv.width;
      const row = (r: number): [number, number] | null => {
        let mn = -1, mx = -1;
        for (let c = 0; c < W; c++) { if (d[(r * W + c) * 4 + 3] > 110) { if (mn < 0) mn = c; mx = c; } }
        return mn < 0 ? null : [mn, mx];
      };
      const out: { t: number; b: number; l: number; r: number }[] = [];
      let cur: (typeof out)[number] | null = null;
      for (let r = 0; r < cv.height; r++) {
        const k = row(r);
        if (k) { if (!cur) cur = { t: r, b: r, l: k[0], r: k[1] }; cur.b = r; cur.l = Math.min(cur.l, k[0]); cur.r = Math.max(cur.r, k[1]); }
        else if (cur) { out.push(cur); cur = null; }
      }
      if (cur) out.push(cur);
      return out.map(o => ({ top: (oy - o.t) / S, bottom: (oy - o.b - 1) / S, left: (o.l - ox) / S, right: (o.r + 1 - ox) / S }));
    };

    const layout = () => {
      const fs = parseFloat(getComputedStyle(word).fontSize);
      parts.forEach(p => { p.w.style.width = ""; });
      parts.forEach(p => { p.w.style.width = `${(p.w.getBoundingClientRect().width / fs).toFixed(4)}em`; });
      const wr = word.getBoundingClientRect();
      const b = document.createElement("span"); b.className = "base"; J.g.appendChild(b);
      const br = b.getBoundingClientRect(), gr = J.g.getBoundingClientRect(); b.remove();
      const baseline = br.top - wr.top, gx = gr.left - wr.left, gTop = gr.top - wr.top;
      const bl = blobs("j"), dot = bl[0], stem = bl[1] || { top: dot.bottom - .06 };
      // hide the j's own dot; the caret will become it
      const cutY = baseline - ((dot.bottom + stem.top) / 2) * fs;
      J.g.style.clipPath = `inset(${((cutY - gTop) / fs).toFixed(4)}em -1em -1em -1em)`;
      const d = Math.max(dot.right - dot.left, dot.top - dot.bottom) * fs;
      const cx = gx + (dot.left + dot.right) / 2 * fs, cy = baseline - (dot.top + dot.bottom) / 2 * fs;
      geo = {
        fs, baseline, cw: Math.max(2, .06 * fs), chh: .72 * fs,
        startX: parts[0].w.getBoundingClientRect().left - wr.left,
        after: parts.map(p => p.w.getBoundingClientRect().right - wr.left + .02 * fs),
        dot: { x: cx - d / 2, y: cy - d / 2, d },
      };
      ping.style.left = px(geo.dot.x); ping.style.top = px(geo.dot.y);
      ping.style.width = ping.style.height = px(d); ping.style.borderRadius = px(d * .22);
    };
    const caretAt = (x: number) => {
      const g = geo!;
      caret.style.left = px(x); caret.style.top = px(g.baseline - g.chh); caret.style.width = px(g.cw); caret.style.height = px(g.chh);
    };
    const caretAsDot = () => {
      const d = geo!.dot; caret.className = "caret dot";
      caret.style.left = px(d.x); caret.style.top = px(d.y); caret.style.width = caret.style.height = px(d.d); caret.style.borderRadius = px(d.d * .22);
    };
    // the status light pulses for as long as the signature is on screen
    const ambient = () => {
      amb.push(ping.animate([{ transform: "scale(1)", opacity: .75 }, { offset: .5, transform: "scale(3.4)", opacity: 0 }, { transform: "scale(3.4)", opacity: 0 }],
        { duration: 2800, iterations: Infinity, easing: "cubic-bezier(.2,.6,.3,1)" }));
      amb.push(caret.animate([{ boxShadow: "0 0 0 0 currentColor" }, { offset: .25, boxShadow: "0 0 .14em 0 currentColor" }, { offset: .6, boxShadow: "0 0 0 0 currentColor" }, { boxShadow: "0 0 0 0 currentColor" }],
        { duration: 2800, iterations: Infinity, easing: "ease-in-out" }));
    };

    const reset = () => {
      timers.forEach(clearTimeout); timers = []; anims.forEach(a => a.cancel()); anims = []; amb.forEach(a => a.cancel()); amb = []; done = false;
      parts.forEach(p => { p.g.textContent = p.ch; p.g.classList.remove("scr"); p.g.style.opacity = ""; });
      caret.className = "caret"; caret.style.cssText = "";
    };
    const settle = () => {
      parts.forEach(p => { p.g.style.opacity = "1"; });
      caretAsDot();
      done = true;
    };

    const play = () => {
      reset(); layout();
      if (reduce) { settle(); return; }
      const g = geo!;

      // 1. a cursor appears and waits
      caretAt(g.startX - .06 * g.fs);
      later(() => { caret.style.opacity = "1"; caret.classList.add("blink"); }, 250);

      // 2. the name decodes in, letter by letter, with the cursor running ahead
      let t = 1250;
      parts.forEach((p, i) => {
        if (i === split) t += 140;
        later(() => {
          caret.classList.remove("blink"); caret.style.opacity = "1";
          p.g.classList.add("scr");
          A(p.g, [{ opacity: 0, transform: "translateY(.16em)" }, { offset: .3, opacity: 1 }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 460, easing: "cubic-bezier(.2,.8,.25,1.12)" });
          [0, 45, 90].forEach(dt => later(() => { p.g.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }, dt));
          later(() => { p.g.textContent = p.ch; p.g.classList.remove("scr"); }, 140);
          later(() => caretAt(g.after[i]), 40);
        }, t);
        t += 88;
      });
      const Tend = t + 260;
      later(() => caret.classList.add("blink"), Tend);

      // 3. the cursor lifts off and becomes the dot of the j
      const Tf = Tend + 800, FLY = 820;
      later(() => {
        caret.classList.remove("blink"); caret.style.opacity = "1"; caret.style.transition = "none";
        const st = getComputedStyle(root);
        const acc = st.getPropertyValue("--in-accent").trim(), sig = st.getPropertyValue("--in-signal").trim();
        const x0 = parseFloat(caret.style.left), y0 = parseFloat(caret.style.top), D = g.dot;
        const fly = A(caret, [
          { left: px(x0), top: px(y0), width: px(g.cw), height: px(g.chh), borderRadius: "1px", backgroundColor: acc },
          { offset: .18, left: px(x0), top: px(y0 + g.chh * .25), width: px(g.cw * 1.6), height: px(g.chh * .75), backgroundColor: acc },
          { offset: .6, left: px((x0 + D.x) / 2), top: px(Math.min(y0, D.y) - .42 * g.fs), width: px(D.d * .8), height: px(D.d * 1.3), borderRadius: px(D.d * .3), backgroundColor: sig },
          { offset: .86, left: px(D.x - D.d * .08), top: px(D.y + D.d * .12), width: px(D.d * 1.16), height: px(D.d * .86), borderRadius: px(D.d * .22), backgroundColor: sig },
          { left: px(D.x), top: px(D.y), width: px(D.d), height: px(D.d), borderRadius: px(D.d * .22), backgroundColor: sig },
        ], { duration: FLY, easing: "cubic-bezier(.55,0,.3,1)" });
        fly.finished.then(() => { caretAsDot(); fly.cancel(); ambient(); }, () => {}); // rejected when cancelled by a replay
        // the j takes the weight of the landing
        A(J.g, [{ transform: "translateY(0) scaleY(1)" }, { offset: .4, transform: "translateY(.025em) scaleY(.96)" }, { transform: "translateY(0) scaleY(1)" }],
          { duration: 380, delay: Math.round(FLY * .84), easing: "ease-out", fill: "none" });
      }, Tf);

      const Tdone = Tf + FLY + 300;
      later(() => { done = true; }, Tdone);

      // hold the finished signature, fade out, play again
      later(() => {
        A(lockup, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE, easing: "ease-in", fill: "forwards" })
          .finished.then(play, () => {}); // rejected when cancelled by a click or unmount
      }, Tdone + HOLD);
    };

    let rt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (!done) return;
        amb.forEach(a => a.cancel()); amb = []; layout(); caretAsDot(); if (!reduce) ambient();
      }, 150);
    };
    addEventListener("resize", onResize);
    lockup.addEventListener("click", play);

    let cancelled = false;
    const start = () => { if (!cancelled) play(); };
    (document.fonts?.load ? document.fonts.load(`800 100px ${family}`).then(() => document.fonts.ready) : Promise.resolve())
      .then(start, start);

    return () => {
      cancelled = true;
      clearTimeout(rt);
      timers.forEach(clearTimeout);
      removeEventListener("resize", onResize);
      lockup.removeEventListener("click", play);
      anims.forEach(a => a.cancel());
      amb.forEach(a => a.cancel());
      created.forEach(el => el.remove());
    };
  }, []);

  return (
    <h1 className="intro-name" ref={rootRef}>
      <style>{`
        .intro-name {
          --in-ink: var(--text);
          --in-accent: #2f5bea; --in-signal: #f2a516;
          --in-muted: var(--text-dim);
          margin: 0 0 clamp(10px, 2vh, 16px) 0;
          font-size: clamp(2.4rem, 8vw, 4.6rem);
          font-weight: 800;
          line-height: 1;
          max-width: 100%;
        }
        /* dark-background themes (everything except the four light ones) */
        :root:not([data-theme='light']):not([data-theme='neu']):not([data-theme='brutal']):not([data-theme='sepia']) .intro-name {
          --in-accent: #7593ff; --in-signal: #ffb52e;
        }
        .intro-name .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .intro-name .lockup { display: inline-flex; flex-direction: column; align-items: stretch; max-width: 100%; cursor: pointer; user-select: none; }
        .intro-name .word { position: relative; display: flex; align-items: flex-end; line-height: 1; letter-spacing: -.035em; white-space: nowrap; }
        .intro-name .ch { position: relative; display: inline-block; text-align: center; }
        .intro-name .g { display: inline-block; opacity: 0; }
        .intro-name .y .g { color: var(--in-ink); }
        .intro-name .r .g { color: var(--in-accent); }
        .intro-name .g.scr { color: var(--in-muted); }
        .intro-name .gap { width: .24em; flex: none; }
        .intro-name .base { display: inline-block; width: 0; height: 0; vertical-align: baseline; }
        .intro-name .caret { position: absolute; left: 0; top: 0; width: 0; height: 0; background: var(--in-accent); opacity: 0; transition: left .09s ease-out; }
        .intro-name .caret.blink { animation: intro-blink 1s steps(1) infinite; }
        .intro-name .caret.dot { background: var(--in-signal); color: var(--in-signal); opacity: 1; transition: none; }
        @keyframes intro-blink { 50% { opacity: 0; } }
        .intro-name .ping { position: absolute; box-sizing: border-box; border: 2px solid var(--in-signal); opacity: 0; pointer-events: none; }
      `}</style>
      <span className="sr">{NAME}</span>
      <span className="lockup" ref={lockupRef} title="Replay" aria-hidden="true">
        <span className={`word ${manrope.className}`} ref={wordRef}>
          <span className="caret" ref={caretRef} />
          <span className="ping" ref={pingRef} />
        </span>
      </span>
    </h1>
  );
}
