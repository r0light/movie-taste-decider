import axios from 'axios'

export type ageRate = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'

export type rating = {
    source: string,
    value: string
}

export type movieType = 'movie' | 'series' | 'episode'

export type detailedMovie = {
    title: string,
    year: number,
    rated: ageRate,
    released: string,
    runtime: string,
    genre: string,
    director: string,
    writer: string,
    actors: string,
    plot: string,
    language: string,
    country: string,
    awards: string,
    poster: string,
    ratings: rating[],
    metascore: number,
    imdbRating: number,
    imdbVotes: number,
    imdbId: string,
    type: movieType
}

export type simpleMovie = {
    title: string,
    year: number,
    imdbId: string,
    type: movieType,
    poster: string
}

export interface omdbapi {
    searchMovieByName(nameToSearch: string): Promise<simpleMovie[]>
    getMovieById(id: string): Promise<detailedMovie>
}

export class omdbWrapper implements omdbapi{
    readonly #apikey: string
    constructor(apikey: string) {
        this.#apikey = apikey
    }
    searchMovieByName(nameToSearch: string) {
        let result = new Promise<simpleMovie[]>((resolve, reject) => {
            axios.get('https://www.omdbapi.com/', {
                params: {
                    apikey: this.#apikey,
                    s: nameToSearch
                },
            }).then((response) => {
                if (response.status === 200 && response.data) {
                    resolve(parseSimpleMovies(response.data["Search"]))
                } else {
                    reject("There was a problem with the OMDB API")
                }
            }).catch((err) => {
                reject(err)
            })
        })
        return result
    }
    getMovieById(id: string) {
        let result = new Promise<detailedMovie>((resolve, reject) => {
            axios.get('https://www.omdbapi.com/', {
                params: {
                    apikey: this.#apikey,
                    i: id
                },
            }).then((response) => {
                if (response.status === 200) {
                    if (response.data["Response"] === 'True') {
                        resolve(parseDetailedMovie(response.data))
                    } else {
                        reject(response.data["Error"])
                    }
                } else {
                    reject("There was a problem with the OMDB API")
                }
            }).catch((err) => {
                reject(err)
            })
        })
        return result
    }
}

function hasOwnProperty<X extends {}, Y extends PropertyKey>
    (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

function parseSimpleMovies(moviesToParse: object[]): simpleMovie[] {
    let simpleMovies: simpleMovie[] = []
    for (let movieToParse of moviesToParse) {
        let title = "UnknownTitle"
        if (hasOwnProperty(movieToParse, "Title") && typeof movieToParse.Title === "string") {
            title = movieToParse.Title
        }
        let year = NaN
        if (hasOwnProperty(movieToParse, "Year") && typeof movieToParse.Year === "string") {
            year = parseInt(movieToParse.Year)
        }
        let imdbId = "UnknownImdbId"
        if (hasOwnProperty(movieToParse, "imdbID") && typeof movieToParse.imdbID === "string") {
            imdbId = movieToParse.imdbID
        }
        let type: movieType = "movie"
        if (hasOwnProperty(movieToParse, "Type") && typeof movieToParse.Type === "string") {
            if (movieToParse.Type === 'movie' || movieToParse.Type === 'series' || movieToParse.Type === 'episode') {
                type = movieToParse.Type
            }
        }
        let poster = "UnknownPoster"
        if (hasOwnProperty(movieToParse, "Poster") && typeof movieToParse.Poster === "string") {
            poster = movieToParse.Poster
        }
        simpleMovies.push({ title: title, year: year, imdbId: imdbId, type: type, poster: poster })
    }
    return simpleMovies
}

function parseDetailedMovie(movieToParse: object): detailedMovie {
    let title = "UnknownTitle"
    if (hasOwnProperty(movieToParse, "Title") && typeof movieToParse.Title === "string") {
        title = movieToParse.Title
    }
    let year = NaN
    if (hasOwnProperty(movieToParse, "Year") && typeof movieToParse.Year === "string") {
        year = parseInt(movieToParse.Year)
    }
    let rated: ageRate = 'G'
    if (hasOwnProperty(movieToParse, "Rated") && typeof movieToParse.Rated === "string") {
        if (movieToParse.Rated === 'G' || movieToParse.Rated === 'PG' || movieToParse.Rated === 'PG-13' || movieToParse.Rated === 'R' || movieToParse.Rated === 'NC-17') {
            rated = movieToParse.Rated
        }
    }
    let released = "UnknownReleased"
    if (hasOwnProperty(movieToParse, "Released") && typeof movieToParse.Released === "string") {
        released = movieToParse.Released
    }
    let runtime = "UnknownRuntime"
    if (hasOwnProperty(movieToParse, "Runtime") && typeof movieToParse.Runtime === "string") {
        runtime = movieToParse.Runtime
    }
    let genre = "UnknownGenre"
    if (hasOwnProperty(movieToParse, "Genre") && typeof movieToParse.Genre === "string") {
        genre = movieToParse.Genre
    }
    let director = "UnknownDirector"
    if (hasOwnProperty(movieToParse, "Director") && typeof movieToParse.Director === "string") {
        director = movieToParse.Director
    }
    let writer = "UnknownWriter"
    if (hasOwnProperty(movieToParse, "Writer") && typeof movieToParse.Writer === "string") {
        writer = movieToParse.Writer
    }
    let actors = "UnknownActors"
    if (hasOwnProperty(movieToParse, "Actors") && typeof movieToParse.Actors === "string") {
        actors = movieToParse.Actors
    }
    let plot = "UnknownPlot"
    if (hasOwnProperty(movieToParse, "Plot") && typeof movieToParse.Plot === "string") {
        plot = movieToParse.Plot
    }
    let language = "UnknownLanguage"
    if (hasOwnProperty(movieToParse, "Language") && typeof movieToParse.Language === "string") {
        language = movieToParse.Language
    }
    let country = "UnknownCountry"
    if (hasOwnProperty(movieToParse, "Country") && typeof movieToParse.Country === "string") {
        country = movieToParse.Country
    }
    let awards = "UnknownAwards"
    if (hasOwnProperty(movieToParse, "Awards") && typeof movieToParse.Awards === "string") {
        awards = movieToParse.Awards
    }
    let ratings: rating[] = []
    if (hasOwnProperty(movieToParse, "Ratings") && Array.isArray(movieToParse.Ratings)) {
        for (let rating of movieToParse.Ratings) {
            let source = "UnknownSource"
            if (hasOwnProperty(rating, "Source")) {
                source = rating.Source
            }
            let value = "UnknownValue"
            if (hasOwnProperty(rating, "Value")) {
                value = rating.Value
            }
            ratings.push({ source: source, value: value })
        }
    }
    let metascore = NaN
    if (hasOwnProperty(movieToParse, "Metascore") && typeof movieToParse.Metascore === "string") {
        metascore = parseFloat(movieToParse.Metascore)
    }
    let imdbRating = NaN
    if (hasOwnProperty(movieToParse, "imdbRating") && typeof movieToParse.imdbRating === "string") {
        imdbRating = parseFloat(movieToParse.imdbRating)
    }
    let imdbVotes = NaN
    if (hasOwnProperty(movieToParse, "imdbVotes") && typeof movieToParse.imdbVotes === "string") {

        imdbVotes = parseFloat(movieToParse.imdbVotes.replace(/,/g, ""))
    }
    let imdbId = "UnknownImdbId"
    if (hasOwnProperty(movieToParse, "imdbID") && typeof movieToParse.imdbID === "string") {
        imdbId = movieToParse.imdbID
    }
    let type: movieType = "movie"
    if (hasOwnProperty(movieToParse, "Type") && typeof movieToParse.Type === "string") {
        if (movieToParse.Type === 'movie' || movieToParse.Type === 'series' || movieToParse.Type === 'episode') {
            type = movieToParse.Type
        }
    }
    let poster = "UnknownPoster"
    if (hasOwnProperty(movieToParse, "Poster") && typeof movieToParse.Poster === "string") {
        poster = movieToParse.Poster
    }
    // not parsed: <DVD: string>, <BoxOffice: string>, <Production: string>, <Website: string>
    return {
        title: title,
        year: year,
        rated: rated,
        released: released,
        runtime: runtime,
        genre: genre,
        director: director,
        writer: writer,
        actors: actors,
        plot: plot,
        language: language,
        country: country,
        awards: awards,
        poster: poster,
        ratings: ratings,
        metascore: metascore,
        imdbRating: imdbRating,
        imdbVotes: imdbVotes,
        imdbId: imdbId,
        type: type
    }
}