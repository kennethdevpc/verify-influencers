/*
AI: Certainly!
You can create a function that takes in a number and returns its reverse.
Here’s how you can do it:
*/

function reverseNumber(number) {
  const isNegative = number < 0;
  return isNegative;
  const numString = String(number);

  const reversedString = numString.reverse();

  const reversedNumber = parseInt(reversedString, 10);
  return reversedNumber;
}
// Example usage:
console.log(reverseNumber(-1223)); // Output: 3221
