import { Card, Box } from "@mui/material";

export function RecipeCardSkeleton() {
    return (
        <Card
            sx={{
                minWidth: "330px",
                minHeight: "400px",
                backgroundColor: "secondary.light",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    height: "50%",
                    backgroundColor: "grey",
                }}
            />
        </Card>
    );
}

export default RecipeCardSkeleton;
