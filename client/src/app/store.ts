import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const authPersistConfig = {
    key: "auth",
    storage,
  };

  const persistedReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
    reducer:{
        auth: persistedReducer 
    }
})

export const persistor = persistStore(store);

// type for useSelecet
export type RootState = ReturnType<typeof store.getState>;


// type for useDispatch
export type AppDispatch = typeof store.dispatch;