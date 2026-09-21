import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels } from "../slices/channelsSlice.js";
import { fetchMessages, addMessages } from "../slices/messagesSlice.js";
import axios from "axios";
import { Modal, TextInput, Button, Menu } from "@mantine/core";
import { useForm } from "@mantine/form";
import { logout } from "../slices/authSlice";
import i18next from "i18next";
import { notifications } from '@mantine/notifications';
import filter from 'leo-profanity';
filter.loadDictionary("ru");





function Home() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels)
    const messages = useSelector((state) => state.messages.messages)
    const [messageText, setMessageText] = useState("");
    const [currentChannelId, setCurrentChannelId] = useState(null);
    const [isAddChannelOpen, setIsAddChannelOpen] = useState(false); // !!! как работает эта строка - я не пронимаю !!!!
    const [openedMenuId, setOpenedMenuId] = useState(null);
    const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
    const [channelToDelete, setChannelToDelete] = useState(null);
    const [isRenameChannelOpen, setIsRenameChannelOpen] = useState(false);
    const [channelToRename, setChannelToRename] = useState(null);



    useEffect(() => {
        const socket = io(); // позволяет отображать изменения в добавленных сообщениях во всех открытых браузерах чата
        filter.loadDictionary("ru");
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
                    body: filter.clean(messageText),
                    channelId: currentChannelId, // сюда сохраняем выборку каналов 
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
    const addChannel = async (values) => { // тут код п о добавлению каналов 
        //console.log(values.channelName);
        console.log("1. addChannel запустился");
        console.log("2. values:", values);
        const token = localStorage.getItem("token");
        filter.loadDictionary("ru");

        try {
            
            const response = await axios.post("/api/v1/channels", 
                {
                    name: filter.clean(values.channelName.trim()),
                    removable: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },);

                
                console.log("3. ВЕСЬ RESPONSE:", response);
                console.log("4. КАНАЛЫ С СЕРВЕРА:", response.data);
                console.log("5. RESPONSE STATUS:", response.status);

                dispatch(fetchChannels()); // обновляет список каналов 
                setCurrentChannelId(response.data.id); // канал нашего создания - сделает текущим автоматически 
                form.reset(); // очищаем инпут
                setIsAddChannelOpen(false);

                // 3. ПОКАЗЫВАЕМ ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ ОБ УСПЕХЕ 🌟
                // Показываем уведомление об успехе
                notifications.show({
                    title: 'Успешно',
                    message: i18next.t(($) => $.channelCreated),
                    color: 'green',
                  });


            } catch (error) {
                console.log("не создался канал", error)
                // Показываем уведомление об ошибке
                notifications.show({
                    message: i18next.t(($) => $.networkError),
                    color: "red",
                });
            }


    };

    const handleDeleteChannel = (channelId) => {
        setChannelToDelete(channelId);
        setIsDeleteChannelOpen(true);
    };
    
    const deleteChannel = async () => {
        const token = localStorage.getItem("token");
    
        try {
            await axios.delete(`/api/v1/channels/${channelToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            dispatch(fetchChannels());
            dispatch(fetchMessages());

            const generalChannel = channels.find(
                (channel) => channel.name === "general"
            );
    
            if (generalChannel) {
                setCurrentChannelId(generalChannel.id);
            } else {
                setCurrentChannelId(1);
                console.log("generalChannel.id не был найден");
            }

    
            setIsDeleteChannelOpen(false);
            setChannelToDelete(null);

            notifications.show({
                message: i18next.t(($) => $.channelDeleted),
                color: "green",
            });


        } catch (error) {
            console.log("Не удалось удалить канал", error);
            nnotifications.show({
                message: i18next.t(($) => $.networkError),
                color: "red",
            });

        }
    };
    
    const renameForm = useForm({
        initialValues: {
            channelName: "",
        },
    
        validate: {
            channelName: (value) => {
                if (value.length < 3 || value.length > 20) {
                    return i18next.t(($) => $.channelAlreadyExists);
                }
    
                if (
                    channels.some(
                        (channel) =>
                            channel.id !== channelToRename &&
                            channel.name.trim().toLowerCase() === value.toLowerCase()
                    )
                ) {
                    return i18next.t(($) => $.channelAlreadyExists);
                }
    
                return null;
            },
        },
    });
    
    const handlrRenameChanal = (channelId) => {
        const channel = channels.find(
            (channel) => channel.id === channelId
        );

        if (!channel) {
            return;
        }
    
        setChannelToRename(channelId);
    
        renameForm.setValues({
            channelName: channel.name,
        });
    
        setIsRenameChannelOpen(true);
    };
    


        const form = useForm({
            initialValues: {
                channelName: "", // если " " то будет во вводном окне пустое поле а не подсказка  'channelName'
            },
        
            validate: {
                channelName: (value) => {
                    if (value.length < 3 || value.length > 20) {
                        return i18next.t(($) => $.channelAlreadyExists);
                    }
            
                    if (
                        channels.some(
                            (channel) =>
                                channel.name.trim().toLowerCase() === value.toLowerCase()
                        )
                    ) {
                        return i18next.t(($) => $.channelAlreadyExists);
                    }
            
                    return null;
                },
            },
        }
    );
    

    const renameChannel = async (values) => {
        const token = localStorage.getItem("token");
    
        try {
            const cleanName = filter.clean(values.channelName.trim());
            await axios.patch(
                `/api/v1/channels/${channelToRename}`,
                {
                    name: cleanName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            dispatch(fetchChannels());
    
            renameForm.reset();
            setChannelToRename(null);
            setIsRenameChannelOpen(false);

            // ✅ Уведомление об успешном переименовании канала
            notifications.show({
                message: i18next.t(($) => $.channelRenamed),
                color: "green",
            });
    
        } catch (error) {
            console.log("Не удалось переименовать канал", error);
            notifications.show({
                message: i18next.t(($) => $.networkError),
                color: "red",
            });
        }
    };


        // что отобразится при первичном запуске страницы с принятым токеном
    useEffect(() => {
            dispatch(fetchChannels());
            dispatch(fetchMessages());
    }, [dispatch]);// Этот эффект зависит от navigate и dispatch.
                             // Если они изменятся — React должен выполнить эффект заново».

    useEffect(() => {
            if (channels.length > 0 && currentChannelId === null) {
                                    const generalChannel = channels.find(
                                        (channel) => channel.name === "general"
                                    );
                            
                                    if (generalChannel) {
                                        setCurrentChannelId(generalChannel.id);
                                    }
                }
            }, [channels, currentChannelId]);

    // 4. Ошибка при загрузке данных при входе на страницу
    useEffect(() => {
        const loadData = async () => {
            try {
                await dispatch(fetchChannels()).unwrap();
                await dispatch(fetchMessages()).unwrap();
            } catch (error) {
                if (error?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
    
                // ✅ Уведомление об ошибке загрузки данных
                notifications.show({
                    message: i18next.t(($) => $.fetchError),
                    color: "red",
                });
            }
        };

        loadData();
    }, [dispatch, navigate]);



    return (
        <div className={styles.home}>
            <header className={styles.header}>
                <Link to="/">{i18next.t(($) => $.nameChat)}</Link>
                <Button
                    className={styles.logaut}
                    onClick={() => {
                        dispatch(logout());
                        navigate("/login");
                    }}
                >
                    {i18next.t(($) => $.logout)}
                </Button>
            </header>

            <div className={styles.chatLayout}>
                <aside className={styles.channels}>
                    <div className={styles.channelsHeader}>
                        <h2>{i18next.t(($) => $.channels)}</h2>
                        <button
                            type="button"
                            className={styles.addChannels}
                            onClick={() => setIsAddChannelOpen(true)}
                        >
                            +
                        </button>
                    </div>

                    {channels.map((channel) => (
                        <div key={channel.id} className={styles.channelRow}>
                            <p onClick={() => setCurrentChannelId(channel.id)}>
                                # {channel.name}
                            </p>
                            {channel.removable && (
                                <Menu>
                                    <Menu.Target>
                                        <Button
                                            type="button"
                                            variant="subtle"
                                            size="compact-sm"
                                        >
                                            ⋮
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            onClick={() =>
                                                handlrRenameChanal(channel.id)
                                            }
                                        >
                                            {i18next.t(($) => $.rename)}
                                        </Menu.Item>
                                        <Menu.Item
                                            color="red"
                                            onClick={() =>
                                                handleDeleteChannel(channel.id)
                                            }
                                        >
                                            {i18next.t(($) => $.delete)}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </div>
                    ))}
                </aside>

                <main className={styles.messages}>
                    {/* Фиксированная шапка чата */}
                    <div style={{ marginBottom: "16px" }}>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700" }}>
                            # { channels.find((channel) => channel.id === currentChannelId)?.name }
                        </h3>
                        <span style={{ fontSize: "13px", color: "#6c757d" }}>
                            { messages.filter((message) => message.channelId === currentChannelId).length } сообщений
                        </span>
                    </div>

                    {/* Прокручиваемая область ТОЛЬКО для сообщений */}
                    <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                        {messages
                            .filter((message) => message.channelId === currentChannelId)
                            .map((message) => (
                                <p key={message.id}>
                                    <b>{message.username}:</b> {message.body}
                                </p>
                            ))}
                    </div>

                    {/* Форма всегда снизу */}
                    <form onSubmit={addedMessages} className={styles.addMessages}>
                        <input
                            type="text"
                            value={messageText}
                            placeholder="Введите сообщение..."
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <button type="submit">{i18next.t(($) => $.add)}</button>
                    </form>
                </main>
            </div>

            <Modal
                opened={isAddChannelOpen}
                onClose={() => {
                    setIsAddChannelOpen(false);
                    form.reset();
                }}
                title={i18next.t(($) => $.addChannelTitle)}
                centered
            >
                <form onSubmit={form.onSubmit(addChannel)}>
                    <TextInput
                        label={i18next.t(($) => $.channelName)}
                        placeholder={i18next.t(($) => $.namePlaceholder)}
                        withAsterisk
                        key={form.key("channelName")}
                        {...form.getInputProps("channelName")}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <Button
                            type="button"
                            color="gray"
                            onClick={() => {
                                setIsAddChannelOpen(false);
                                form.reset();
                            }}
                        >
                            {i18next.t(($) => $.cancel)}
                        </Button>

                        <Button type="submit">
                            {i18next.t(($) => $.submit)}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                opened={isDeleteChannelOpen}
                onClose={() => {
                    setIsDeleteChannelOpen(false);
                    setChannelToDelete(null);
                }}
                title={i18next.t(($) => $.deleteChannelTitle)}
                centered
            >
                <p>{i18next.t(($) => $.channelDeleteQuestionSecond)}</p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <Button
                        type="button"
                        color="gray"
                        onClick={() => {
                            setIsDeleteChannelOpen(false);
                            setChannelToDelete(null);
                        }}
                    >
                        {i18next.t(($) => $.cancel)}
                    </Button>

                    <Button color="red" onClick={deleteChannel}>
                        {i18next.t(($) => $.delete)}
                    </Button>
                </div>
            </Modal>

            <Modal
                opened={isRenameChannelOpen}
                onClose={() => {
                    setIsRenameChannelOpen(false);
                    setChannelToRename(null);
                    renameForm.reset();
                }}
                title={i18next.t(($) => $.renameChannelTitle)}
                centered
            >
                <form onSubmit={renameForm.onSubmit(renameChannel)}>
                    <TextInput
                        label={i18next.t(($) => $.channelName)}
                        placeholder={i18next.t(($) => $.namePlaceholder)}
                        withAsterisk
                        autoFocus
                        key={renameForm.key("channelName")}
                        {...renameForm.getInputProps("channelName")}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <Button
                            type="button"
                            color="gray"
                            onClick={() => {
                                setIsRenameChannelOpen(false);
                                setChannelToRename(null);
                                renameForm.reset();
                            }}
                        >
                            {i18next.t(($) => $.cancel)}
                        </Button>

                        <Button type="submit">
                            {i18next.t(($) => $.rename)}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Home;