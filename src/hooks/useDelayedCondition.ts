import { useEffect, useRef, useState } from "react";

const DELAY = 1000;
const DURATION = 1000;

export const useDelayedCondition = (condition: boolean, delay = DELAY, duration = DURATION) => {
  const [delayedCondition, setDelayedCondition] = useState(false);
  const delayTimeout = useRef(undefined as undefined | NodeJS.Timeout);
  const startTime = useRef(undefined as undefined | number);
  const durationTimeout = useRef(undefined as undefined | NodeJS.Timeout);

  useEffect(() => {
    if (condition) {
      startTime.current = Date.now();
      delayTimeout.current = setTimeout(() => {
        setDelayedCondition(true);
      }, delay);
    }
    if (!condition) {
      if (startTime.current) {
        if (Date.now() >= startTime.current + delay) {
          durationTimeout.current = setTimeout(() => {
            delayTimeout.current && clearTimeout(delayTimeout.current);
            setDelayedCondition(false);
          }, duration - (Date.now() - (startTime.current + DELAY)));
        }
        if (Date.now() < startTime.current + delay) {
          delayTimeout.current && clearTimeout(delayTimeout.current);
          setDelayedCondition(false);
        }
      }
    }
    return () => {
      delayTimeout.current && clearTimeout(delayTimeout.current);
      durationTimeout.current && clearTimeout(durationTimeout.current);
    };
  }, [condition]);

  return delayedCondition;
};

export default useDelayedCondition;
