export {};

declare global {
  interface Window {
    onRecaptchaSuccess: (token: string) => void;
    onRecaptchaError: () => void;
    grecaptcha: {
      reset: () => void;
      render: (
        container: string | HTMLElement,
        parameters: { sitekey: string; theme: string }
      ) => void;
      execute: () => void;
      getResponse: () => string;
    };
  }
}
export {};

declare global {
  interface Window {
    onRecaptchaSuccess: (token: string) => void;
    onRecaptchaError: () => void;
    grecaptcha: {
      reset: () => void;
      render: (
        container: string | HTMLElement,
        parameters: { sitekey: string; theme: string }
      ) => void;
      execute: () => void;
      getResponse: () => string;
    };
  }
}
