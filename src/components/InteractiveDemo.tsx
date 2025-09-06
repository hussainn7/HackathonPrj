import React, { useMemo, useState, useRef } from "react";

type Node = { id: string; name: string; x: number; y: number; active: boolean };

const initialNodes: Node[] = [
  { id: "alex", name: "ALEXANDRIA", x: 45, y: 70, active: true },
  { id: "perg", name: "PERGAMON",  x: 60, y: 40, active: true },
  { id: "rho",  name: "RHODES",     x: 55, y: 62, active: true },
];

export default function InteractiveDemo() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [isBurning, setIsBurning] = useState(false);
  const [burned, setBurned] = useState(false);
  const alex = nodes.find(n => n.id === "alex")!;
  const mapRef = useRef<HTMLDivElement>(null);

  const preservePct = useMemo(() => {
    const alive = nodes.filter(n => n.active).length;
    if (alive === 3) return 100;
    if (alive === 2) return 96;
    if (alive === 1) return 48;
    return 0;
  }, [nodes]);

  const handleBurn = () => {
    if (burned || isBurning) return;
    setIsBurning(true);

    // After burn animation, toggle Alexandria off
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === "alex" ? { ...n, active: false } : n));
      setBurned(true);
      setIsBurning(false);
    }, 1800); // match animation duration
  };

  // Links between alive nodes
  const links = useMemo(() => {
    const alive = nodes.filter(n => n.active);
    const segs: Array<[Node, Node]> = [];
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) segs.push([alive[i], alive[j]]);
    }
    return segs;
  }, [nodes]);

  return (
    <section className="py-24 px-6 bg-[rgba(247,244,233,0.5)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 font-cinzel text-[#1E3A5F]">
          Ancient Library Network
        </h2>

        {/* Controls + Stats */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBurn}
              disabled={burned || isBurning}
              className={`px-5 py-2 rounded-xl font-semibold text-white shadow-md transition
                ${burned ? "bg-neutral-500 cursor-not-allowed" : "bg-[#8C1D18] hover:brightness-110"}
              `}
            >
              {burned ? "Alexandria Burned" : (isBurning ? "Burning…" : "Travel Back to 48 BCE")}
            </button>
            <span className="text-sm text-[#5C5C5C]">Demo failover with one click</span>
          </div>
          <div className="glass-lite px-4 py-2 rounded-xl text-sm">
            <span className="mr-4">Nodes alive: <b>{nodes.filter(n => n.active).length}/{nodes.length}</b></span>
            <span>Corpus preserved: <b>{preservePct}%</b></span>
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_20px_40px_rgba(30,58,95,0.08)]">
          {/* Map */}
          <div ref={mapRef} className="relative rounded-2xl h-[28rem] overflow-hidden parchment-frame">
            <img
              src="/uploads/5aa7167c-8f3b-4f1a-b779-bbbd0cc16bca.png"
              alt="Ancient Mediterranean map"
              className={`w-full h-full object-cover transition duration-700
                ${burned ? "grayscale-[35%] contrast-110" : ""}
              `}
            />

            {/* gradient tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f7f4e9]/30 via-transparent to-transparent pointer-events-none" />

            {/* Animated links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {links.map(([a, b], idx) => (
                <g key={idx}>
                  <line x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                        className="stroke-[#1E3A5F]/60" strokeWidth="2" strokeLinecap="round" />
                  <line x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                        className="stroke-[#8C1D18]/80 animate-dash" strokeWidth="2"
                        strokeDasharray="6 10" strokeLinecap="round" />
                </g>
              ))}
            </svg>

            {/* Nodes */}
            {nodes.map(n => (
              <div key={n.id}
                   className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                   style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                <div className={[
                  "w-6 h-6 rounded-full border-2 transition-all duration-500",
                  n.active
                    ? "bg-[#f8e6b8] border-[#1E3A5F] shadow-[0_0_16px_rgba(140,29,24,0.55)] animate-pulse-soft"
                    : "bg-neutral-400/40 border-neutral-500/40 grayscale opacity-60"
                ].join(" ")} />
                <span className={[
                  "mt-2 block text-[10px] md:text-xs font-semibold tracking-wide",
                  n.active ? "text-[#1E3A5F]" : "text-neutral-500"
                ].join(" ")}>{n.name}</span>
              </div>
            ))}

            {/* BURN EFFECT at Alexandria */}
            {(isBurning || burned) && (
              <>
                {/* scorching vignette centered on Alexandria */}
                <div
                  className="absolute pointer-events-none burn-spot"
                  style={{
                    left: `${alex.x}%`,
                    top: `${alex.y}%`,
                    transform: "translate(-50%, -50%)",
                    animation: isBurning ? "burnGrow 1.6s ease-out forwards" : "none"
                  }}
                />
                {/* ember particles */}
                <div className="pointer-events-none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="ember"
                      style={{
                        left: `calc(${alex.x}% + ${Math.random()*40-20}px)`,
                        top:  `calc(${alex.y}% + ${Math.random()*20-10}px)`,
                        animationDelay: `${Math.random()*0.6}s`,
                        animationDuration: `${1.2 + Math.random()*0.9}s`
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Post-burn message */}
          <div
            role="status"
            aria-live="polite"
            className={`mt-5 transition-all ${burned ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          >
            <div className="flex items-center justify-between glass-lite rounded-xl px-4 py-3">
              <p className="text-sm md:text-base text-[#1E3A5F]">
              <b>Alexandria burned.</b> But <b>CodeExplore</b> ensures the knowledge survives.
              </p>
              <a href="/library" className="ml-4 px-4 py-2 rounded-lg bg-[#2F4F7F] text-white text-sm hover:brightness-110">
                View preserved copies
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
