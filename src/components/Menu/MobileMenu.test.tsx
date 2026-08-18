import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";

import theme from "@/themes/theme";
import MobileMenu from "./MobileMenu";

/*Menu wyświetla link „Home”.
Menu wyświetla link „Recipes”.
Menu wyświetla link „Favorites”.
Link „Home” jest oznaczony jako aktualna strona.
Link „Recipes” nie jest oznaczony jako aktualna strona.
Kliknięcie linku „Recipes” wywołuje onClose.
Naciśnięcie Escape na linku „Home” wywołuje onClose.
Naciśnięcie Tab przenosi fokus na kolejny element nawigacji.
Naciśnięcie Shift + Tab przenosi fokus na poprzedni element nawigacji.
Naciśnięcie ArrowDown przenosi fokus na kolejny element nawigacji.
Naciśnięcie ArrowUp przenosi fokus na poprzedni element nawigacji.
Naciśnięcie Home przenosi fokus na pierwszy element nawigacji.
Naciśnięcie End przenosi fokus na ostatni element nawigacji.
Po zamknięciu menu fokus wraca na element, który je otworzył.
*/
jest.mock("next/navigation", () => ({
    usePathname: () => "/",
}));

jest.mock("next/link", () => {
    return function MockLink({ children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) {
        return <a {...props}>{children}</a>;
    };
});

const navItems = [
    {
        label: "Home",
        href: "/",
        icon: <span aria-hidden="true">H</span>,
    },
    {
        label: "Recipes",
        href: "/recipes",
        icon: <span aria-hidden="true">R</span>,
    },
    {
        label: "Favorites",
        href: "/favorites",
        icon: <span aria-hidden="true">F</span>,
    },
];

const renderMobileMenu = (props: Partial<React.ComponentProps<typeof MobileMenu>> = {}) => {
    return render(
        <ThemeProvider theme={theme}>
            <MobileMenu navItems={navItems} open onClose={jest.fn()} {...props} />
        </ThemeProvider>
    );
};

describe("MobileMenu", () => {
    it("renders navigation items when open", () => {
        renderMobileMenu();

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Recipes" })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Favorites" })).toBeInTheDocument();
    });

    it("marks the current navigation item", () => {
        renderMobileMenu();

        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");

        expect(screen.getByRole("link", { name: "Recipes" })).not.toHaveAttribute("aria-current", "page");
    });

    it("calls onClose when a navigation item is clicked", () => {
        const onClose = jest.fn();

        renderMobileMenu({ onClose });

        fireEvent.click(screen.getByRole("link", { name: "Recipes" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Escape is pressed on a navigation item", () => {
        const onClose = jest.fn();

        renderMobileMenu({ onClose });

        const home = screen.getByRole("link", {
            name: "Home",
        });

        fireEvent.keyDown(home, {
            key: "Escape",
        });

        expect(onClose).toHaveBeenCalled();
    });
    it("moves focus to the first navigation item when opened", async () => {
        renderMobileMenu();

        await waitFor(() => {
            expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
        });
    });
    it("moves focus to the next navigation item with ArrowDown", () => {
        renderMobileMenu();

        const home = screen.getByRole("link", { name: "Home" });
        const recipes = screen.getByRole("link", { name: "Recipes" });

        home.focus();

        fireEvent.keyDown(home, {
            key: "ArrowDown",
        });

        expect(recipes).toHaveFocus();
    });

    it("moves focus to the previous navigation item with ArrowUp", () => {
        renderMobileMenu();

        const home = screen.getByRole("link", { name: "Home" });
        const recipes = screen.getByRole("link", { name: "Recipes" });

        recipes.focus();

        fireEvent.keyDown(recipes, {
            key: "ArrowUp",
        });

        expect(home).toHaveFocus();
    });

    it("moves focus to the first navigation item with Home", () => {
        renderMobileMenu();

        const home = screen.getByRole("link", { name: "Home" });
        const favorites = screen.getByRole("link", { name: "Favorites" });

        favorites.focus();

        fireEvent.keyDown(favorites, {
            key: "Home",
        });

        expect(home).toHaveFocus();
    });

    it("moves focus to the last navigation item with End", () => {
        renderMobileMenu();

        const home = screen.getByRole("link", { name: "Home" });
        const favorites = screen.getByRole("link", { name: "Favorites" });

        home.focus();

        fireEvent.keyDown(home, {
            key: "End",
        });

        expect(favorites).toHaveFocus();
    });
});
