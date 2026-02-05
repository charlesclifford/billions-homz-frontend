import Header from "@/components/shared/header/Header";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Suspense } from "react";
import "../globals.css";
import Loading from "../loading";
import Footer from "@/components/shared/footer/Footer";
import WhatsappBubble from "@/components/shared/WhatsappBubble";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Header />
        <main className="w-full min-h-dvh">{children}</main>
        <ScrollToTop />
        <WhatsappBubble />
        <Footer />
      </Suspense>
    </div>
  );
}
