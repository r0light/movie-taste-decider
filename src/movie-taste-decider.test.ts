import { imdbMovieTasteDecider } from './movie-taste-decider'
import { simpleMovie, detailedMovie, omdbWrapper } from './omdb-wrapper'
import { favorites, favorite } from './favorites'

const firstMovie: simpleMovie = {
    title: "My awesome movie",
    year: 1999,
    imdbId: "tt00032423",
    type: "movie",
    poster: "link"
}

const secondMovie: simpleMovie = {
    title: "Yet another awesome movie",
    year: 2003,
    imdbId: "tt00023432",
    type: "movie",
    poster: "link"
}

const searchMovieMock = jest.fn().mockImplementation((name: string) => {
    return new Promise<simpleMovie[]>((resolve, reject) => {
        resolve([firstMovie, secondMovie])
    })
})

const darkKnight: detailedMovie = {
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

const getMovieByIdMock = jest.fn().mockImplementation((id: string) => {
    return new Promise<detailedMovie>((resolve, reject) => {
        resolve(darkKnight)
    })
})

jest.mock('./omdb-wrapper', () => {
    return {
        omdbWrapper: jest.fn().mockImplementation((apikey: string) => {
            return {
                searchMovieByName: searchMovieMock,
                getMovieById: getMovieByIdMock
            }
        })
    }
})

const firstFavorite: favorite = {
    title: "My awesome movie",
    id: "tt00032423",
    score: 8.1
}

const secondFavorite: favorite = {
    title: "Yet another awesome movie",
    id: "tt00023432",
    score: 7.4
}

const thirdFavorite: favorite = {
    title: "Not such a good movie",
    id: "tt00023899",
    score: 3.9
}

const getAllFavoritesMock = jest.fn()
const saveAsFavoriteMock = jest.fn()
const removeFromFavoritesMock = jest.fn()
const clearFavoritesMock = jest.fn()
function createDefaultFavoritesManagerMock() {
    getAllFavoritesMock.mockImplementation(() => {
        return [firstFavorite, secondFavorite, thirdFavorite]
    })
    saveAsFavoriteMock.mockImplementation((movie: favorite) => {
        //nothing to do here
    })
    removeFromFavoritesMock.mockImplementation((id: string) => {
        //nothing to do here
    })
    clearFavoritesMock.mockImplementation(() => {
        //nothing to do here
    })
}

jest.mock('./favorites', () => {
    return {
        favoritesManager: jest.fn().mockImplementation((movieDirectory?: string) => {
            return {
                saveAsFavorite: saveAsFavoriteMock,
                getAllFavorites: getAllFavoritesMock,
                removeFromFavorites: removeFromFavoritesMock,
                clearFavorites: clearFavoritesMock
            }
        })
    }
})

test("present movies from search", () => {
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    return tasteDecider.searchForMovie("awesome").then((movies) => {
        expect(movies.length).toBe(2)
        expect(movies[0]).toMatchObject(firstMovie)
        expect(movies[0]).toHaveProperty("addToFavorites")
        expect(movies[0]).toHaveProperty("getDetails")
        expect(movies[1]).toMatchObject(secondMovie)
        expect(movies[1]).toHaveProperty("addToFavorites")
        expect(movies[1]).toHaveProperty("getDetails")
    })
})

test("get details for movie should call omdb api wrapper", () => {
    getMovieByIdMock.mockClear()
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    return tasteDecider.getDetailsForMovie("someId").then((movieDetails) => {
        expect(getMovieByIdMock.mock.calls.length).toBe(1)
        expect(getMovieByIdMock).toBeCalledWith("someId")
        expect(movieDetails).toEqual(darkKnight)
    })
})

test("adding to favorites should get movie and save as favorite", async () => {
    getMovieByIdMock.mockClear() // use mockClear to ensure number of times called is correct although the mock is called from different tests
    createDefaultFavoritesManagerMock()
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    await tasteDecider.addToFavorites("someId") // await required here because addToFavorites is asynchronous internally
    expect(getMovieByIdMock.mock.calls.length).toBe(1)
    expect(getMovieByIdMock).toBeCalledWith("someId")
    expect(saveAsFavoriteMock.mock.calls.length).toBe(1)
})

test("remove from favorites should delegate to favoritesManager", () => {
    createDefaultFavoritesManagerMock()
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    tasteDecider.removeFromFavorites("someId")
    expect(removeFromFavoritesMock.mock.calls.length).toBe(1)
    expect(removeFromFavoritesMock).toBeCalledWith("someId")
})

test("list all favorites should delegate to favoritesManager", () => {
    createDefaultFavoritesManagerMock()
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    tasteDecider.listFavorites()
    expect(getAllFavoritesMock.mock.calls.length).toBe(1)
})

test("clear favorites should delegate to favoritesManager", () => {
    createDefaultFavoritesManagerMock
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    tasteDecider.clearFavorites()
    expect(clearFavoritesMock.mock.calls.length).toBe(1)
})

function hasOwnProperty<X extends {}, Y extends PropertyKey>
    (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

test("average score calculation should round correctly", () => {
    createDefaultFavoritesManagerMock
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    let taste = tasteDecider.determineTaste()
    if (hasOwnProperty(taste, "averageScore") && hasOwnProperty(taste, "tasteCategory")) {
        expect(taste.averageScore).toBe(6.5)
        expect(taste.tasteCategory).toBe("ordinary")
    } else {
        expect(true).toBe(false) // make test fail on purpose
    }
})

test("determine taste should handle no favorites", () => {
    getAllFavoritesMock.mockImplementation(() => {
        return []
    })
    let tasteDecider = new imdbMovieTasteDecider("somekey")
    let taste = tasteDecider.determineTaste()
    if (hasOwnProperty(taste, "averageScore") && hasOwnProperty(taste, "tasteCategory")) {
        expect(taste.averageScore).toBe(NaN)
        expect(taste.tasteCategory).toBe("unknown")
    } else {
        expect(true).toBe(false) // make test fail on purpose
    }
})

