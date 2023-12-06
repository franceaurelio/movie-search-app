import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "e0a33e50";
const ITEMS_PER_PAGE = 10;

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [darkMode, setDarkMode] = useState(false); 

  useEffect(() => {
    const storedRatings = localStorage.getItem("movieRatings");
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${searchTerm}&type=movie&page=${currentPage}`
      );
      if (response.data.Response === "True") {
        setMovies(response.data.Search || []);
        setTotalPages(Math.ceil(response.data.totalResults / ITEMS_PER_PAGE));
      } else {
        setMovies([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchMovies();
    }
  }, [searchTerm, currentPage]);

  const rateMovie = (title, rating) => {
    const updatedRatings = { ...ratings, [title]: parseInt(rating, 10) };
    setRatings(updatedRatings);
    localStorage.setItem("movieRatings", JSON.stringify(updatedRatings));
  };

  const handleSaveRating = (title, selectedRating) => {
    const numericRating = parseInt(selectedRating, 10);
    if (!numericRating || isNaN(numericRating)) {
      alert("Bitte wählen Sie eine gültige Bewertung aus.");
    } else {
      rateMovie(title, numericRating);
      alert(
        `Bewertung für ${title}: ${numericRating} Sterne wurde gespeichert!`
      );
    }
  };

  const resetMovieRating = (title) => {
    const updatedRatings = { ...ratings };
    delete updatedRatings[title];
    setRatings(updatedRatings);
    localStorage.setItem("movieRatings", JSON.stringify(updatedRatings));
  };

  const handleResetRating = (title) => {
    const confirmReset = window.confirm(
      `Möchten Sie die Bewertung für ${title} wirklich zurücksetzen?`
    );
    if (confirmReset) {
      resetMovieRating(title);
      alert(`Bewertung für ${title} wurde zurückgesetzt!`);
    }
  };

  const renderMovies = () => {
    return movies.map((movie, index) => (
      <div className="movie" key={index}>
        <h2>{movie.Title}</h2>
        <p>Year: {movie.Year}</p>
        <img src={movie.Poster} alt={movie.Title} />
        <div>
          <label htmlFor={`rating-${index}`}>Bewertung:</label>
          <select
            id={`rating-${index}`}
            onChange={(e) => rateMovie(movie.Title, e.target.value)}
            value={ratings[movie.Title] || ""}
            aria-label={`Rating for ${movie.Title}`}
          >
            <option value="">Wähle eine Bewertung</option>
            <option value="1">1 Stern</option>
            <option value="2">2 Sterne</option>
            <option value="3">3 Sterne</option>
            <option value="4">4 Sterne</option>
            <option value="5">5 Sterne</option>
          </select>
          <button
            onClick={() =>
              handleSaveRating(movie.Title, ratings[movie.Title] || "")
            }
          >
            Bewertung speichern
          </button>
          <button onClick={() => handleResetRating(movie.Title)}>
            Bewertung zurücksetzen
          </button>
        </div>
      </div>
    ));
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>Film - Bibliothek Wir Machen deinen Leben Einfach!!</h1>
      </header>
      <div className="content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Suche nach Filmen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchMovies}>Starten</button>
        </div>
        <div className="main-content">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          <div className="movie-list">{renderMovies()}</div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {renderPagination()}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <footer>
        <div className="contact-info">
          <h3>Kontakt</h3>
          <p>E-Mail: Wonderland-bibliothek@alice.com</p>
        </div>
        <div className="imprint">
          <h3>Impressum</h3>
          <p>Unternehmensname</p>
          <p>Adresse:Wonderland 00 , 12345 Alice in wonderland</p>
        </div>
      </footer>
      <div className="dark-mode-toggle">
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}

export default App;
