
import { Layout } from "@/components/Layout";
import "./globals.css";
import MantineProviderRegistry from "@/components/MantineProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <MantineProviderRegistry>
            <Layout>
                {children}
            </Layout>
          </MantineProviderRegistry>
      </body>
    </html>
  );
}
