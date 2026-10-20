import { buatKlienServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  let daftarProduk = [];
  try {
    const supabase = buatKlienServer();
    let res = await supabase
      .from("produk")
      .select("id, created_at, aktif")
      .neq("aktif", false);

    // Fallback jika kolom aktif belum ada
    if (res.error && res.error.code === "42703") {
      res = await supabase.from("produk").select("id, created_at");
    }

    daftarProduk = res.data || [];
  } catch {
    // Abaikan error koneksi
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/tentang</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${daftarProduk
    .map(
      (p) => `
  <url>
    <loc>${baseUrl}/produk/${p.id}</loc>
    <lastmod>${new Date(p.created_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
</urlset>`.trim();

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
