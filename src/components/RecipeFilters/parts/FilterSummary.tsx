import React, { JSX, useMemo } from "react";
import { Typography, Tooltip, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { filterSummaryTooltipArrowSx, filterSummaryTooltipSx, summaryItemTextSx, summaryTextSx } from "../styles";

import { useAdminStore } from "@/stores";
import { FILTER_FIELDS_CONFIG, FilterState } from "@/models/filters";

const MAX_LENGTH = 15;

const icons = {
    title: "📖",
    cuisine: "🍽️",
    tags: "🏷️",
    dietary: "🌱",
    products: "🛍️",
    status: "⭐",
    kizia: "👩",
    "source.http": "🌐",
    "source.book": "📚",
    "source.title": "📝",
    "source.author": "✍️",
    "source.where": "📍",
};
interface FilterSummaryProps {
    filters: FilterState;
}

export default function FilterSummary({ filters }: FilterSummaryProps) {
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);
    const theme = useTheme();

    const summary = useMemo(() => {
        const elements: JSX.Element[] = [];
        let count = 0;

        const shorten = (text: string) => (text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) + "..." : text);

        for (const field of FILTER_FIELDS_CONFIG) {
            if (field.requiredAdmin && !isAdminLogged) continue;

            let fullText: string | undefined;
            const key = field.key;

            if (field.multiple) {
                const value = filters[key];
                if (Array.isArray(value) && value.length > 0) {
                    fullText = value.join(", ");
                    count += value.length;
                }
            } else if (field.component === "switch") {
                const value = filters[key];
                if (typeof value === "boolean" && value) {
                    fullText = key;
                    count += 1;
                }
            } else {
                const value = filters[key];
                if (typeof value === "string" && value) {
                    fullText = value;
                    count += 1;
                }
            }

            if (fullText) {
                const shortened = shorten(fullText);
                const isShortened = fullText.length > MAX_LENGTH;
                const textElement = isShortened ? (
                    <Tooltip
                        title={fullText}
                        sx={filterSummaryTooltipSx}
                        arrow
                        slotProps={{
                            tooltip: {
                                sx: filterSummaryTooltipSx,
                            },
                            arrow: {
                                sx: filterSummaryTooltipArrowSx,
                            },
                        }}
                    >
                        <Box component="span" sx={summaryItemTextSx}>
                            {shortened}
                        </Box>
                    </Tooltip>
                ) : (
                    <Box component="span">{shortened}</Box>
                );
                elements.push(
                    <React.Fragment key={key}>
                        {icons[key]} {textElement}
                    </React.Fragment>
                );
            }
        }

        if (count === 0) return "Brak aktywnych filtrów.";

        const filtrWord = count === 1 ? "filtr" : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20) ? "filtry" : "filtrów";
        const aktywnyWord = count === 1 ? "aktywny" : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20) ? "aktywne" : "aktywnych";

        return (
            <>
                {`${count} ${filtrWord} ${aktywnyWord}: `}
                {elements.map((el, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && ", "}
                        {el}
                    </React.Fragment>
                ))}
            </>
        );
    }, [filters, isAdminLogged]);

    return (
        <Typography variant="body2" align="center" sx={summaryTextSx(theme)}>
            {summary}
        </Typography>
    );
}

// Add TypeGuards for FilterState
// Implement FilterValidatuion logic
//Make count logic more robust

// Add Type safety for fields
// add cursor pointer to shortened spans
// make tooltips appear only on ellipsis
// implement popover for complex  filter details

// better look for the tooltip, make tooltip multiline
