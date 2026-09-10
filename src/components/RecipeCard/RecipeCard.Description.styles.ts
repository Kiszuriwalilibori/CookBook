import { cardTextColor } from "./styles";

export const descriptionStyles = {
    fontFamily: "Playfair Display, serif",
    fontWeight: 400,
    fontSize: "16px",
    fontStyle: "italic",
    color: cardTextColor,
    display: "-webkit-box", // line-clamp
    WebkitLineClamp: 3, // ograniczenie do 3 linii
    WebkitBoxOrient: "vertical", // potrzebne do -webkit-line-clamp
    overflow: "hidden", // ukrywa resztę
    textOverflow: "ellipsis", // dodaje "…"
};
