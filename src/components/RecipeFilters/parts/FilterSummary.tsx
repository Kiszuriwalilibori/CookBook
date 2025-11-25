import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { summaryTextSx } from "../styles";
import { FilterState } from "@/types";

interface FilterSummaryProps {
    filters: FilterState;
}

export default function FilterSummary({ filters }: FilterSummaryProps) {
    const theme = useTheme();

    const summary = useMemo(() => {
        const parts: string[] = [];
        let count = 0;

        if (filters.title) {
            parts.push(`📖 ${filters.title}`);
            count += 1;
        }
        if (filters.cuisine) {
            parts.push(`🍽️ ${filters.cuisine}`);
            count += 1;
        }
        if (filters.tags.length) {
            parts.push(`🏷️ ${filters.tags.join(", ")}`);
            count += filters.tags.length;
        }
        if (filters.dietary.length) {
            parts.push(`🌱 ${filters.dietary.join(", ")}`);
            count += filters.dietary.length;
        }
        if (filters.products.length) {
            parts.push(`🛍️ ${filters.products.join(", ")}`);
            count += filters.products.length;
        }
        if (filters.Kizia) {
            parts.push(`👩 Kizia`);
            count += 1;
        }

        if (count === 0) return "Brak aktywnych filtrów.";

        const filtrWord = count === 1 ? "filtr" : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20) ? "filtry" : "filtrów";
        const aktywnyWord = count === 1 ? "aktywny" : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20) ? "aktywne" : "aktywnych";

        return `${count} ${filtrWord} ${aktywnyWord}: ${parts.join(", ")}`;
    }, [filters]);

    return (
        <Typography variant="body2" align="center" sx={summaryTextSx(theme)}>
            {summary}
        </Typography>
    );
}
