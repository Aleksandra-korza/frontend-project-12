import React from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
import { Flex, Box, Container, Title, Text, Button, Anchor } from "@mantine/core";

function NotFound() {
  return (
    <Flex direction="column" minH="100vh" bg="gray.0">
      {/* Шапка */}
      <Box 
        px="xl" 
        py="sm" 
        bg="white" 
        style={{ borderBottom: "1px solid #dee2e6" }}
      >
        <Anchor component={Link} to="/" fw={700} fz="md" c="dark" underline="never">
          {i18next.t(($) => $.nameChat)}
        </Anchor>
      </Box>

      {/* Контент 404 по центру */}
      <Container size="sm" my="auto" ta="center">
        <Title order={1} size={80} fw={900} c="gray.4" mb="md">
          {i18next.t(($) => $.error404)}
        </Title>
        <Text size="xl" fw={500} mb="lg">
          {i18next.t(($) => $.noPage)}
        </Text>
        <Button component={Link} to="/" size="md">
          {i18next.t(($) => $.nameChat)}
        </Button>
      </Container>
    </Flex>
  );
}

export default NotFound;