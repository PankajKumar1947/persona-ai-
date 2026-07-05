import React, { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import { AssistantMessage, markdownComponents } from "./assistant-message";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MessagePanelProps {
  persona: "hitesh" | "piyush";
  messages: Message[];
  isLoading: boolean;
  onSendPrompt: (prompt: string) => void;
  chatEndRef: RefObject<HTMLDivElement | null>;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({
  persona,
  messages,
  isLoading,
  onSendPrompt,
  chatEndRef,
}) => {
  const starterPrompts = {
    hitesh: [
      { label: "Explain React Server Components", prompt: "Explain React Server Components like you explain it in Chai aur Code" },
      { label: "How to stay consistent in Coding?", prompt: "How do I build consistency in coding and avoid tutorial hell?" },
      { label: "MERN Stack Roadmap", prompt: "Give me a practical, project-based roadmap for learning the MERN Stack." },
    ],
    piyush: [
      { label: "Dockerize a Node.js App", prompt: "Show me a production-ready Dockerfile for a Node.js application and explain it." },
      { label: "Scaling Node.js Backend", prompt: "How do I handle scaling for a Node.js backend when traffic hits 100k requests/sec?" },
      { label: "WebRTC vs WebSockets", prompt: "Can you explain under the hood how WebRTC works compared to WebSockets?" },
    ],
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center max-w-xl mx-auto text-center space-y-8 py-12">
          <div className="space-y-3">
            <div className={`text-4xl ${persona === "hitesh" ? "animate-bounce" : "animate-pulse"}`}>
              {persona === "hitesh" ? "☕" : "🐳"}
            </div>
            <h2 className="text-lg font-bold text-[#cbd5e1]">
              {persona === "hitesh" ? "Chai aur Code Interactive Session" : "Piyush's Technical Playpen"}
            </h2>
            <p className="text-xs text-[#64748b] leading-relaxed">
              {persona === "hitesh"
                ? "Ask Hitesh about coding roadmaps, career growth, consistency, life advice, or how to learn by building real projects over a cup of chai."
                : "Ask Piyush about backend scale, system architectures, Docker, cloud deployment, scaling up your tech career, or production-grade workflow design."}
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">
              Select Starter Script
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {starterPrompts[persona].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendPrompt(item.prompt)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all ${
                    persona === "hitesh"
                      ? "bg-[#0f1115] border-hitesh-accent/20 hover:border-hitesh-accent/60 text-slate-300 hover:text-white"
                      : "bg-[#0f1115] border-piyush-accent/20 hover:border-piyush-accent/60 text-slate-300 hover:text-white"
                  }`}
                >
                  <span className={`mr-2 font-bold ${persona === "hitesh" ? "text-hitesh-text" : "text-piyush-text"}`}>
                    &gt;
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, index) => (
            <div key={index} className="space-y-2 border-b border-[#11151c] pb-6 last:border-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  msg.role === "user"
                    ? "bg-[#1e293b] text-slate-300"
                    : persona === "hitesh"
                    ? "bg-hitesh-accent/20 text-hitesh-text border border-hitesh-accent/40"
                    : "bg-piyush-accent/20 text-piyush-text border border-piyush-accent/40"
                }`}>
                  {msg.role === "user" ? "guest@developer:~$ ask" : `${persona.toUpperCase()}::OUTPUT`}
                </span>
              </div>

              <div className="text-sm leading-relaxed text-slate-200 pl-2 font-sans selection:bg-[#38bdf8] selection:text-black">
                {msg.role === "user" ? (
                  <ReactMarkdown components={markdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <AssistantMessage content={msg.content} persona={persona} />
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}
    </div>
  );
};
