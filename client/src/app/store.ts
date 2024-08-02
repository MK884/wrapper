import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
    reducer:{
        auth: authReducer 
    }
})


// type for useSelecet
export type RootState = ReturnType<typeof store.getState>;


// type for useDispatch
export type AppDispatch = typeof store.dispatch;