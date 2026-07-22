//Comments.test.tsx;

import { render, screen } from "@testing-library/react";
import { server } from "@/mocks/server";

import Comments from "./Comments";

jest.mock("@/hooks", () => ({
    useFingerprint: () => "test-fingerprint",

    useMessage: () => ({
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
    }),

    useApiResponseErrorHandler: () => jest.fn(),
}));

jest.mock("@/stores/useAdminStore", () => ({
    useIsAdminLogged: () => false,
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("renders comments fetched from API", async () => {
    render(<Comments recipeId="recipe-1" />);

    expect(await screen.findByText("Świetny przepis!")).toBeInTheDocument();
});
