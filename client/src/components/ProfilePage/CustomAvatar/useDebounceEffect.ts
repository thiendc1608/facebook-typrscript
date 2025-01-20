import { useEffect } from "react";

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fn();
    }, waitTime);

    // Cleanup function to clear the timeout when the component unmounts or deps change
    return () => {
      clearTimeout(timer);
    };
  }, [...deps, waitTime]); // Ensure that the effect re-runs if either `deps` or `waitTime` changes
}
