declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GSSO_TOKEN_NAME: string;
      HACKNEY_JWT_SECRET: string;
      AUTHORISED_DEV_GROUP: string;
      AUTHORISED_ADMIN_GROUP: string;
      AUTHORISED_ADULT_GROUP: string;
      AUTHORISED_CHILD_GROUP: string;
      AUTHORISED_ALLOCATORS_GROUP: string;
      AUTHORISED_UNRESTRICTED_GROUP: string;
      AUTHORISED_AUDITABLE_GROUP: string;
      AUTHORISED_WORKFLOWS_PILOT_GROUP: string;
      WORKFLOWS_PILOT_URL: string;
    }
  }

  interface Window {
    __APP_CONFIG__: {
      [identifier: string]: string | number;
    };
    GOVUKFrontend: {
      initAll: () => void;
    };
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
