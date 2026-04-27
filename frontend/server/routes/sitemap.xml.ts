export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "https://lastwolf.netlify.app";

  const pages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/village-list", priority: "0.9", changefreq: "always" },
    { url: "/player-record", priority: "0.5", changefreq: "weekly" },
    { url: "/charachip-list", priority: "0.5", changefreq: "weekly" },
    { url: "/rule", priority: "0.6", changefreq: "monthly" },
    { url: "/about", priority: "0.5", changefreq: "monthly" },
    { url: "/faq", priority: "0.5", changefreq: "monthly" },
    { url: "/release-note", priority: "0.4", changefreq: "monthly" },
  ];

  const today = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return xml;
});
