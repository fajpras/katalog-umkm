export const dynamic = "force-dynamic";

export async function GET(request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
