// src/types/google.d.ts
export {};

declare global {
    interface Window {
        google?: GoogleIdentityServices;
        googleInitialized?: boolean;
    }
}

interface GoogleIdentityServices {
    accounts: {
        id: {
            initialize: (config: GoogleSignInConfig) => void;
            renderButton: (element: HTMLElement | null, options: GoogleButtonOptions) => void;
            prompt: () => void;
        };
    };
}

interface GoogleSignInConfig {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: "signin" | "signup" | "use";
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean;
}

interface GoogleCredentialResponse {
    credential: string;
    select_by?: "auto" | "user" | "user_1tap" | "user_2tap" | "btn" | "btn_confirm" | "btn_add_session" | "btn_confirm_add_session";
}

interface GoogleButtonOptions {
    type?: "standard" | "icon";
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    logo_alignment?: "left" | "center";
    width?: string;
    locale?: string;
}
