"use client";

import NavBar from "@/app/[locale]/_components/navbar";
import { useI18nZodErrors } from "@/lib/use-I18n-zod-errors";
import { usePathname, useRouter } from "@/navigation";
import { DirectionProvider, MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { type ReactNode, useEffect } from "react";
const theme = createTheme({});

const queryClient = new QueryClient();
export default function App({
                                children,
                                langDir,
                            }: { children: ReactNode; langDir: string }) {
    useI18nZodErrors();
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <DirectionProvider>
                {/** @ts-expect-error */}
                <MantineProvider theme={{ ...theme, dir: langDir }}>
                    <ProgressBar
                        height="4px"
                        color="var(--mantine-primary-color-filled)"
                        options={{ showSpinner: true }}
                        shallowRouting
                    />
                    <ConfirmUserLoggedIn>{children}</ConfirmUserLoggedIn>
                </MantineProvider>
            </DirectionProvider>
        </QueryClientProvider>
    );
}

function ConfirmUserLoggedIn({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <>{pathname === "/login" ? <>{children}</> : <NavBar>{children}</NavBar>}</>
    );
}
