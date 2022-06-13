import React from "react";

export function SearchedButtons({
  urls,
  setSearchTerm,
  setSearched,
  emptyDataList,
}) {
  const getSearchTerm = (element) => element.split("=")[1].split("&")[0];
  return (
    <div>
      <p style={{ margin: "0" }}>
        <strong>Saved search terms: </strong>
      </p>
      {urls.map((each, i) => (
        <button
          key={i}
          onClick={(e) => {
            emptyDataList();
            setSearchTerm(getSearchTerm(each));
            setSearched(e.target.textContent);
          }}
        >
          {getSearchTerm(each).toLowerCase()}
        </button>
      ))}
    </div>
  );
}
