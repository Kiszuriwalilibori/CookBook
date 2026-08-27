import { render, screen, fireEvent } from "@testing-library/react";
import CarouselItem from "./Carousel.item";

// Sprawdza, czy obraz początkowo korzysta z adresu podanego w slajdzie.
// Sprawdza, czy po błędzie ładowania obraz zostaje zastąpiony placeholderem /placeholder.png.

jest.mock("./Carousel.styles", () => ({
    SlideWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    StyledCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AspectBox: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SlideImage: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => <img data-testid="slide-image" src={src} alt={alt} onError={onError} />,
    Overlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    focusCardStyles: {},
}));

jest.mock("./SlideLink", () => {
    const MockSlideLink = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

    MockSlideLink.displayName = "MockSlideLink";

    return MockSlideLink;
});

describe("CarouselItem", () => {
    it("uses placeholder image when the slide image fails to load", () => {
        render(
            <CarouselItem
                slide={{
                    _id: "1",
                    title: "Recipe",
                    slug: "recipe",
                    imageUrl: "broken-image.jpg",
                }}
                priority={false}
            />
        );

        const image = screen.getByTestId("slide-image");

        expect(image).toHaveAttribute("src", "broken-image.jpg");

        fireEvent.error(image);

        expect(image).toHaveAttribute("src", "/placeholder.png");
    });
});
