import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
}
