import { NextResponse } from "next/server";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

function escapeCSV(field) {
  if (field === null || field === undefined) return '""';
  const stringValue = String(field);
  if (
    stringValue.includes('"') ||
    stringValue.includes(",") ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET() {
  // a. Cek sesi di baris pertama (401 jika tidak login)
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse("Unauthorized: Sesi admin tidak valid.", { status: 401 });
  }

  // b. Query kolom id, nama, harga, kategori, aktif
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, kategori, aktif")
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(`Gagal mengambil data produk: ${error.message}`, { status: 500 });
  }

  const header = ["id", "nama", "harga", "kategori", "aktif"];
  const rows = (daftarProduk || []).map((p) => [
    escapeCSV(p.id),
    escapeCSV(p.nama),
    escapeCSV(p.harga),
    escapeCSV(p.kategori),
    escapeCSV(p.aktif !== false),
  ]);

  const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="produk-katalog.csv"',
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
