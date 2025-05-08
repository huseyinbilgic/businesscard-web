import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import businessCardReducer from './businessCardSlice';

export const store = configureStore({
    reducer:{
        auth : authReducer,
        businessCard: businessCardReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;