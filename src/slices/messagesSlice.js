import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
    "messages/fetchMessages",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Нет токена");
        }

        try {
            const response = await axios.get("/api/v1/messages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.log("Failed to fetch messages:", error);

            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const initialState = {
    messages: [],
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,

    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },

        addMessages: (state, action) => {
            state.messages.push(action.payload);
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
        });
    },
});

export const { setMessages, addMessages } = messagesSlice.actions;

export default messagesSlice.reducer;