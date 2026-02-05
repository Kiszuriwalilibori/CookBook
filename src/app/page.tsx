// import { Box } from "@mui/material";

// import HomeContent from "../components/HomeContent";

// export default function Home() {
//     return (
//         <Box>
//             <HomeContent />
//         </Box>
//     );
// }

import React from "react";
import { Box } from "@mui/material";
import HomeContent from "@/components/HomeContent";
import getRandomRecipes from "@/utils/getRandomRecipes";

// ISR: adjust revalidate to taste (seconds)
export const revalidate = 60;

export default async function Page() {
    // server-side fetch — wykonywane przed renderem strony
    const slides = await getRandomRecipes(5);

    return (
        <Box>
            {/* Pass server-fetched slides to the client HomeContent */}
            <HomeContent initialSlides={slides} />
        </Box>
    );
}
