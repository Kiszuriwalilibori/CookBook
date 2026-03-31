import { Box } from "@mui/material";
import Slider from "@/components/Slider";
import PageTitle from "@/components/PageTitle";

export function Home() {
    return (
        <>
            <PageTitle title={"Witamy"} />
            <Box>
                <Slider />
            </Box>
        </>
    );
}
export default Home;
