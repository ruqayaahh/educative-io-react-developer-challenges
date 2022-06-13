import React from "react";

export function SortButtons({ setSortValue }) {
  const buttons = ["Unsorted", "Title", "Author", "Points", "Num of comments"];
  const sorts = ["none", "title", "author", "points", "num_comments"];
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
