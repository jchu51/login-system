import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import isNil from "lodash/isNil";
import { useCookies } from "react-cookie";
import { atom, useRecoilState, RecoilState, SetterOrUpdater } from "recoil";

export interface IUser {
  createdAt: string;
  email: string;
  mfaEnabled: boolean;
  mfaToken: string;
  updatedAt: string;
  username: string;
  _id: string;
}

export interface IAuthState {
  user?: IUser;
  accessToken?: string;
}

export interface IAuthContext {
  auth: IAuthState;
  setAuth: SetterOrUpdater<IAuthState>;
}

export interface ICookiesToken {
  token?: {
    user: IUser;
    accessToken: string;
  };
}
export const AuthContext = createContext<Partial<IAuthContext>>({});

const authState: RecoilState<IAuthState> = atom({
  key: "userState",
  default: null,
});

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [cookies] = useCookies<"token", ICookiesToken>(["token"]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    setIsLoading(true);
    if (cookies) {
      setAuth({ ...auth, ...cookies.token });
    } else {
      setAuth({ user: null, accessToken: null });
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer: FunctionComponent = ({
  children,
}: {
  children: (context: Partial<IAuthContext>) => ReactNode;
}) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        if (isNil(context)) {
          throw new Error("AuthConsumer must be used within a AuthProvider");
        }
        return children(context);
      }}
    </AuthContext.Consumer>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (isNil(context)) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
