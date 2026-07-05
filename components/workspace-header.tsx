import React from "react";

interface WorkspaceHeaderProps {
  persona: "hitesh" | "piyush";
  onClear: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ persona, onClear }) => {
  return (
    <header className="h-11 border-b border-border-studio bg-bg-sidebar flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold text-[#64748b]">WORKSPACE /</span>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs font-semibold border-t-2 ${
          persona === "hitesh"
            ? "bg-bg-studio border-hitesh-accent text-hitesh-text"
            : "bg-bg-studio border-piyush-accent text-piyush-text"
        }`}>
          {persona === "hitesh" ? "hitesh_chai_session.sh" : "piyush_production_grade.ts"}
        </div>
      </div>
      <div>
        <button
          onClick={onClear}
          className="text-xs text-[#64748b] hover:text-[#94a3b8] px-2 py-1 rounded bg-[#0f1115] border border-border-studio"
        >
          Clear Buffer
        </button>
      </div>
    </header>
  );
};
