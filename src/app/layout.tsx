import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio Debian Firwanto",
    template: "%s | Portfolio Debian Firwanto",
  },
  description: "Portfolio pribadi Debian Firwanto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
