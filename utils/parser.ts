export function parsePipelineResponse(text: string) {
  const steps: { type: string; content: string }[] = [];
  let outputContent = "";

  const regex = /\[(INITIAL|THINK|ANALYSE|OUTPUT)\]/gi;
  let match;
  const segments: { tag: string; startIndex: number; contentStartIndex: number }[] = [];

  while ((match = regex.exec(text)) !== null) {
    segments.push({
      tag: match[1].toUpperCase(),
      startIndex: match.index,
      contentStartIndex: match.index + match[0].length,
    });
  }

  if (segments.length === 0) {
    return {
      steps: [],
      outputContent: text,
    };
  }

  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    const next = segments[i + 1];
    const contentEndIndex = next ? next.startIndex : text.length;
    const content = text.slice(current.contentStartIndex, contentEndIndex).trim();

    if (current.tag === "OUTPUT") {
      outputContent = content;
    } else {
      steps.push({
        type: current.tag,
        content: content,
      });
    }
  }

  return { steps, outputContent };
}

export function parseMarkdownContent(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3);
      
      return {
        isCode: true,
        language,
        code: code.trim(),
        key: index,
        content: ""
      };
    } else {
      return {
        isCode: false,
        language: "",
        code: "",
        key: index,
        content: part
      };
    }
  });
}
