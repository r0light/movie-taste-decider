import { imdbMovieTasteDecider, movieTasteDecider } from './movie-taste-decider'
import { resolve } from 'path'
import repl from 'repl'

let replServer = repl.start({
    prompt: "movie-taste-decider> ",
})

replServer.defineCommand('setApiKey', {
    help: 'set your omdb api key with this command: >.setApiKey yourkey',
    action(apikey) {
        this.clearBufferedCommand();
        if (apikey) {
            let tasteDecider = new imdbMovieTasteDecider(apikey)
            this.context.tasteDecider = tasteDecider
            console.log("Created new tasteDecider object.")
        } else {
            console.log("No tasteDecider created, you have to set a non-empty omdb api key")
        }
        this.displayPrompt();
    }
});

replServer.defineCommand('howToUse', {
    help: 'shows how to use the tasteDecider object',
    action(apikey) {
        this.clearBufferedCommand();
        console.log("First create a tasteDecider object with the required omdb api key with: >.setApiKey yourkey")
        console.log("Then you can use the tasteDecider object for example with: >tasteDecider.searchForMovie('Star Wars')")
        console.log("The following methods are available: "
            + "\n searchForMovie(movieName: string): Promise<movie[]>"
            + "\n getDetailsForMovie(imdbId: string): Promise<detailedMovie>"
            + "\n addToFavorites(imdbId: string): void"
            + "\n removeFromFavorites(imdbId: string): void"
            + "\n listFavorites(): favorite[] | MovieTasteDeciderError"
            + "\n determineTaste(): tasteResult | MovieTasteDeciderError"
        )
        this.displayPrompt();
    }
});