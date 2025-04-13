import { createSlice } from "@reduxjs/toolkit";


const initalState = {
    user: null,
}

const authslice = createSlice({
    name: 'auth',
    initialState: initalState,
    reducers: {
        setuser: (state, action) => {
            state.user = action.payload
        },
        removeuser: (state) => {
            state.user = null
        }
    },

})

export const { setuser, removeuser } = authslice.actions

export default authslice.reducer