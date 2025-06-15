'use client';
import {  MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import "@mantine/notifications/styles.css";
import "./globals.css";
import { Layout } from "@/shared/Layout";
// import { theme as baseTheme } from '@/shared/mantine';

export default function MantineProviderRegistry({children,}: { children: React.ReactNode;}) {
// const theme: Partial<MantineThemeOverride> = baseTheme;

  return (
      <MantineProvider>
          <ModalsProvider>
          <Notifications />
            <Layout>
              {children}
            </Layout>
          </ModalsProvider>
      </MantineProvider>
  );
}
