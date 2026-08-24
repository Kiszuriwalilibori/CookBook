import { ApiErrorPayload } from "@/models/apiResponse";
import { useCallback } from "react";
import useMessage, { MessageMethods } from "@/hooks/useMessage";

export type MessageType = keyof MessageMethods;

export type ErrorHandlerMap = Partial<
    Record<
        string,
        {
            type: MessageType;
            message?: string;
        }
    >
>;

type TransportError = { type: "NETWORK_ERROR"; message: string } | { type: "PARSE_ERROR"; message: string } | { type: "ABORTED"; message: string };

function isTransportError(err: unknown): err is TransportError {
    return typeof err === "object" && err !== null && "type" in err && typeof (err as { type?: unknown }).type === "string";
}

function isApiErrorPayload(err: unknown): err is ApiErrorPayload {
    return typeof err === "object" && err !== null && "code" in err && "message" in err;
}

export function useApiResponseErrorHandler() {
    const showMessage = useMessage();

    return useCallback(
        (err: unknown, map: ErrorHandlerMap = {}) => {
            console.log(err);

            // Transport errors (fetch / parse)
            if (isTransportError(err)) {
                switch (err.type) {
                    case "NETWORK_ERROR":
                        showMessage.error("Brak połączenia z internetem");
                        return;

                    case "PARSE_ERROR":
                        showMessage.error("Błąd odpowiedzi serwera");
                        return;

                    case "ABORTED":
                        showMessage.info("Zapytanie przerwane");
                        return;
                }
            }

            // Unknown error
            if (!isApiErrorPayload(err)) {
                showMessage.error("Nieoczekiwany błąd");
                return;
            }

            // API error
            const config = map[err.code];

            if (!config) {
                showMessage.error(err.message);
                return;
            }

            showMessage[config.type](config.message ?? err.message);
        },
        [showMessage]
    );
}
