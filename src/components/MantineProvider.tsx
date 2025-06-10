'use client';

import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

export default function MantineProviderRegistry({children,}: { children: React.ReactNode;}) {

  return (
      <MantineProvider>
        <ModalsProvider>
            <Provider store = {store}>
              <Notifications position="top-right" />
              {children}
            </Provider>
        </ModalsProvider>
      </MantineProvider>
  );
}
