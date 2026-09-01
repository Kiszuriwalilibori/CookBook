// jest.setup.ts
import "@testing-library/jest-dom"; // Typy powinny działać automatycznie
// Object.defineProperty(window, "matchMedia", {
//     writable: true,
//     value: jest.fn().mockImplementation(query => ({
//         matches: false,
//         media: query,
//         onchange: null,
//         addListener: jest.fn(),
//         removeListener: jest.fn(),
//         addEventListener: jest.fn(),
//         removeEventListener: jest.fn(),
//         dispatchEvent: jest.fn(),
//     })),
// });

if (typeof window !== "undefined") {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R; // Przykładowy matcher – dodaj inne, jeśli potrzeba
            // np. toHaveTextContent(): R;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */
