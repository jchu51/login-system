import React, {
  ChangeEvent,
  useCallback,
  useState,
  FormEvent,
  MouseEvent,
} from "react";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
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

import { register } from "../../api/index";
import { useAuth } from "../../contexts/authContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidCredentials] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      if (
        !isEmpty(email) &&
        !isEmpty(password) &&
        !isEmpty(confirmPassword) &&
        !isEmpty(username)
      ) {
        const result = await register({
          username,
          email,
          confirmPassword,
          password,
        });

        // For simplicity, we refresh the page after authenticating
        // and let app handle the flow
        if (result.success) {
          setAuth(result.data);
          navigate("/user");
        }
      }

      setIsLoading(false);
    },
    [email, password, confirmPassword, username]
  );

  const handleRedirect = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(`/${href}`);
  };

  return (
    <VStack height={"100vh"} justifyContent="center">
      <Container maxW="md" border={"1px solid #888"} borderRadius={8}>
        <Box w="100%" p={4}>
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
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="username"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
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
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
              <Button
                isLoading={isLoading}
                loadingText="Loading"
                colorScheme="teal"
                variant="outline"
                type="submit"
                marginTop={4}
              >
                Create an account
              </Button>
              {invalidCredentials && <p>Invalid credentials</p>}
            </FormControl>
          </form>
          <Text paddingTop={4} fontSize="sm">
            Aready has account?{" "}
            <Link onClick={(e) => handleRedirect(e, "")}>Login here</Link>
          </Text>
        </Box>
      </Container>
    </VStack>
  );
}
