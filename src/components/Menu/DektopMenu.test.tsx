import { fireEvent, render, screen } from "@testing-library/react";

import DesktopMenu from "./DesktopMenu";
import type { NavItem } from "./Menu";

jest.mock("next/navigation", () => ({
    usePathname: () => "/",
}));

const navItems: NavItem[] = [
    {
        label: "Home",
        href: "/",
        icon: <span>H</span>,
    },
    {
        label: "Recipes",
        href: "/recipes",
        icon: <span>R</span>,
    },
    {
        label: "Favorites",
        href: "/favorites",
        icon: <span>F</span>,
    },
];

describe("DesktopMenu", () => {
    it("renders all navigation items", () => {
        render(<DesktopMenu navItems={navItems} />);

        expect(screen.getByRole("link", { name: /Home/ })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: /Recipes/ })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: /Favorites/ })).toBeInTheDocument();
    });

    it("marks the current navigation item", () => {
        render(<DesktopMenu navItems={navItems} />);

        expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("aria-current", "page");

        expect(screen.getByRole("link", { name: /Recipes/ })).not.toHaveAttribute("aria-current");
    });

    it("calls onClick for an action item", () => {
        const onClick = jest.fn();

        const items: NavItem[] = [
            {
                label: "Logout",
                icon: <span>L</span>,
                onClick,
            },
        ];

        render(<DesktopMenu navItems={items} />);

        fireEvent.click(screen.getByRole("button", { name: /Logout/ }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("moves focus to the next item with ArrowRight", () => {
        render(<DesktopMenu navItems={navItems} />);

        const home = screen.getByRole("link", { name: /Home/ });
        const recipes = screen.getByRole("link", { name: /Recipes/ });

        home.focus();

        fireEvent.keyDown(home, {
            key: "ArrowRight",
        });

        expect(recipes).toHaveFocus();
    });

    it("moves focus to the previous item with ArrowLeft", () => {
        render(<DesktopMenu navItems={navItems} />);

        const home = screen.getByRole("link", { name: /Home/ });
        const favorites = screen.getByRole("link", { name: /Favorites/ });

        home.focus();

        fireEvent.keyDown(home, {
            key: "ArrowLeft",
        });

        expect(favorites).toHaveFocus();
    });

    it("moves focus to the first item with Home", () => {
        render(<DesktopMenu navItems={navItems} />);

        const home = screen.getByRole("link", { name: /Home/ });
        const favorites = screen.getByRole("link", { name: /Favorites/ });

        favorites.focus();

        fireEvent.keyDown(favorites, {
            key: "Home",
        });

        expect(home).toHaveFocus();
    });

    it("moves focus to the last item with End", () => {
        render(<DesktopMenu navItems={navItems} />);

        const home = screen.getByRole("link", { name: /Home/ });
        const favorites = screen.getByRole("link", { name: /Favorites/ });

        home.focus();

        fireEvent.keyDown(home, {
            key: "End",
        });

        expect(favorites).toHaveFocus();
    });
});
