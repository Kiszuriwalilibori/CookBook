"use client";

import { usePathname } from "next/navigation";

const useIsCurrentMenuItem = () => {
    const currentPathname = usePathname();

    return (href?: string): boolean => Boolean(href && currentPathname === href.split("?")[0]);
};

export default useIsCurrentMenuItem;
