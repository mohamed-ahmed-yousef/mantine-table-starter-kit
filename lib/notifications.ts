import { notifications } from "@mantine/notifications";

export function notifySuccess({
                                  title,
                                  message,
                              }: { title: string; message?: string }) {
    notifications.show({
        title,
        message,
        color: "green",
    });
}

export function notifyError({
                                title,
                                message,
                            }: { title: string; message?: string }) {
    notifications.show({
        title,
        message,
        color: "red",
    });
}