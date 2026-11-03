import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split content into blocks: code blocks vs text blocks
  const blocks = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }
    blocks.push({
      type: 'code',
      lang: match[1] || 'text',
      code: match[2].trimEnd()
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return (
    <div className="space-y-3 text-xs sm:text-sm text-[#F5F3FF] leading-relaxed break-words">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return <CodeBlock key={idx} lang={block.lang} code={block.code} />;
        }
        return <TextBlock key={idx} text={block.content} />;
      })}
    </div>
  );
}

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#09090F] shadow-lg my-2.5">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#15151F] border-b border-white/[0.08] text-[11px] text-[#9694A8]">
        <div className="flex items-center gap-1.5 font-mono">
          <Terminal className="w-3.5 h-3.5 text-[#8055FF]" />
          <span>{lang || 'code'}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#23D18B]" />
              <span className="text-[#23D18B]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-3.5 overflow-x-auto font-mono text-xs text-[#E2E8F0] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TextBlock({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];
  let isNumberedList = false;
  let inTable = false;
  let tableRows = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-2 pl-2">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineFormatting(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2 marker:text-[#8055FF]">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineFormatting(item)}</li>
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-3 rounded-xl border border-white/10 bg-[#101019]/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                {tableRows[0].map((cell, cIdx) => (
                  <th key={cIdx} className="p-2.5 font-bold text-white">
                    {parseInlineFormatting(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-[#9694A8]">
                      {parseInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check for Table Row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      // Skip separator rows like | :--- | :--- |
      if (line.replace(/\||-|:|\s/g, '').length === 0) {
        continue;
      }
      inTable = true;
      const cells = line.slice(1, -1).split('|').map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Check for Headings
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold font-heading text-white mt-3 mb-1 text-[#F5F3FF]">
          {parseInlineFormatting(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-base sm:text-lg font-extrabold font-heading text-white mt-4 mb-1.5 text-gradient-purple-pink inline-block">
          {parseInlineFormatting(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${i}`} className="text-lg sm:text-xl font-black font-heading text-white mt-4 mb-2">
          {parseInlineFormatting(line.slice(2))}
        </h1>
      );
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A78BFA] mt-3 mb-1">
          {parseInlineFormatting(line.slice(5))}
        </h4>
      );
      continue;
    }

    // Check for Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${i}`} className="border-l-2 border-[#8055FF] pl-3 py-1 my-2 bg-[#8055FF]/10 rounded-r-lg text-xs text-[#C4B5FD] italic">
          {parseInlineFormatting(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Check for Bullet List Item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      isNumberedList = false;
      listItems.push(line.slice(2));
      continue;
    }

    // Check for Numbered List Item
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      inList = true;
      isNumberedList = true;
      listItems.push(numMatch[2]);
      continue;
    }

    // Empty line
    if (!line) {
      flushList();
      continue;
    }

    // Normal paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="my-1.5 leading-relaxed text-[#F5F3FF]/90">
        {parseInlineFormatting(rawLine)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <>{elements}</>;
}

// Parses inline Markdown: bold, italic, inline code, markdown links
function parseInlineFormatting(text) {
  if (!text) return text;

  // Split tokens by inline code `...`
  const parts = [];
  const codeRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        val: text.slice(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'code',
      val: match[1]
    });
    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      val: text.slice(lastIndex)
    });
  }

  return parts.map((part, pIdx) => {
    if (part.type === 'code') {
      return (
        <code key={pIdx} className="px-1.5 py-0.5 mx-0.5 rounded-md bg-white/[0.08] text-[#C4B5FD] font-mono text-[11px] sm:text-xs border border-white/[0.06]">
          {part.val}
        </code>
      );
    }

    // Parse Bold **...** and Links [text](url)
    return parseTextTokens(part.val, pIdx);
  });
}

function parseTextTokens(str, keyPrefix) {
  // Replace links [label](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIdx = 0;
  let match;
  const nodes = [];

  while ((match = linkRegex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(parseBoldItalics(str.slice(lastIdx, match.index), `${keyPrefix}-${nodes.length}`));
    }
    nodes.push(
      <a
        key={`${keyPrefix}-link-${nodes.length}`}
        href={match[2]}
        className="text-[#8055FF] hover:text-[#A78BFA] underline font-semibold transition-colors"
      >
        {match[1]}
      </a>
    );
    lastIdx = linkRegex.lastIndex;
  }

  if (lastIdx < str.length) {
    nodes.push(parseBoldItalics(str.slice(lastIdx), `${keyPrefix}-${nodes.length}`));
  }

  return <React.Fragment key={keyPrefix}>{nodes}</React.Fragment>;
}

function parseBoldItalics(str, key) {
  // Parse **bold**
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let lastIdx = 0;
  let match;
  const nodes = [];

  while ((match = boldRegex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(str.slice(lastIdx, match.index));
    }
    nodes.push(
      <strong key={`${key}-b-${nodes.length}`} className="font-bold text-white">
        {match[1]}
      </strong>
    );
    lastIdx = boldRegex.lastIndex;
  }

  if (lastIdx < str.length) {
    nodes.push(str.slice(lastIdx));
  }

  return <React.Fragment key={key}>{nodes}</React.Fragment>;
}

