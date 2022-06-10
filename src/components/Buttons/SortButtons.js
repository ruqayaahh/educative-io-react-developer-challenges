import React from "react";

export function SortButtons({ buttons, setSortValue, sorts }) {
  return (
    <div>
      {buttons.map((button, i) => (
        <button key={i} onClick={() => setSortValue(sorts[i])}>
          {button}
        </button>
      ))}
    </div>
  );
}
