import React from "react";
import bookIcon from "../../imgs/book-icon.png";

const BookItem = ({ book }) => {
  const {
    title,
    publisher,
    description,
    publishedDate,
    authors,
    imageLinks,
    canonicalVolumeLink,
  } = book.volumeInfo;

  const text = book.searchInfo?.textSnippet || "No description found.";

  const publishedYear = new Date(publishedDate).getFullYear();

  const truncatedDescription = () => {
    if (description && description.length >= 250)
      return `${description?.substr(0, 247)}...`;

    return text;
  };

  return (
    <div className="book-item">
      {/* Image */}
      <div className="book-image">
        <img src={imageLinks?.thumbnail ?? bookIcon} alt={title} />
      </div>
      {/* Details */}
      <div className="book-details">
        <p className="book-title">
          {title}
          <span className="book-published-year">{`, ${
            !isNaN(publishedYear) ? publishedYear : "Unknown"
          } `}</span>
        </p>
        {publisher && <p className="book-publisher">{publisher}</p>}
        <p className="book-authors">{`${authors ?? "Unknown"}`}</p>
        <p className="book-description">
          {truncatedDescription()}
          <a
            href={canonicalVolumeLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            [more info]
          </a>
        </p>
      </div>
    </div>
  );
};

export default BookItem;
