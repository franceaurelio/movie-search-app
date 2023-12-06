import React, { useState, useEffect } from "react";
import axios from "axios";
import Movie from "./Movie";
import "./App.css";

const API_KEY = "e5c2b670";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const storedRatings = localStorage.getItem("movieRatings");
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`
      );
      setMovies(response.data.Search || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchMovies();
    }
  }, [searchTerm]);

  const handleRatingChange = (title, rating) => {
    const updatedRatings = { ...ratings, [title]: rating };
    setRatings(updatedRatings);
    localStorage.setItem("movieRatings", JSON.stringify(updatedRatings));
  };

  const handleSaveRating = (title, selectedRating) => {
    handleRatingChange(title, selectedRating);
    alert(
      `Bewertung für ${title}: ${selectedRating} Sterne wurde gespeichert!`
    );
  };

  return (
    <div className="App">
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
          <div className="movie-list">
            {movies.map((movie, index) => (
              <Movie
                key={index}
                movie={movie}
                handleRatingChange={handleRatingChange}
                currentRating={ratings[movie.Title] || ""}
                handleSaveRating={handleSaveRating}
              />
            ))}
          </div>
        </div>
      </div>
      <footer>
        <div className="contact-info">
          <h3>Kontakt</h3>
          <p>E-Mail: kontakt@beispiel.com</p>
        </div>
        <div className="imprint">
          <h3>Impressum</h3>
          <p>Unternehmensname</p>
          <p>Adresse: Beispielstraße 123, 12345 Beispielstadt</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
