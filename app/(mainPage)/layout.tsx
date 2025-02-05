import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        {/* <Suspense fallback={<NavbarSkeleton />}> */}
        <Navbar />
        {/* </Suspense> */}
        <Footer />
      </div>
      <main>{children}</main>
    </>
  );
}
