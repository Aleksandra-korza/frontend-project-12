import { Box, ScrollArea, Text } from "@mantine/core";
import i18next from "i18next";

function ChatMessages({ channels, messages, currentChannelId }) {
  return (
    <>
      {/* Шапка текущего канала */}
      <Box p="md" style={{ borderBottom: "1px solid #dee2e6" }}>
        <Text fw={700} size="md">
          {
            channels.find(
              (channel) => channel.id === currentChannelId
            )?.name
          }
        </Text>

        <Text size="xs" c="dimmed">
          {
            messages.filter(
              (message) =>
                message.channelId === currentChannelId
            ).length
          }{" "}
          сообщений
        </Text>
      </Box>

      {/* Сообщения с прокруткой Mantine */}
      <ScrollArea style={{ flex: 1 }} p="md">
        {messages
          .filter(
            (message) => message.channelId === currentChannelId
          )
          .map((message) => (
            <Text key={message.id} size="sm" mb="xs">
              <Text span fw={700} mr={6}>
                {message.username}:
              </Text>
              {message.body}
            </Text>
          ))}
      </ScrollArea>
    </>
  );
}

export default ChatMessages;