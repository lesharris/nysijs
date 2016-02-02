'use strict';

var Nysijs = function () {};

Nysijs.encode = function ( input, trueNYSIIS ) {
  var strip = (typeof trueNYSIIS === 'undefined') ? false : trueNYSIIS;

  // Normalize
  var stash = input.toUpperCase();
  stash = stash.replace(/[^\w]/, '');

  // Step 1
  stash = stash.replace(/^MAC/, 'MCC');
  stash = stash.replace(/^KN/, 'N');
  stash = stash.replace(/^K/, 'C');
  stash = stash.replace(/^(PH|PF)/, 'FF');
  stash = stash.replace(/^SCH/, 'SSS');

  // Step 2
  stash = stash.replace(/EE$/, 'Y');
  stash = stash.replace(/IE$/, 'Y');
  stash = stash.replace(/(DT|RT|RD|NT|ND)$/, 'D');

  // Step 3
  var firstChar = stash.substring(0, 1);

  // Non-iterative parts of Step 4
  stash = stash.replace(/EV/g, 'AF');
  stash = stash.replace(/KN/g, 'N');
  stash = stash.replace(/(A|E|I|O|U)/g, 'A');
  stash = stash.replace(/SCH/g, 'SSS');
  stash = stash.replace(/PH/g, 'FF');

  // Iterate for rules that require position information
  var exploded = stash.split('');
  var output = '';
  var previousChar = firstChar;

  // Step 4 Iterative
  for (var i = 1; i < exploded.length; i++) {
    switch (exploded[i]) {
      case 'H':
        if (i < exploded.length - 1) {
          if (!Nysijs.isVowel(previousChar) || !Nysijs.isVowel(exploded[i + 1])) {
            exploded[i] = previousChar;
          }
        }
        break;

      case 'K':
            exploded[i] = 'C';
            break;

      case 'M':
            exploded[i] = 'N';
            break;

      case 'Q':
            exploded[i] = 'G';
            break;

      case 'W':
        if (Nysijs.isVowel(previousChar)) {
          exploded[i] = 'A';
        }
        break;

      case 'Z':
            exploded[i] = 'S';
            break;

      default:
        break;
    }

    if (exploded[i] !== previousChar) {
      output += exploded[i];
    }

    previousChar = exploded[i];
  }

  // Clean up end of key

  // Step 5
  output = output.replace(/S$/, '');

  // Step 6
  output = output.replace(/AY$/, 'Y');

  // Step 7
  output = output.replace(/A$/, '');

  // Step 8
  output = firstChar + output;

  // Step 9
  if( strip ) {
    output = output.substring(0, 6);
  }

  return output;
};

Nysijs.isVowel = function ( c ) {
  var vowels = ['A', 'E', 'I', 'O', 'U'];
  return vowels.indexOf(c) !== -1;
};

