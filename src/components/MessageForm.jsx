import { Box, Flex, TextInput, Button } from "@mantine/core";
import i18next from "i18next";

function MessageForm({
  messageText,
  setMessageText,
  addedMessages,
}) {
  return (
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

          <Button type="submit">
            {i18next.t(($) => $.add)}
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default MessageForm;