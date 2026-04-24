import React, {
  useState, useCallback, useRef, useEffect, useMemo, memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub, FaYoutube, FaTimes, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { styles } from "../styles";
import { textVariant, fadeIn } from "../utils/motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { useProjects } from "../hooks/useProjects";

// ─── Constants ────────────────────────────────────────────────────────────────
const CONT_H     = 540;   // container height px for 2D Grid
const GAP        = 12;    // gap between cards px
const PAGE_SIZE  = 6;     // cards per page
const GRID_COLS  = 12;    // virtual column grid
const GRID_ROWS  = 6;     // virtual row grid

const CARD_SPRING    = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 };

// 320 ms lock to prevent mid-flight reflows breaking the grid matrix
const SPRING_LOCK_MS = 320;

const GRADS = [
  ["#5522cc", "#1a3080"],
  ["#2a0060", "#0a0a30"],
  ["#001540", "#050816"],
  ["#0a2040", "#050816"],
  ["#150040", "#050816"],
  ["#0a1530", "#050816"],
];

// ─── True 2D Packer ───────────────────────────────────────────────────────────

function computeLayout(visibleProjects, hoveredIdx, containerW) {
  if (!visibleProjects.length) return [];

  const W = containerW > 0 ? containerW : 960;
  const H = CONT_H;

  const cellW = (W - GAP * (GRID_COLS - 1)) / GRID_COLS;
  const cellH = (H - GAP * (GRID_ROWS - 1)) / GRID_ROWS;

  const matrix = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(false)
  );

  const rects = [];

  for (let i = 0; i < visibleProjects.length; i++) {
    let cSpan = 2;
    let rSpan = 2;

    if (hoveredIdx !== null) {
      const dist = Math.abs(i - hoveredIdx);
      if (dist === 0) {
        cSpan = 4;
        rSpan = 4;
      } else if (dist === 1) {
        cSpan = 2;
        rSpan = 2;
      } else if (dist === 2) {
        cSpan = i % 2 === 0 ? 2 : 1;
        rSpan = i % 2 === 0 ? 1 : 2;
      } else {
        cSpan = 1;
        rSpan = 1;
      }
    }

    cSpan = Math.min(cSpan, GRID_COLS);
    rSpan = Math.min(rSpan, GRID_ROWS);

    let placed = false;
    for (let row = 0; row <= GRID_ROWS - rSpan; row++) {
      for (let col = 0; col <= GRID_COLS - cSpan; col++) {
        let fits = true;
        for (let r = 0; r < rSpan; r++) {
          for (let c = 0; c < cSpan; c++) {
            if (matrix[row + r][col + c]) {
              fits = false; break;
            }
          }
          if (!fits) break;
        }

        if (fits) {
          for (let r = 0; r < rSpan; r++) {
            for (let c = 0; c < cSpan; c++) {
              matrix[row + r][col + c] = true;
            }
          }
          const pxX = col * cellW + col * GAP;
          const pxY = row * cellH + row * GAP;
          const pxW = cSpan * cellW + Math.max(0, cSpan - 1) * GAP;
          const pxH = rSpan * cellH + Math.max(0, rSpan - 1) * GAP;
          
          rects.push({
            id: visibleProjects[i].id ?? i,
            origIdx: i,
            project: visibleProjects[i],
            x: pxX,
            y: pxY,
            w: pxW,
            h: pxH,
            col, row, cSpan, rSpan
          });
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    if (!placed) {
      // Fallback
      rects.push({
        id: visibleProjects[i].id ?? i,
        origIdx: i,
        project: visibleProjects[i],
        x: 0, y: 0, w: cellW, h: cellH,
        col: 0, row: 0, cSpan: 1, rSpan: 1
      });
    }
  }

  return rects;
}

// ─── BentoCard ────────────────────────────────────────────────────────────────
const BentoCard = memo(function BentoCard({
  project, origIdx, isHovered, isFaded, onEnter, onLeave, onClick,
}) {
  const tiltRef = useRef(null);
  const [g0, g1] = GRADS[origIdx % GRADS.length];
  const tags = useMemo(
    () => project.techStack?.split(",").slice(0, 5) || [],
    [project.techStack],
  );

  const onMouseMove = useCallback((e) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const ry = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    el.style.transform = `perspective(700px) rotateX(${-ry}deg) rotateY(${rx}deg)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (tiltRef.current)
      tiltRef.current.style.transform =
        "perspective(700px) rotateX(0deg) rotateY(0deg)";
    onLeave();
  }, [onLeave]);

  return (
    <div
      ref={tiltRef}
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: `linear-gradient(135deg, ${g0}44 0%, ${g1}dd 100%)`,
        border: isHovered
          ? "1.5px solid rgba(145,94,255,0.85)"
          : "1.5px solid rgba(145,94,255,0.18)",
        boxShadow: isHovered
          ? "0 0 48px rgba(145,94,255,0.4), 0 16px 40px rgba(0,0,0,0.6)"
          : "0 4px 18px rgba(0,0,0,0.28)",
        opacity: isFaded ? 0.60 : 1,
        transition:
          "transform 0.12s ease, border-color 0.3s ease, " +
          "box-shadow 0.3s ease, opacity 0.35s ease",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onEnter}
      onClick={onClick}
    >
      {/* Image */}
      {project.image && (
        <div
          className="absolute inset-0"
          style={{
            opacity: isHovered ? 0.60 : 0.22,
            transition: "opacity 0.4s ease",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/95 via-[#050816]/40 to-transparent" />

      {/* Gloss */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg,rgba(255,255,255,0.09) 0%,transparent 50%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Index */}
      <span
        className="absolute top-3 left-3.5 font-mono tracking-widest"
        style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}
      >
        {String(origIdx + 1).padStart(2, "0")}
      </span>

      {/* Pulse dot */}
      <div
        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          border: "1px solid rgba(145,94,255,0.45)",
          background: "rgba(145,94,255,0.12)",
          color: "#915EFF",
          fontSize: 9,
          fontWeight: 700,
          animation: isHovered ? "bentoP 1.1s ease-in-out infinite" : "none",
        }}
      >
        +
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        {/* Tags — appear on hover */}
        <div
          style={{
            maxHeight: isHovered ? "64px" : "0",
            opacity: isHovered ? 1 : 0,
            overflow: "hidden",
            marginBottom: isHovered ? "7px" : "0",
            transition:
              "max-height 0.3s ease, opacity 0.25s ease, margin-bottom 0.25s ease",
          }}
        >
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono rounded-full px-2 py-0.5"
                style={{
                  fontSize: 8,
                  background: "rgba(145,94,255,0.15)",
                  border: "1px solid rgba(145,94,255,0.35)",
                  color: "#cc99ff",
                }}
              >
                #{t.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-white leading-snug"
          style={{
            fontSize: isHovered ? 14 : 10,
            transition: "font-size 0.25s ease",
          }}
        >
          {project.title}
        </h3>

        {/* Click hint */}
        <div
          style={{
            maxHeight: isHovered ? "20px" : "0",
            opacity: isHovered ? 1 : 0,
            overflow: "hidden",
            marginTop: 4,
            transition: "all 0.25s ease 0.06s",
          }}
        >
          <p
            className="font-mono flex items-center gap-1.5"
            style={{ fontSize: 9, color: "#915EFF" }}
          >
            <span
              style={{
                display: "inline-block",
                width: 5, height: 5,
                borderRadius: "50%",
                background: "#915EFF",
                animation: "bentoP 1.1s ease-in-out infinite",
              }}
            />
            Click to explore
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bentoP {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </div>
  );
});

// ─── YouTubeEmbed ─────────────────────────────────────────────────────────────
const YouTubeEmbed = memo(function YouTubeEmbed({ videoId, title }) {
  if (!videoId)
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(135deg,#1a1040,#050816)" }}
      >
        <FaYoutube style={{ fontSize: 48, color: "rgba(255,80,80,0.35)" }} />
        <p className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
          No demo video
        </p>
      </div>
    );
  return (
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
      title={title || "Demo"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
});

// ─── Diorama ─────────────────────────────────────────────────────────────────
const Diorama = memo(function Diorama({
  project, index, total, videoLeft, onClose, onPrev, onNext,
}) {
  const tags = project.techStack?.split(",") || [];

  const videoPanel = (
    <div className="relative overflow-hidden" style={{ background: "#000" }}>
      {project.video ? (
        <YouTubeEmbed videoId={project.video} title={project.title} />
      ) : project.image ? (
        <>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: videoLeft
                ? "linear-gradient(to right,transparent,#08061e)"
                : "linear-gradient(to left,transparent,#08061e)",
            }}
          />
        </>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#1a1040,#050816)" }}
        >
          <FaYoutube style={{ fontSize: 64, color: "rgba(255,255,255,0.07)" }} />
        </div>
      )}
      {project.video && (
        <div
          className="absolute top-3 left-3 flex items-center gap-1 font-bold rounded px-2 py-0.5 text-white"
          style={{ fontSize: 9, background: "rgba(210,0,0,0.85)" }}
        >
          <FaYoutube size={9} /> DEMO
        </div>
      )}
    </div>
  );

  const detailPanel = (
    <motion.div
      className="flex flex-col justify-between h-full p-7"
      style={{ background: "#08061e" }}
      initial={{ opacity: 0, x: videoLeft ? 24 : -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="font-mono uppercase tracking-wider rounded px-2 py-0.5"
                style={{
                  fontSize: 9,
                  background: "rgba(145,94,255,0.1)",
                  border: "1px solid rgba(145,94,255,0.25)",
                  color: "#cc99ff",
                }}
              >
                {t.trim()}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#888",
            }}
            aria-label="Close"
          >
            <FaTimes size={10} />
          </button>
        </div>

        <h2
          className="font-black text-white leading-tight tracking-tight"
          style={{ fontSize: "clamp(18px,3vw,26px)" }}
        >
          {project.title}
        </h2>
        <p className="font-mono mt-1" style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>
          xr_project /{" "}
          {(project.title || "").toLowerCase().replace(/\s+/g, "_")}
        </p>

        <p className="leading-relaxed mt-4" style={{ fontSize: 13, color: "rgba(255,255,255,0.58)" }}>
          {project.description ||
            "High-performance XR / simulation project built for precision industrial training."}
        </p>

        <div className="mt-5">
          <p className="uppercase tracking-widest mb-2"
            style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono rounded-full px-2.5 py-1"
                style={{
                  fontSize: 10,
                  background: "rgba(145,94,255,0.12)",
                  border: "1px solid rgba(145,94,255,0.28)",
                  color: "#cc99ff",
                }}
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{
              background: "rgba(145,94,255,0.1)",
              border: "1px solid rgba(145,94,255,0.25)",
              color: "#915EFF",
            }}
            aria-label="Previous"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={onNext}
            disabled={index === total - 1}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{
              background: "rgba(145,94,255,0.1)",
              border: "1px solid rgba(145,94,255,0.25)",
              color: "#915EFF",
            }}
            aria-label="Next"
          >
            <FaChevronRight size={12} />
          </button>
        </div>

        <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        {project.route && project.route !== "#" && (
          <button
            onClick={() => window.open(project.route, "_blank", "noopener noreferrer")}
            className="flex items-center gap-2 font-semibold"
            style={{ fontSize: 12, color: "#915EFF" }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(145,94,255,0.1)",
                border: "1px solid rgba(145,94,255,0.28)",
              }}
            >
              <FaGithub size={12} />
            </span>
            GitHub
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(5,8,22,0.93)", backdropFilter: "blur(14px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          maxWidth: 960,
          height: "min(580px,85vh)",
          border: "1px solid rgba(145,94,255,0.3)",
          boxShadow: "0 0 80px rgba(145,94,255,0.22), 0 40px 80px rgba(0,0,0,0.6)",
          display: "grid",
          gridTemplateColumns: videoLeft ? "55% 45%" : "45% 55%",
        }}
        initial={{ scale: 0.87, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 18, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        {videoLeft
          ? <>{videoPanel}{detailPanel}</>
          : <>{detailPanel}{videoPanel}</>}
      </motion.div>
    </motion.div>
  );
});

// ─── Works ────────────────────────────────────────────────────────────────────
const Works = () => {
  const { projects, loading, error } = useProjects();

  const containerRef = useRef(null);
  const leaveTimer   = useRef(null);
  const lockTimer    = useRef(null);   // animation-lock timer
  const isLocked     = useRef(false);  // true while grid is reforming

  const [containerW, setContainerW] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeIdx,  setActiveIdx]  = useState(null);
  const [page,       setPage]       = useState(0);

  // ── Paged slice ────────────────────────────────────────────────────────────
  const pageProjects = useMemo(() => {
    if (!projects?.length) return [];
    return projects.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  }, [projects, page]);

  const totalPages = useMemo(
    () => Math.ceil((projects?.length || 0) / PAGE_SIZE),
    [projects],
  );

  // ── Measure container ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setContainerW(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reset on page change ───────────────────────────────────────────────────
  useEffect(() => {
    setHoveredIdx(null);
    clearTimeout(lockTimer.current);
    clearTimeout(leaveTimer.current);
    isLocked.current = false;
  }, [page]);

  // ── Layout computation ─────────────────────────────────────────────────────
  const effectiveW = containerW || (containerRef.current?.offsetWidth ?? 960);
  const rects = useMemo(
    () => computeLayout(pageProjects, hoveredIdx, effectiveW),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageProjects, hoveredIdx, effectiveW],
  );

  // ── Hover callbacks — animation-lock pattern ───────────────────────────────
  //
  // On enter  → trigger layout, immediately lock input, unlock after spring settles
  // On leave  → ignored while locked; clears hovered after small debounce
  //
  const onCardEnter = useCallback((idx) => {
    if (isLocked.current) return;          // grid still reforming — ignore
    clearTimeout(leaveTimer.current);
    clearTimeout(lockTimer.current);

    setHoveredIdx(idx);                    // 1. trigger layout recompute
    isLocked.current = true;              // 2. freeze input immediately

    lockTimer.current = setTimeout(() => {
      isLocked.current = false;           // 3. unlock once spring settles
    }, SPRING_LOCK_MS);
  }, []);

  const onCardLeave = useCallback(() => {
    if (isLocked.current) return;          // wait for grid to finish
    leaveTimer.current = setTimeout(() => setHoveredIdx(null), 60);
  }, []);

  // ── Keyboard nav ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeIdx === null || !projects?.length) return;
    const h = (e) => {
      if (e.key === "ArrowRight") setActiveIdx((i) => Math.min(i + 1, projects.length - 1));
      if (e.key === "ArrowLeft")  setActiveIdx((i) => Math.max(i - 1, 0));
      if (e.key === "Escape")     setActiveIdx(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeIdx, projects?.length]);

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = activeIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIdx]);

  // ── Stable video sides ─────────────────────────────────────────────────────
  const videoSides = useMemo(
    () => (projects || []).map((p, i) => (p.id?.charCodeAt(0) ?? i) % 2 === 0),
    [projects],
  );

  if (loading) return null;

  if (error)
    return (
      <div
        className="w-full flex items-center justify-center min-h-[400px] rounded-2xl"
        style={{
          border: "1px solid rgba(145,94,255,0.2)",
          background: "rgba(29,16,64,0.2)",
        }}
      >
        <p className="text-lg text-center px-4" style={{ color: "rgba(255,255,255,0.44)" }}>
          Project gallery temporarily offline.
        </p>
      </div>
    );

  return (
    <div className="relative" style={{ zIndex: 10 }}>

      {/* Header */}
      <motion.div variants={textVariant()} className="mb-10">
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Featured XR simulations and immersive systems.
          Hover any card to make it dominant — click to explore.
        </motion.p>
      </motion.div>

      {/* Bento grid — fixed height, absolute-positioned cards */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: CONT_H }}
      >
        {rects.map((rect) => {
          const globalIdx = page * PAGE_SIZE + rect.origIdx;
          const isHovered = hoveredIdx === rect.origIdx;
          // Fade all non-hero cards when anyone is hovered
          const isFaded   = hoveredIdx !== null && !isHovered;

          return (
            <motion.div
              key={`${page}-${rect.id}`}
              initial={{ opacity: 0, x: rect.x, y: rect.y, width: rect.w, height: rect.h }}
              animate={{ opacity: 1, x: rect.x, y: rect.y, width: rect.w, height: rect.h }}
              transition={{
                ...CARD_SPRING,
                opacity: { duration: 0.3, ease: "easeOut" },
              }}
              style={{
                position: "absolute",
                willChange: "transform, width",
              }}
              onMouseEnter={() => onCardEnter(rect.origIdx)}
              onMouseLeave={onCardLeave}
            >
              <BentoCard
                project={rect.project}
                origIdx={rect.origIdx}
                isHovered={isHovered}
                isFaded={isFaded}
                onEnter={() => onCardEnter(rect.origIdx)}
                onLeave={onCardLeave}
                onClick={() => setActiveIdx(globalIdx)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 transition-all"
            style={{
              background: "rgba(145,94,255,0.1)",
              border: "1px solid rgba(145,94,255,0.28)",
              color: "#915EFF",
            }}
            aria-label="Previous page"
          >
            <FaChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width:      i === page ? 20 : 8,
                  height:     8,
                  background: i === page ? "#915EFF" : "rgba(145,94,255,0.3)",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 transition-all"
            style={{
              background: "rgba(145,94,255,0.1)",
              border: "1px solid rgba(145,94,255,0.28)",
              color: "#915EFF",
            }}
            aria-label="Next page"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Diorama overlay */}
      <AnimatePresence>
        {activeIdx !== null && projects?.[activeIdx] && (
          <Diorama
            key={activeIdx}
            project={projects[activeIdx]}
            index={activeIdx}
            total={projects.length}
            videoLeft={videoSides[activeIdx]}
            onClose={() => setActiveIdx(null)}
            onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
            onNext={() => setActiveIdx((i) => Math.min(projects.length - 1, i + 1))}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default SectionWrapper(Works, "projects");
