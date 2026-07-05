"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { WorkspaceHeader } from "@/components/workspace-header";
import { MessagePanel } from "@/components/message-panel";
import { ChatInput } from "@/components/chat-input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [persona, setPersona] = useState<"hitesh" | "piyush">("hitesh");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sysLog, setSysLog] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logEvent("System initialized. Ready for simulation.");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const logEvent = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSysLog((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) {
      setInput("");
    }

    const updatedMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(updatedMessages);
    setIsLoading(true);
    logEvent(`Dispatched query to ${persona === "hitesh" ? "Hitesh" : "Piyush"} engine.`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          persona,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to communicate with LLM.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error("No readable stream in response.");
      }

      // Append an empty assistant message slot that we will update as stream chunks arrive
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let streamedText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        streamedText += chunkText;

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              role: "assistant",
              content: streamedText,
            };
          }
          return updated;
        });
      }

      logEvent(`Received response from ${persona === "hitesh" ? "Hitesh" : "Piyush"} model stream.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to communicate with LLM.";
      logEvent(`[ERROR] ${errorMessage}`);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ [ENGINE ERROR]: ${errorMessage}\n\n*Suggestion: Ensure your server-side MISTRAL_API_KEY is configured in the .env file.*`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPersona = (selected: "hitesh" | "piyush") => {
    setPersona(selected);
    setMessages([]);
    logEvent(`Switched active environment to: ${selected.toUpperCase()}_ENV`);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0d0f12] text-[#e2e8f0] font-mono overflow-hidden">
      {/* Sidebar Controls */}
      <Sidebar
        persona={persona}
        onSelectPersona={handleSelectPersona}
        sysLog={sysLog}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col bg-bg-studio">
        {/* Workspace Title / Tab Bar */}
        <WorkspaceHeader
          persona={persona}
          onClear={() => {
            setMessages([]);
            logEvent("Cleared conversation terminal output.");
          }}
        />

        {/* Message Output */}
        <MessagePanel
          persona={persona}
          messages={messages}
          isLoading={isLoading}
          onSendPrompt={handleSend}
          chatEndRef={chatEndRef}
        />

        {/* Chat Input Footer */}
        <ChatInput
          input={input}
          setInput={setInput}
          persona={persona}
          isLoading={isLoading}
          onSend={() => handleSend()}
        />
      </main>
    </div>
  );
}
