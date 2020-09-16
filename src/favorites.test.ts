import {favoritesManager, favorite} from './favorites'
import tmp from 'tmp'
import fs from 'fs'

test('saving favorites should create file correctly', () => {
    const tmpDir = tmp.dirSync().name

    const favoriteMovie = {title: "My favorite movie", id: "tt0000202", score: 8.5}
    const dirToBeCreated = tmpDir + "/favorites"
    const fileToBeCreated = dirToBeCreated + "/favorites.json"
    
    let favorites = new favoritesManager(dirToBeCreated)
    favorites.saveAsFavorite(favoriteMovie)

    expect(fs.existsSync(fileToBeCreated)).toBeTruthy()

    let content = fs.readFileSync(fileToBeCreated, 'utf8')
    expect(JSON.parse(content)).toEqual([favoriteMovie])
})

test('reading favorites should return all saved favorites', () => {
    const tmpDir = tmp.dirSync().name

    const favoriteMovies = [{title: "My favorite movie", id: "tt0000202", score: 8.5}, {title: "The best movie", id: "tt0000212", score: 9.0}, {title: "Another movie", id: "tt000345", score: 7.0}]
    
    let favorites = new favoritesManager(tmpDir)
    for (let movie of favoriteMovies) {
        favorites.saveAsFavorite(movie)
    }
    expect(favorites.getAllFavorites()).toEqual(favoriteMovies)
})

test('calling listFavorites first should result in empty array', () => {
    const tmpDir = tmp.dirSync().name

    let favorites = new favoritesManager(tmpDir)
    expect(favorites.getAllFavorites()).toEqual([])
})

test('calling clear favorites first should result in empty array', () => {
    const tmpDir = tmp.dirSync().name

    let favorites = new favoritesManager(tmpDir)
    expect(favorites.getAllFavorites()).toEqual([])
})

test('adding favorite twice should not result in duplicates', () => {
    const tmpDir = tmp.dirSync().name

    const favoriteMovie = {title: "My favorite movie", id: "tt0000202", score: 8.5}
    
    let favorites = new favoritesManager(tmpDir)
    // add movie twice
    favorites.saveAsFavorite(favoriteMovie)
    favorites.saveAsFavorite(favoriteMovie)
    expect(favorites.getAllFavorites()).toEqual([favoriteMovie])

})

test('removing movie should remove it from list if the id is matched', () => {
    const tmpDir = tmp.dirSync().name

    const favoriteMovie = {title: "My favorite movie", id: "tt0000001", score: 8.5}
    
    let favorites = new favoritesManager(tmpDir)

    favorites.saveAsFavorite(favoriteMovie)
    favorites.removeFromFavorites(favoriteMovie.id)
    let emptyFavorites = favorites.getAllFavorites()
    if (Array.isArray(emptyFavorites)) {
        expect(emptyFavorites.length).toEqual(0)
    }
})

test('clearing favorites should remove all favorites', () => {
    const tmpDir = tmp.dirSync().name

    const favoriteMovie = {title: "My favorite movie", id: "tt0000001", score: 8.5}
    const otherMovie = {title: "Another cool movie", id: "tt0000002", score: 7.5}
    
    let favorites = new favoritesManager(tmpDir)

    favorites.saveAsFavorite(favoriteMovie)
    favorites.saveAsFavorite(otherMovie)
    favorites.clearFavorites()
    let emptyFavorites = favorites.getAllFavorites()
    if (Array.isArray(emptyFavorites)) {
        expect(emptyFavorites.length).toEqual(0)
    }
})