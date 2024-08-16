"use client";

import { usePathname, useRouter } from "@/navigation";
import { type Locale,  availableLocales } from "@/next.locales";
import { Button, Menu } from "@mantine/core";
import { useLocale } from "next-intl";
import {useSearchParams} from "next/navigation";

export default function LangSwitch() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const searchParams = useSearchParams();
    const handleChange = (newLocale: Locale) => {
        // console.log(newLocale)
        const currentSearchParams = new URLSearchParams(searchParams);
        const searchString = currentSearchParams.toString();
        router.replace(`${pathname}?${searchString}`, { locale: newLocale });
    };

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button variant="light" size="icon" className="min-w-fit">
                    {availableLocales.find(({ code }) => code === locale)?.localName}
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {availableLocales.map(({ code, localName }) => (
                    <Menu.Item key={code} onClick={() => handleChange(code)}>
                        {localName}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}

