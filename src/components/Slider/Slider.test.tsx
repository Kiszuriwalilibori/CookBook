import { render, waitFor } from "@testing-library/react";

import Slider from "./Slider";

const mockError = jest.fn();
const mockCarousel = jest.fn();

jest.mock("@/hooks/useMessage", () => ({
    __esModule: true,
    default: () => ({
        error: mockError,
    }),
}));

jest.mock("../Carousel/Carousel", () => {
    function MockCarousel(props: { initialSlides?: unknown; count?: number; intervalMs?: number }) {
        mockCarousel(props);

        return <div data-testid="carousel" />;
    }

    MockCarousel.displayName = "MockCarousel";

    return MockCarousel;
});

describe("Slider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders Carousel", () => {
        render(<Slider initialSlides={[]} />);

        expect(document.querySelector("[data-testid='carousel']")).toBeInTheDocument();
    });

    it("passes slides and configuration to Carousel", () => {
        const slides = [
            {
                _id: "1",
                title: "Test recipe",
                slug: "test-recipe",
                imageUrl: "image.jpg",
            },
        ];

        render(<Slider initialSlides={slides} />);

        expect(mockCarousel).toHaveBeenCalledWith({
            initialSlides: slides,
            count: 5,
            intervalMs: 5000,
        });
    });
    it("shows error message when error changes from null to a value", async () => {
        const { rerender } = render(<Slider initialSlides={[]} error={null} />);

        expect(mockError).not.toHaveBeenCalled();

        rerender(<Slider initialSlides={[]} error="Test error" />);

        await waitFor(() => {
            expect(mockError).toHaveBeenCalledTimes(1);
            expect(mockError).toHaveBeenCalledWith("Test error");
        });
    });
    it("shows each new error when error prop changes", async () => {
        const { rerender } = render(<Slider initialSlides={[]} error="First error" />);

        await waitFor(() => {
            expect(mockError).toHaveBeenCalledWith("First error");
        });

        rerender(<Slider initialSlides={[]} error="Second error" />);

        await waitFor(() => {
            expect(mockError).toHaveBeenCalledTimes(2);
            expect(mockError).toHaveBeenNthCalledWith(1, "First error");
            expect(mockError).toHaveBeenNthCalledWith(2, "Second error");
        });
    });

    it("shows error message when error prop is provided", async () => {
        render(<Slider initialSlides={[]} error="Test error" />);

        await waitFor(() => {
            expect(mockError).toHaveBeenCalledWith("Test error");
        });
    });

    it("does not show error message when error prop is missing", () => {
        render(<Slider initialSlides={[]} />);

        expect(mockError).not.toHaveBeenCalled();
    });

    it("uses null as default initialSlides", () => {
        render(<Slider />);

        expect(mockCarousel).toHaveBeenCalledWith({
            initialSlides: null,
            count: 5,
            intervalMs: 5000,
        });
    });
});
