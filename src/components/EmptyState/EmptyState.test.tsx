import { render } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { EmptyState } from "./EmptyState";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const theme = createTheme();

function renderWithTheme(ui: React.ReactElement) {
    return render(
        <ThemeProvider theme={theme}>
            {ui}
        </ThemeProvider>
    );
}

describe("EmptyState", () => {
    it("matches snapshot (basic)", () => {
        const { container } = renderWithTheme(
            <EmptyState title="No items found" />
        );

        expect(container).toMatchSnapshot();
    });

    it("matches snapshot with description and icon", () => {
        const { container } = renderWithTheme(
            <EmptyState
                icon={<SearchOffIcon />}
                title="No recipes"
                description="Try adjusting your filters"
            />
        );

        expect(container).toMatchSnapshot();
    });

    it("matches snapshot with action button", () => {
        const { container } = renderWithTheme(
            <EmptyState
                title="No favourites"
                description="You have not added any recipes yet"
                actionLabel="Browse recipes"
                onAction={jest.fn()}
            />
        );

        expect(container).toMatchSnapshot();
    });
});
