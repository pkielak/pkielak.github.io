import { useEffect, useState } from "react";
const useWindowSize = () => {
  if (typeof window !== "undefined") {
    const [windowSize, setWindowSize] = useState<[number, number]>([
      window.innerWidth,
      window.innerHeight,
    ]);

    useEffect(() => {
      const handleResize = () => {
        setWindowSize([window.innerWidth, window.innerHeight]);

        window.addEventListener("resize", handleResize);
      };
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return windowSize;
  }
};

export default useWindowSize;
