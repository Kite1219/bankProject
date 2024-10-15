'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

function displayMovements(movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.textContent = '';
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
// displayMovements(account1.movements);

function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}
// calcDisplayBalance(account1.movements);

function calcDisplaySummary(acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => {
      return Math.abs(mov) + acc;
    }, 0);
  labelSumOut.textContent = `${outcome}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

// calcDisplaySummary(account1.movements);

const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};

function updateUI(acc) {
  //DISPLAY MOVEMENT
  displayMovements(acc.movements);
  //DISPLAY BALANCE
  calcDisplayBalance(acc);
  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
}

//Eventhandler
let currentAccount;

btnLogin.addEventListener('click', e => {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI AND MESSAGE
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Update UI
    updateUI(currentAccount);
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(receiverAcc, amount);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  //============
  const checker = currentAccount.movements.some(mov => {
    return mov >= amount * 0.1;
  });

  if (amount > 0 && checker) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  //===========
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(acc => {
      return currentAccount.username === acc.username;
    });
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

createUsernames(accounts);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
const deposits = movements.filter(mov => {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];

for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor);

const withdrawal = movements.filter(mov => {
  return mov < 0;
});

console.log(withdrawal);
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

//splice
console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'j'];
console.log(arr2.reverse());
console.log(arr2);

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));
*/
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas'.at(0));
console.log('jonas'.at(-1));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
}

movements.forEach((mov, i, arr) => {
  if (mov > 0) {
    console.log(`Movement ${i + 1} You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(mov)}`);
  }
  console.log(arr);
});
*/

//Map

// console.log(currencies);

// currencies.forEach((value, key, Map) => {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach((value, _, map) => {
//   console.log(`${value}: ${value}`);
// });
/*
//=============CHALLENGE 1================//

const julia = [5, 2, 4, 1, 15, 8, 3];
const kate = [16, 6, 10, 5, 6, 1, 4];

function checkDogs(dogsJulia, dogsKate) {
  const juliadogs2 = dogsJulia.slice();
  juliadogs2.splice(-2);
  juliadogs2.splice(0, 1);
  console.log(juliadogs2);

  const correctedJulia = [...dogsJulia];
  const correctedKate = dogsKate.slice();

  correctedJulia.forEach(value => {
    if (value < 3) {
      console.log(`${value} what a puppy!`);
    } else {
      console.log(`${value} what an adult`);
    }
  });
}

checkDogs(julia, kate);
//================CHALENGE 2===================
function calcAverageHumanAge(ages) {
  const humanAge = ages
    .map(dogAge => {
      if (dogAge <= 2) {
        return 2 * dogAge;
      } else {
        return 16 + dogAge * 4;
      }
    })
    .filter(dogAge => {
      return dogAge > 18;
    })
    .reduce((acc, humanAge, i, arr) => {
      return acc + humanAge / arr.length;
    }, 0);
  return humanAge;
}

console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/
// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescriptions);
/*
console.log(movements);

const balance = movements.reduce((acc, cur) => {
  return acc + cur;
}, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;

console.log(balance2);

//maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/
// const eurToUsd = 1.1;
// const totalDoposits = movements
//   .filter(mov => mov < 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDoposits);

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);

// let account22;
// for (const i of accounts) {
//   if (i.owner === 'Jessica Davis') {
//     account22 = i;
//     break;
//   }
// }
// console.log(account22);
/*
console.log(movements);

//Equality
console.log(movements.includes(-130));

//Condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => {
  return mov > 0;
});
console.log(anyDeposits);

//Every
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Seprate Callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
*/
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [(4, [5, 6])], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);
const overalBalance = allMovements.reduce((acc, mov) => {
  return acc + mov;
}, 0);

console.log(overalBalance);

const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// //numbers
// console.log(movements);

// //return < 0, A, B (keep order
// //return > 0, B, A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return 1;
// //   }
// //   if (b > a) {
// //     return -1;
// //   }
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);
// //Descending
// movements.sort((a, b) => b - a);
// console.log(movements);
/*
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 4, 6);
console.log(arr);

//Array.from
const y = Array.from({ length: 7 }, () => 1);

console.log(y);

const z = Array.from({ length: 7 }, (crr, i) => {
  return i + 1;
});
console.log(z);

const xv = Array.from({ length: 100 }, () => {
  return Math.round(Math.random() * 100);
});
console.log(xv);

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements_value')];
});
*/
/*
const bankDepositSum = accounts
  .flatMap(acc => {
    return acc.movements;
  })
  .filter(acc => {
    return acc >= 0;
  })
  .reduce((acc, value) => {
    return acc + value;
  }, 0);

console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 0)
  .reduce((acc, mov) => {
    if (mov >= 1000) {
      return ++acc;
    }
    return acc;
  }, 0);

console.log(numDeposits1000);

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
// This is a nice title => This Is a Nice Title
function convertTitleCase(title) {
  function capitailze(str) {
    return str.replace(str[0], str[0].toUpperCase());
  }

  const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (expections.includes(word) ? word : capitailze(word)))
    .join(' ');
  return capitailze(titleCase);
}

console.log(convertTitleCase('this is aice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

dogs.forEach(dog => {
  if (dog.owners.includes('Sarah')) {
    console.log(dog);
    console.log(
      dog.curFood > dog.recommendedFood * 0.9 &&
        dog.curFood < dog.recommendedFood * 1.1
        ? `It's a banger`
        : `Fat fuck`
    );
  }
});

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

const exactlyAmount = dogs.some(dog => {
  return dog.curFood === dog.recommendedFood;
});

const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

const okayAmount = dogs.some(checkEatingOkay);

console.log(dogs.filter(checkEatingOkay));

console.log(exactlyAmount);
console.log(okayAmount);

const sortedDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(sortedDogs);

console.log(dogs);
