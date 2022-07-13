import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import BookItem from "./components/BookItem";

import "./css/index.css";

const BookList = () => {
  const [queryString, setQueryString] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookItems, setBookItems] = useState({ books: [], count: 0 });
  const [pageCount, setPageCount] = useState(bookItems.count);
  const [resultsText, setResultsText] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [page, setPage] = useState(0);
  const maxResults = 25;

  const handleTextChange = (e) => {
    setQueryString(e.target.value);

    if (!e.target.length) {
      setBookItems({ books: [], count: 0 });
      setResultsText(null);
      setStartIndex(0);
      setPageCount(0);
    }
  };

  const handleSearchSubmit = (e = null) => {
    if (e) handlePageReset();

    if (!!queryString.length) {
      setLoading(true);
      axios
        .get(
          `${process.env.REACT_APP_GOOGLEBOOKS_API_BASEURL}?q=${queryString}&key=${process.env.REACT_APP_GOOGLEBOOKS_API_KEY}&startIndex=${startIndex}&maxResults=${maxResults}`
        )
        .then((res) => {
          const { items: books, totalItems: count } = res.data;
          setPageCount(Math.ceil(count / maxResults));
          setBookItems({ books, count });
          setResultsText(`${count} results found for "${queryString}"`);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  };

  const handlePageChange = (e) => {
    setPage(e.selected);
    setStartIndex(e.selected * maxResults);
  };

  const handlePageReset = () => {
    setPage(0);
    setStartIndex(0);
  };

  useEffect(() => {
    handleSearchSubmit();
  }, [page]);

  return (
    <div className="main-container">
      {/* Form */}
      <div className="form-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit(e);
          }}
        >
          <input
            id="search-box"
            placeholder="Enter a book title..."
            value={queryString}
            onChange={handleTextChange}
          />
          <input id="search-btn" type="submit" value="Search" />
        </form>
      </div>

      {loading && <h2>Loading...</h2>}
      {!!queryString.length && <h2>{resultsText ?? null}</h2>}

      {/* Booklist */}
      <div className="booklist-container">
        {bookItems.books?.map((book) => (
          <BookItem book={book} key={book.id} />
        ))}
      </div>

      {/* Pagination */}
      <ReactPaginate
        nextLabel="Next &#x2192;"
        onPageChange={handlePageChange}
        pageCount={pageCount}
        previousLabel="&#x2190; Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination-container"
        activeClassName="active-page"
        nextClassName="next-page"
        previousClassName="prev-page"
        forcePage={page}
      />
    </div>
  );
};

export default BookList;
