import { TextInput, PasswordInput, Button, Container, Card, Title, Text, Flex, Box, Anchor } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import i18next from "i18next";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [serverError, setServerError] = useState("");

    const schema = yup.object().shape({
        name: yup
            .string()
            .required(i18next.t(($) => $.required))
            .min(3, i18next.t(($) => $.usernameRange))
            .max(20, i18next.t(($) => $.usernameRange)),

        password: yup
            .string()
            .required(i18next.t(($) => $.required))
            .min(6, i18next.t(($) => $.passwordMin)),

        confirmPassword: yup
            .string()
            .required(i18next.t(($) => $.required))
            .oneOf(
                [yup.ref("password")],
                i18next.t(($) => $.mustMatch)
            ),
    });

    const form = useForm({
        initialValues: {
            name: "",
            password: "",
            confirmPassword: "",
        },

        validate: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        setServerError("");

        try {
            const response = await axios.post("/api/v1/signup", {
                username: values.name,
                password: values.password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            dispatch(login(token));

            navigate("/");
        } catch (error) {
            console.log("ERROR:", error);
            if (error.response?.status === 409) {
                setServerError(i18next.t(($) => $.userAlreadyExists));
            } else {
                setServerError(i18next.t(($) => $.signupFailed));
            }
        }
    };

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

            {/* Карточка регистрации */}
            <Container size="xs" my="auto" w="100%">
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                    <Title order={2} size="h3" mb="lg" ta="center">
                        {i18next.t(($) => $.registration)}
                    </Title>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            label={i18next.t(($) => $.username)}
                            placeholder={i18next.t(($) => $.username)}
                            mb="sm"
                            {...form.getInputProps("name")}
                        />

                        <PasswordInput
                            label={i18next.t(($) => $.password)}
                            placeholder={i18next.t(($) => $.password)}
                            mb="sm"
                            {...form.getInputProps("password")}
                        />

                        <PasswordInput
                            label={i18next.t(($) => $.confirmPassword)}
                            placeholder={i18next.t(($) => $.confirmPassword)}
                            mb="sm"
                            {...form.getInputProps("confirmPassword")}
                        />

                        {serverError && (
                            <Text c="red" size="sm" mb="sm">
                                {serverError}
                            </Text>
                        )}

                        <Button type="submit" fullWidth mt="md">
                            {i18next.t(($) => $.registrationBatton)}
                        </Button>
                    </form>
                </Card>
            </Container>
        </Flex>
    );
}

export default Signup;




 