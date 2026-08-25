"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { BlogCategory, BlogPost, ListingPageContent, PaginationMeta } from "@/types/public";

export function BlogContent({ posts, categories, pageContent, meta, activeCategory }: {
  posts: BlogPost[];
  categories: BlogCategory[];
  pageContent?: ListingPageContent;
  meta: PaginationMeta;
  activeCategory?: string;
}) {
  const router = useRouter();
  const filtered = activeCategory
    ? posts.filter((post) => post.categories?.some((category) => category.slug === activeCategory))
    : posts;
  const hero = pageContent?.hero;

  return (
    <>
      <PageIntro label={hero?.eyebrow || ""} title={hero?.title || ""} copy={hero?.description || undefined} />
      <section className="blog-listing container">
        <nav className="blog-category-tabs" aria-label="Blog categories">
          {categories.map((category) => (
            <button
              className={activeCategory === category.slug ? "active" : ""}
              onClick={() => router.push(`/blog?category=${category.slug}`, { scroll: false })}
              type="button"
              key={category.slug}
            >
              {category.name}
            </button>
          ))}
        </nav>

        <div className="blog-grid">
          {filtered.length ? filtered.map((post, index) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }}>
              <Link href={`/blog-details?slug=${post.slug}`} className="blog-card">
                <div className="blog-img-wrap">
                  <ContentImage media={post.featured_media} fill sizes="608px" alt={post.title} className="blog-image-desktop" />
                  <ContentImage media={post.featured_media} fill sizes="100vw" alt="" className="blog-image-mobile" />
                  <div className="blog-image-meta">
                    {post.author?.name && <strong>{post.author.name}</strong>}
                    {post.publication_date && <span>{new Date(post.publication_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                  </div>
                </div>
                <h2>{post.title}</h2>
                {post.excerpt && <p>{post.excerpt}</p>}
                <span className="read-link">Read Post <b>↗</b></span>
              </Link>
            </motion.div>
          )) : <EmptyContent message="No blog posts are published in this API category." />}
        </div>

        {meta.last_page > 1 && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            <Link aria-disabled={meta.current_page <= 1} href={`/blog?category=${activeCategory || ""}&page=${Math.max(1, meta.current_page - 1)}`}>← <span>Previous Page</span></Link>
            <div>{Array.from({ length: meta.last_page }, (_, index) => index + 1).map((page) => <Link className={page === meta.current_page ? "active" : ""} href={`/blog?category=${activeCategory || ""}&page=${page}`} key={page}>{page}</Link>)}</div>
            <Link aria-disabled={meta.current_page >= meta.last_page} href={`/blog?category=${activeCategory || ""}&page=${Math.min(meta.last_page, meta.current_page + 1)}`}><span>Next Page</span> →</Link>
          </nav>
        )}
      </section>
    </>
  );
}
