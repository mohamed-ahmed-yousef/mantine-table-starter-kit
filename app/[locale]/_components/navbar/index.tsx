"use client";
import LangSwitch from "./lang-switch";
import { ThemeSwitch } from "./theme-switch";
import { Link } from "@/navigation";
import { AppShell, Burger, Divider, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    BookText,
    DollarSign,
    FileClock,
    House,
    Landmark,
    User,
    Users,
    WalletCards,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";

export default function NavBar({ children }: { children: ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const t = useTranslations("NavBar");

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            withBorder={false}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" className={"bg-primary "}>
                    <Burger
                        opened={mobileOpened}
                        onClick={toggleMobile}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Burger
                        opened={desktopOpened}
                        onClick={toggleDesktop}
                        visibleFrom="sm"
                        size="sm"
                    />
                    <Image
                        src="/favicon.ico"
                        width={30}
                        height={30}
                        alt="ZU hospital logo"
                    />
                    <div className="hidden md:flex items-center gap-2 h-full grow">
                        {/*<SearchField className="min-w-0 md:basis-[300px] lg:basis-[600px] shrink" />*/}
                        <div className="grow" />
                        <LangSwitch />
                        {/*<Divider orientation="vertical" />*/}
                        <ThemeSwitch />
                        {/*<Logout />*/}
                    </div>
                </Group>
            </AppShell.Header>
            {/* TODO: fix for small screens */}
            <AppShell.Navbar>
                <section className={"bg-primary p-2 h-full space-y-4"}>
                    <Text fw="bold" size="xl">
                        {t("debt-collector")}
                    </Text>
                    {/*<SearchField className="w-full md:hidden mt-4" />*/}
                    <SharedLinks />
                    <Stack className="md:hidden mt-4">
                        <Divider mb="md" />
                        <div className="gap-2 grid grid-cols-2">
                            <LangSwitch />
                            <ThemeSwitch />
                        </div>
                        {/*<Logout width="100%" mt="md" />*/}
                    </Stack>
                </section>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}

function SharedLinks() {
    const t = useTranslations("NavBar");

    return (
        <Stack className="space-y-1">
            <NavLink href={"/"}>
                {" "}
                <House /> {t("home")}
            </NavLink>
            <NavLink href={"/debts"}>
                <DollarSign /> {t("debts")}
            </NavLink>
            <NavLink href={"/creditors"}>
                <Landmark /> {t("creditors")}
            </NavLink>
            <NavLink href={"/buckets"}>
                <WalletCards /> {t("buckets")}
            </NavLink>
            <NavLink href={"/employees"}>
                <User /> {t("employees")}
            </NavLink>
            <NavLink href={"/templates"}>
                <BookText /> {t("templates")}
            </NavLink>
            <NavLink href={"/groups"}>
                <Users /> {t("groups")}
            </NavLink>
            <NavLink href={"/activities"}>
                <FileClock /> {t("activities")}
            </NavLink>
        </Stack>
    );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="flex gap-x-2 hover:underline  hover:scale-105 transition duration-200 ease-in-out"
        >
            {children}
        </Link>
    );
}
