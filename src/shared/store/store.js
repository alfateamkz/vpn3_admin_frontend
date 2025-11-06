import {configureStore} from "@reduxjs/toolkit";
import main from "./main.js";
import config from "./configSlice.js";


export const store = configureStore({
    reducer: {
        mainSlice: main,
        config: config
    }
})