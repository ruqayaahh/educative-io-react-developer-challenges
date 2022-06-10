import { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";

import {
  List,
  Pagination,
  SearchForm,
  SearchedButtons,
  SortButtons,
} from "./components";
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
  const [urls, setUrls] = useState([`${API_ENDPOINT}${searchTerm}`]);
  const [sortValue, setSortValue] = useState("");
  const [reverse, setReverse] = useState(false);
  const [searched, setSearched] = useState("");
  // const [page, setPage] = useState(1);

  const buttons = ["Unsorted", "Title", "Author", "Points", "Num of comments"];
  const sorts = ["none", "title", "author", "points", "num_comments"];

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(
        searched ? `${API_ENDPOINT}${searched}` : urls[urls.length - 1]
      );
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls, searched]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setSearched("");
    setUrls((prevUrls) => {
      if (prevUrls.length === 5) {
        return Array.from(
          new Set(
            [...prevUrls].slice(1).concat([`${API_ENDPOINT}${searchTerm}`])
          )
        );
      }
      return Array.from(
        new Set([...prevUrls].slice(0).concat([`${API_ENDPOINT}${searchTerm}`]))
      );
    });

    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <h3>Sort</h3>
      <div>
        <SortButtons
          buttons={buttons}
          setSortValue={setSortValue}
          sorts={sorts}
        />
      </div><br />
      <div>
        <button type="button" onClick={() => setReverse(!reverse)}>
          Reverse
        </button>
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
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : stories.data.length === 0 ? (
        <>No results for your search</>
      ) : (
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
          sortValue={sortValue}
          reverse={reverse}
        />
      )}
      <div>
        {/* <span>Previous Page</span> */}
        <span>Next Page</span>
      </div>
      {/* <Pagination data={stories.data} /> */}
    </div>
  );
};
