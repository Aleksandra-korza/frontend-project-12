import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAutenticaded: false,
    token: null,
}

const authSlice = createSlice({
    name: "authorization",
    initialState,
    reducers: {
        login(state, action) {
            state.token = action.payload;
            state.isAutenticaded = true;
        },
        logout(state, action) {
            state.token = null;
            state.isAutenticaded =false;
        }
    }

})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;