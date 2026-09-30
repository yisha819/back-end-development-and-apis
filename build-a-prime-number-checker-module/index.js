function isPrime(num) {
  // Prime numbers must be greater than 1
  if (num <= 1) {
    return false;
  }

  // Check every integer from 2 up to num - 1
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      return false; // Found a divisor other than 1 and itself
    }
  }

  // If no divisors were found in the loop, it is prime
  return true;
}

module.exports = { isPrime };