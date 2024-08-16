"use client";

import { Button, Menu, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeSwitch() {
    const { setColorScheme } = useMantineColorScheme();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button variant="light" size="icon" className="min-w-fit">
                    <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={() => setColorScheme("light")}>Light</Menu.Item>
                <Menu.Item onClick={() => setColorScheme("dark")}>Dark</Menu.Item>
                <Menu.Item onClick={() => setColorScheme("auto")}>Auto</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}