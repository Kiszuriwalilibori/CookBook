import { Box } from "@mui/material";
import HomeContent from "@/components/HomeContent";
import PageTitle from "@/components/PageTitle";

export function Home() {
    return (
        <>
            <PageTitle title={"Witamy"} />
            <Box>
                <HomeContent />
            </Box>
        </>
    );
}
export default Home;
