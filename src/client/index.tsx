import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import config from "../aws-exports";
Amplify.configure(config);

import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./app";

ReactDOM.render(
  <CookiesProvider>
    <RecoilRoot>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </RecoilRoot>
  </CookiesProvider>,
  document.getElementById("root")
);
