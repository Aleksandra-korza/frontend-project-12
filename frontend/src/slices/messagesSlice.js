import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk( "messages/fetchMessages",  // создает pending / fulfilled / rejected состояния и записывает сам в стейт state.status = "succeeded";

    async ( _, rejectWithValue) => {
    const token = localStorage.getItem("token");
    if (!token) {
        // navigate("/login");
        return rejectWithValue("Нет токена");
    }
    try {
        const response = await axios.get("/api/v1/messages", {
            headers: {
                authorization: `Bearer ${token}`,
            }

        });
        //const data = response.data;
        //dispatch(setMessages(data));
        return response.data;

    } catch (error) {
        console.log("Failed to fetch messages:", error)
        return rejectWithValue("Не удалось получить сообщения");
    }

})

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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
        });
    },
});

export const  { setMessages, addMessages } = messagesSlice.actions;
export default messagesSlice.reducer;