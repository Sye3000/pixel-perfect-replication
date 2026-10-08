import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import tent from "@/assets/logo/tent.png";
import ground from "@/assets/logo/ground.png";
import protractor from "@/assets/logo/protractor.png";
import diamonds from "@/assets/logo/diamonds.png";
import campus from "@/assets/logo/campus.png";
import one from "@/assets/logo/one.png";
import wordmark from "@/assets/logo/wordmark.png";

// Pieces are pixel-exact layers cut from the supplied CampusOne artwork (same canvas, so
// they line up perfectly at x/y = 0). Scatter offsets are % of the logo box.
const PIECES = [
  { src: ground, x: -24, y: 22, r: -14, z: -60 },
  { src: tent, x: -18, y: -22, r: -10, z: 40, tent: true },
  { src: protractor, x: -40, y: 10, r: 28, z: 90 },
  { src: diamonds, x: 34, y: -30, r: -22, z: 120 },
  { src: campus, x: 38, y: 6, r: 18, z: 70 },
  { src: one, x: 26, y: 34, r: -16, z: 100 },
  { src: wordmark, x: 8, y: 26, r: 8, z: 30 },
];

export function LogoAssemble({ onComplete, className = "" }: { onComplete?: () => void; className?: string }) {
  const reduce = useReducedMotion();
  const [assembled, setAssembled] = useState(false);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (reduce) {
      setAssembled(true);
      onComplete?.();
    }
  }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (reduce) return;
    const next = !assembled;
    setAssembled(next);
    setGlow(false);
    if (next) {
      setTimeout(() => {
        setGlow(true);
        onComplete?.();
      }, 900);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={assembled ? "Replay CampusOne logo animation" : "Tap to assemble the CampusOne logo"}
      className={`group relative flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl ${className}`}
      style={{ perspective: 900 }}
    >
      <motion.div
        className="relative aspect-[1600/1533] w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          assembled
            ? { rotateX: 0, rotateY: 0, scale: glow ? [1, 1.04, 1] : 1 }
            : { rotateX: 14, rotateY: -12, scale: 0.92 }
        }
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        {PIECES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={false}
            animate={
              assembled
                ? { x: "0%", y: "0%", rotate: 0, z: 0, opacity: 1 }
                : {
                    x: `${p.x}%`,
                    y: [`${p.y}%`, `${p.y - 3}%`, `${p.y}%`],
                    rotate: p.r,
                    z: p.z,
                    opacity: 0.95,
                  }
            }
            transition={
              assembled
                ? { type: "spring", stiffness: 170, damping: 16, delay: i * 0.06 }
                : {
                    y: { duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                    default: { type: "spring", stiffness: 80, damping: 12 },
                  }
            }
          >
            <img
              src={p.src}
              alt=""
              draggable={false}
              className="h-full w-full select-none"
              style={
                p.tent
                  ? {
                      filter:
                        "drop-shadow(3px 3px 0 oklch(0.2 0.06 260)) drop-shadow(6px 6px 0 oklch(0.16 0.05 260)) drop-shadow(10px 14px 14px oklch(0.2 0.06 260 / 35%))",
                    }
                  : undefined
              }
            />
          </motion.div>
        ))}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-[10%] -z-10 rounded-full bg-brand/30 blur-3xl"
          animate={{ opacity: glow ? [0, 0.9, 0.35] : 0 }}
          transition={{ duration: 1.2 }}
        />
      </motion.div>
      <span className="sr-only">CampusOne</span>
      <motion.span
        className="mt-4 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground"
        animate={{ opacity: assembled ? 0.6 : [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: assembled ? 0 : Infinity }}
      >
        {assembled ? "Tap to replay" : "Tap to assemble"}
      </motion.span>
    </button>
  );
}

export function LogoStatic({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-[1600/1533] ${className}`} role="img" aria-label="CampusOne">
      {[ground, tent, protractor, diamonds, campus, one, wordmark].map((s, i) => (
        <img key={i} src={s} alt="" className="absolute inset-0 h-full w-full" />
      ))}
    </div>
  );
}
