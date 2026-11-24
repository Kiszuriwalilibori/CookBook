import { useState, useEffect } from "react";

export const useNotesState = (initialNotes = "") => {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    const clearNotes = () => setNotes("");
    const hasNotes = notes.trim().length > 0;

    return {
        notes,
        setNotes,
        clearNotes,
        hasNotes,
    };
};
