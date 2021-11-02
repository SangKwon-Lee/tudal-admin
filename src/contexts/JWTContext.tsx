import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/user';
import { authApi } from '../lib/api/auth.api';
import axios, { cmsServer } from '../lib/axios';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends State {
  platform: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: User;
  };
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const setSession = (
  accessToken: string | null,
  userId?: string | null,
): void => {
  if (accessToken && userId) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    cmsServer.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common.Authorization;
    delete cmsServer.defaults.headers.common.Authorization;
  }
};

const handlers: Record<
  string,
  (state: State, action: Action) => State
> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type]
    ? handlers[action.type](state, action)
    : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken =
          window.localStorage.getItem('accessToken');
        const userId = window.localStorage.getItem('userId');

        if (accessToken) {
          setSession(accessToken, userId);
          const user = await authApi.me(userId);
          console.log('INIT User', user);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          setSession(null);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        setSession(null);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<void> => {
    setSession(null);
    const { accessToken, user } = await authApi.login({
      email,
      password,
    });
    setSession(accessToken, user.id.toString());
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const logout = async (): Promise<void> => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
