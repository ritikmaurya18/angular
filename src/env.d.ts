interface ImportMetaEnv {
  readonly NG_APP_API_URL?: string;
  readonly NG_APP_APP_NAME?: string;
  readonly NG_APP_VERSION?: string;
  readonly NG_APP_ANALYTICS?: string;
  readonly NG_APP_MAX_TODOS?: string;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}
