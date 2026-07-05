import React from "react";

interface SidebarProps {
  persona: "hitesh" | "piyush";
  onSelectPersona: (p: "hitesh" | "piyush") => void;
  sysLog: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  persona,
  onSelectPersona,
  sysLog,
}) => {
  return (
    <aside className="w-80 border-r border-border-studio bg-bg-sidebar flex flex-col justify-between p-6 select-none">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-sm font-bold tracking-widest text-[#94a3b8] uppercase">
              Persona AI
            </h1>
          </div>
          <p className="text-[11px] text-[#64748b] mt-1">
            Simulating developer mentors via Mistral LLM
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#64748b]">
            Active Engine
          </label>
          <div className="space-y-2">
            <button
              onClick={() => onSelectPersona("hitesh")}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                persona === "hitesh"
                  ? "bg-hitesh-bg-dim border-hitesh-accent text-hitesh-text"
                  : "bg-[#0f1115] border-border-studio text-[#94a3b8] hover:border-[#334155] hover:text-[#cbd5e1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-hitesh-accent/20 flex items-center justify-center text-lg">
                  ☕
                </div>
                <div>
                  <div className="text-xs font-semibold">Hitesh Choudhary</div>
                  <div className="text-[10px] opacity-60">Chai aur Code Vibe</div>
                </div>
              </div>
              {persona === "hitesh" && <span className="text-[10px] font-bold">ONLINE</span>}
            </button>

            <button
              onClick={() => onSelectPersona("piyush")}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                persona === "piyush"
                  ? "bg-piyush-bg-dim border-piyush-accent text-piyush-text"
                  : "bg-[#0f1115] border-border-studio text-[#94a3b8] hover:border-[#334155] hover:text-[#cbd5e1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-piyush-accent/20 flex items-center justify-center text-lg">
                  🐳
                </div>
                <div>
                  <div className="text-xs font-semibold">Piyush Garg</div>
                  <div className="text-[10px] opacity-60">Production Grade Code</div>
                </div>
              </div>
              {persona === "piyush" && <span className="text-[10px] font-bold">ONLINE</span>}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#64748b]">
            Console Log Stream
          </label>
          <div className="h-40 bg-[#07080a] border border-border-studio rounded p-2 text-[10px] overflow-y-auto text-[#475569] space-y-1 scrollbar-none">
            {sysLog.map((log, index) => (
              <div key={index} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[10px] text-[#475569] text-center pt-4 border-t border-border-studio">
        Authorized Session
      </div>
    </aside>
  );
};
