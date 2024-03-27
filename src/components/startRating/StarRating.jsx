import React, { useState } from "react";
import { RenderStar } from "./RenderStar";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starContainerStyle = {
  display: "flex",
  alignItems: "center",
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  onSetStarCount,
}) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <RenderStar
            key={i}
            onRate={() => {
              setRating(i + 1);
              onSetStarCount(i + 1);
            }}
            isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating || rating || ""}</p>
    </div>
  );
}
