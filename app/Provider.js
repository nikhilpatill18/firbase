"use client"
import { Provider } from "react-redux";

import { store } from "@/store/store";


import React from 'react'

const provider = ({ children }) => {
    return (
        <div>
            <Provider
                store={store}
            >
                {children}
            </Provider>

        </div>
    )
}

export default provider
