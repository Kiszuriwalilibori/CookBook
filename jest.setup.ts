// jest.setup.ts
import "@testing-library/jest-dom"; // Typy powinny działać automatycznie

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
