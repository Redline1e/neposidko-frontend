import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Непосидько - Інтернет-магазин дитячого взуття",
  description:
    "Широкий вибір якісного дитячого взуття в інтернет-магазині Непосидько. Купуйте онлайн з доставкою по Україні.",
  keywords:
    "дитяче взуття, інтернет-магазин, Непосидько, взуття для дітей, купити взуття",
  openGraph: {
    title: "Непосидько - Інтернет-магазин дитячого взуття",
    description:
      "Широкий вибір якісного дитячого взуття від Непосидько. Купуйте онлайн з доставкою по Україні.",
    url: "https://www.neposidko.com",
    siteName: "Непосидько",
    images: [
      {
        url: "https://www.neposidko.com/logo.png",
        width: 800,
        height: 600,
        alt: "Логотип Непосидько",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Непосидько - Інтернет-магазин дитячого взуття",
    description:
      "Широкий вибір якісного дитячого взуття від Непосидько. Купуйте онлайн з доставкою по Україні.",
    images: ["https://www.neposidko.com/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <link rel="canonical" href="https://www.neposidko.com" />
      </head>
      <body className={inter.className}>
        {children}
        <div id="captcha-root"></div>
      </body>
    </html>
  );
}
