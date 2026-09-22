import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChannels = createAsyncThunk(
    "channels/fetchChannels",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Нет токена");
        }

        try {
            const response = await axios.get("/api/v1/channels", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.log("Failed to fetch channels:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    channels: [],
};

const channelsSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
        setChannels: (state, action) => {
            state.channels = action.payload;
        },

        addChannel: (state, action) => {
            state.channels.push(action.payload);
        },

        renameChannel: (state, action) => {
            const channel = state.channels.find(
                (item) => item.id === action.payload.id
            );

            if (channel) {
                channel.name = action.payload.name;
            }
        },

        removeChannel: (state, action) => {
            state.channels = state.channels.filter(
                (channel) => channel.id !== action.payload.id
            );
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchChannels.fulfilled, (state, action) => {
            state.channels = action.payload;
        });
    },
});

export const {
    setChannels,
    addChannel,
    renameChannel,
    removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;