import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawerKeranjang from "@/components/DrawerKeranjang";
import BandingkanFloatingBar from "@/components/BandingkanFloatingBar";
import { KeranjangProvider } from "@/context/KeranjangContext";
import { FavoritProvider } from "@/context/FavoritContext";
import { BandingkanProvider } from "@/context/BandingkanContext";
import { toko } from "@/lib/toko";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: toko.nama,
  description: toko.tagline,
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#059669",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tema');var s=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&s)||(t==='system'&&s)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50 font-[family-name:var(--font-body)]">
        <FavoritProvider>
          <KeranjangProvider>
            <BandingkanProvider>
              <Header />
              <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
              <Footer />
              <DrawerKeranjang />
              <BandingkanFloatingBar />
            </BandingkanProvider>
          </KeranjangProvider>
        </FavoritProvider>
      </body>
    </html>
  );
}
