import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import channelsReducer from "./slices/channelsSlice.js";
import messagesReducer from "./slices/messagesSlice.js";


export const store = configureStore({ // собирает все slices в единое Redux-хранилище.
    reducer: {
        auth: authReducer,
        channels: channelsReducer,
        messages: messagesReducer,

    },
})

/*  Получится такое Redux State:
state = {
    auth: {...},
    channels: {
        channels: []
    },
    messages: {
        messages: []
    }
}

И тогда в Home так получаю данные:
const channels = useSelector((state) => state.channels.channels);
const messages = useSelector((state) => state.messages.messages);

*/