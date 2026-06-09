'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Markdown } from './Markdown';

/**
 * MarkdownTextarea — a lightweight textarea with a small formatting
 * toolbar (bold, italic, bullet list, numbered list) and a Preview
 * toggle. The stored value is plain markdown text; rendering happens
 * via the <Markdown> component elsewhere.
 */

interface MarkdownTextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function MarkdownTextarea({
  id,
  value,
  onChange,
  rows = 5,
  placeholder,
}: MarkdownTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  /** Wrap the current selection with `before`/`after` (e.g. ** ** for bold). */
  function wrapSelection(before: string, after: string, fallback: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || fallback;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }

  /** Prefix each selected line (or the current line) with `prefix`. */
  function prefixLines(makePrefix: (i: number) => string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIdx = value.indexOf('\n', end);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;

    const segment = value.slice(lineStart, lineEnd) || '';
    const updated = segment
      .split('\n')
      .map((line, i) => makePrefix(i) + line)
      .join('\n');

    const next = value.slice(0, lineStart) + updated + value.slice(lineEnd);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = lineStart;
      el.selectionEnd = lineStart + updated.length;
    });
  }

  const toolbarBtn =
    'rounded px-2 py-1 text-xs text-cream/60 transition-colors hover:bg-dark-200 hover:text-cream';

  return (
    <div className="rounded-lg border border-dark-300 bg-dark-100 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-dark-300 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => wrapSelection('**', '**', 'bold')}
            className={cn(toolbarBtn, 'font-bold')}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('*', '*', 'italic')}
            className={cn(toolbarBtn, 'italic')}
            title="Italic"
          >
            I
          </button>
          <span className="mx-1 h-4 w-px bg-dark-300" />
          <button
            type="button"
            onClick={() => prefixLines(() => '- ')}
            className={toolbarBtn}
            title="Bullet list"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => prefixLines((i) => `${i + 1}. `)}
            className={toolbarBtn}
            title="Numbered list"
          >
            1. List
          </button>
        </div>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className={cn(
            toolbarBtn,
            preview && 'bg-dark-200 text-gold',
          )}
          title="Toggle preview"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div className="min-h-[6rem] px-4 py-3 text-cream/80">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-dark-300">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-y bg-transparent px-4 py-3 text-cream placeholder:text-dark-300 focus:outline-none"
        />
      )}
    </div>
  );
}
