import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { parsePipelineResponse } from "@/utils/parser";
import { CodeBlock } from "./code-block";

interface AssistantMessageProps {
  content: string;
  persona: "hitesh" | "piyush";
}

export const markdownComponents = {
  code(props: any) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    const language = match ? match[1] : "";
    const isInline = !className; 

    if (!isInline) {
      return <CodeBlock code={code} language={language} />;
    }

    return (
      <code className="px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-300 font-mono text-xs" {...rest}>
        {children}
      </code>
    );
  },
  p({ children }: any) {
    return <p className="leading-relaxed mb-3 last:mb-0">{children}</p>;
  },
  ul({ children }: any) {
    return <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-300">{children}</ul>;
  },
  ol({ children }: any) {
    return <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-300">{children}</ol>;
  },
  li({ children }: any) {
    return <li className="text-sm">{children}</li>;
  },
  h1({ children }: any) {
    return <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>;
  },
  h2({ children }: any) {
    return <h2 className="text-lg font-bold text-white mt-3 mb-2">{children}</h2>;
  },
  h3({ children }: any) {
    return <h3 className="text-md font-bold text-white mt-2 mb-1">{children}</h3>;
  },
  strong({ children }: any) {
    return <strong className="font-semibold text-white">{children}</strong>;
  }
};

export const AssistantMessage: React.FC<AssistantMessageProps> = ({ content, persona }) => {
  const { steps, outputContent } = parsePipelineResponse(content);
  const [isOpen, setIsOpen] = useState(true);
  const hasCollapsedRef = React.useRef(false);

  React.useEffect(() => {
    if (outputContent.trim() && !hasCollapsedRef.current) {
      setIsOpen(false);
      hasCollapsedRef.current = true;
    }
  }, [outputContent]);

  return (
    <div className="space-y-4">
      {steps.length > 0 && (
        <div className="border border-border-studio bg-[#0b0c0e]/60 rounded-md overflow-hidden text-xs">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-2.5 bg-[#0b0c0e] hover:bg-[#121418] text-[#64748b] font-mono text-[10px] uppercase font-bold tracking-wider select-none text-left"
          >
            <span className="flex items-center gap-1.5">
              🔍 {isOpen ? "Hide" : "Show"} Pipeline Steps ({steps.length}/3)
            </span>
            <span>{isOpen ? "▼" : "▶"}</span>
          </button>
          
          {isOpen && (
            <div className="p-3 space-y-2.5 border-t border-border-studio text-[11px] font-mono text-[#94a3b8] bg-[#07080a]">
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-[#475569]">
                    [{step.type}]
                  </div>
                  <div className="pl-2 border-l border-[#1e293b] text-slate-400">
                    <ReactMarkdown components={markdownComponents}>
                      {step.content || "Processing..."}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-sm leading-relaxed text-slate-200 pl-2 font-sans selection:bg-[#38bdf8] selection:text-black">
        <ReactMarkdown components={markdownComponents}>
          {outputContent || (steps.length > 0 ? "" : content)}
        </ReactMarkdown>
      </div>
    </div>
  );
};
export default AssistantMessage;
