import React from "react";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  persona: "hitesh" | "piyush";
  isLoading: boolean;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  persona,
  isLoading,
  onSend,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="p-6 bg-bg-sidebar border-t border-border-studio flex flex-col gap-2">
      <div className="max-w-4xl w-full mx-auto flex items-end gap-3 bg-[#0d0f12] border border-border-studio rounded-lg p-2.5 focus-within:border-[#334155] transition-colors">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            persona === "hitesh"
              ? "Ask Hitesh (e.g., Explain standard JS callback logic...)"
              : "Ask Piyush (e.g., How do we Dockerize a Next.js setup...)"
          }
          rows={2}
          className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-slate-200 placeholder-[#475569] font-sans"
        />
        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className={`p-2 rounded-md transition-colors ${
            persona === "hitesh"
              ? "bg-hitesh-accent hover:bg-hitesh-accent/80 text-white disabled:opacity-50"
              : "bg-piyush-accent hover:bg-piyush-accent/80 text-white disabled:opacity-50"
          }`}
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      <div className="text-[10px] text-center text-[#475569] max-w-4xl mx-auto w-full">
        Press Enter to submit, Shift + Enter for new line. Simulating model responses dynamically.
      </div>
    </footer>
  );
};
