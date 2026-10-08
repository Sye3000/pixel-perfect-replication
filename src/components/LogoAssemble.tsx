import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CAMPUSONE_PIECES, CampusOneArtwork } from "@/components/CampusOneArtwork";

type Phase = "scattered" | "assembling" | "assembled";
type LogoAssembleProps = {
  onComplete?: () => void;
  className?: string;
  startAssembled?: boolean;
};

export function LogoAssemble({ onComplete, className = "", startAssembled = false }: LogoAssembleProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(startAssembled ? "assembled" : "scattered");
  const [locked, setLocked] = useState(false);
  const [run, setRun] = useState(0);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const isAssembled = Boolean(reduce) || phase !== "scattered";

  useEffect(() => {
    if (reduce) {
      setPhase("assembled");
      complete.current?.();
    }
  }, [reduce]);

  useEffect(() => {
    if (phase !== "assembling" || reduce) return;
    const lock = window.setTimeout(() => setLocked(true), 2700);
    const finish = window.setTimeout(() => {
      setPhase("assembled");
      complete.current?.();
    }, 3000);
    return () => { window.clearTimeout(lock); window.clearTimeout(finish); };
  }, [phase, reduce]);

  // Replay returns to the scattered pose, then assembles without requiring another tap.
  useEffect(() => {
    if (!run || phase !== "scattered" || reduce) return;
    const replay = window.setTimeout(() => setPhase("assembling"), 450);
    return () => window.clearTimeout(replay);
  }, [run, phase, reduce]);

  const play = () => {
    if (reduce || phase === "assembling") return;
    setLocked(false);
    if (phase === "assembled") {
      setRun(value => value + 1);
      setPhase("scattered");
    } else setPhase("assembling");
  };

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={play}
      aria-label={isAssembled ? "Replay CampusOne logo animation" : "Tap to assemble the CampusOne logo"}
      aria-busy={phase === "assembling"}
      data-phase={reduce ? "assembled" : phase}
      className={`campusone-logo group relative flex h-auto flex-col gap-0 whitespace-normal p-0 hover:bg-transparent [&_svg]:size-auto ${className}`}
    >
      <motion.div
        className="campusone-logo-scene relative aspect-[4/3] w-full"
        animate={reduce ? { rotateX: 0, rotateY: 0, scale: 1 } : { rotateX: isAssembled ? 0 : 6, rotateY: isAssembled ? 0 : -6, scale: locked ? [1, 1.018, 1] : 1 }}
        transition={{ rotateX: { duration: 2.4 }, rotateY: { duration: 2.4 }, scale: { type: "tween", duration: 0.3, ease: "easeOut" } }}
      >
        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="100 30 480 360" className={`campusone-logo-artwork h-full w-full overflow-visible ${locked && !reduce ? "campusone-logo-locked" : ""}`} aria-hidden="true">
          {CAMPUSONE_PIECES.map((piece, index) => (
            <motion.g
              key={piece.id}
              className={piece.id === "tent" ? "campusone-tent-depth" : undefined}
              initial={false}
              animate={isAssembled ? { x: 0, y: 0, rotate: 0 } : { x: piece.x, y: [piece.y, piece.y - 3, piece.y], rotate: piece.rotate }}
              transition={reduce ? { duration: 0 } : isAssembled
                ? { type: "spring", duration: 2.1, bounce: 0.12, delay: index * 0.09 }
                : { x: { type: "spring", duration: 0.4 }, rotate: { type: "spring", duration: 0.4 }, y: { type: "tween", duration: 2.8 + index * 0.15, repeat: Infinity, ease: "easeInOut" } }}
            >
              {piece.artwork}
            </motion.g>
          ))}
        </motion.svg>
      </motion.div>
      <span className="mt-6 block h-5 text-sm font-medium text-muted-foreground" aria-live="polite">
        {reduce ? "CampusOne" : phase === "scattered" ? "Tap to assemble" : phase === "assembling" ? "Assembling…" : "Tap to replay"}
      </span>
    </Button>
  );
}

export function LogoStatic({ className = "" }: { className?: string }) {
  return <CampusOneArtwork className={className} />;
}