import { omdbWrapper } from './omdb-wrapper';
import axios from 'axios'

const mockedGet = jest.spyOn(axios, 'get');

test('searchMovieByName should return array of movies', () => {
  const movies = [{ Title: 'Awesome movie', imdbID: 'tt000001', Year: '1999', Type: 'movie', Poster: "link" }, { Title: 'Super awesome movie', imdbID: 'tt000002', Year: '2000', Type: 'movie', Poster: "link" }];
  const response = { status: 200, data: { Search: movies } };
  mockedGet.mockImplementation(() => Promise.resolve(response))

  let omdb = new omdbWrapper("dummykey")
  const parsedMovies = [{ title: 'Awesome movie', imdbId: 'tt000001', year: 1999, type: 'movie', poster: "link" }, { title: 'Super awesome movie', imdbId: 'tt000002', year: 2000, type: 'movie', poster: "link" }];
  return omdb.searchMovieByName("awesome movie").then(data => expect(data).toEqual(parsedMovies))
});

test('searchMovieByName should pass errors through', () => {
  const error = 'API error';

  mockedGet.mockImplementation(() => Promise.reject(error))

  let omdb = new omdbWrapper("dummykey")
  return omdb.searchMovieByName("awesome movie").then(data => { }).catch((err) => expect(err).toEqual(error))
});

test('getMovieById should return movie object', () => {
  const movie = {
    "Title": "The Dark Knight",
    "Year": "2008",
    "Rated": "PG-13",
    "Released": "18 Jul 2008",
    "Runtime": "152 min",
    "Genre": "Action, Crime, Drama, Thriller",
    "Director": "Christopher Nolan",
    "Writer": "Jonathan Nolan (screenplay), Christopher Nolan (screenplay), Christopher Nolan (story), David S. Goyer (story), Bob Kane (characters)",
    "Actors": "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
    "Plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "Language": "English, Mandarin",
    "Country": "USA, UK",
    "Awards": "Won 2 Oscars. Another 153 wins & 159 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    "Ratings": [{ "Source": "Internet Movie Database", "Value": "9.0/10" }, { "Source": "Rotten Tomatoes", "Value": "94%" }, { "Source": "Metacritic", "Value": "84/100" }],
    "Metascore": "84",
    "imdbRating": "9.0",
    "imdbVotes": "2,234,169",
    "imdbID": "tt0468569",
    "Type": "movie",
    "DVD": "09 Dec 2008",
    "BoxOffice": "$533,316,061",
    "Production": "Warner Bros. Pictures/Legendary",
    "Website": "N/A",
    "Response": "True"
  }
  const response = { status: 200, data: movie };

  mockedGet.mockImplementation(() => Promise.resolve(response))

  let omdb = new omdbWrapper("dummykey")
  const parsedMovie = {
    title: "The Dark Knight",
    year: 2008,
    rated: "PG-13",
    released: "18 Jul 2008",
    runtime: "152 min",
    genre: "Action, Crime, Drama, Thriller",
    director: "Christopher Nolan",
    writer: "Jonathan Nolan (screenplay), Christopher Nolan (screenplay), Christopher Nolan (story), David S. Goyer (story), Bob Kane (characters)",
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    language: "English, Mandarin",
    country: "USA, UK",
    awards: "Won 2 Oscars. Another 153 wins & 159 nominations.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    ratings: [{ source: "Internet Movie Database", value: "9.0/10" }, { source: "Rotten Tomatoes", value: "94%" }, { source: "Metacritic", value: "84/100" }],
    metascore: 84,
    imdbRating: 9.0,
    imdbVotes: 2234169,
    imdbId: "tt0468569",
    type: "movie",
  }
  return omdb.getMovieById("tt000001").then(data => expect(data).toEqual(parsedMovie))
})

test('getMovieById should return error for wrong id', () => {
  const error = { Response: "False", Error: "No movie for this id" }
  const response = { status: 200, data: error };

  mockedGet.mockImplementation(() => Promise.resolve(response))

  let omdb = new omdbWrapper("dummykey")
  return omdb.getMovieById("tt000001").then(data => { }).catch((err) => expect(err).toEqual(error.Error))
})

