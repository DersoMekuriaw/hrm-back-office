import { configureStore } from '@reduxjs/toolkit';
import { apiReducers, apiMiddlewares } from './api';

export const store = configureStore({
  reducer: {
    ...apiReducers,
    // Add other reducers here if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;