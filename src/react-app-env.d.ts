/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface Process {
    /** running on server */
    isServer: boolean;
  }
  interface ProcessEnv {
    /** node environment */
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_CMS_TOKEN: string;
    REACT_APP_CMS_URL: string;
    REACT_APP_API_URL: string;
  }
}
