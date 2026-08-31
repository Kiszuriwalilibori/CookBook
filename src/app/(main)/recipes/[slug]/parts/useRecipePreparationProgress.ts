import { useEffect, useRef, useState } from "react";

export function useRecipePreparationProgress(totalSteps: number) {
    const [activeStep, setActiveStep] = useState(0);

    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const steps = stepRefs.current.filter((step): step is HTMLDivElement => step !== null);

        if (steps.length === 0) {
            return;
        }

        const visibleSteps = new Set<number>();

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const index = Number(entry.target.getAttribute("data-step-index"));

                    if (entry.isIntersecting) {
                        visibleSteps.add(index);
                    } else {
                        visibleSteps.delete(index);
                    }
                });

                if (visibleSteps.size > 0) {
                    setActiveStep(Math.max(...visibleSteps));
                }
            },
            {
                threshold: 0,
            }
        );

        steps.forEach(step => observer.observe(step));

        return () => observer.disconnect();
    }, [totalSteps]);

    return {
        activeStep,
        stepRefs,
    };
}
