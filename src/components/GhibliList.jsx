import { useState, useEffect } from "react";

function GhibliList() {
  const [movies, setGhibliMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGhibliMovies();
  }, []);

  async function fetchGhibliMovies() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("https://ghibliapi.vercel.app/films");
      if (!response.ok) {
        throw new Error("Filme konnten nicht geladen werden.");
      }

      const data = await response.json();
      const detailedGhibliMovies = data.map((movie) => ({
        id: movie.id,
        title: movie.title,
        image: movie.image,
        originalTitle: movie.original_title,
        releaseDate: movie.release_date,
        director: movie.director,
      }));

      setGhibliMovies(detailedGhibliMovies);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p>Filme werden geladen...</p>;
  }

  if (error) {
    return <p>Fehler: {error}</p>;
  }

  return (
    <div className="ghibli-page">
      <div className="ghibli-hero">
        <p className="eyebrow">Studio Ghibli</p>
        <h1>Filmübersicht</h1>
        <p className="subtitle">Lieblingsmomente aus dem Ghibli-Universum.</p>
      </div>

      <div className="ghibli-grid">
        {movies.map((movie) => (
          <article key={movie.id} className="ghibli-card">
            <img className="card-image" src={movie.image} alt={movie.title} />
            <div className="card-overlay">
              <p className="ghibli-name">{movie.title}</p>
              <p className="ghibli-original">{movie.originalTitle}</p>
              <p className="ghibli-meta">
                Regie: {movie.director} · {movie.releaseDate}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default GhibliList;
