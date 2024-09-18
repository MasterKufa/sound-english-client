import { Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export const OverflowTip = ({ children }: { children: string }) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const textElementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIsOverflow(
      textElementRef.current!.scrollWidth > textElementRef.current!.clientWidth
    );
  }, []);
  return (
    <Tooltip title={children} disableHoverListener={!isOverflowed}>
      <div
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};
