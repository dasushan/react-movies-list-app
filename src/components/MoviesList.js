import React from 'react';

import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = (props) => {
  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <Movie
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
          id={movie.id}
          key={movie.id}
          deleteHandler={props.onDeleteMovie}
        />
      ))}
    </ul>
  );
};

export default MovieList;