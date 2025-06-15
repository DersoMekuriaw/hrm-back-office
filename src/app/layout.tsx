import StoreProvider from "@/store/provider";
import "./globals.css";
import MantineProviderRegistry from "./MantineProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProviderRegistry>
          <StoreProvider>
            {children}
          </StoreProvider>
        </MantineProviderRegistry>
      </body>
    </html>
  );
}
