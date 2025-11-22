import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import folderReducer from './slices/folderSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    folder: folderReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;