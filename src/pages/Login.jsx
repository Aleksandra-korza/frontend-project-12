import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice.js';
import i18next from 'i18next';
import {
  Container,
  Card,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Flex,
  Box,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authErr, setAuthError] = useState('');

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    setAuthError('');

    try {
      const response = await axios.post('/api/v1/login', values);
      const { token } = response.data;

      if (!token) {
        setAuthError(i18next.t(($) => $.noToken));
        return;
      }

      dispatch(login(token));
      navigate('/');
    } catch (error) {
      setAuthError(i18next.t(($) => $.invalidCredentials));
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg="gray.0">
      <Box
        px="xl"
        py="sm"
        bg="white"
        style={{ borderBottom: '1px solid #dee2e6' }}
      >
        <Anchor
          component={Link}
          to="/"
          fw={700}
          fz="md"
          c="dark"
          underline="never"
        >
          {i18next.t(($) => $.nameChat)}
        </Anchor>
      </Box>

      <Container size="xs" my="auto" w="100%">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align="center"
            gap="lg"
            mb="lg"
          >
            <Box w={120} h={120} style={{ flexShrink: 0 }}>
              <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="100" r="80" fill="#EBF8FF" />
                <path
                  d="M60 140 C 60 110, 140 110, 140 140"
                  stroke="#3182CE"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle
                  cx="100"
                  cy="85"
                  r="25"
                  stroke="#3182CE"
                  strokeWidth="8"
                  fill="#FFFFFF"
                />
                <path
                  d="M130 55 L 145 35 M 145 35 L 155 45 M 145 35 L 135 25"
                  stroke="#DD6B20"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>

            <Box style={{ flex: 1 }} w="100%">
              <Text size="xl" fw={700} mb="md">
                {i18next.t(($) => $.login)}
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label={i18next.t(($) => $.nikName)}
                  mb="sm"
                  {...form.getInputProps('username')}
                />

                <PasswordInput
                  label={i18next.t(($) => $.password)}
                  mb="sm"
                  {...form.getInputProps('password')}
                />

                {authErr && (
                  <Text c="red" size="sm" mb="sm">
                    {authErr}
                  </Text>
                )}

                <Button type="submit" fullWidth mt="md">
                  {i18next.t(($) => $.loginSubmit)}
                </Button>
              </form>
            </Box>
          </Flex>

          <Box
            pt="md"
            style={{ borderTop: '1px solid #dee2e6' }}
            ta="center"
          >
            <Text size="sm" c="dimmed">
              {i18next.t(($) => $.noAcaunt)}{' '}
              <Anchor component={Link} to="/signup">
                {i18next.t(($) => $.registration)}
              </Anchor>
            </Text>
          </Box>
        </Card>
      </Container>
    </Flex>
  );
}

export default Login;