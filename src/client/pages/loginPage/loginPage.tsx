import React, {
  ChangeEvent,
  useCallback,
  useState,
  FormEvent,
  useEffect,
} from "react";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Input,
  Button,
  Container,
  VStack,
  Text,
  Link,
} from "@chakra-ui/react";

import { login } from "../../api/index";
import { ICookiesToken, useAuth } from "../../contexts/authContext";
import { VerifyMFANumberForm } from "../../components/index";

export default function Login() {
  const navigate = useNavigate();
  const [cookies] = useCookies<"token", ICookiesToken>(["token"]);

  const { setAuth, auth } = useAuth();
  const [email, setEmail] = useState<string>("jonathan@gmail.com");
  const [password, setPassword] = useState<string>("test");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show2FAVerifyForm, setShow2FAVerifyForm] = useState<boolean>(false);

  useEffect(() => {
    if (auth?.user && cookies) {
      navigate("/user");
    }
  }, []);

  useEffect(() => {
    if (cookies?.token) {
      setAuth({ ...auth, ...cookies.token });
    } else {
      setAuth({ user: null, accessToken: null });
    }
  }, [cookies]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (!isEmpty(email) && !isEmpty(password)) {
        e.preventDefault();
        setIsLoading(true);
        const result = await login({ email, password });
        if (result.success) {
          if (result.data.user.mfaEnabled) {
            setAuth({ ...auth, accessToken: result.data.accessToken });
            setShow2FAVerifyForm(true);
          } else {
            setAuth(result.data);
            handleRedirect("user");
          }
        }
      }
    },
    [email, password]
  );

  const handleRedirect = (href: string) => {
    navigate(`/${href}`);
  };

  return (
    <VStack height={"100vh"} justifyContent="center">
      <Container maxW="md" border={"1px solid #888"} borderRadius={8}>
        <Box w="100%" p={4}>
          {!show2FAVerifyForm ? (
            <>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <Text paddingTop={4} fontSize="xs">
                    <Link onClick={() => handleRedirect("rest")}>
                      Forgot password?
                    </Link>
                  </Text>
                  <Button
                    isLoading={isLoading}
                    loadingText="Loading"
                    colorScheme="teal"
                    variant="outline"
                    type="submit"
                    marginTop={4}
                  >
                    Login
                  </Button>
                </FormControl>
              </form>
              <Text paddingTop={4} fontSize="sm">
                Not registered yet?{" "}
                <Link onClick={() => handleRedirect("register")}>
                  Create an account
                </Link>
              </Text>
            </>
          ) : (
            <VerifyMFANumberForm handleRedirect={handleRedirect} />
          )}
        </Box>
      </Container>
    </VStack>
  );
}
