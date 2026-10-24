'use client';

import { useEffect, useRef } from "react";
import { Manrope } from "next/font/google";

// Declared here rather than in lib/fonts.ts (which the root layout imports) so
// the font is only preloaded on the landing page.
const manrope = Manrope({ subsets: ["latin"], weight: ["800"], display: "swap" });

/**
 * Animated "Youssef Rajeh" signature for the landing page. A cursor appears,
 * the name decodes in letter by letter with the cursor running ahead, then the
 * cursor lifts off and lands as the dot of the "j" (a live status light) and a
 * one-line intro types out below. Once finished the letters come alive: the
 * "Y" is an antenna, the "o" a loader, a current runs through the "ss", the
 * "f" glitches and the "a" streams bits.
 *
 * The letters are built imperatively because every decoration is positioned
 * from the rendered font (canvas ink bounds), then animated with the Web
 * Animations API. Clicking the name replays it. The <h1> keeps the plain name
 * and the intro sits in a visually hidden paragraph, for SEO and screen
 * readers; the animated lockup is aria-hidden.
 */

type Part = { w: HTMLSpanElement; g: HTMLSpanElement; ch: string };
type Geo = {
  fs: number; baseline: number; cw: number; chh: number; startX: number; after: number[];
  dot: { x: number; y: number; d: number };
  bits: { x0: number; x1: number; top: number };
};

const NAME = "Youssef Rajeh";
const ROLE = "Software developer with a Computer Programming & Analysis background, building practical web, database, and software projects.";
const GLYPHS = "01<>/{}[]#$%&*+=?";
const NS = "http://www.w3.org/2000/svg";
const HOLD = 9000; // finished signature stays alive on screen this long before looping
const FADE = 500; // fade-out before the sequence starts again

export default function IntroName() {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const lockupRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const pingRef = useRef<HTMLSpanElement>(null);
  const prRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const scRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current, lockup = lockupRef.current, word = wordRef.current, caret = caretRef.current,
      ping = pingRef.current, pr = prRef.current, role = roleRef.current, sc = scRef.current;
    if (!root || !lockup || !word || !caret || !ping || !pr || !role || !sc) return;

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
    const [Y, O, , S1, S2, , F] = parts;
    const Aa = parts.find(p => p.ch === "a")!;
    const split = 7; // index of the first letter of the surname

    const waves = document.createElementNS(NS, "svg"); waves.setAttribute("class", "fx waves"); waves.setAttribute("viewBox", "-50 -50 100 50");
    waves.innerHTML = '<path d="M-14,-14 A20,20 0 0 1 14,-14"/><path d="M-24,-24 A34,34 0 0 1 24,-24"/><path d="M-34,-34 A48,48 0 0 1 34,-34"/>';
    Y.w.appendChild(waves);
    const spin = document.createElementNS(NS, "svg"); spin.setAttribute("class", "fx spin"); spin.setAttribute("viewBox", "-50 -50 100 100");
    spin.innerHTML = '<circle r="46" pathLength="1" transform="rotate(-90)"/>';
    O.w.appendChild(spin);

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
      ping.style.left = px(cx - d / 2); ping.style.top = px(cy - d / 2);
      ping.style.width = ping.style.height = px(d); ping.style.borderRadius = px(d * .22);

      // per-letter decorations, in em from each letter's box
      const B = (baseline - (J.w.getBoundingClientRect().top - wr.top)) / fs;
      const off = (p: Part) => (p.g.getBoundingClientRect().left - p.w.getBoundingClientRect().left) / fs;
      const yb = blobs("Y")[0], ob = blobs("o")[0], ab = blobs("a")[0];
      const yc = off(Y) + (yb.left + yb.right) / 2, ytop = B - yb.top;
      Object.assign(waves.style, { width: ".62em", height: ".31em", left: `${(yc - .31).toFixed(3)}em`, top: `${(ytop - .33).toFixed(3)}em` });
      const r = (ob.right - ob.left) / 2 + .12, ocx = off(O) + (ob.left + ob.right) / 2, ocy = B - (ob.top + ob.bottom) / 2;
      Object.assign(spin.style, { width: `${(2 * r).toFixed(3)}em`, height: `${(2 * r).toFixed(3)}em`, left: `${(ocx - r).toFixed(3)}em`, top: `${(ocy - r).toFixed(3)}em` });
      const ga = off(Aa);

      geo = {
        fs, baseline, cw: Math.max(2, .06 * fs), chh: .72 * fs,
        startX: parts[0].w.getBoundingClientRect().left - wr.left,
        after: parts.map(p => p.w.getBoundingClientRect().right - wr.left + .02 * fs),
        dot: { x: cx - d / 2, y: cy - d / 2, d },
        bits: { x0: ga + ab.left, x1: ga + ab.right, top: B - ab.top },
      };
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

    // Continuous tech behaviours, started once the intro has finished.
    let life: Animation[] = [], bitTimer: ReturnType<typeof setInterval> | undefined;
    const L = (el: Element, kf: Keyframe[], opt: KeyframeAnimationOptions) => { const a = el.animate(kf, opt); life.push(a); return a; };
    const stopLife = () => {
      life.forEach(a => a.cancel()); life = []; clearInterval(bitTimer); bitTimer = undefined;
      [S1, S2].forEach(p => p.g.classList.remove("live"));
      Aa.w.querySelectorAll(".bit").forEach(b => b.remove());
    };
    const startLife = () => {
      stopLife(); if (reduce) return;
      // Y is an antenna: signal waves ripple out of its fork
      [...waves.children].forEach((pth, i) => L(pth, [{ opacity: 0 }, { offset: .12 + i * .08, opacity: 0 }, { offset: .24 + i * .08, opacity: .95 }, { offset: .5 + i * .06, opacity: 0 }, { opacity: 0 }],
        { duration: 2600, iterations: Infinity, easing: "ease-in-out" }));
      // o is a loader: a ring sweeps around it
      L(spin.firstElementChild!, [{ strokeDashoffset: 1, opacity: 1 }, { offset: .42, strokeDashoffset: 0, opacity: 1 }, { offset: .5, strokeDashoffset: 0, opacity: 0 }, { strokeDashoffset: 1, opacity: 0 }],
        { duration: 4200, delay: 600, iterations: Infinity, easing: "cubic-bezier(.6,0,.3,1)" });
      L(spin, [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 1400, iterations: Infinity });
      // ss carry an electric current: a bright pulse runs through one s into the next
      [S1, S2].forEach((p, i) => {
        p.g.classList.add("live");
        L(p.g, [{ backgroundPosition: "100% 0" }, { offset: .22, backgroundPosition: "0% 0" }, { backgroundPosition: "0% 0" }],
          { duration: 3000, delay: 1200 + i * 230, iterations: Infinity, easing: "cubic-bezier(.4,0,.6,1)" });
      });
      // f glitches now and then, like a bad signal
      L(F.g, [
        { offset: 0, transform: "translate(0,0)", textShadow: "none" },
        { offset: .86, transform: "translate(0,0)", textShadow: "none" },
        { offset: .875, transform: "translate(.03em,0) skewX(-6deg)", textShadow: "-.035em 0 #ff2d6f,.035em 0 #20d0ff" },
        { offset: .89, transform: "translate(-.025em,0)", textShadow: ".03em 0 #ff2d6f,-.03em 0 #20d0ff" },
        { offset: .905, transform: "translate(0,-.01em) skewX(4deg)", textShadow: "-.02em 0 #ff2d6f,.02em 0 #20d0ff" },
        { offset: .92, transform: "translate(0,0)", textShadow: "none" },
        { offset: 1, transform: "translate(0,0)", textShadow: "none" },
      ], { duration: 3700, delay: 400, iterations: Infinity });
      // a streams binary: bits rise out of it and fade
      const spawn = () => {
        const g = geo!.bits, b = document.createElement("span"); b.className = "bit"; b.textContent = Math.random() < .5 ? "0" : "1";
        b.style.left = `${(g.x0 + Math.random() * (g.x1 - g.x0 - .1)).toFixed(3)}em`; b.style.top = `${(g.top - .2).toFixed(3)}em`;
        Aa.w.appendChild(b);
        b.animate([{ transform: "translateY(0)", opacity: 0 }, { offset: .2, opacity: .9 }, { transform: "translateY(-3.6em)", opacity: 0 }],
          { duration: 1700 + Math.random() * 700, easing: "cubic-bezier(.3,.6,.4,1)" })
          .finished.then(() => b.remove(), () => b.remove());
      };
      spawn(); bitTimer = setInterval(spawn, 520);
    };

    const reset = () => {
      timers.forEach(clearTimeout); timers = []; anims.forEach(a => a.cancel()); anims = []; amb.forEach(a => a.cancel()); amb = []; done = false;
      parts.forEach(p => { p.g.textContent = p.ch; p.g.classList.remove("scr"); p.g.style.opacity = ""; });
      caret.className = "caret"; caret.style.cssText = "";
      role.textContent = ""; pr.style.opacity = ""; sc.className = "sc"; sc.style.opacity = "";
      stopLife();
    };
    const settle = () => {
      parts.forEach(p => { p.g.style.opacity = "1"; });
      caretAsDot();
      pr.style.opacity = "1"; role.textContent = ROLE; sc.style.opacity = "1";
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

      // 4. the intro types out on the line below, then the letters come alive
      const Ts = Tf + FLY + 400, K = 22, Tdone = Ts + 180 + ROLE.length * K + 200;
      later(() => { pr.style.opacity = "1"; sc.style.opacity = "1"; }, Ts);
      [...ROLE].forEach((_, i) => later(() => { role.textContent = ROLE.slice(0, i + 1); }, Ts + 180 + i * K));
      later(() => { sc.style.opacity = ""; sc.className = "sc blink"; done = true; startLife(); }, Tdone);

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
    word.addEventListener("click", play);

    let cancelled = false;
    const start = () => { if (!cancelled) play(); };
    (document.fonts?.load ? document.fonts.load(`800 100px ${family}`).then(() => document.fonts.ready) : Promise.resolve())
      .then(start, start);

    return () => {
      cancelled = true;
      clearTimeout(rt);
      timers.forEach(clearTimeout);
      removeEventListener("resize", onResize);
      word.removeEventListener("click", play);
      anims.forEach(a => a.cancel());
      amb.forEach(a => a.cancel());
      stopLife();
      created.forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <h1 className="intro-name" ref={rootRef}>
        <style>{`
          .intro-name {
            --in-ink: var(--text);
            --in-accent: #2f5bea; --in-signal: #f2a516; --in-spark: #12b5ff;
            --in-muted: var(--text-dim);
            margin: 0 0 clamp(20px, 3.5vh, 32px) 0;
            font-size: clamp(2.4rem, 8vw, 4.6rem);
            font-weight: 800;
            line-height: 1;
            max-width: 100%;
          }
          /* dark-background themes (everything except the four light ones) */
          :root:not([data-theme='light']):not([data-theme='neu']):not([data-theme='brutal']):not([data-theme='sepia']) .intro-name {
            --in-accent: #7593ff; --in-signal: #ffb52e; --in-spark: #5fd2ff;
          }
          .intro-name-sr { position: absolute; width: 1px; height: 1px; margin: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
          .intro-name .lockup { display: inline-flex; flex-direction: column; align-items: stretch; max-width: 100%; }
          .intro-name .word { position: relative; display: flex; align-items: flex-end; line-height: 1; letter-spacing: -.035em; white-space: nowrap; cursor: pointer; user-select: none; }
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
          /* the intro is as wide as the name and never adds to it; a hidden copy of the full text reserves its height while it types */
          .intro-name .sub { display: grid; width: 0; min-width: 100%; margin-top: 1.1em; font: 500 max(13px, .14em)/1.45 var(--font-jetbrains), ui-monospace, Menlo, Consolas, monospace; color: var(--in-muted); letter-spacing: .01em; text-align: left; text-wrap: pretty; }
          .intro-name .sub > span { grid-area: 1 / 1; }
          .intro-name .sub .ghost { visibility: hidden; }
          .intro-name .sub .pr { color: var(--in-accent); opacity: 0; }
          .intro-name .sub .sc { display: inline-block; width: .6em; height: 1.05em; vertical-align: -.2em; margin-left: .08em; background: var(--in-signal); opacity: 0; }
          .intro-name .sub .sc.blink { opacity: 1; animation: intro-blink 1.1s steps(1) infinite; }
          .intro-name .fx { position: absolute; pointer-events: none; overflow: visible; }
          .intro-name .fx path, .intro-name .fx circle { fill: none; stroke-linecap: round; }
          .intro-name .waves path { stroke: var(--in-accent); stroke-width: .028em; opacity: 0; }
          .intro-name .spin circle { stroke: var(--in-accent); stroke-width: .026em; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; }
          .intro-name .g.live { color: transparent; -webkit-background-clip: text; background-clip: text; background-size: 320% 100%; background-position: 100% 0;
            background-image: linear-gradient(100deg, var(--in-ink) 0 42%, var(--in-spark) 47%, var(--bg) 50%, var(--in-spark) 53%, var(--in-ink) 58% 100%); }
          .intro-name .bit { position: absolute; font: 500 .15em/1 var(--font-jetbrains), ui-monospace, monospace; color: var(--in-accent); opacity: 0; letter-spacing: 0; }
        `}</style>
        <span className="intro-name-sr">{NAME}</span>
        <span className="lockup" ref={lockupRef} aria-hidden="true">
          <span className={`word ${manrope.className}`} ref={wordRef} title="Replay">
            <span className="caret" ref={caretRef} />
            <span className="ping" ref={pingRef} />
          </span>
          <span className="sub">
            <span className="ghost">&gt;&nbsp;{ROLE}<span className="sc" /></span>
            <span><span className="pr" ref={prRef}>&gt;&nbsp;</span><span ref={roleRef} /><span className="sc" ref={scRef} /></span>
          </span>
        </span>
      </h1>
      <p className="intro-name-sr">{ROLE}</p>
    </>
  );
}
