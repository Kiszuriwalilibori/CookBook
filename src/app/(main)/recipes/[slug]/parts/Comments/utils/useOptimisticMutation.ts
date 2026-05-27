"use client";
import { useState, useRef, useCallback } from "react";

type OptimisticMutationOptions<TState, TResult> = {
    optimisticUpdate: (prev: TState) => TState;

    mutation: (context: { optimisticState: TState; previousState: TState }) => Promise<TResult>;

    onSuccess?: (
        result: TResult,
        context: {
            optimisticState: TState;
            previousState: TState;
        }
    ) => TState;

    onError?: (
        error: unknown,
        context: {
            optimisticState: TState;
            previousState: TState;
        }
    ) => TState;
};

type RunOptimisticMutation<TState> = <TResult>(options: OptimisticMutationOptions<TState, TResult>) => Promise<TResult>;

type UseOptimisticMutationReturn<TState> = {
    state: TState;

    setState: React.Dispatch<React.SetStateAction<TState>>;

    isPending: boolean;

    run: RunOptimisticMutation<TState>;
};

export function useOptimisticMutation<TState>(initialState: TState): UseOptimisticMutationReturn<TState> {
    const [state, setState] = useState<TState>(initialState);

    const [isPending, setIsPending] = useState(false);

    const stateRef = useRef(state);

    stateRef.current = state;

    const run: RunOptimisticMutation<TState> = useCallback(async options => {
        const previousState = stateRef.current;

        const optimisticState = options.optimisticUpdate(previousState);

        setState(optimisticState);

        setIsPending(true);

        try {
            const result = await options.mutation({
                optimisticState,
                previousState,
            });

            if (options.onSuccess) {
                setState(
                    options.onSuccess(result, {
                        optimisticState,
                        previousState,
                    })
                );
            }

            return result;
        } catch (error) {
            setState(
                options.onError
                    ? options.onError(error, {
                          optimisticState,
                          previousState,
                      })
                    : previousState
            );

            throw error;
        } finally {
            setIsPending(false);
        }
    }, []);

    return {
        state,
        setState,
        isPending,
        run,
    };
}
