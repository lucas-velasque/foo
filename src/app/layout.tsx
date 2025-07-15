import "../styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from './ClientLayout';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
} 