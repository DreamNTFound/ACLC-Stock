import { useEffect, useState } from "react";

export const useNearBottom = (threshold = 100) => {
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      setIsNearBottom(pageHeight - scrollPosition <= threshold);
    };

    // Initial check
    checkPosition();

    // Check when user scrolls
    window.addEventListener("scroll", checkPosition);

    // Check when page content changes size
    const resizeObserver = new ResizeObserver(() => {
      checkPosition();
    });

    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", checkPosition);
      resizeObserver.disconnect();
    };
  }, [threshold]);

  return isNearBottom;
};
