import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "PR Agent",
  description: "AI-Powered Code Reviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
