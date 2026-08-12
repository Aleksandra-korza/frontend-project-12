import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messages: [],
}

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessages: (state, action) => {
            state.messages.push(action.payload);
        }
    }

})

export const  { setMessages, addMessages } = messagesSlice.actions;
export default messagesSlice.reducer;