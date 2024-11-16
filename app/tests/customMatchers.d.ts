import 'vitest';

declare module 'vitest' {
    // Extend the expect type to include the custom matcher
    interface Assertion<T> {
        toBeBetween(floor: number, ceiling: number): T;
    }
}
