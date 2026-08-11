import styles from "./Home.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setChannels } from "../slices/channelsSlice.js";
import { setMessages } from "../slices/messagesSlice.js";
import axios from "axios";

function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels)
    const messages = useSelector((state) => state.messages.messages)

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

    useEffect(() => {
        fetchChannels();
        fetchMessages();
    }, [navigate, dispatch])
    

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
                            {message.name}
                        </p>
                    ))}
                </main>
            </div>
        </div>
    );
}

export default Home;