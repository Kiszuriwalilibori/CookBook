import { act, renderHook } from "@testing-library/react";

import useDelayedCondition from "./useDelayedCondition";

describe("useDelayedCondition", () => {
    const delay = 1000;
    const duration = 1000;

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("does not become true before delay", () => {
        const { result } = renderHook(({ condition }) => useDelayedCondition(condition, delay, duration), {
            initialProps: { condition: true },
        });

        expect(result.current).toBe(false);

        act(() => {
            jest.advanceTimersByTime(delay - 1);
        });

        expect(result.current).toBe(false);
    });

    it("becomes true after delay", () => {
        const { result } = renderHook(({ condition }) => useDelayedCondition(condition, delay, duration), {
            initialProps: { condition: true },
        });

        act(() => {
            jest.advanceTimersByTime(delay);
        });

        expect(result.current).toBe(true);
    });

    it("never becomes visible if condition ends before delay", () => {
        const { result, rerender } = renderHook(({ condition }) => useDelayedCondition(condition, delay, duration), {
            initialProps: { condition: true },
        });

        act(() => {
            jest.advanceTimersByTime(delay / 2);
        });

        rerender({ condition: false });

        act(() => {
            jest.advanceTimersByTime(delay + duration);
        });

        expect(result.current).toBe(false);
    });

    it("stays visible for minimum duration", () => {
        const { result, rerender } = renderHook(({ condition }) => useDelayedCondition(condition, delay, duration), {
            initialProps: { condition: true },
        });

        act(() => {
            jest.advanceTimersByTime(delay);
        });

        expect(result.current).toBe(true);

        rerender({ condition: false });

        act(() => {
            jest.advanceTimersByTime(duration - 1);
        });

        expect(result.current).toBe(true);

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(result.current).toBe(false);
    });

    it("remains visible if condition lasts longer than delay + duration", () => {
        const { result, rerender } = renderHook(({ condition }) => useDelayedCondition(condition, delay, duration), {
            initialProps: { condition: true },
        });

        act(() => {
            jest.advanceTimersByTime(delay + duration + 1000);
        });

        expect(result.current).toBe(true);

        rerender({ condition: false });

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(result.current).toBe(false);
    });
});
