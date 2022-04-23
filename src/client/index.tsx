import React from "react";
import ReactDOM from "react-dom";
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
