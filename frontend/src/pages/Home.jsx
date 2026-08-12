import { io } from "socket.io-client";
import { useState } from "react";
import styles from "./Home.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setChannels } from "../slices/channelsSlice.js";
import { setMessages, addMessages } from "../slices/messagesSlice.js";
import axios from "axios";

function Home() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels)
    const messages = useSelector((state) => state.messages.messages)
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const socket = io(); // позволяет отображать изменения в добавленных сообщениях во всех открытых браузерах чата
        socket.on( "newMessage", (message) => dispatch(addMessages(message))); // socket.o слушает событие с именем "newMessage"
                                // (message) => {dispatch(addMessages(message));} - выполняется код этот если сервер пришлет новое событие этого типа
                                // полученное message передай в Redux через addMessages а он уже находится в слайчах, который делает это:
                                /* addMessages: (state, action) => {
                                    state.messages.push(action.payload); */ 
                                // и вот мы видим сообщение отображенным на экране сообщений
        return () => {
            socket.disconnect(); // эта функция очистки срабатывает только когда покидаешь страницу например
          }

    }, [dispatch]); // «Когда мне нужно снова выполнить этот useEffect?» Выполни эффект при первом появлении компонента и если изменится dispatch

    const fetchChannels = async () => { // получить каналы с сервера
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const response = await axios.get("/api/v1/channels", {
                headers: {
                    authorization: `Bearer ${token}`,
                },
              });
            const data = response.data;
            dispatch(setChannels(data));
            console.log(data);

        } catch (error) {
            console.log("Failed to fetch channels:", error);
        }
    }

    const fetchMessages = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const response = await axios.get("/api/v1/messages", {
                headers: {
                    authorization: `Bearer ${token}`,
                }

            });
            const data = response.data;
            dispatch(setMessages(data));

        } catch (error) {
            console.log("Failed to fetch messages:", error)
        }

    }

    const addedMessages = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            
            const response = await axios.post("/api/v1/messages", 
                {
                    body: messageText,
                    channelId: "1",
                    username: "admin",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },);

                setMessageText(""); // очищаем инпут

            } catch (error) {
                console.log("не отправилось сообщение", error)
            }

    }

    useEffect(() => { // что отобразится при первичном запуске страницы с принятым токеном
        fetchChannels();
        fetchMessages();

    }, [navigate, dispatch]) // Этот эффект зависит от navigate и dispatch.
                             // Если они изменятся — React должен выполнить эффект заново».
    

    return (
        <div className={styles.home}>
            <h1>Slack Chat</h1>

            <div className={styles.chatLayout}>
                <aside className={styles.channels}>
                    <h2>Channels</h2>

                    {channels.map((channel) => (
                        <p key={channel.id}>
                            {channel.name}
                        </p>
                    ))}
                </aside>

                <main className={styles.messages}>
                    <h2>Messages</h2>

                    {messages.map((message) => (
                    <p key={message.id}>
                        {message.username}: {message.body}
                    </p>
                    ))}
                </main>
                <form onSubmit={addedMessages}>
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                    <button type="submit"> Add </button>
                </form>
            </div>
        </div>
    );
}

export default Home;