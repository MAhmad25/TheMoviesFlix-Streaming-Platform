'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CirclePlay, Clapperboard, Play, SquarePlay, Star } from 'lucide-react';
import { play } from 'cuelume';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import MediaActionButton from './MediaActionButton';
import './curtain-slider.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, CustomEase);
  if (!CustomEase.get('annnimate')) {
    CustomEase.create('annnimate', 'M0,0 C0.3,0.9 0.1,1 1,1');
  }
  if (!CustomEase.get('annnimateInOut')) {
    CustomEase.create('annnimateInOut', 'M0,0 C0.7,0 0.16,1 1,1');
  }
}

const STRIP_DUR_RATIO = 0.62;
// Dimming runs on per-strip black shade overlays tweening OPACITY, never
// on filter: brightness() - animated filters repaint every frame and
// churn compositor layers (flashing-rectangle flicker at fullscreen
// retina + high refresh). Opacity composites on the GPU.
const INCOMING_SHADE = 0.18;
const OUT_SHADE = 0.3;
const ZOOM_FROM = 1.3;
const TITLE_OUT_DUR = 0.55;
const TITLE_IN_DUR = 0.95;
const LABEL_DUR = 0.5;
const DIGIT_DUR = 0.7;
const SWIPE_THRESHOLD_RATIO = 0.15;
const ARROW_HOVER_DUR = 0.35;
const ARROW_PRESS_DUR = 0.15;
const AUTO_RESUME_DELAY = 4;

const VIEWPORT_QUERIES = {
  mobile: '(max-width: 479px)',
  tablet: '(max-width: 991px)',
  landscape: '(orientation: landscape) and (max-width: 767px)',
  desktop: '(min-width: 992px)',
};

function indexLabel(i) {
  return String(i + 1).padStart(2, '0');
}

function isDisabledOnViewport(disable) {
  if (!disable) return false;
  const list = Array.isArray(disable) ? disable : String(disable).split(',');
  return list.some((v) => {
    const q = VIEWPORT_QUERIES[String(v).trim()];
    return q && window.matchMedia(q).matches;
  });
}

function buildCharLine(text, lineClass, charClass) {
  const line = document.createElement('span');
  line.className = lineClass;
  text.split('').forEach((ch) => {
    const span = document.createElement('span');
    span.className = charClass;
    // inline-block char spans collapse a plain space to zero width -
    // swap word gaps for a non-breaking space so they keep their width
    span.textContent = ch === ' ' ? '\xA0' : ch;
    line.appendChild(span);
  });
  return line;
}

function splitChars(el, text, lineClass, charClass) {
  el.innerHTML = '';
  const line = buildCharLine(text, lineClass, charClass);
  el.appendChild(line);
  return Array.from(line.querySelectorAll('.' + charClass));
}

// The curtain design keeps the display title on one masked line. Real film
// titles can be long, so shrink that line (never the layout) until it fits
// the copy column instead of letting it overflow under the controls.
function fitTitleLine(container, line) {
  if (!container || !line) return;
  line.style.fontSize = '';
  const available = Math.min(
    container.getBoundingClientRect().width || Infinity,
    container.parentElement ? container.parentElement.getBoundingClientRect().width : Infinity
  );
  if (!Number.isFinite(available) || available <= 0) return;
  const lineWidth = line.getBoundingClientRect().width;
  if (!lineWidth || lineWidth <= available) return;
  const base = parseFloat(window.getComputedStyle(line).fontSize) || 16;
  const fitted = Math.max(14, base * (available / lineWidth) * 0.985);
  line.style.fontSize = fitted.toFixed(2) + 'px';
}

// Swap masked char content without clearing the element: the outgoing
// line is lifted onto an absolute overlay (its own mask keeps clipping)
// and removed only when its exit tween completes, so both the out and
// the in animation always run to the end.
function swapChars(el, newText, lineClass, charClass, outVars, inVars) {
  const oldLine = el.querySelector('.' + lineClass + ':not(.cs_line_out)');
  if (oldLine) {
    oldLine.classList.add('cs_line_out');
    const oldChars = oldLine.querySelectorAll('.' + charClass);
    gsap.to(oldChars, Object.assign({
      onComplete: () => { oldLine.remove(); },
    }, outVars));
  }
  const line = buildCharLine(newText, lineClass, charClass);
  el.appendChild(line);
  fitTitleLine(el, line);
  const chars = Array.from(line.querySelectorAll('.' + charClass));
  // Park FIRST via set: a delayed fromTo does NOT immediateRender, so the
  // incoming line would sit visible at rest during the delay and "jump".
  gsap.set(chars, inVars.from);
  gsap.to(chars, inVars.to);
  return chars;
}

function buildDigitColumn(digitChar) {
  const wrap = document.createElement('span');
  wrap.className = 'cs_digit_wrap';
  const roller = document.createElement('span');
  roller.className = 'cs_digit_roller';
  for (let d = 0; d <= 9; d++) {
    const s = document.createElement('span');
    s.textContent = String(d);
    roller.appendChild(s);
  }
  wrap.appendChild(roller);
  wrap._digit = parseInt(digitChar, 10);
  wrap._roller = roller;
  return wrap;
}

function setIndexDisplay(el, valueString, total) {
  el.innerHTML = '';
  valueString.split('').forEach((ch) => {
    const col = buildDigitColumn(ch);
    gsap.set(col._roller, { y: -col._digit + 'em' });
    el.appendChild(col);
  });
  const divider = document.createElement('span');
  divider.className = 'cs_index_divider';
  divider.textContent = '/';
  el.appendChild(divider);
  const totalEl = document.createElement('span');
  totalEl.className = 'cs_index_total';
  totalEl.textContent = indexLabel(total - 1);
  el.appendChild(totalEl);
}

function rollIndex(el, value) {
  const cols = Array.from(el.querySelectorAll('.cs_digit_wrap'));
  value.split('').forEach((d, i) => {
    const col = cols[i];
    if (!col) return;
    const target = parseInt(d, 10);
    col._digit = target;
    gsap.to(col._roller, {
      y: -target + 'em',
      duration: DIGIT_DUR,
      ease: 'expo.inOut',
      force3D: true,
      overwrite: true,
    });
  });
}

// Intrinsic sizes are shared across every strip of a slide, so one probe
// per unique URL is enough to lay out the cover-fit columns. Cached at
// module level: re-mounts and re-renders never re-probe the network.
const imageMetaCache = new Map();

function cssUrl(src) {
  return 'url("' + String(src || '').replace(/["\\\n\r]/g, '') + '")';
}

function loadImageMeta(src, onReady) {
  if (!src) {
    onReady();
    return () => {};
  }
  if (imageMetaCache.has(src)) {
    onReady();
    return () => {};
  }
  let cancelled = false;
  const probe = new Image();
  const finish = () => {
    if (cancelled) return;
    imageMetaCache.set(
      src,
      probe.naturalWidth && probe.naturalHeight
        ? { width: probe.naturalWidth, height: probe.naturalHeight }
        : null
    );
    probe.onload = null;
    probe.onerror = null;
    onReady();
  };
  probe.decoding = 'async';
  probe.onload = finish;
  probe.onerror = finish;
  probe.src = src;
  return () => {
    cancelled = true;
    probe.onload = null;
    probe.onerror = null;
  };
}

// Each layer is built from COLUMNS strips painted with the shared
// cover-fit background. A strip only paints its own slice (instead of a
// full-stage image clipped by overflow), which keeps both texture memory
// and per-frame clip repaint proportional to one column. Strip edges are
// integer-snapped pixels, and every strip except the last OVERLAPS its
// right neighbor by 1px: under a fractional effective scale (preview
// scale-to-fit, browser zoom, odd dpr) exactly-tiled edges antialias
// against the stage and leak hairline seams between columns. The
// overlapped pixel shows the identical source content - invisible, but
// the seam can never open.
function layoutStrips(stage, layerParts, columns) {
  const w = stage.clientWidth || 1;
  const h = stage.clientHeight || 1;
  const edges = [];
  for (let c = 0; c <= columns; c++) edges.push(Math.round((c * w) / columns));
  layerParts.forEach((parts) => {
    const meta = imageMetaCache.get(parts.src);
    // Until intrinsic dimensions are known, the layer's own `cover`
    // background renders the photo correctly; strips stay unpainted.
    if (!meta || !meta.width || !meta.height) {
      parts.layer.classList.remove('cs_ready');
      return;
    }
    const scale = Math.max(w / meta.width, h / meta.height);
    const bgW = meta.width * scale;
    const bgH = meta.height * scale;
    const offX = (w - bgW) / 2;
    const offY = (h - bgH) / 2;
    parts.layer.classList.add('cs_ready');
    for (let c = 0; c < columns; c++) {
      const strip = parts.strips[c];
      const overlap = c < columns - 1 ? 1 : 0;
      strip.style.left = edges[c] + 'px';
      strip.style.width = (edges[c + 1] - edges[c] + overlap) + 'px';
      strip.style.backgroundSize = bgW.toFixed(2) + 'px ' + bgH.toFixed(2) + 'px';
      strip.style.backgroundPosition = (offX - edges[c]).toFixed(2) + 'px ' + offY.toFixed(2) + 'px';
    }
  });
}

function setLayerVisible(layer, visible) {
  layer.style.visibility = visible ? '' : 'hidden';
}

// A clip edge is antialiased even at inset(0) and leaks a hairline of
// the layer beneath - settled strips must carry NO clip at all.
function clearStripClips(parts) {
  for (let s = 0; s < parts.strips.length; s++) {
    parts.strips[s].style.clipPath = 'none';
    parts.strips[s].style.removeProperty('--csc');
  }
}

export default function CurtainSlider({
  className = '',
  images = [],
  duration = 1.1,
  ease = 'annnimate',
  columns = 12,
  auto = 0,
  drag = true,
  stagger = 0.0125,
  disable,
  onChange,
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const labelElRef = useRef(null);
  const titleElRef = useRef(null);
  const indexElRef = useRef(null);
  const progressFillRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const liveRegionRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const clampedColumns = Math.max(2, Math.min(24, parseInt(columns, 10) || 12));
  const resolvedEase = (ease === 'annnimate' || ease === 'annnimateInOut') ? ease : (ease || 'expo.out');
  const barDur = duration * 0.8;

  const currentIndexRef = useRef(0);
  const refsRef = useRef(null);
  const zTopRef = useRef(0);
  const goToSeqRef = useRef(0);
  const inFlightRef = useRef(null);
  const lastGoToRef = useRef(0);
  const dragStartRef = useRef(0);
  const dragActiveRef = useRef(false);
  const dragAxisSizeRef = useRef(1);
  const autoTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const reducedMotionRef = useRef(false);

  const activeSlide = useMemo(
    () => images[activeIndex] || images[0] || null,
    [images, activeIndex]
  );

  const announce = useCallback(() => {
    const refs = refsRef.current;
    if (!refs || !images.length) return;
    const slide = images[currentIndexRef.current];
    if (!slide) return;
    refs.liveRegion.textContent = 'Slide ' + (currentIndexRef.current + 1) + ' of ' + images.length + ': ' + slide.title;
  }, [images]);

  const settleCurrent = useCallback(() => {
    const refs = refsRef.current;
    if (!refs || !images.length) return;
    const slide = images[currentIndexRef.current];
    if (!slide) return;

    const titleChars = splitChars(refs.titleEl, slide.title || '', 'cs_title_line', 'cs_title_char');
    gsap.set(titleChars, { yPercent: 0, y: 0 });
    fitTitleLine(refs.titleEl, refs.titleEl.querySelector('.cs_title_line'));

    const labelChars = splitChars(refs.labelEl, slide.label || '', 'cs_label_line', 'cs_title_char');
    gsap.set(labelChars, { yPercent: 0, y: 0 });

    setIndexDisplay(refs.indexEl, indexLabel(currentIndexRef.current), images.length);

    gsap.set(refs.progressFill, {
      scaleX: (currentIndexRef.current + 1) / images.length,
      transformOrigin: 'left center',
    });

    announce();
  }, [images, announce]);

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) { clearInterval(autoTimerRef.current); autoTimerRef.current = null; }
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    if (auto > 0 && images.length > 1 && !reducedMotionRef.current) {
      autoTimerRef.current = setInterval(() => { nextRef.current(); }, auto * 1000);
    }
  }, [auto, images.length, stopAuto]);

  const armAutoResume = useCallback(() => {
    if (auto <= 0) return;
    stopAuto();
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(startAuto, AUTO_RESUME_DELAY * 1000);
  }, [auto, stopAuto, startAuto]);

  // direction: 1 = next, -1 = prev
  const goTo = useCallback((newIndex, direction) => {
    const refs = refsRef.current;
    if (!refs || !images.length || newIndex === currentIndexRef.current) return;
    if (newIndex < 0 || newIndex >= images.length) return;
    const now = performance.now();
    if (now - lastGoToRef.current < 150) return;
    lastGoToRef.current = now;

    // Reversing onto the slide that is mid-demotion: snap the in-flight
    // transition to done first so re-clipping it never flashes the stage.
    if (inFlightRef.current && newIndex === inFlightRef.current.outIndex) {
      inFlightRef.current.tl.progress(1);
      inFlightRef.current = null;
    }

    const outIndex = currentIndexRef.current;
    currentIndexRef.current = newIndex;
    setActiveIndex(newIndex);
    const slide = images[newIndex];

    const seq = ++goToSeqRef.current;
    const tl = gsap.timeline({
      onComplete: () => { if (inFlightRef.current && inFlightRef.current.tl === tl) inFlightRef.current = null; },
    });
    inFlightRef.current = { tl, outIndex };

    // --- background layers: the OUTGOING slide's columns exit through
    // their strip masks with a travel-signed stagger (the curtain), while
    // the incoming slide sits whole beneath, zoom-settling + brightening.
    const outLayer = refs.layers[outIndex];
    const inLayer = refs.layers[newIndex];
    const outParts = refs.layerParts[outIndex];
    const inParts = refs.layerParts[newIndex];
    if (!outLayer || !inLayer || !outParts || !inParts) return;

    // outgoing rides ON TOP of the incoming; monotonically increasing
    // pairs keep the newest transition's stack order under spam
    zTopRef.current += 2;
    outLayer.style.zIndex = String(images.length + zTopRef.current + 1);
    inLayer.style.zIndex = String(images.length + zTopRef.current);
    setLayerVisible(outLayer, true);
    setLayerVisible(inLayer, true);

    // an interrupted exit can leave partial clips on the layer that is now
    // incoming - clear them before it shows whole beneath the curtain
    gsap.killTweensOf(inParts.strips);
    gsap.killTweensOf(inLayer);
    gsap.killTweensOf(inParts.shades);
    clearStripClips(inParts);
    // Zoom the LAYER, not the individual strips: scaling many
    // stage-sized dpr2 textures per frame forces compositor re-rasters
    // (checkerboard-rectangle flicker on 120Hz retina); one layer
    // transform is compositor-cheap and visually identical while the
    // incoming plate is unclipped.
    gsap.set(inLayer, { scale: ZOOM_FROM, transformOrigin: '50% 50%', force3D: true });
    gsap.set(inParts.shades, { opacity: INCOMING_SHADE });

    const stripDur = duration * STRIP_DUR_RATIO;
    const stripStagger = (duration - stripDur) / Math.max(1, clampedColumns - 1);

    // The curtain: every outgoing column stays in place while its clip
    // edge wipes sideways, staggered across the row. The wipe side and
    // the stagger both follow travel: next wipes + staggers left -> right,
    // prev right -> left. Only the inset SIDE is a static template - the
    // tween drives the single --csc var (never tween inset strings - they
    // collapse and freeze).
    gsap.killTweensOf(outParts.strips);
    for (let s = 0; s < outParts.strips.length; s++) {
      outParts.strips[s].style.clipPath = direction > 0
        ? 'inset(0% 0% 0% var(--csc, 0%))'
        : 'inset(0% var(--csc, 0%) 0% 0%)';
    }
    gsap.set(outParts.strips, { '--csc': '0%' });
    // target overshoots 100%: the drift ease spends its long tail on the
    // last ~1% of distance, which parks a 1px antialiased sliver at the
    // column edge until the tween ends (it reads as a flicker). Crossing
    // the visually-empty point at 100% mid-ease kills the sliver while
    // the tail plays out invisibly (an inset past 100% renders nothing).
    tl.to(outParts.strips, {
      '--csc': '105%',
      duration: stripDur,
      ease: resolvedEase,
      stagger: direction > 0 ? stripStagger : -stripStagger,
      overwrite: true,
    }, 0);
    gsap.killTweensOf(outParts.shades);
    tl.to(outParts.shades, {
      opacity: OUT_SHADE,
      duration: stripDur * 0.8,
      ease: 'power1.in',
      stagger: direction > 0 ? stripStagger : -stripStagger,
      overwrite: 'auto',
    }, 0);

    // incoming settles underneath for the full transition length
    tl.to(inLayer, {
      scale: 1,
      duration: duration * 1.05,
      ease: resolvedEase,
      force3D: true,
    }, 0);
    tl.to(inParts.shades, {
      opacity: 0,
      duration: duration * 1.05,
      ease: resolvedEase,
    }, 0);

    tl.call(() => {
      // Only the newest transition may settle the stage: under spam, an
      // older tl completing late would otherwise restack layers a newer
      // transition is actively using.
      if (seq !== goToSeqRef.current) return;
      refs.layers.forEach((layer, i) => {
        const parts = refs.layerParts[i];
        gsap.killTweensOf(parts.strips);
        gsap.killTweensOf(layer);
        gsap.killTweensOf(parts.shades);
        clearStripClips(parts);
        gsap.set(layer, { scale: 1 });
        gsap.set(parts.shades, { opacity: 0 });
        setLayerVisible(layer, i === newIndex);
        layer.style.zIndex = i === newIndex ? String(images.length) : String(i);
      });
    }, null, duration);

    // --- texts: outgoing chars keep animating on an overlay line while the
    // incoming line staggers in - both always complete. ---
    swapChars(refs.titleEl, slide.title || '', 'cs_title_line', 'cs_title_char', {
      yPercent: direction > 0 ? -120 : 120,
      y: 0,
      duration: TITLE_OUT_DUR,
      ease: 'annnimateInOut',
      stagger: direction > 0 ? stagger : -stagger,
      force3D: true,
      overwrite: true,
    }, {
      from: { yPercent: direction > 0 ? 120 : -120, y: 0 },
      to: { yPercent: 0, y: 0, duration: TITLE_IN_DUR, ease: 'annnimateInOut', stagger: direction > 0 ? stagger : -stagger, force3D: true, overwrite: true },
    });

    swapChars(refs.labelEl, slide.label || '', 'cs_label_line', 'cs_title_char', {
      yPercent: direction > 0 ? -110 : 110,
      y: 0,
      duration: LABEL_DUR * 0.7,
      ease: 'annnimateInOut',
      force3D: true,
      overwrite: true,
    }, {
      from: { yPercent: direction > 0 ? 110 : -110, y: 0 },
      to: { yPercent: 0, y: 0, duration: LABEL_DUR, ease: 'annnimateInOut', force3D: true, overwrite: true },
    });

    rollIndex(refs.indexEl, indexLabel(newIndex));

    gsap.set(refs.progressFill, { transformOrigin: 'left center' });
    tl.to(refs.progressFill, {
      scaleX: (newIndex + 1) / images.length,
      duration: barDur,
      ease: resolvedEase,
      force3D: true,
      overwrite: 'auto',
    }, 0);

    announce();
    onChange?.({ index: newIndex, direction, slide });
  }, [images, duration, clampedColumns, resolvedEase, stagger, barDur, announce, onChange]);

  const next = useCallback(() => {
    if (images.length < 2) return;
    const i = (currentIndexRef.current + 1) % images.length;
    goTo(i, 1);
  }, [images.length, goTo]);

  const prev = useCallback(() => {
    if (images.length < 2) return;
    const i = (currentIndexRef.current - 1 + images.length) % images.length;
    goTo(i, -1);
  }, [images.length, goTo]);

  // next/prev are re-created per render (deps change with duration/ease/etc);
  // interval/keyboard handlers need a stable call-through to the latest fns.
  const nextRef = useRef(next);
  const prevRef = useRef(prev);
  nextRef.current = next;
  prevRef.current = prev;

  const { contextSafe } = useGSAP(() => {
    if (isDisabledOnViewport(disable)) return;
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container || !images.length) return;

    if (currentIndexRef.current >= images.length) {
      currentIndexRef.current = 0;
      setActiveIndex(0);
    }

    stage.innerHTML = '';

    const layerWrap = document.createElement('div');
    layerWrap.className = 'cs_layers';
    const layerParts = [];
    const layers = images.map((slide, i) => {
      const layer = document.createElement('div');
      layer.className = 'cs_layer';
      layer.style.zIndex = String(i);
      layer.style.visibility = i === currentIndexRef.current ? '' : 'hidden';
      layer.style.setProperty('--cs-img', cssUrl(slide.src));
      // One decoded bitmap per slide is shared by all its strips (no
      // per-strip <img> copies), so DOM and GPU texture count stay flat.
      const parts = { layer, src: slide.src, strips: [], shades: [] };
      for (let c = 0; c < clampedColumns; c++) {
        const strip = document.createElement('div');
        strip.className = 'cs_strip';
        const shade = document.createElement('div');
        shade.className = 'cs_shade';
        shade.setAttribute('aria-hidden', 'true');
        strip.appendChild(shade);
        layer.appendChild(strip);
        parts.strips.push(strip);
        parts.shades.push(shade);
      }
      layerParts.push(parts);
      layerWrap.appendChild(layer);
      return layer;
    });

    const scrim = document.createElement('div');
    scrim.className = 'cs_scrim';
    scrim.setAttribute('aria-hidden', 'true');

    stage.appendChild(layerWrap);
    stage.appendChild(scrim);

    refsRef.current = {
      layers,
      layerParts,
      labelEl: labelElRef.current,
      titleEl: titleElRef.current,
      indexEl: indexElRef.current,
      progressFill: progressFillRef.current,
      prevBtn: prevBtnRef.current,
      nextBtn: nextBtnRef.current,
      liveRegion: liveRegionRef.current,
    };

    layoutStrips(stage, layerParts, clampedColumns);
    settleCurrent();

    // Probe each unique photo once; when its intrinsic size lands, the
    // strips can paint their slices instead of the layer fallback. Probe
    // callbacks coalesce into one relayout per frame (several photos can
    // finish in the same tick).
    const cancelMetaLoads = [];
    const probed = new Set();
    let relayoutFrame = 0;
    const scheduleRelayout = () => {
      if (relayoutFrame) return;
      relayoutFrame = requestAnimationFrame(() => {
        relayoutFrame = 0;
        if (!refsRef.current || !stageRef.current) return;
        layoutStrips(stageRef.current, refsRef.current.layerParts, clampedColumns);
      });
    };
    images.forEach((slide) => {
      if (!slide.src || probed.has(slide.src)) return;
      probed.add(slide.src);
      cancelMetaLoads.push(loadImageMeta(slide.src, scheduleRelayout));
    });

    container.setAttribute('tabindex', container.getAttribute('tabindex') || '0');

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      reducedMotionRef.current = true;
      gsap.globalTimeline.timeScale(20);
      return () => {
        reducedMotionRef.current = false;
        gsap.globalTimeline.timeScale(1);
      };
    });

    startAuto();

    return () => {
      mm.revert();
      stopAuto();
      cancelMetaLoads.forEach((cancel) => cancel());
      if (relayoutFrame) cancelAnimationFrame(relayoutFrame);
      clearTimeout(resumeTimerRef.current);
      if (inFlightRef.current) {
        inFlightRef.current.tl.kill();
        inFlightRef.current = null;
      }
      zTopRef.current = 0;
      gsap.globalTimeline.resume();
      layers.forEach((layer, i) => {
        gsap.killTweensOf(layerParts[i].strips);
        gsap.killTweensOf(layerParts[i].shades);
        gsap.killTweensOf(layer);
      });
      if (progressFillRef.current) gsap.killTweensOf(progressFillRef.current);
    };
  }, { scope: containerRef, dependencies: [images, clampedColumns, disable] });

  // Keep the display line fitted once React has committed the new slide's
  // meta/actions (their width can change the copy column width).
  useEffect(() => {
    const titleEl = titleElRef.current;
    if (!titleEl) return;
    fitTitleLine(titleEl, titleEl.querySelector('.cs_title_line:not(.cs_line_out)'));
  }, [activeIndex]);

  // Local display fonts can land after first paint; re-fit once they do.
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const titleEl = titleElRef.current;
      if (!titleEl) return;
      titleEl.querySelectorAll('.cs_title_line').forEach((line) => fitTitleLine(titleEl, line));
    });
    return () => { cancelled = true; };
  }, [images]);

  const handlePrevClick = contextSafe(() => { prev(); armAutoResume(); });
  const handleNextClick = contextSafe(() => { next(); armAutoResume(); });

  const animateArrowHoverIn = contextSafe((e, dir) => {
    const icon = e.currentTarget.querySelector('.cs_arrow_icon');
    gsap.to(icon, { x: dir * 3, duration: ARROW_HOVER_DUR, ease: 'back.out(2)', overwrite: 'auto', force3D: true });
  });
  const animateArrowHoverOut = contextSafe((e) => {
    const icon = e.currentTarget.querySelector('.cs_arrow_icon');
    gsap.to(icon, { x: 0, duration: ARROW_HOVER_DUR, ease: 'expo.out', overwrite: 'auto', force3D: true });
  });
  const animateArrowPressDown = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 0.92, duration: ARROW_PRESS_DUR, ease: 'power2.out', overwrite: 'auto', force3D: true });
  });
  const animateArrowPressUp = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: ARROW_PRESS_DUR, ease: 'back.out(2.5)', overwrite: 'auto', force3D: true });
  });
  const animateArrowPressLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: ARROW_PRESS_DUR, ease: 'power2.out', overwrite: 'auto', force3D: true });
  });

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { next(); armAutoResume(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { prev(); armAutoResume(); }
  }, [next, prev, armAutoResume]);

  const handlePointerDown = useCallback((e) => {
    if (!drag) return;
    if (e.target.closest('a, button, .cs_pill')) { dragActiveRef.current = false; return; }
    dragActiveRef.current = true;
    dragStartRef.current = e.clientX;
    dragAxisSizeRef.current = stageRef.current ? stageRef.current.clientWidth : 1;
  }, [drag]);

  const handlePointerUp = useCallback((e) => {
    if (!dragActiveRef.current) return;
    dragActiveRef.current = false;
    const pos = e.clientX;
    const delta = pos - dragStartRef.current;
    const threshold = dragAxisSizeRef.current * SWIPE_THRESHOLD_RATIO;
    if (Math.abs(delta) < threshold) return;
    if (delta < 0) next(); else prev();
    armAutoResume();
  }, [next, prev, armAutoResume]);

  // resize: strip edges are integer-snapped pixels - re-derive on every resize
  useEffect(() => {
    let resizeTimer = null;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!refsRef.current || !stageRef.current) return;
        layoutStrips(stageRef.current, refsRef.current.layerParts, clampedColumns);
        const titleEl = titleElRef.current;
        if (titleEl) {
          titleEl.querySelectorAll('.cs_title_line').forEach((line) => fitTitleLine(titleEl, line));
        }
      }, 150);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [clampedColumns]);

  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) { gsap.globalTimeline.pause(); stopAuto(); }
      else { gsap.globalTimeline.resume(); startAuto(); }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [stopAuto, startAuto]);

  if (!images.length || !activeSlide) return null;

  return (
    <div
      ref={containerRef}
      className={`cs_wrap${className ? ' ' + className : ''}`}
      data-anm-curtain-slider
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured titles"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragActiveRef.current = false; }}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      onFocus={stopAuto}
      onBlur={startAuto}
    >
      <div className="cs_stage" ref={stageRef} data-anm-cs-stage>
        {/* Layer stack and scrim built imperatively above (cover-fit column
            strips reassembled from live img sources). */}
      </div>

      <div className="cs_copy">
        <div className="cs_meta" aria-label="Title information">
          {Number(activeSlide.rating) > 0 && (
            <span className="cs_meta__rating">
              <Star size={15} fill="currentColor" aria-hidden="true" />
              <span>{Number(activeSlide.rating).toFixed(1)} / 10</span>
            </span>
          )}
          {activeSlide.year && <span className="cs_meta__item">{activeSlide.year}</span>}
          {activeSlide.mediaLabel && <span className="cs_meta__item">{activeSlide.mediaLabel}</span>}
        </div>

        {(activeSlide.watchTo || activeSlide.trailerTo) && (
          <div className="cs_actions" aria-label={`Actions for ${activeSlide.title}`}>
            {activeSlide.watchTo && (
              <MediaActionButton
                as={Link}
                to={activeSlide.watchTo}
                onClick={() => play('press')}
                label="Watch"
                icon={Play}
                activeIcon={CirclePlay}
                primary
                className="hero-media-action"
              />
            )}
            {activeSlide.trailerTo && (
              <MediaActionButton
                as={Link}
                to={activeSlide.trailerTo}
                onClick={() => play('press')}
                label="Trailer"
                icon={Clapperboard}
                activeIcon={SquarePlay}
                className="hero-media-action"
              />
            )}
          </div>
        )}

        <h2 className="cs_title" ref={titleElRef} />
      </div>

      <div className="cs_label" ref={labelElRef} />
      <div className="cs_index" ref={indexElRef} aria-hidden="true" />

      <div className="cs_progress" aria-hidden="true">
        <div className="cs_progress_fill" ref={progressFillRef} />
      </div>

      {images.length > 1 && (
        <div className="cs_pill" role="group" aria-label="Slide controls">
          <button
            ref={prevBtnRef}
            type="button"
            className="cs_arrow"
            aria-label="Previous slide"
            onClick={handlePrevClick}
            onMouseEnter={(e) => animateArrowHoverIn(e, -1)}
            onMouseLeave={animateArrowHoverOut}
            onPointerDown={animateArrowPressDown}
            onPointerUp={animateArrowPressUp}
            onPointerLeave={animateArrowPressLeave}
          >
            <svg className="cs_arrow_icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            className="cs_arrow"
            aria-label="Next slide"
            onClick={handleNextClick}
            onMouseEnter={(e) => animateArrowHoverIn(e, 1)}
            onMouseLeave={animateArrowHoverOut}
            onPointerDown={animateArrowPressDown}
            onPointerUp={animateArrowPressUp}
            onPointerLeave={animateArrowPressLeave}
          >
            <svg className="cs_arrow_icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="cs_live" aria-live="polite" ref={liveRegionRef} />
    </div>
  );
}
