let wordCollection = [];

const singleDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const twoDigits = ['ten', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const specialDigits = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const digitGrouping = ['billion', 'million', 'thousand']; // milliard = billion(englisch)

// ACHTUNG! Haupt-Gruppen müssen von RECHTS nach LINKS eingeteilt werden
// Hundred, thousand, million - wird erst hinzugefügt, wenn die einzelnen Gruppen erledigt sind

// Fälle die noch nicht funktionieren: 30
// erledigte Fälle: 505, 580, 005

//TODO reset groups after converting

// Get Input
const convertBtn = document.getElementById('convert');
convertBtn.addEventListener('click', convertNumberToString);
let groups = [];


function convertNumberToString() {
    // Get input value
    const inputValue = document.getElementById('numberInput');
    let text = inputValue.value;
    let number = Number(text);
    const minValue = -1000000000;
    const maxValue = 1000000000;
    let positive = true;

    // Check for invalid input
    if(number > maxValue || number < minValue || text === '') {
        console.error('Enter number between -1 and 1 billion');
        alert('Enter number between -1 and 1 billion');
        return;
    }
    // Check positiv and negativ input
    if(number < 0) {
        positive = false;
        number = number * -1;
        text = number.toString();
    }

    // Make groups of 3
    makeGroups(text);
    // Reset User Input
    inputValue.value = '';
    // Convert all numbers to words
    convertGroupsToWords(groups);
    printWordcollection(wordCollection, positive);

    // Reset global variables
    groups = [];
    wordCollection = [];

}

// Seprate 1-3 digits in groups
// Trying to make groups of 3
// Add them to groups array
function makeGroups(text) {

    let subArr = [];
    const lastIndex = text.length - 1;

    for (let i = lastIndex; i >= 0; i--) {
        //Add digits to subarray as numbers
        if (subArr.length < 3) {
            subArr.unshift(Number(text[i]));
        }

        // Add Sub array to group array
        if (subArr.length === 3 || i === 0) {
            groups.unshift(subArr);
            subArr = [];
        }
    }

    // Hat lange gedauert: Ich wollte die Zähl-Schleife auf decrement abändern und hab lange nach Fehlern gesucht, anstatt es einfach neu zu bauen.
}

// Returns a collection of words for a subgroup of numbers
function checkSubGroup(group) {
    let output = [];

    // Wie starte ich die Wort-Ausgabe, anhängig von der Länge des
    // group-Arrays? 
    // LÖSUNG: Array-Länge abfragen, abhängig davon hunderter/10er-Prüfung weglassen


    // Check length of Array
    let arraylength = group.length;

    // Write words to array - depending on the number of digits
    switch (arraylength) {
        // 1 digits Case
        case 1:
            output.push(singleDigits[group[0]]);
            break;
        // 2 digits Case
        case 2:
            if (group[0] === 0) {
                console.error('The first digit must not be zero');
            }
            else if (group[0] === 1) {
                output.push(getSpecialDigitWords(group[0], group[1]));
            } else {
                output.push(twoDigits[group[0] - 1]);
                if(group[1] !== 0) output.push(singleDigits[group[1]]);
            }
            break;
        // 3 digits Case
        default:
            // 1 digit zero
            if (group[0] === 0) {
                // Add word for following digits
                if (group[1] === 1) {
                    output.push(getSpecialDigitWords(group[1], group[2]));
                } else {
                    if (group[1] !== 0) output.push(twoDigits[group[1] - 1]);
                    if (group[2] !== 0) output.push(singleDigits[group[2]]);
                }
            }
            // 1 digit > zero
            else if (group[0] >= 1) {
                output.push(singleDigits[group[0]]);
                output.push('hundred');

                if (group[1] === 1) {
                    output.push(getSpecialDigitWords(group[1], group[2]));
                } else {
                    if (group[1] !== 0) output.push(twoDigits[group[1] - 1]);
                    if (group[2] !== 0) output.push(singleDigits[group[2]]);
                }
            }
            break;
    }

    return output

}

// Returns the word for Numbers between 10 -19
function getSpecialDigitWords(digit1, digit2) {
    let wholeNumber = Number(`${digit1}${digit2}`);

    switch (wholeNumber) {
        case 10:
            return specialDigits[0]
        case 11:
            return specialDigits[1]
        case 12:
            return specialDigits[2]
        case 13:
            return specialDigits[3]
        case 14:
            return specialDigits[4]
        case 15:
            return specialDigits[5]
        case 16:
            return specialDigits[6]
        case 17:
            return specialDigits[7]
        case 18:
            return specialDigits[8]
        case 19:
            return specialDigits[9]

        default:
            break;
    }



}

// Convert all numbers to words
function convertGroupsToWords(groups) {

        switch (groups.length) {
            case 1:
                wordCollection.push(
                    checkSubGroup(groups[0])
                );
                break;
            case 2:
                wordCollection.push(
                    checkSubGroup(groups[0]) + ' ' + digitGrouping[2]
                );
                wordCollection.push(
                    checkSubGroup(groups[1])
                );
                break;
            case 3:
                wordCollection.push(
                    checkSubGroup(groups[0]) + ' ' + digitGrouping[1]
                );
                wordCollection.push(
                    checkSubGroup(groups[1]) + ' ' + digitGrouping[2]
                );
                wordCollection.push(
                    checkSubGroup(groups[2])
                );
                break;

            default:
                // TODO: throw error
                break;
        }

}

// Prints out the actual number in words
function printWordcollection(wordCollection, positive) {
    let outputString = '';
    const wordlist = document.querySelector('.wordBox ol');
    
    for (const word of wordCollection) {
        outputString += ' ' + word;    
    }

    outputString = outputString.replaceAll(',', ' ');

    // Add minus for negative numbers
    if(positive === false) outputString = 'minus ' + outputString;

    // Append new word to list
    let newWord = document.createElement('li');
    newWord.textContent = outputString;
    wordlist.append(newWord);
}


// convertNumberToString();

// Musste unshift verwenden, damit die Einträge vor eingefügt und von links nach recht in dreier Gruppen unterteil werden.
// Die Erstellung der Nummern-Gruppen und das "Drucken" der einzelnen Wörter habe ich getrennt erstellt. Beim Verbinden dieser Blöcke hatte ich Schwierigkeiten.
// Wie stelle ich in "convertGroupsToWords" fest, welche "digitGrouping" ich brauche?
// arraylength = group.length; checkSubGroup ERROR: group is undefined. Solved -> changed case 1 to checkSubGroup(groups[0]) in convertGroupsToWords