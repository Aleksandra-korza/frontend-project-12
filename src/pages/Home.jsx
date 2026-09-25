import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchChannels,
    addChannel as addChannelToStore,
    renameChannel as renameChannelInStore,
    removeChannel as removeChannelFromStore,
} from "../slices/channelsSlice.js";
import { fetchMessages, addMessages } from "../slices/messagesSlice.js";
import axios from "axios";
import {
  Modal,
  TextInput,
  Button,
  Flex,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { logout } from "../slices/authSlice";
import i18next from "i18next";
import { notifications } from "@mantine/notifications";
import filter from "leo-profanity";

import ChannelList from "../components/ChannelList.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import MessageForm from "../components/MessageForm.jsx";

filter.clearList();
filter.add(filter.getDictionary("en"));
filter.add(filter.getDictionary("ru"));

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

    const channelSchema = yup.object().shape({
        channelName: yup
          .string()
          .required(i18next.t(($) => $.required))
          .min(3, i18next.t(($) => $.channelNameRange))
          .max(20, i18next.t(($) => $.channelNameRange))
          .test(
            "unique-channel",
            i18next.t(($) => $.channelAlreadyExists),
            (value) =>
              !channels.some(
                (channel) =>
                  channel.name.trim().toLowerCase() ===
                  value.trim().toLowerCase()
              )
          ),
      });

    useEffect(() => {
        filter.clearList();
        filter.add(filter.getDictionary("en"));
        filter.add(filter.getDictionary("ru"));

        socket?.on("newMessage", (message) => {
            dispatch(addMessages(message));
        });

        socket?.on("newChannel", (channel) => {
            dispatch(addChannelToStore(channel));
        });

        socket?.on("renameChannel", (channel) => {
            dispatch(renameChannelInStore(channel));
        });

        socket?.on("removeChannel", (channel) => {
            dispatch(removeChannelFromStore(channel));
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

        filter.clearList();
        filter.add(filter.getDictionary("en"));
        filter.add(filter.getDictionary("ru"));

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
                title: "Успешно",
                message: i18next.t(($) => $.channelCreated),
                color: "green",
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
            await axios.delete(
                `/api/v1/channels/${channelToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
        initialValues: { channelName: "" },
        validate: yupResolver(channelSchema),
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
        initialValues: { channelName: "" },
        validate: yupResolver(channelSchema),
    });

    const renameChannel = async (values) => {
        const token = localStorage.getItem("token");

        try {
            const cleanName = filter.clean(
                values.channelName.trim()
            );

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
                style={{
                    borderBottom: "1px solid #dee2e6",
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "#212529",
                        fontWeight: 700,
                        fontSize: 16,
                    }}
                >
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
                    overflow: "hidden",
                }}
                bg="white"
            >
                <ChannelList
                    channels={channels}
                    currentChannelId={currentChannelId}
                    setCurrentChannelId={setCurrentChannelId}
                    setIsAddChannelOpen={setIsAddChannelOpen}
                    handlrRenameChanal={handlrRenameChanal}
                    handleDeleteChannel={handleDeleteChannel}
                />

                {/* Правая часть - Чат */}
                <Flex
                    direction="column"
                    style={{ flex: 1 }}
                    h="100%"
                >
                    <ChatMessages
                        channels={channels}
                        messages={messages}
                        currentChannelId={currentChannelId}
                    />

                    <MessageForm
                        messageText={messageText}
                        setMessageText={setMessageText}
                        addedMessages={addedMessages}
                    />
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

                        <Button type="submit">
                            {i18next.t(($) => $.submit)}
                        </Button>
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
                <Text size="sm">
                    {i18next.t(
                        ($) => $.channelDeleteQuestionSecond
                    )}
                </Text>

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

                    <Button
                        color="red"
                        onClick={deleteChannel}
                    >
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
                <form
                    onSubmit={renameForm.onSubmit(renameChannel)}
                >
                    <TextInput
                        label={i18next.t(($) => $.channelName)}
                        placeholder={i18next.t(
                            ($) => $.namePlaceholder
                        )}
                        withAsterisk
                        autoFocus
                        key={renameForm.key("channelName")}
                        {...renameForm.getInputProps(
                            "channelName"
                        )}
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

                        <Button type="submit">
                            {i18next.t(($) => $.rename)}
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </Flex>
    );
}

export default Home;