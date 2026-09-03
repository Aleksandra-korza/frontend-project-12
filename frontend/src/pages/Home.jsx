import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels } from "../slices/channelsSlice.js";
import { fetchMessages, addMessages } from "../slices/messagesSlice.js";
import axios from "axios";
import { Modal, TextInput, Button, Menu } from "@mantine/core";
import { useForm } from "@mantine/form";


function Home() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels)
    const messages = useSelector((state) => state.messages.messages)
    const [messageText, setMessageText] = useState("");
    const [currentChannelId, setCurrentChannelId] = useState(1);
    const [isAddChannelOpen, setIsAddChannelOpen] = useState(false); // !!! как работает эта строка - я не пронимаю !!!!
    const [openedMenuId, setOpenedMenuId] = useState(null);
    const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
    const [channelToDelete, setChannelToDelete] = useState(null);
    const [isRenameChannelOpen, setIsRenameChannelOpen] = useState(false);
    const [channelToRename, setChannelToRename] = useState(null);



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

        try {
            
            const response = await axios.post("/api/v1/channels", 
                {
                    name: values.channelName.trim(),
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


            } catch (error) {
                console.log("не создался канал", error)
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
    
            setCurrentChannelId(1);
    
            setIsDeleteChannelOpen(false);
            setChannelToDelete(null);
        } catch (error) {
            console.log("Не удалось удалить канал", error);
        }
    };
    
    const renameForm = useForm({
        initialValues: {
            channelName: "",
        },
    
        validate: {
            channelName: (value) => {
                if (value.length < 3 || value.length > 20) {
                    return "Name must be 3-20 characters long";
                }
    
                if (
                    channels.some(
                        (channel) =>
                            channel.id !== channelToRename &&
                            channel.name.trim().toLowerCase() === value.toLowerCase()
                    )
                ) {
                    return "Channel name is already taken";
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
                        return "Name must be 3-20 characters long";
                    }
            
                    if (
                        channels.some(
                            (channel) =>
                                channel.name.trim().toLowerCase() === value.toLowerCase()
                        )
                    ) {
                        return "Channel name is already taken";
                    }
            
                    return null;
                },
            },
        }
    );


    const renameChannel = async (values) => {
        const token = localStorage.getItem("token");
    
        try {
            await axios.patch(
                `/api/v1/channels/${channelToRename}`,
                {
                    name: values.channelName.trim(),
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
    
        } catch (error) {
            console.log("Не удалось переименовать канал", error);
        }
    };


        // что отобразится при первичном запуске страницы с принятым токеном
    useEffect(() => {
            dispatch(fetchChannels());
            dispatch(fetchMessages());
    }, [dispatch]);// Этот эффект зависит от navigate и dispatch.
                             // Если они изменятся — React должен выполнить эффект заново».


    return (
        <div className={styles.home}>
            <div className={styles.header}>
            <h1>Slack Chat</h1>
            <Button className={styles.logaut}>Выйти</Button>
            </div>
            <div className={styles.chatLayout}>
                <aside className={styles.channels}>
                    <div className={styles.channelsHeader}>
                        <h2>Channels</h2>
                <button
                    type="button"
                    className={styles.addChannels}
                    onClick={() => setIsAddChannelOpen(true)}
                >
                    +
                </button>
            </div>

                    {channels.map((channel) => (
                        <div key={channel.id}
                             className={styles.channelRow}
                             >
                                <p  onClick={() => setCurrentChannelId(channel.id)}>
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
                                    onClick={() => handlrRenameChanal(channel.id)}
                                    >
                                        Переименовать
                                    </Menu.Item>
                                    <Menu.Item
                                        color="red"
                                        onClick={() => handleDeleteChannel(channel.id)
                                        }
                                        >
                                         
                                                Удалить
                                           
                                        </Menu.Item>
                                </Menu.Dropdown>
                                </Menu>
                             )}
                       </div>
                    ))}
                </aside>

                <main className={styles.messages} >
                    <h3>{ channels.find((channel) => channel.id === currentChannelId)?.name }</h3>
                    <h4>{ messages.filter((message) => message.channelId === currentChannelId).length}</h4>

                    {messages.filter((message) => message.channelId === currentChannelId)
                    .map((message) => (
                    <p key={message.id}>
                        {message.username}: {message.body}
                    </p>
                    ))}
                </main>

                <form onSubmit={addedMessages} className={styles.addMessages}>
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                    <button type="submit"> Add </button>
                </form>
            </div>
            <Modal
                opened={isAddChannelOpen}
                     onClose={() => {
                        setIsAddChannelOpen(false);
                        form.reset();
                    }}
                    title="Add channal"
                    centered
                     >
                        <form onSubmit={form.onSubmit(addChannel)}>
                            <TextInput
                                label="Channel name"
                                placeholder="Name"
                                withAsterisk // -  withAsterisk ставит звездочку - помечает как обязательное поле 
                                key={form.key('channelName')} // 
                                {...form.getInputProps('channelName')} // введенное имя пользователем 
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
                            Cancel
                        </Button>

                        <Button type="submit">
                            Submit
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
    title="Удалить канал?"
    centered
>
    <p>
        Вы уверены, что хотите удалить этот канал?
    </p>

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
            Отмена
        </Button>

        <Button
            color="red"
            onClick={deleteChannel}
        >
            Удалить
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
    title="Переименовать канал"
    centered
>
    <form onSubmit={renameForm.onSubmit(renameChannel)}>
        <TextInput
            label="Channel name"
            placeholder="Name"
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
                Отмена
            </Button>

            <Button type="submit">
                Переименовать
            </Button>
        </div>
    </form>
</Modal>


                    </div>);
                    
                        }

export default Home;
