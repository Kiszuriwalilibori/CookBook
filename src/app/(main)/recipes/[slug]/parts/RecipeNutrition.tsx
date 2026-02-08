// import { Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
// import { Recipe } from "@/types";

// interface RecipeNutritionTableProps {
//     nutrition?: Recipe["nutrition"];
// }

// // Jednostki mikroelementów
// const MICRO_UNITS: Record<string, string> = {
//     vitaminA: "µg",
//     vitaminC: "mg",
//     vitaminD: "µg",
//     vitaminE: "mg",
//     vitaminK: "µg",
//     thiamin: "mg",
//     riboflavin: "mg",
//     niacin: "mg",
//     vitaminB6: "mg",
//     folate: "µg",
//     vitaminB12: "µg",
//     calcium: "mg",
//     iron: "mg",
//     magnesium: "mg",
//     potassium: "mg",
//     sodium: "mg",
//     zinc: "mg",
//     selenium: "µg",
// };

// // Tłumaczenia nazw składników
// const NAMES_PL: Record<string, string> = {
//     calories: "Kalorie",
//     protein: "Białko",
//     fat: "Tłuszcz",
//     carbohydrate: "Węglowodany",
//     vitaminA: "Witamina A",
//     vitaminC: "Witamina C",
//     vitaminD: "Witamina D",
//     vitaminE: "Witamina E",
//     vitaminK: "Witamina K",
//     thiamin: "Tiamina (B1)",
//     riboflavin: "Ryboflawina (B2)",
//     niacin: "Niacyna (B3)",
//     vitaminB6: "Witamina B6",
//     folate: "Foliany",
//     vitaminB12: "Witamina B12",
//     calcium: "Wapń",
//     iron: "Żelazo",
//     magnesium: "Magnez",
//     potassium: "Potas",
//     sodium: "Sód",
//     zinc: "Cynk",
//     selenium: "Selen",
// };

// export function RecipeNutrition({ nutrition }: RecipeNutritionTableProps) {
//     if (!nutrition) return null;

//     const { per100g, micronutrients } = nutrition;

//     const macroRows = Object.entries(per100g || {}).filter(([, value]) => value > 0);
//     const microRows = Object.entries(micronutrients || {}).filter(([, value]) => value > 0);

//     if (macroRows.length === 0 && microRows.length === 0) return null;

//     return (
//         <Box sx={{ mt: 4 }}>
//             <Typography variant="h2" sx={{ mb: 1 }}>
//                 Wartości odżywcze
//             </Typography>
//             <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
//                 Wszystkie wartości na 100 g produktu
//             </Typography>

//             {/* Makroelementy */}
//             {macroRows.length > 0 && (
//                 <Box sx={{ mb: 3 }}>
//                     <Typography variant="h3" sx={{ mb: 1 }}>
//                         Makroelementy
//                     </Typography>
//                     <Table size="small">
//                         <TableBody>
//                             {macroRows.map(([key, value]) => (
//                                 <TableRow key={key}>
//                                     <TableCell>{NAMES_PL[key] || key}</TableCell>
//                                     <TableCell align="right">
//                                         {value}
//                                         {key === "calories" ? " kcal" : " g"}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </Box>
//             )}

//             {/* Mikroelementy */}
//             {microRows.length > 0 && (
//                 <Box>
//                     <Typography variant="h3" sx={{ mb: 1 }}>
//                         Mikroskładniki
//                     </Typography>
//                     <Table size="small">
//                         <TableBody>
//                             {microRows.map(([key, value]) => (
//                                 <TableRow key={key}>
//                                     <TableCell>{NAMES_PL[key] || key}</TableCell>
//                                     <TableCell align="right">
//                                         {value} {MICRO_UNITS[key]}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </Box>
//             )}
//         </Box>
//     );
// }

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import { Recipe } from "@/types";

// === RDI / %DV dla dorosłego mężczyzny i kobiety ===
const DV_MACRO_MALE = { calories: 2500, protein: 56, fat: 70, carbohydrate: 310 } as const;
const DV_MACRO_FEMALE = { calories: 2000, protein: 46, fat: 70, carbohydrate: 260 } as const;

const DV_MICRO_MALE = {
    vitaminA: 900,
    vitaminC: 90,
    vitaminD: 20,
    vitaminE: 15,
    vitaminK: 120,
    thiamin: 1.2,
    riboflavin: 1.3,
    niacin: 16,
    vitaminB6: 1.3,
    folate: 400,
    vitaminB12: 2.4,
    calcium: 1000,
    iron: 8,
    magnesium: 420,
    potassium: 3500,
    sodium: 2000,
    zinc: 11,
    selenium: 55,
} as const;

const DV_MICRO_FEMALE = {
    vitaminA: 700,
    vitaminC: 75,
    vitaminD: 20,
    vitaminE: 15,
    vitaminK: 90,
    thiamin: 1.1,
    riboflavin: 1.1,
    niacin: 14,
    vitaminB6: 1.3,
    folate: 400,
    vitaminB12: 2.4,
    calcium: 1000,
    iron: 18,
    magnesium: 320,
    potassium: 2600,
    sodium: 2000,
    zinc: 8,
    selenium: 55,
} as const;

// === Nazwy PL i jednostki mikro ===
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

interface RecipeNutritionTableProps {
    nutrition?: Recipe["nutrition"];
}

export function RecipeNutrition({ nutrition }: RecipeNutritionTableProps) {
    if (!nutrition) return null;

    const per100g = nutrition?.per100g ?? {};
    const micronutrients = nutrition?.micronutrients ?? {};

    const macroRows = Object.entries(per100g)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
            name: NAMES_PL[key] ?? key,
            value: value as number,
            unit: key === "calories" ? "kcal" : "g",
            percentMale: DV_MACRO_MALE[key as keyof typeof DV_MACRO_MALE] ? (((value as number) / DV_MACRO_MALE[key as keyof typeof DV_MACRO_MALE]) * 100).toFixed(0) : null,
            percentFemale: DV_MACRO_FEMALE[key as keyof typeof DV_MACRO_FEMALE] ? (((value as number) / DV_MACRO_FEMALE[key as keyof typeof DV_MACRO_FEMALE]) * 100).toFixed(0) : null,
        }));

    const microRows = Object.entries(micronutrients)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
            name: NAMES_PL[key] ?? key,
            value: value as number,
            unit: MICRO_UNITS[key] ?? "",
            percentMale: DV_MICRO_MALE[key as keyof typeof DV_MICRO_MALE] ? (((value as number) / DV_MICRO_MALE[key as keyof typeof DV_MICRO_MALE]) * 100).toFixed(0) : null,
            percentFemale: DV_MICRO_FEMALE[key as keyof typeof DV_MICRO_FEMALE] ? (((value as number) / DV_MICRO_FEMALE[key as keyof typeof DV_MICRO_FEMALE]) * 100).toFixed(0) : null,
        }));

    if (macroRows.length === 0 && microRows.length === 0) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
                Wartości odżywcze (na 100 g)
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell align="right">Wartość</TableCell>
                            <TableCell align="right">%DV (mężczyzna)</TableCell>
                            <TableCell align="right">%DV (kobieta)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {macroRows.length > 0 && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
                                        Makroskładniki
                                    </TableCell>
                                </TableRow>
                                {macroRows.map(row => (
                                    <TableRow key={row.name}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell align="right">
                                            {row.value} {row.unit}
                                        </TableCell>
                                        <TableCell align="right">{row.percentMale}%</TableCell>
                                        <TableCell align="right">{row.percentFemale}%</TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}

                        {microRows.length > 0 && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
                                        Mikroskładniki
                                    </TableCell>
                                </TableRow>
                                {microRows.map(row => (
                                    <TableRow key={row.name}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell align="right">
                                            {row.value} {row.unit}
                                        </TableCell>
                                        <TableCell align="right">{row.percentMale}%</TableCell>
                                        <TableCell align="right">{row.percentFemale}%</TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
