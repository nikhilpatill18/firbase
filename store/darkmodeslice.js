import { createSlice } from "@reduxjs/toolkit";


const initalState = {
    darkmode: true,
}

const authslice = createSlice({
    name: 'darkmode',
    initialState: initalState,
    reducers: {
        darkmode: (state, action) => {
            state.darkmode = action.payload
        }
    },

})

export const { darkmode } = authslice.actions

export default authslice.reducer