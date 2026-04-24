import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Configuration
const GRID_COLS = 12;
const GRID_ROWS = 6;
const GAP = 12;

// The items we want to render (dummy data)
const DUMMY_CARDS = [
  { id: 1, title: "Card 1: Screwing Process", color: "#1a1040" },
  { id: 2, title: "Card 2: Terminal Fixing", color: "#001540" },
  { id: 3, title: "Card 3: Holder Fixing", color: "#0a2040" },
  { id: 4, title: "Card 4: Die Casting", color: "#150040" },
  { id: 5, title: "Card 5: Leakage Testing", color: "#0a1530" },
  { id: 6, title: "Card 6: Painting Process", color: "#2a0060" },
];

/**
 * 2D Grid Packing Algorithm
 * Iterates cards in order and finds the first available (row, col) that fits the span.
 */
function packGrid(cards, hoveredIdx) {
  // Initialize grid availability matrix [GRID_ROWS][GRID_COLS]
  const matrix = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(false)
  );

  const rects = [];

  for (let i = 0; i < cards.length; i++) {
    // 1. Determine target spans
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

    // Constrain spans to grid bounds just in case
    cSpan = Math.min(cSpan, GRID_COLS);
    rSpan = Math.min(rSpan, GRID_ROWS);

    // 2. Find first fit
    let placed = false;
    for (let row = 0; row <= GRID_ROWS - rSpan; row++) {
      for (let col = 0; col <= GRID_COLS - cSpan; col++) {
        // Check if cells are free
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
          // Mark as occupied
          for (let r = 0; r < rSpan; r++) {
            for (let c = 0; c < cSpan; c++) {
              matrix[row + r][col + c] = true;
            }
          }
          rects.push({ col, row, cSpan, rSpan, card: cards[i], idx: i });
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    // fallback if no fit found (shouldn't happen with these sizes, but safety first)
    if (!placed) {
      rects.push({ col: 0, row: 0, cSpan: 1, rSpan: 1, card: cards[i], idx: i });
    }
  }

  return rects;
}

const DummyBento = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef(null);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute Layout
  const rects = useMemo(
    () => packGrid(DUMMY_CARDS, hoveredIdx),
    [hoveredIdx]
  );

  const cellW = (containerSize.w - GAP * (GRID_COLS - 1)) / GRID_COLS;
  const cellH = (containerSize.h - GAP * (GRID_ROWS - 1)) / GRID_ROWS;

  return (
    <div className="w-full min-h-screen bg-[#050816] flex items-center justify-center p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="text-white font-sans">
          <h1 className="text-4xl font-black mb-2">Dummy 2D Adaptive Bento Grid</h1>
          <p className="text-secondary text-sm">
            Strict 2D Solver (12x6). Hover a card to make it dominant (4x4), neighbors compress (2x2), distant shrink (1x1).
          </p>
        </div>

        {/* The Grid Container */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-video rounded-xl bg-white/5 border border-white/10"
          style={{ minHeight: 600 }}
        >
          {containerSize.w > 0 && rects.map((rect) => {
            const isHovered = hoveredIdx === rect.idx;
            const isDimmed = hoveredIdx !== null && !isHovered;

            // Pixel conversions
            const pxX = rect.col * cellW + rect.col * GAP;
            const pxY = rect.row * cellH + rect.row * GAP;
            const pxW = rect.cSpan * cellW + Math.max(0, rect.cSpan - 1) * GAP;
            const pxH = rect.rSpan * cellH + Math.max(0, rect.rSpan - 1) * GAP;

            return (
              <motion.div
                key={rect.card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  x: pxX, 
                  y: pxY, 
                  width: pxW, 
                  height: pxH,
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  mass: 0.8
                }}
                onMouseEnter={() => setHoveredIdx(rect.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: "absolute",
                  willChange: "transform, width, height",
                  zIndex: isHovered ? 20 : 10,
                }}
                className="overflow-hidden rounded-2xl cursor-pointer shadow-xl transition-all duration-300"
              >
                <div 
                  className="w-full h-full flex flex-col items-center justify-center p-6 border transition-all duration-300"
                  style={{
                    backgroundColor: rect.card.color,
                    borderColor: isHovered ? 'rgba(145,94,255,0.7)' : 'rgba(255,255,255,0.05)',
                    boxShadow: isHovered ? '0 0 40px rgba(145,94,255,0.3)' : 'none',
                    opacity: isDimmed ? 0.4 : 1,
                    transform: isDimmed ? 'scale(0.96)' : 'scale(1)',
                  }}
                >
                  {/* Grid Span Visualizer */}
                  <span className="absolute top-3 left-3 font-mono text-[10px] text-white/30">
                    Pos: ({rect.col}, {rect.row}) • Span: {rect.cSpan}x{rect.rSpan}
                  </span>
                  
                  <h3 
                    className="font-bold text-white text-center leading-tight transition-all duration-300"
                    style={{ fontSize: rect.cSpan >= 2 && rect.rSpan >= 2 ? 18 : 12 }}
                  >
                    {rect.card.title}
                  </h3>
                  
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 px-4 py-2 rounded-full bg-white/10 text-xs text-white/70 font-mono"
                    >
                      Dominant Node
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default DummyBento;
