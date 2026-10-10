import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type PageAction = {
  label: string;
  href: string;
  external?: boolean;
  secondary?: boolean;
};

export type PageBlock = {
  heading: string;
  paragraphs?: string[];
  points?: string[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  actions?: PageAction[];
  blocks?: PageBlock[];
  children?: ReactNode;
};

export function InfoPage({
  eyebrow,
  title,
  introduction,
  actions = [],
  blocks = [],
  children,
}: InfoPageProps) {
  return (
    <main id="main-content" className="content-page">
      <header className="content-page-intro">
        <div className="site-width">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="content-introduction">{introduction}</p>
          {actions.length > 0 && (
            <div className="page-actions">
              {actions.map((action) => {
                const className = `button ${action.secondary ? "button-outline" : "button-maroon"}`;
                const content = <>{action.label}<ArrowRight size={18} aria-hidden="true" /></>;

                return action.external ? (
                  <a className={className} href={action.href} key={action.href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link className={className} href={action.href} key={action.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>
      {(blocks.length > 0 || children) && (
        <div className="site-width content-main">
          {blocks.map((block) => (
            <section className="content-block" key={block.heading}>
              <h2>{block.heading}</h2>
              <div className="content-block-body">
                {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {block.points && (
                  <ul>
                    {block.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}
          {children}
        </div>
      )}
    </main>
  );
}