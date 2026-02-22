import type { Metadata } from "next";
import "./globals.css";
import "./pulse.css";

export const metadata: Metadata = {
  title: "Pulse — My Adventure",
  description: "Skill Reinforcer: practice CBT skills and build confidence. Pulse Miami Hackathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
