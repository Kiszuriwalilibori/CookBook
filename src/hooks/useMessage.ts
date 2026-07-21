"use client";

import { SnackbarOrigin, useSnackbar } from "notistack";

interface MessageOptions {
    autoHideDuration?: number;
    anchorOrigin?: SnackbarOrigin;
    [key: string]: unknown;
}
export interface MessageMethods {
    info: (message: string, options?: MessageOptions) => void;
    error: (message: string, options?: MessageOptions) => void;
    success: (message: string, options?: MessageOptions) => void;
    warning: (message: string, options?: MessageOptions) => void;
}

export const useMessage = (): MessageMethods => {
    const { enqueueSnackbar } = useSnackbar();

    const showMessage: MessageMethods = {
        info: (message, options) => enqueueSnackbar(message, { variant: "info", ...options }),
        error: (message, options) => enqueueSnackbar(message, { variant: "error", ...options }),
        success: (message, options) => enqueueSnackbar(message, { variant: "success", ...options }),
        warning: (message, options) => enqueueSnackbar(message, { variant: "warning", ...options }),
    };

    return showMessage;
};

export default useMessage;

// TODO: Ale uwaga: Twój useMessage za każdym renderem tworzy nowy obiekt:

// const showMessage: MessageMethods = {
//     info: ...,
//     error: ...,
// }

// więc showMessage ma nową referencję przy każdym renderze.

// To może powodować ponowne wykonanie efektu.

// Na przyszłość rozważyłbym w useMessage:

// const showMessage = useMemo(
//     () => ({
//         info: ...,
//         error: ...,
//         success: ...,
//         warning: ...,
//     }),
//     [enqueueSnackbar]
// );
