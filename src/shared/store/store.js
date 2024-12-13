import {configureStore} from "@reduxjs/toolkit";
import main from "./main.js";


export const store = configureStore({
    reducer: {
        mainSlice: main
    }
})