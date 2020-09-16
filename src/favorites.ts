import os from 'os'
import fs from 'fs'

export type favorite = { id: string, title: string, score: number }
export type FavoritesError = { name: "FavoritesError", message: string, cause: Error }

export interface favorites {
    saveAsFavorite(favorite: favorite): void | FavoritesError
    removeFromFavorites(id: string): void | FavoritesError
    getAllFavorites(): favorite[] | FavoritesError
    clearFavorites(): void | FavoritesError
}

const defaultFilePath = os.homedir() + '/.movie-taste-decider'

export class favoritesManager implements favorites {
    private readonly filePath: string
    constructor(filePath?: string) {
        const fileName = '/favorites.json'
        if (filePath) {
            this.filePath = filePath + fileName
        } else {
            this.filePath = defaultFilePath + fileName
        }
    }
    saveAsFavorite(favorite: favorite) {
        try {
            makeSureFileExists(this.filePath)
            let favorites = readFavorites(this.filePath)
            if ((favorites.filter((fav) => fav.id === favorite.id)).length === 0) {
                favorites.push(favorite)
                writeFavorites(this.filePath, favorites)
            }
        } catch (err) {
            return { name: "FavoritesError", message: "Could not save favorites", cause: err } as FavoritesError
        }
    }
    removeFromFavorites(id: string) {
        try {
            let favorites = readFavorites(this.filePath)
            let updatedFavorites = favorites.filter(fav => fav.id !== id)
            if (favorites.length !== updatedFavorites.length) {
                writeFavorites(this.filePath, updatedFavorites)
            }
        } catch (err) {
            return { name: "FavoritesError", message: "Could not remove from favorites", cause: err } as FavoritesError
        }
    }
    getAllFavorites() {
        try {
            return readFavorites(this.filePath)
        } catch (err) {
            return { name: "FavoritesError", message: "Could not read favorites", cause: err } as FavoritesError
        }
    }
    clearFavorites() {
        try {
            writeFavorites(this.filePath, [])
        } catch (err) {
            return { name: "FavoritesError", message: "Could not clear favorites", cause: err } as FavoritesError
        }
    }
}

function makeSureFileExists(filePath: string) {
    if (fs.existsSync(filePath)) {
        return
    } else {
        let dirPath = filePath.slice(0, filePath.lastIndexOf("/"))
        fs.mkdirSync(dirPath, { recursive: true })
        fs.writeFileSync(filePath, "", { encoding: 'utf8' });
        return
    }
}

function readFavorites(filePath: string): favorite[] {
    let serialized = fs.readFileSync(filePath, 'utf8')
    if (serialized === "") {
        return []
    } else {
        let favorites = JSON.parse(serialized)
        return favorites
    }
}

function writeFavorites(filePath: string, favorites: favorite[]) {
    let serialized = JSON.stringify(favorites)
    fs.writeFileSync(filePath, serialized, { encoding: 'utf8' })
}