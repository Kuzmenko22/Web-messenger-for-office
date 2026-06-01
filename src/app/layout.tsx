import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { MyApp } from "./_components/main";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Корпоративная информационная система",
  description: "Корпоративная информационная система",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <MyApp>{children}</MyApp>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
