<script setup>
import { ref } from 'vue'

const inputValue = ref('');
let wordlist = ref([]);


let groups = [];
let wordCollection = [];
const singleDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const twoDigits = ['ten', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const specialDigits = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const digitGrouping = ['billion', 'million', 'thousand']; // milliard = billion(englisch)

function convertNumberToString() {
  // Get input value    
  let text = inputValue.value.toString();
  let number = Number(text);
  const minValue = -1000000000;
  const maxValue = 1000000000;
  let positive = true;

  // Check for negativ input and convert 
  if (number < 0) {
    positive = false;
    number = number * -1;
    text = number.toString();
  }


  // Check User-Input
  checkUserInput(text, number, minValue, maxValue);
  // Make groups of 3
  makeGroups(text);
  // Convert all numbers to words
  convertGroupsToWords(groups);
  // Print all words to Display
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
  debugger;
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

  console.log(groups);
}

// Build words from subgroups
function convertGroupsToWords(groups) {
  // Add fitting words to wordCollection.
  // Add digit grouping number if necessary, relative to length of groups array.

  switch (groups.length) {
    case 1:
      // Create Words (without digital grouping)
      wordCollection.push(
        convertSubGroup(groups[0])
      );
      break;
    case 2:
      // Create Words with 'Thousand' digital grouping
      createThousandWordGroup(groups);
      break;
    case 3:
      // Create Words with 'Thousand' and million digital grouping
      createMillionWordGroup(groups);
      break;
    case 4:
      // Create Word for 1 Billion
      wordCollection.push(
        convertSubGroup(groups[0]) + ' ' + digitGrouping[0]
      );
      break;

    default:
      break;
  }

}

// Returns a collection of words for a subgroup of numbers
function convertSubGroup(group) {
  let output = [];
  // Check length of Array
  let arraylength = group.length;

  // Write words to array - depending on the number of digits
  switch (arraylength) {
    // 1 digits Case
    case 1:
      createOneWord(group, output);
      break;
    // 2 digits Case
    case 2:
      createTwoWords(group, output);
      break;
    // 3 digits Case
    default:
      createThreeWords(group, output);
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

// Prints out the actual number in words
function printWordcollection(wordCollection, positive) {
  let outputString = '';

  for (const word of wordCollection) {
    outputString += ' ' + word;
  }

  // "Dirty fix" - Remove unnecessary "thousand"
  outputString = outputString.replaceAll(',', ' ');
  outputString = outputString.replace('  thousand', '');

  // Add minus for negative numbers
  if (positive === false) outputString = 'minus ' + outputString;
  // Push new word to list 
  wordlist.value.push(outputString);
}

// Convert 1 Digit to word
function createOneWord(group, output) {
  output.push(singleDigits[group[0]]);
}

// Convert 2 Digits to words
function createTwoWords(group, output) {
  if (group[0] === 0) {
    console.error('The first digit must not be zero');
  }
  else if (group[0] === 1) {
    output.push(getSpecialDigitWords(group[0], group[1]));
  } else {
    output.push(twoDigits[group[0] - 1]);
    if (group[1] !== 0) output.push(singleDigits[group[1]]);
  }
}

// Convert 3 Digits to words
function createThreeWords(group, output) {
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
}

// Build word with thousand gouping
function createThousandWordGroup() {
  wordCollection.push(
    convertSubGroup(groups[0]) + ' ' + digitGrouping[2]
  );
  wordCollection.push(
    convertSubGroup(groups[1])
  );
}

// Build word with thousand and million gouping
function createMillionWordGroup() {
  wordCollection.push(
    convertSubGroup(groups[0]) + ' ' + digitGrouping[1]
  );
  wordCollection.push(
    convertSubGroup(groups[1]) + ' ' + digitGrouping[2]
  );
  wordCollection.push(
    convertSubGroup(groups[2])
  );
}

// Check User-Input
function checkUserInput(text, number, minValue, maxValue) {
  // Check for invalid input
  if (number > maxValue || number < minValue || text === '') {
    alert('Enter number between -1 and 1 billion');
    throw new Error('Enter number between -1 and 1 billion.');
  }
  // 

}



</script>

<template>
  <h1>Convert number to word</h1>

  <input type="number" name="numberInput" v-model="inputValue">
  <button id="convert" @click="convertNumberToString">convert</button>
  <div class="wordBox">
    <ol>
      <li v-for="word in wordlist">
        {{ word }}
      </li>

    </ol>
  </div>
</template>

<style scoped>
ol {
  padding: 0 0 0 15px;
}
</style>
