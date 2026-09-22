
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChannels = createAsyncThunk("channels/fetchChannels", 
    async ( _ , thunkAPI) => { // получить каналы с сервера 
    // createAsyncThunk — это специальный объект, который Redux Toolkit передаёт нашей функции
    // async (первыйАргумент, второйАргумент) => {
    const rejectWithValue = thunkAPI.rejectWithValue;
    // Из второго аргумента Redux Toolkit я беру функцию rejectWithValue, чтобы правильно передавать свои ошибки в Redux».
    const token = localStorage.getItem("token");
    if (!token) {
        return rejectWithValue(i18next.t(($) => $.noToken));
      }
    try {
        const response = await axios.get("/api/v1/channels", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });

        return response.data;
        //const data = response.data;
        //dispatch(setChannels(data));
        //console.log(data);

    } catch (error) {
        console.log("Failed to fetch channels:", error);
        return rejectWithValue(error.response?.data || error.message);
    }
})

const initialState = {
    channels: [],
}

const channelsSlice = createSlice({  
    name: "channels",
    initialState,
    reducers: { // создаём action сами.
        setChannels: (state, action) => {
            state.channels = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchChannels.fulfilled, (state, actions) => {
            state.channels = actions.payload;
        });
        
    }


})

export const  { setChannels } = channelsSlice.actions;

export default channelsSlice.reducer;