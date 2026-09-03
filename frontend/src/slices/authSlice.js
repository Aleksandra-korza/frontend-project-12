import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAutenticaded: false,
    token: null,
}

const authSlice = createSlice({ // Это способ создать часть Redux state.
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

// Slice объединяет: state + reducers + actions для одной области приложения.

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;