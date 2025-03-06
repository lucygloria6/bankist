'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Oluchi Gloria Anogwi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium'
};

const account2 = {
  owner: 'Ohaeri John',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard'
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium'
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic'
   
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements,sort = false) { 
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row"> 
      <div class="movements__type       movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${acc.balance} €`; 
};

///////////Map and ForEach array methods

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  })
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance 
  calcDisplayBalance(acc);
  //Display summary 
  calcDisplaySummary(acc);
}

//  Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  console.log(currentAccount);
// Optional Chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
updateUI(currentAccount)
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';
  
  if (amount > 0 && receiverAcc && currentAccount.balance > amount && receiverAcc?.username !== currentAccount.username) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
////// FINDINDEX
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin)
  {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
//delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
//LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
//////////////////////////////////////////////
Simple Array Methods
let arr = ['a', 'b', 'c', 'd', 'e',];
// slide method
console.log(arr.slice(2));
console.log(arr.slice(2,4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1,-2));
console.log(arr.slice());
console.log([...arr]);

//splice(it chances the original array)
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2)// 2 is the num of element we want to delete
console.log(arr);
// Reverse method
arr = ['a', 'b', 'c', 'd', 'e',];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2);
console.log(arr2.reverse());
// Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);//spread operator
//Join 
console.log(letters.join('-'));

// The new AT method
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));
//getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('gloria'.at(0));
console.log('gloria'.at(-1));

looping Array : forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
//forOF loop
// for (const movement of movements) {
for (const [i,movement] of movements.entries()){
  if (movement > 0) {
    console.log(`Movement ${i+1}:You deposited ${movement}`);
  } else {
    console.log(`Movement ${i+1}:You withdrew ${Math.abs(movement)}`);//abs(absolute value)
  }
};
//forEach method(mov(current element,i(index),arr(entire array)))
console.log('------FOREACH-----');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}:You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}:You withdrew ${Math.abs(mov)}`);//abs(absolute value)
  }
});
//forEach with maps and sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//for map
currencies.forEach(function (value, key, map) {
  console.log(`${key}:${value}`);
})
//set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}:${value}`);
})
*/

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// const movementsUSD = movements.map(mov =>
//   mov * eurToUsd);
 
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = []
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementDescriptions = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1}:You deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1}:You withdrew ${Math.abs(mov)}`;
//   }
// // });
// const movementDescriptions = movements.map((mov, i) =>
//   `Movement ${i + 1}:You ${mov > 0 ? 'deposited':'withdrew'} ${Math.abs(mov)}`
// ) 
// console.log(movementDescriptions);

/////Filter Array methods 
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

/////Reduce Method
// console.log(movements);
// // accumulator (acc)-> snowball 
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(balance);
// //reduce with for-loop

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov)
//     return acc;
//   else
//     return mov;
// }, movements[0]);
// console.log(max);

///// Chaining all array methods map,filter and reduce methods

// const eurToUsd = 1.1;
// //Pipeline
// const totalDepositsUSD = movements
//   .filter(mov =>  mov > 0)
//   .map((mov, i, arr) => {
//     // 
//     return mov * eurToUsd;
//   })

//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);
////// FIND METHOD used to revive one element of an array based on a condition
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Ohaeri John');
// console.log(account);
// bonus Assignment use for -off loop

//////////// The New findLast and findLastIndex Methods

// console.log(movements);
const lastWithdrawal = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawal);

// `Your latest large movement was X movements ago`

// const latestLargeMovementIndex = movements.findLastIndex(mov => Math.abs(mov) > 1000);
// console.log(latestLargeMovementIndex);

// console.log(`Your latest large movement was ${movements.length - latestLargeMovementIndex} movements ago`);
////// Some and The Every Method

//// The includes Methods deals on Equality
// console.log(movements.includes(-130));

//// The Some Methods deals with Conditions
// console.log(movements.some(mov => mov === -130));
// or
const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

//// Every Method returns true if all the conditions passed in are true
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// Separate callback function
const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

//////////// Flat and FlatMap methods

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// OR Chaining
 /////flat method 
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
  // console.log(overalBalance);
///////flatmap method if goes 1 level deep
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
  // console.log(overalBalance2);

// Sorting Arrays

//Strings

const owners = ['Gloria', 'John', 'Zach', 'Jonas'];
// console.log(owners.sort());
// console.log(owners);

// Numbers
// console.log(movements);

// return < 0, A,B(keep order)
// return >0, B, A(switch order)

//Ascending order
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});

movements.sort((a, b) => a - b);

// console.log(movements);

// Descending order
/*movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
movements.sort((a, b) => b - a);
// 
///// Array Grouping
console.log(movements);

const groupedMovements = Object.groupBy(movements, movement => movement > 0 ? 'deposits' : 'withdrawals')
  ;
console.log(groupedMovements);
  
const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});
console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, account => account.type);
const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
console.log(groupedAccounts);

///////// Filling Arrays programatically
const arr2 = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays + fill method
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));
x.fill(3, 2, 5);
x.fill(1);
console.log(x);

arr2.fill(23, 2, 6);
console.log(arr2);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', ''))
  );
console.log(movementsUI);
})

//// Non-Destructive Alternatives: toReversed, toSorted, toSpliced, with
console.log(movements);
const reversedMov = movements.toReversed();
console.log(reversedMov);

//toSorted (sort), toSpliced (splice)

// movements[1] = 2000; // affects the original array
const newMovements = movements.with(1, 2000);
console.log(newMovements);
console.log(movements);
*/
///////Array Method Practice

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);
// 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 1000).length;
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
// .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
.reduce((count, cur) => (cur >= 1000 ? ++count : count), 0)
console.log(numDeposits1000);

// prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const {deposits, withdrawals}= accounts
  .flatMap(acc => acc.movements)
  .reduce(
     (sums, cur) => {
//   cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
);
console.log(deposits, withdrawals);
  
// 4.
// this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'))
console.log(convertTitleCase('this is a LONG title but not too long'));console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('and here a another title with an EXAMPLE'));