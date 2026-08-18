"use client";

/*
Menu wyświetla desktopową nawigację z linkami „Home”, „Recipes” i „Favorites”.

Menu nie wyświetla elementu nawigacji oznaczonego jako ukryty.

Menu wyświetla przycisk otwierający mobilne menu.

Kliknięcie przycisku otwierającego mobilne menu wywołuje onMobileOpen.

Przycisk otwierający mobilne menu ma aria-expanded="false", gdy menu jest zamknięte.

Przycisk otwierający mobilne menu ma aria-expanded="true", gdy menu jest otwarte.

Przycisk otwierający mobilne menu nie ma atrybutu aria-controls, gdy menu jest zamknięte.

Przycisk otwierający mobilne menu ma aria-controls="navigation-drawer", gdy menu jest otwarte.

Mobilne menu otrzymuje informację o swoim aktualnym stanie otwarcia.

Po zamknięciu mobilnego menu fokus wraca na przycisk otwierający menu.
*/

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";

import Menu, { NavItem } from "./Menu";
import theme from "@/themes/theme";

jest.mock("./DesktopMenu", () => ({
    __esModule: true,
    default: ({ navItems }: { navItems: NavItem[] }) => (
        <div data-testid="desktop-menu">
            {navItems.map(item => (
                <span key={item.label}>{item.label}</span>
            ))}
        </div>
    ),
}));

jest.mock("./MobileMenu", () => ({
    __esModule: true,
    default: ({ navItems, open, onClose }: { navItems: NavItem[]; open: boolean; onClose: () => void }) => (
        <div data-testid="mobile-menu">
            <span data-testid="mobile-menu-open">{String(open)}</span>

            {navItems.map(item => (
                <span key={item.label}>{item.label}</span>
            ))}

            {open && (
                <button type="button" onClick={onClose}>
                    Close mobile menu
                </button>
            )}
        </div>
    ),
}));

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(() => "/"),
}));

describe("Menu", () => {
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

    const hiddenNavItem: NavItem = {
        label: "Hidden",
        href: "/hidden",
        icon: <span>H</span>,
        hidden: true,
    };

    const renderMenu = (props: Partial<React.ComponentProps<typeof Menu>> = {}) => {
        const defaultProps: React.ComponentProps<typeof Menu> = {
            navItems,
            mobileOpen: false,
            onMobileOpen: jest.fn(),
            onMobileClose: jest.fn(),
        };

        return render(
            <ThemeProvider theme={theme}>
                <Menu {...defaultProps} {...props} />
            </ThemeProvider>
        );
    };

    it("renders the desktop navigation with the provided navigation items", () => {
        renderMenu();

        const desktopMenu = screen.getByTestId("desktop-menu");

        expect(desktopMenu).toHaveTextContent("Home");
        expect(desktopMenu).toHaveTextContent("Recipes");
        expect(desktopMenu).toHaveTextContent("Favorites");
    });

    it("does not render hidden navigation items", () => {
        renderMenu({
            navItems: [...navItems, hiddenNavItem],
        });

        expect(screen.getByTestId("desktop-menu")).not.toHaveTextContent("Hidden");

        expect(screen.getByTestId("mobile-menu")).not.toHaveTextContent("Hidden");
    });

    it("renders the mobile menu trigger", () => {
        renderMenu();

        expect(
            screen.getByRole("button", {
                name: "Open navigation menu",
            })
        ).toBeInTheDocument();
    });

    it("calls onMobileOpen when the mobile menu trigger is clicked", () => {
        const onMobileOpen = jest.fn();

        renderMenu({ onMobileOpen });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Open navigation menu",
            })
        );

        expect(onMobileOpen).toHaveBeenCalledTimes(1);
    });

    it("sets aria-expanded to false when the mobile menu is closed", () => {
        renderMenu({
            mobileOpen: false,
        });

        expect(
            screen.getByRole("button", {
                name: "Open navigation menu",
            })
        ).toHaveAttribute("aria-expanded", "false");
    });

    it("sets aria-expanded to true when the mobile menu is open", () => {
        renderMenu({
            mobileOpen: true,
        });

        expect(
            screen.getByRole("button", {
                name: "Open navigation menu",
            })
        ).toHaveAttribute("aria-expanded", "true");
    });

    it("does not set aria-controls when the mobile menu is closed", () => {
        renderMenu({
            mobileOpen: false,
        });

        expect(
            screen.getByRole("button", {
                name: "Open navigation menu",
            })
        ).not.toHaveAttribute("aria-controls");
    });

    it("sets aria-controls to navigation-drawer when the mobile menu is open", () => {
        renderMenu({
            mobileOpen: true,
        });

        expect(
            screen.getByRole("button", {
                name: "Open navigation menu",
            })
        ).toHaveAttribute("aria-controls", "navigation-drawer");
    });

    it("passes the mobile menu open state to MobileMenu", () => {
        renderMenu({
            mobileOpen: true,
        });

        expect(screen.getByTestId("mobile-menu-open")).toHaveTextContent("true");
    });

    it("returns focus to the mobile menu trigger after closing the menu", async () => {
        const onMobileClose = jest.fn();

        renderMenu({
            mobileOpen: true,
            onMobileClose,
        });

        const trigger = screen.getByRole("button", {
            name: "Open navigation menu",
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Close mobile menu",
            })
        );

        expect(onMobileClose).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(trigger).toHaveFocus();
        });
    });
});
