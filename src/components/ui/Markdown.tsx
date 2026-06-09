import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Markdown — a tiny, zero-dependency renderer for the small subset of
 * markdown we let members use in free-form profile text:
 *
 *   - Paragraphs (blank line between them)
 *   - Bullet lists           ( -  or  *  prefix )
 *   - Numbered lists         ( 1.  2.  prefix )
 *   - Bold                   ( **text** )
 *   - Italic                 ( *text* or _text_ )
 *   - Links                  ( [label](https://…) )
 *
 * It builds React elements directly (never dangerouslySetInnerHTML), so
 * user input is escaped by React and cannot inject HTML. Only http(s)
 * and mailto links are allowed.
 */

interface MarkdownProps {
  children: string | null | undefined;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  if (!children || !children.trim()) return null;
  const blocks = parseBlocks(children);

  return (
    <div className={cn('space-y-3 leading-relaxed', className)}>
      {blocks.map((block, i) => {
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={i} className="list-decimal space-y-1 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

/* ── Block-level parsing ─────────────────────────────────────── */

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ').trim() });
      paragraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const numbered = trimmed.match(/^\d+\.\s+(.*)$/);

    if (bullet) {
      flushParagraph();
      const items: string[] = [bullet[1]];
      while (i + 1 < lines.length) {
        const next = lines[i + 1].trim().match(/^[-*]\s+(.*)$/);
        if (!next) break;
        items.push(next[1]);
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (numbered) {
      flushParagraph();
      const items: string[] = [numbered[1]];
      while (i + 1 < lines.length) {
        const next = lines[i + 1].trim().match(/^\d+\.\s+(.*)$/);
        if (!next) break;
        items.push(next[1]);
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

/* ── Inline parsing (bold / italic / links) ──────────────────── */

const INLINE_RE =
  /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(_([^_]+)_)|(\[([^\]]+)\]\(([^)\s]+)\))/g;

function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>,
      );
    }

    if (match[2] !== undefined) {
      nodes.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key++}>{match[4]}</em>);
    } else if (match[6] !== undefined) {
      nodes.push(<em key={key++}>{match[6]}</em>);
    } else if (match[8] !== undefined) {
      const label = match[8];
      const href = match[9];
      if (isSafeHref(href)) {
        nodes.push(
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-2 hover:text-gold-light"
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(<Fragment key={key++}>{match[0]}</Fragment>);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}

function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|mailto:)/i.test(href);
}
