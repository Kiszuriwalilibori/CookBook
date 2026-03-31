declare module "react-rating-stars-component" {
    import { FC } from "react";

    interface ReactStarsProps {
        count?: number;
        onChange?: (newRating: number) => void;
        size?: number;
        activeColor?: string;
        color?: string;
        value?: number;
        edit?: boolean;
        isHalf?: boolean;
        emptyIcon?: React.ReactNode;
        halfIcon?: React.ReactNode;
        filledIcon?: React.ReactNode;
        classNames?: string;
        a11y?: object;
    }

    const ReactStars: FC<ReactStarsProps>;
    export default ReactStars;
}
