import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let interval;

    if (error) {
      interval = setInterval(async () => {
        const response = await fetch('https://swapi.dev/api/films/');
      }, 5000);
    }
    if (clicked) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [error, clicked]);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-backend-app-f330f-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json'
      );
      if (!response.ok) {
        throw new Error('Something went wrong....Retrying');
      }
      const data = await response.json();

      //console.log(data);

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      'https://react-backend-app-f330f-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    fetchMoviesHandler();
  }

  async function deleteMovieHandler(id) {
    console.log(`id: ${id}`);
    const updatedMovies = movies.filter((movie) => {
      return movie.id != id;
    });
    setMovies(updatedMovies);

    const response = await fetch(
      `https://react-backend-app-f330f-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${id}.json`,
      {
        method: 'DELETE',
      }
    );
    const data = await response.json();
  }

  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  const stopHandler = () => {
    setClicked(true);
  };
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>

        {content}
        {error && <button onClick={stopHandler}>Close</button>}
      </section>
    </React.Fragment>
  );
}

export default App;
