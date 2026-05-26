// "use client";

// import { useCallback, useState } from "react";

// export function useBoolean(initialValue: boolean = false) {
//     const [value, setValue] = useState(initialValue);

//     function setTrue() {
//         setValue(true);
//     }

//     const setFalse = useCallback(() => {
//         setValue(false);
//     }, []);

//     const toggle = useCallback(() => {
//         setValue(!value);
//     }, [value]);

//     return [value, setTrue, setFalse, toggle] as const;
// }

// export default useBoolean;

"use client";

import { useCallback, useState } from "react";

export function useBoolean(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const setTrue = useCallback(() => {
        setValue(true);
    }, []);

    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);

    return [value, setTrue, setFalse, toggle] as const;
}

export default useBoolean;
