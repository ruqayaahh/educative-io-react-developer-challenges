import { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";

import { List, SearchForm, SearchedButtons, SortButtons } from "./components";
import { storiesReducer } from "./reducers";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

export const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");
  const [page, setPage] = useState(0);
  const [urls, setUrls] = useState([
    `${API_ENDPOINT}${searchTerm}&page=${page}`,
  ]);
  const [sortValue, setSortValue] = useState("");
  const [reverse, setReverse] = useState(false);
  const [searched, setSearched] = useState("");

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    const checkScenario = () => {
      if (searched && page > 0) {
        return `${API_ENDPOINT}${searched}&page=${page}`;
      } else if (searched && page === 0) {
        return `${API_ENDPOINT}${searched}&page=0`;
      }
      return urls[urls.length - 1];
    };
    try {
      const result = await axios.get(checkScenario());
      const payload = [...stories.data, ...result.data.hits];

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [page, searched, urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const emptyDataListAction = () => {
    dispatchStories({
      type: "EMPTY_STORIES_FOR_NEW_SEARCH",
      payload: [],
    });
    setPage(0);
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    emptyDataListAction();
    setSearched(searchTerm);
    setUrls((prevUrls) => {
      if (prevUrls.length === 5) {
        return Array.from(
          new Set(
            [...prevUrls]
              .slice(1)
              .concat([`${API_ENDPOINT}${searchTerm}&page=0`])
          )
        );
      }
      return Array.from(
        new Set(
          [...prevUrls].slice(0).concat([`${API_ENDPOINT}${searchTerm}&page=0`])
        )
      );
    });

    event.preventDefault();
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  return (
    <div style={{ padding: "5%" }}>
      <h1>My Hacker Stories</h1>
      {/* <h3>Sort</h3> */}
      <div>
        <span>
          <strong>Sort Headings: </strong>
        </span>
        <SortButtons setSortValue={setSortValue} />
      </div>
      <br />
      <div>
        <span>
          <strong>Reverse: </strong>
        </span>
        <div>
          <button type="button" onClick={() => setReverse(!reverse)}>
            Reverse
          </button>
        </div>
      </div>
      <br />
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <br />
      <SearchedButtons
        urls={urls}
        setSearchTerm={setSearchTerm}
        setSearched={setSearched}
        emptyDataList={emptyDataListAction}
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : stories.data.length === 0 ? (
        <>No results for your search</>
      ) : (
        <>
          <List
            list={stories.data}
            onRemoveItem={handleRemoveStory}
            sortValue={sortValue}
            reverse={reverse}
          />
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* <span>Previous Page</span> */}
            <span>Current Page: {page}</span>
            <span
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "blue",
              }}
              onClick={() => {
                setPage((prevPage) => prevPage + 1);
              }}
            >
              Next Page: {page + 1}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
