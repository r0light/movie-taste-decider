# Movie taste decider

This is a small NodeJS library written in TypeScript which enables searching for your favorite movies, save them as such, and determine your personal movie taste based on the imdb scores of your favorite movies.

**Caution**: This project is not meant to be used in any way in productive software. It is only a showcase project for educational purposes.

## How to use

The library uses the [OMDb API](https://www.omdbapi.com/) and requires you to have an API key for it.
You can then import the central `imdbMovieTasteDecider`-class and create an instance of it by passing in your API key as a string like this:

```typescript
import { imdbMovieTasteDecider } from 'movie-taste-decider'

let tasteDecider = new imdbMovieTasteDecider("yourOmdbApiKey")
```

`imdbMovieTasteDecider` implements the `movieTasteDecider`-Interface which looks like the following:

```typescript
export interface movieTasteDecider {
    searchForMovie(movieName: string): Promise<movie[]>
    getDetailsForMovie(imdbId: string): Promise<detailedMovie>
    addToFavorites(imdbId: string): void
    removeFromFavorites(imdbId: string): void
    listFavorites(): favorite[] | MovieTasteDeciderError
    clearFavorites(): void | MovieTasteDeciderError
    determineTaste(): tasteResult | MovieTasteDeciderError
}
```

And you can therefore use all the functions available in the interface.

The library stores your favorites on the file systems at the following place as a default: `~/.movie-taste-decider/favorites.json`
If you want to specify another place, you can also do that via the constructor, for example:

```typescript
import { imdbMovieTasteDecider } from 'movieTasteDecider'

let tasteDecider = new imdbMovieTasteDecider("yourOmdbApiKey", "/home/me/customDirectory")
```

This would result in the favorites being saved at `/home/me/customDirectory/favorites.json`

## Try it out via the REPL console

(*A current installation of NodeJS is required for this*)

If you check out this repository, you can run `npm start` to enter a customized node [REPL](https://nodejs.org/api/repl.html) console, which you can use to try out the library.
There are two additional commands available:

* `.howToUse`: prints out a little help how to use the library in the REPL console
* `.setApiKey`: takes a string as an input which is interpreted as your OMDb API key to create an object `tasteDecider` which is then ready to use.
