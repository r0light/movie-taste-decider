import { omdbWrapper, omdbapi } from './omdb-wrapper'
import { favoritesManager, favorite } from './favorites'
import { simpleMovie, detailedMovie, movieType} from './omdb-wrapper'

export type MovieTasteDeciderError = { name: "MovieTasteDecideError", message: string, cause: Error }
export type tasteResult = { averageScore: number, tasteCategory: tasteCategory }
export type tasteCategory = "cineaste" | "ordinary" | "trash lover" | "unknown"

export interface movieTasteDecider {
    searchForMovie(movieName: string): Promise<movie[]>
    getDetailsForMovie(imdbId: string): Promise<detailedMovie>
    addToFavorites(imdbId: string): void
    removeFromFavorites(imdbId: string): void
    listFavorites(): favorite[] | MovieTasteDeciderError
    clearFavorites(): void | MovieTasteDeciderError
    determineTaste(): tasteResult | MovieTasteDeciderError
}

export class imdbMovieTasteDecider implements movieTasteDecider {
    readonly #omdbApi: omdbapi
    readonly #favorites: favoritesManager
    constructor(omdbApiKey: string, movieDirectory?: string) {
        this.#omdbApi = new omdbWrapper(omdbApiKey)
        if (movieDirectory) {
            this.#favorites = new favoritesManager(movieDirectory)
        } else {
            this.#favorites = new favoritesManager()
        }
    }
    searchForMovie(movieName: string): Promise<movie[]> {
        let foundMovies = new Promise<movie[]>((resolve, reject) => {
            this.#omdbApi.searchMovieByName(movieName).then(searchResults => {
                let foundMovies = searchResults.map<movie>(simpleMovie => {
                    return new movie(simpleMovie, this.#omdbApi, this.#favorites)
                })
                resolve(foundMovies)
            }).catch(err => {
                reject(err)
            })
        })
        return foundMovies
    }
    getDetailsForMovie(imdbId: string) {
        return this.#omdbApi.getMovieById(imdbId)
    }
    addToFavorites(imdbId: string) {
        this.#omdbApi.getMovieById(imdbId).then((details) => {
            this.#favorites.saveAsFavorite({ id: details.imdbId, title: details.title, score: details.imdbRating })
        }).catch(err => {
            console.error("Could not add to favorites")
        })
    }
    removeFromFavorites(imdbId: string) {
        this.#favorites.removeFromFavorites(imdbId)
    }
    listFavorites() {
        let favorites = this.#favorites.getAllFavorites()
        if (Array.isArray(favorites)) {
            return favorites
        } else {
            return { name: "MovieTasteDecideError", message: "The taste could not be determined", cause: favorites } as MovieTasteDeciderError
        }
    }
    clearFavorites() {
        let error = this.#favorites.clearFavorites()
        if (error) {
            return { name: "MovieTasteDecideError", message: "The taste could not be determined", cause: error } as MovieTasteDeciderError
        }
    }
    determineTaste() {
        let favorites = this.#favorites.getAllFavorites()
        if (Array.isArray(favorites)) {
            let averageScore = calculateAverageScore(favorites)
            let taste = determineTasteCategory(averageScore)
            return { averageScore: averageScore, tasteCategory: taste }
        } else {
            return { name: "MovieTasteDecideError", message: "The taste could not be determined", cause: favorites } as MovieTasteDeciderError
        }
    }
}

export class movie {
    readonly #omdb: omdbapi
    readonly #favorites: favoritesManager
    title: string
    year: number
    imdbId: string
    poster: string
    type: movieType
    constructor(baseMovie: simpleMovie, omdb: omdbapi, favorites: favoritesManager) {
        this.title = baseMovie.title
        this.year = baseMovie.year
        this.imdbId = baseMovie.imdbId
        this.poster = baseMovie.poster
        this.type = baseMovie.type
        this.#omdb = omdb
        this.#favorites = favorites
    }
    addToFavorites = () => {
        this.#omdb.getMovieById(this.imdbId).then((details) => {
            this.#favorites.saveAsFavorite({ id: details.imdbId, title: details.title, score: details.imdbRating })
        }).catch(err => {
            console.error("Could not add to favorites")
        })
    }
    getDetails = () => {
        return this.#omdb.getMovieById(this.imdbId)
    }
}

function calculateAverageScore(favorites: favorite[]): number {
    if (favorites.length === 0) {
        return NaN
    }
    let average = favorites.map<number>(movie => movie.score).reduce((scoreA, scoreB) => {return scoreA + scoreB}) / favorites.length
    return Math.round(average * 10) / 10 // round to one decimal place
}

function determineTasteCategory(averageScore: number): tasteCategory {
    if (isNaN(averageScore)) {
        return "unknown"
    } else if (averageScore >= 0 && averageScore <= 4.0) {
        return "trash lover"
    } else if (averageScore > 4.0 && averageScore <= 7.0) {
        return "ordinary"
    } else if (averageScore > 7.0 && averageScore <= 10) {
        return "cineaste"
    } else {
        throw new Error("averageScore has to be between 0 and 10, but was: " + averageScore)
    }
}