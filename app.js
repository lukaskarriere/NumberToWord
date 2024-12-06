const group = [1,8,7];
let output = "";

function checkSubGroup(group) {
    let wordCollection = [];
    // Check length of Array
    // Wie starte ich die Wort-Ausgabe, anhängig von der Länge des
    // group-Arrays? 
    // LÖSUNG: Array-Länge abfragen, abhängig davon hunderter/10er-Prüfung weglassen
    let arraylength = group.length;
   

    switch (arraylength) {
        case 1:
            console.log('1 digit available');       
            break;
        case 2:
            console.log('2 digit available');
            break;
        default:
            console.log('Full Set available');
            break;
    }


    // Check first digit

}

function appendToWord(word) {
    output += `${output} ${word}`;
}


checkSubGroup(group);