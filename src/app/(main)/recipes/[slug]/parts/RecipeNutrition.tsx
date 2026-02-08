import { Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Recipe } from "@/types";

interface RecipeNutritionTableProps {
    nutrition?: Recipe["nutrition"];
}

// Jednostki mikroelementów
const MICRO_UNITS: Record<string, string> = {
    vitaminA: "µg",
    vitaminC: "mg",
    vitaminD: "µg",
    vitaminE: "mg",
    vitaminK: "µg",
    thiamin: "mg",
    riboflavin: "mg",
    niacin: "mg",
    vitaminB6: "mg",
    folate: "µg",
    vitaminB12: "µg",
    calcium: "mg",
    iron: "mg",
    magnesium: "mg",
    potassium: "mg",
    sodium: "mg",
    zinc: "mg",
    selenium: "µg",
};

// Tłumaczenia nazw składników
const NAMES_PL: Record<string, string> = {
    calories: "Kalorie",
    protein: "Białko",
    fat: "Tłuszcz",
    carbohydrate: "Węglowodany",
    vitaminA: "Witamina A",
    vitaminC: "Witamina C",
    vitaminD: "Witamina D",
    vitaminE: "Witamina E",
    vitaminK: "Witamina K",
    thiamin: "Tiamina (B1)",
    riboflavin: "Ryboflawina (B2)",
    niacin: "Niacyna (B3)",
    vitaminB6: "Witamina B6",
    folate: "Foliany",
    vitaminB12: "Witamina B12",
    calcium: "Wapń",
    iron: "Żelazo",
    magnesium: "Magnez",
    potassium: "Potas",
    sodium: "Sód",
    zinc: "Cynk",
    selenium: "Selen",
};

export function RecipeNutrition({ nutrition }: RecipeNutritionTableProps) {
    if (!nutrition) return null;

    const { per100g, micronutrients } = nutrition;

    const macroRows = Object.entries(per100g || {}).filter(([, value]) => value > 0);
    const microRows = Object.entries(micronutrients || {}).filter(([, value]) => value > 0);

    if (macroRows.length === 0 && microRows.length === 0) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>
                Wartości odżywcze
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
                Wszystkie wartości na 100 g produktu
            </Typography>

            {/* Makroelementy */}
            {macroRows.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                        Makroelementy
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            {macroRows.map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell>{NAMES_PL[key] || key}</TableCell>
                                    <TableCell align="right">
                                        {value}
                                        {key === "calories" ? " kcal" : " g"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            {/* Mikroelementy */}
            {microRows.length > 0 && (
                <Box>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                        Mikroskładniki
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            {microRows.map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell>{NAMES_PL[key] || key}</TableCell>
                                    <TableCell align="right">
                                        {value} {MICRO_UNITS[key]}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Box>
    );
}
