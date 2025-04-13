import { configureStore } from "@reduxjs/toolkit";

import authReducer from './authslice'
import darkmodeReducer from "./darkmodeslice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        darkmode: darkmodeReducer
    }
})



