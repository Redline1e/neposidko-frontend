export {}; 

declare global {
  interface Window {
    onRecaptchaSuccess: (token: string) => void;
    onRecaptchaError: () => void;
    grecaptcha: {
      reset: () => void;
      render: (container: string | HTMLElement, parameters: any) => void;
      execute: () => void;
      getResponse: () => string;
    };
  }
}
