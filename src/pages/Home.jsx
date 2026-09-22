
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchChannels,
    addChannel,
    renameChannel,
    removeChannel,
} from "../slices/channelsSlice.js";
import { fetchMessages, addMessages } from "../slices/messagesSlice.js";
import axios from "axios";
import { 
  Modal, 
  TextInput, 
  Button, 
  Menu, 
  Flex, 
  Box, 
  ScrollArea, 
  Text, 
  ActionIcon 
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { logout } from "../slices/authSlice";
import i18next from "i18next";
import { notifications } from '@mantine/notifications';
import filter from 'leo-profanity';

filter.loadDictionary("ru");

function Home({ socket }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels);
    const messages = useSelector((state) => state.messages.messages);
    const [messageText, setMessageText] = useState("");
    const [currentChannelId, setCurrentChannelId] = useState(null);
    const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
    const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
    const [channelToDelete, setChannelToDelete] = useState(null);
    const [isRenameChannelOpen, setIsRenameChannelOpen] = useState(false);
    const [channelToRename, setChannelToRename] = useState(null);

    useEffect(() => {
        filter.loadDictionary("ru");
    
        socket?.on("newMessage", (message) => {
            dispatch(addMessages(message));
        });
    
        socket?.on("newChannel", (channel) => {
            dispatch(addChannel(channel));
        });
    
        socket?.on("renameChannel", (channel) => {
            dispatch(renameChannel(channel));
        });
    
        socket?.on("removeChannel", (channel) => {
            dispatch(removeChannel(channel));
        });
    
        return () => {
            socket?.off("newMessage");
            socket?.off("newChannel");
            socket?.off("renameChannel");
            socket?.off("removeChannel");
        };
    }, [dispatch, socket]);

    const addedMessages = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                "/api/v1/messages",
                {
                    body: filter.clean(messageText),
                    channelId: currentChannelId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessageText("");
        } catch (error) {
            console.log("не отправилось сообщение", error);
        }
    };

    const addChannel = async (values) => {
        const token = localStorage.getItem("token");
        filter.loadDictionary("ru");

        try {
            const response = await axios.post(
                "/api/v1/channels",
                {
                    name: filter.clean(values.channelName.trim()),
                    removable: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch(fetchChannels());
            setCurrentChannelId(response.data.id);
            form.reset();
            setIsAddChannelOpen(false);

            notifications.show({
                title: 'Успешно',
                message: i18next.t(($) => $.channelCreated),
                color: 'green',
            });
        } catch (error) {
            console.log("не создался канал", error);
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
            }

            setIsDeleteChannelOpen(false);
            setChannelToDelete(null);

            notifications.show({
                message: i18next.t(($) => $.channelDeleted),
                color: "green",
            });
        } catch (error) {
            console.log("Не удалось удалить канал", error);
            notifications.show({
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
                    return i18next.t(($) => $.channelNameRange);
                }

                if (
                    channels.some(
                        (channel) =>
                            channel.name.trim().toLowerCase() === value.trim().toLowerCase()
                    )
                ) {
                    return i18next.t(($) => $.channelAlreadyExists);
                }

                return null;
            },
        },
    });

    const handlrRenameChanal = (channelId) => {
        const channel = channels.find((channel) => channel.id === channelId);

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
            channelName: "",
        },
        validate: {
            channelName: (value) => {
                if (value.length < 3 || value.length > 20) {
                    return i18next.t(($) => $.channelNameRange);
                }
    
                if (
                    channels.some(
                        (channel) =>
                            channel.name.trim().toLowerCase() ===
                            value.trim().toLowerCase()
                    )
                ) {
                    return i18next.t(($) => $.channelAlreadyExists);
                }
    
                return null;
            },
        },
    });

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

                notifications.show({
                    message: i18next.t(($) => $.fetchError),
                    color: "red",
                });
            }
        };

        loadData();
    }, [dispatch, navigate]);

    return (
        <Flex direction="column" h="100vh" bg="gray.0">
            {/* Шапка проекта */}
            <Flex 
                justify="space-between" 
                align="center" 
                px="xl" 
                py="sm" 
                bg="white" 
                style={{ borderBottom: "1px solid #dee2e6" }}
            >
                <Link to="/" style={{ textDecoration: "none", color: "#212529", fontWeight: 700, fontSize: 16 }}>
                    {i18next.t(($) => $.nameChat)}
                </Link>
                <Button
                    variant="outline"
                    onClick={() => {
                        localStorage.removeItem("token");
                        dispatch(logout());
                        navigate("/login");
                    }}
                >
                    {i18next.t(($) => $.logout)}
                </Button>
            </Flex>

            {/* Главное окно чата */}
            <Flex 
                style={{ 
                    flex: 1, 
                    maxWidth: 1110, 
                    width: "100%", 
                    margin: "24px auto", 
                    border: "1px solid #dee2e6", 
                    borderRadius: 8, 
                    overflow: "hidden" 
                }} 
                bg="white"
            >
                {/* Левая панель - Каналы */}
                <Box w={250} p="md" bg="gray.0" style={{ borderRight: "1px solid #dee2e6" }}>
                    <Flex justify="space-between" align="center" mb="md">
                        <Text fw={700} size="md">{i18next.t(($) => $.channels)}</Text>
                        <ActionIcon
                            variant="outline"
                            color="blue"
                            size="sm"
                            onClick={() => setIsAddChannelOpen(true)}
                        >
                            +
                        </ActionIcon>
                    </Flex>

                    {channels.map((channel) => (
                        <Flex 
                            key={channel.id} 
                            justify="space-between" 
                            align="center" 
                            p="xs" 
                            mb={4}
                            style={{ 
                                borderRadius: 6, 
                                backgroundColor: channel.id === currentChannelId ? "#e9ecef" : "transparent",
                                cursor: "pointer"
                            }}
                        >
                            <Button
                                variant="subtle"
                                color="dark"
                                size="compact-sm"
                                justify="flex-start"
                                style={{ flex: 1 }}
                                onClick={() => setCurrentChannelId(channel.id)}
                            >
                                # {channel.name}
                            </Button>
                            {channel.removable && (
                                <Menu placement="end">
                                    <Menu.Target>
                                        <Button variant="subtle" size="compact-xs" color="gray">
                                            ⋮
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => handlrRenameChanal(channel.id)}>
                                            {i18next.t(($) => $.rename)}
                                        </Menu.Item>
                                        <Menu.Item color="red" onClick={() => handleDeleteChannel(channel.id)}>
                                            {i18next.t(($) => $.delete)}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </Flex>
                    ))}
                </Box>

                {/* Правая часть - Чат */}
                <Flex direction="column" style={{ flex: 1 }} h="100%">
                    {/* Шапка текущего канала */}
                    <Box p="md" style={{ borderBottom: "1px solid #dee2e6" }}>
                        <Text fw={700} size="md">
                            # {channels.find((channel) => channel.id === currentChannelId)?.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {messages.filter((message) => message.channelId === currentChannelId).length} сообщений
                        </Text>
                    </Box>

                    {/* Сообщения с прокруткой Mantine */}
                    <ScrollArea style={{ flex: 1 }} p="md">
                        {messages
                            .filter((message) => message.channelId === currentChannelId)
                            .map((message) => (
                                <Text key={message.id} size="sm" mb="xs">
                                    <Text span fw={700} mr={6}>{message.username}:</Text>
                                    {message.body}
                                </Text>
                            ))}
                    </ScrollArea>

                    {/* Форма ввода всегда внизу */}
                    <Box p="md" style={{ borderTop: "1px solid #dee2e6" }}>
                        <form onSubmit={addedMessages}>
                            <Flex gap="sm">
                            <TextInput
                                aria-label="Новое сообщение"
                                style={{ flex: 1 }}
                                value={messageText}
                                placeholder="Введите сообщение..."
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                                <Button type="submit">{i18next.t(($) => $.add)}</Button>
                            </Flex>
                        </form>
                    </Box>
                </Flex>
            </Flex>

            {/* Модалки */}
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

                    <Flex justify="flex-end" gap="sm" mt="md">
                        <Button
                            variant="default"
                            onClick={() => {
                                setIsAddChannelOpen(false);
                                form.reset();
                            }}
                        >
                            {i18next.t(($) => $.cancel)}
                        </Button>
                        <Button type="submit">{i18next.t(($) => $.submit)}</Button>
                    </Flex>
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
                <Text size="sm">{i18next.t(($) => $.channelDeleteQuestionSecond)}</Text>
                <Flex justify="flex-end" gap="sm" mt="md">
                    <Button
                        variant="default"
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
                </Flex>
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

                    <Flex justify="flex-end" gap="sm" mt="md">
                        <Button
                            variant="default"
                            onClick={() => {
                                setIsRenameChannelOpen(false);
                                setChannelToRename(null);
                                renameForm.reset();
                            }}
                        >
                            {i18next.t(($) => $.cancel)}
                        </Button>
                        <Button type="submit">{i18next.t(($) => $.rename)}</Button>
                    </Flex>
                </form>
            </Modal>
        </Flex>
    );
}

export default Home;