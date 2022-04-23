import React, {
  useCallback,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import isEmpty from "lodash/isEmpty";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
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
  Switch,
} from "@chakra-ui/react";

import { fetchGetQrCode, verifyOtp, logout, updateUser } from "../../api/index";
import { ICookiesToken, useAuth } from "../../contexts/authContext";

export default function UserPage() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { user } = auth;
  const [qrCode, setQrCode] = useState<string>("");
  const [verifyNumber, setVerifyNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies<"token", ICookiesToken>(["token"]);
  const [show2FA, setShow2FA] = useState<boolean>(auth?.user.mfaEnabled);

  useEffect(() => {
    const callApi = async () => {
      if (show2FA && !auth?.user.mfaEnabled) {
        const result = await fetchGetQrCode(cookies.token.accessToken);

        if (result.success) {
          setQrCode(result.data);
        }
      } else if (!show2FA && auth?.user.mfaEnabled) {
        //disalbe 2fa
        const result = await updateUser(cookies.token.accessToken, {
          mfaEnabled: false,
          mfaToken: "",
        });

        if (result.success) {
          setAuth({ ...auth, user: result.data.user });
        }
      }
    };

    callApi();
  }, [show2FA]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (!isEmpty(verifyNumber)) {
        e.preventDefault();
        setIsLoading(true);
        const result = await verifyOtp(cookies.token.accessToken, {
          token: verifyNumber,
        });

        if (result.success) {
          setShow2FA(true);
          setAuth({
            ...auth,
            user: {
              ...auth.user,
              mfaEnabled: true,
            },
          });
        }
        setIsLoading(false);
      }
    },
    [verifyNumber]
  );

  const handleToggle2FA = () => {
    setShow2FA(!show2FA);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <VStack height={"100vh"} justifyContent="center">
      <Container maxW="md" border={"1px solid #888"} borderRadius={8}>
        <Box w="100%" p={2}>
          <Text paddingTop={4} fontSize="md">
            User name: {user.username}
          </Text>
          <Text paddingTop={4} fontSize="md">
            Email: {user.email}
          </Text>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="2FA" mb="0">
              Enable 2FA?
            </FormLabel>
            <Switch id="2FA" isChecked={show2FA} onChange={handleToggle2FA} />
          </FormControl>
          {show2FA && !user.mfaEnabled && (
            <>
              <img alt="2FA" src={qrCode} />
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel htmlFor="verifyNumber">Number</FormLabel>
                  <Input
                    id="verifyNumber"
                    type="number"
                    value={verifyNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setVerifyNumber(e.target.value)
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
                    Verify
                  </Button>
                </FormControl>
              </form>
            </>
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
      </Container>
    </VStack>
  );
}
