import { NextResponse } from "next/server";
import { buatKlienServer } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const produk_id = body?.produk_id;

    if (!produk_id) {
      return NextResponse.json({ error: "produk_id wajib diisi" }, { status: 400 });
    }

    const supabase = buatKlienServer();
    await supabase.from("log_klik_wa").insert({ produk_id });

    return NextResponse.json({ sukses: true });
  } catch {
    return NextResponse.json({ sukses: false }, { status: 200 });
  }
}
