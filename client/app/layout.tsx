import "./globals.css";
import { Poppins } from "next/font/google";
import WagmiProviders from "@/providers/WagmiProviders";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <WagmiProviders>{children}</WagmiProviders>
      </body>
    </html>
  );
}
