import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { applyLegalPlaceholders } from '@/config/legal';

interface LegalPageProps {
  title: string;
  rawContent: string;
}

/**
 * Renderiza um documento legal a partir de Markdown bruto importado via `?raw`.
 * Substitui placeholders ({{OWNER_NAME}}, {{CONTACT_EMAIL}} etc.) e usa
 * `react-markdown` + `remark-gfm` para tabelas/GFM.
 */
export default function LegalPage({ title, rawContent }: LegalPageProps) {
  const content = useMemo(() => applyLegalPlaceholders(rawContent), [rawContent]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      </header>

      <article
        className="
          text-sm leading-relaxed text-foreground/90
          [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight
          [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold
          [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold
          [&_p]:my-4
          [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
          [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
          [&_strong]:font-semibold [&_strong]:text-foreground
          [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs
          [&_hr]:my-8 [&_hr]:border-border
          [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
          [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
          [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top
          [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
