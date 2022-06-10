import React from "react";

export function SearchedButtons({ urls, setSearchTerm, setSearched }) {
  return (
    <div>
      <strong>Saved search terms: </strong>
      {urls.map((each, i) => (
        <button
          key={i}
          onClick={(e) => {
            setSearchTerm(each.split("=")[1]);
            setSearched(e.target.textContent);
          }}
        >
          {each.split("=")[1].toLowerCase()}
        </button>
      ))}
    </div>
  );
}
