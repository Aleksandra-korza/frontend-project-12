import {
    Flex,
    Box,
    Text,
    ActionIcon,
    Button,
    Menu,
  } from "@mantine/core";
  import i18next from "i18next";
  
  function ChannelList({
    channels,
    currentChannelId,
    setCurrentChannelId,
    setIsAddChannelOpen,
    handlrRenameChanal,
    handleDeleteChannel,
  }) {
    return (
      <Box
        w={250}
        p="md"
        bg="gray.0"
        style={{ borderRight: "1px solid #dee2e6" }}
      >
        <Flex justify="space-between" align="center" mb="md">
          <Text fw={700} size="md">
            {i18next.t(($) => $.channels)}
          </Text>
  
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
              backgroundColor:
                channel.id === currentChannelId
                  ? "#e9ecef"
                  : "transparent",
              cursor: "pointer",
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
                  <Button
                    variant="subtle"
                    size="compact-xs"
                    color="gray"
                    aria-label={i18next.t(
                      ($) => $.channelManagement
                    )}
                  >
                    ⋮
                  </Button>
                </Menu.Target>
  
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => handlrRenameChanal(channel.id)}
                  >
                    {i18next.t(($) => $.rename)}
                  </Menu.Item>
  
                  <Menu.Item
                    color="red"
                    onClick={() => handleDeleteChannel(channel.id)}
                  >
                    {i18next.t(($) => $.delete)}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Flex>
        ))}
      </Box>
    );
  }
  
  export default ChannelList;