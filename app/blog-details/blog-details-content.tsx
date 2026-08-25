"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { BlogPost, ContentBlock, ListingPageContent, PublicMedia, SiteSettings } from "@/types/public";

function BlogBlock({ block }: { block: ContentBlock }) {
  const payload = block.payload || {};
  if (block.type === "heading" && typeof payload.text === "string") return <h2>{payload.text}</h2>;
  if (block.type === "rich_text" && Array.isArray(payload.paragraphs)) {
    return <>{payload.paragraphs.filter((text): text is string => typeof text === "string").map((text, index) => <p key={index}>{text}</p>)}</>;
  }
  if (block.type === "image" && payload.media && typeof payload.media === "object") {
    return <div className="article-inline-img"><ContentImage media={payload.media as PublicMedia} fill sizes="600px" alt={typeof payload.alt_text === "string" ? payload.alt_text : ""} /></div>;
  }
  if (block.type === "quote" && typeof payload.text === "string") return <blockquote>{payload.text}</blockquote>;
  if (block.type === "callout") return <aside className="article-callout"><h3>{typeof payload.heading === "string" ? payload.heading : ""}</h3><p>{typeof payload.body === "string" ? payload.body : ""}</p></aside>;
  return null;
}

export function BlogDetailsContent({ post, pageContent, settings }: { post: BlogPost; pageContent?: ListingPageContent; settings?: SiteSettings }) {
  const meta = post.publication_date
    ? `${new Date(post.publication_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}${post.reading_time_minutes ? ` • ${post.reading_time_minutes} min read` : ""}`
    : undefined;
  const blocks = [...(post.content || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const socialLinks = settings?.social?.links || [];

  return (
    <>
      <PageIntro label={pageContent?.detail?.title || pageContent?.hero?.eyebrow || ""} meta={meta} title={post.title} />
      <article className="article-page container">
        <div className="article-hero-wrap"><ContentImage media={post.featured_media} fill sizes="1240px" alt={post.title} className="article-hero-desktop" priority /><ContentImage media={post.featured_media} fill sizes="100vw" alt={post.title} className="article-hero-mobile" priority /></div>
        <aside>
          {post.author && <div className="article-author"><ContentImage media={post.author.avatar} width={48} height={48} alt={post.author.name || ""} /><div><strong>{post.author.name}</strong><span>{post.author.job_title}</span></div></div>}
          {pageContent?.detail?.share_title && <p>{pageContent.detail.share_title}</p>}
          <div className="share-links">{socialLinks.map((social) => <a href={social.url || "#"} target="_blank" rel="noopener noreferrer" key={social.url || social.channel}>{social.label || social.channel}</a>)}</div>
        </aside>
        <div className="article-copy">
          {post.excerpt && <p>{post.excerpt}</p>}
          {blocks.length ? blocks.map((block, index) => <BlogBlock block={block} key={`${block.type}-${index}`} />) : <EmptyContent message="This post has no published content blocks." />}
        </div>
      </article>

      {post.related_posts && post.related_posts.length > 0 && (
        <section className="similar container">
          <h2>{pageContent?.detail?.related_posts_title}</h2>
          <div className="blog-grid compact">
            {post.related_posts.map((related) => (
              <motion.div key={related.slug} whileHover={{ y: -4 }}>
                <Link className="blog-card" href={`/blog-details?slug=${related.slug}`}>
                  <div className="blog-img-wrap"><ContentImage media={related.featured_media} fill sizes="(max-width: 768px) 100vw, 590px" alt={related.title} /></div>
                  {related.author?.name && <small>{related.author.name}</small>}
                  <h3>{related.title}</h3>
                  <span className="read-link">Read Post ↗</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
