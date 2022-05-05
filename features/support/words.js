export function wordToNumber(word) {

    switch(word) {
        case "five":
            return 5;
        case "seventh":
            return 7;
        case "nine":
            return 9;
        default:
            throw new Error(`Unrecognised: ${word}`);
    }
}
