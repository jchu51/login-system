import React, { useCallback, useState, FormEvent, ChangeEvent } from "react";
import isEmpty from "lodash/isEmpty";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

import { verifyOtp } from "../api/index";
import { useAuth } from "../contexts/authContext";

interface IVerifyMFANumberForm {
  handleRedirect: (href: string) => void;
}

export default function VerifyMFANumberForm(props: IVerifyMFANumberForm) {
  const { handleRedirect } = props;
  const { setAuth, auth } = useAuth();
  const [verifyNumber, setVerifyNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (!isEmpty(verifyNumber)) {
        e.preventDefault();
        setIsLoading(true);

        const result = await verifyOtp(auth.accessToken, {
          token: verifyNumber,
        });

        if (result.success) {
          setAuth(result.data);
          handleRedirect("user");
        }
      }
    },
    [verifyNumber]
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel htmlFor="verifyNumber">Enter 2FA number:</FormLabel>
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
  );
}
