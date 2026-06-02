import { Operation, Problem } from './types';

export const generateProblem = (operations: Operation[], maxDigits: number = 2): Problem => {
  if (operations.length === 0) {
    operations = ['+', '-', '*', '/'];
  }
  
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = 0, num2 = 0, answer = 0;
  
  const maxNum = Math.pow(10, maxDigits) - 1;
  
  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * maxNum) + 2; 
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; 
      answer = num1 - num2;
      break;
    case '*':
      const multMax = maxDigits === 1 ? 9 : (maxDigits === 2 ? 15 : 25);
      num1 = Math.floor(Math.random() * multMax) + 1;
      num2 = Math.floor(Math.random() * multMax) + 1;
      answer = num1 * num2;
      break;
    case '/':
      const divMax = maxDigits === 1 ? 9 : (maxDigits === 2 ? 20 : 50);
      num2 = Math.floor(Math.random() * 9) + 2; 
      answer = Math.floor(Math.random() * divMax) + 1;
      num1 = num2 * answer;
      break;
  }
  
  const options = new Set<number>();
  options.add(answer);
  
  while (options.size < 4) {
    let variance = Math.floor(Math.random() * 10) + 1;
    let wrongAnswer;
    
    // Make plausible wrong answers
    if (op === '*' || op === '/') {
      // Common multiplication errors (off by one table factor)
      const factorVariance = Math.random() > 0.5 ? num1 : num2;
      variance = Math.random() > 0.5 ? factorVariance : variance;
    }
    
    if (Math.random() > 0.5) {
      wrongAnswer = answer + variance;
    } else {
      wrongAnswer = answer - variance;
    }
    
    // Keep them positive
    if (wrongAnswer >= 0 && wrongAnswer !== answer) {
      options.add(wrongAnswer);
    }
  }
  
  return {
    num1,
    num2,
    op,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};

export const getDisplayOperator = (op: Operation): string => {
  switch(op) {
    case '+': return '+';
    case '-': return '-';
    case '*': return '×';
    case '/': return '÷';
  }
}
