'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Hayder Yimer',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-07T17:01:17.194Z',
    '2020-07-07T23:36:17.929Z',
    '2020-07-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'John Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const help = document.querySelector(".help");

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

/////// DISPLAY TRANSACTIONS

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, i) {
    const DOW = value > 0 ? 'deposit' : 'withdrawal';
    const now = new Date();
    const date = new Date(acc.movementsDates[i]);
    const hour = date.getHours();
    const minute = `${date.getMinutes()}`.padStart(2, 0);
    const lifeTimeDay = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const lifeTimeDayD = lifeTimeDay(now, date);
    const displayDate = function (D) {
      if (D === 0) {
        return `today, ${hour}:${minute}`;
      } else if (D === 1) {
        return `yesterday`;
      } else if (D <= 4 && D >= 2) {
        return `${lifeTimeDay} days ago`;
      } else {
        return `${new Intl.DateTimeFormat(acc.locale).format(
          date
        )}, ${hour}:${minute}`;
      }
    };

    const formattedCur = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(value);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${DOW}">${i + 3} ${DOW}</div>
    <div class="movements__date">${displayDate(lifeTimeDayD)}</div>
    <div class="movements__value">${formattedCur}</div>
  </div>
  `;

    // containerMovements.innerHTML+= html; makes it later
    // better way of doing it insertAdjacentHTML

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////// DISPLAY BANK BALANCE

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedCur = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance);
  labelBalance.textContent = `${formattedCur}`;
};

/////// DISPLAY SUMMARY

const calcDisplaySummary = function (acc) {
  // IN
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const formattedCurIn = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes);
  labelSumIn.textContent = `${formattedCurIn}`;
  //  OUT
  const outcomes = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );
  const formattedCurOut = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(outcomes);
  labelSumOut.textContent = `${formattedCurOut}`;

  // INTEREST (1.2 %)

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(depo => (depo * acc.interestRate) / 100)
    .filter((int, i, arr) => int > 1) //filter int more than 1
    .reduce((acc, cur) => acc + cur, 0);
  const formattedCurInt = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest);
  labelSumInterest.textContent = `${formattedCurInt}`;
};

/////// CREATE USERNAME FOR ALL ACCOUNT NAMES

const createUserNames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.slice(0, 1))
      .join('');
  });
};

createUserNames(accounts);

// updating the UI

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

/////// Event Handlers ////////

let currentAccount, tick;

// //// Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Timer

const ticktok = function () {
  const counter = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);

    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(tick);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
      help.style.display = "block"
    }

    time--;
  };

  let time = 300;

  //time starts counting
  counter();
  const tick = setInterval(counter, 1000);
  return tick;
};

// login event

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    const now = new Date();
    const options = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    //we can set locale from the browser itself by navigator language option

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear input fields not to show after login

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
    help.style.display = "none";

    if (tick) clearInterval(tick);
    tick = ticktok();
  }
});

// transfer event

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, transferTo);

  if (
    amount > 0 &&
    transferTo &&
    amount <= currentAccount.balance &&
    transferTo !== currentAccount.username
  ) {
    console.log(`${transferTo.username}  & ${currentAccount.username}`);

    inputTransferAmount.value = inputTransferTo.value = '';

    //the main part which is easy

    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);

    //update date for transaction

    currentAccount.movementsDates.push(new Date());
    transferTo.movementsDates.push(new Date());

    updateUI(currentAccount);

    //resetting timer

    clearInterval(tick);
    tick = ticktok();
  }
});

// Request Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      //add loan
      currentAccount.movements.push(amount);

      //add the date
      currentAccount.movementsDates.push(new Date());

      //update ui
      updateUI(currentAccount);
    }, 3000);
  } else {
    console.log('You are broke bitch 💔');
  }

  //resetting timer

  clearInterval(tick);
  tick = ticktok();

  inputLoanAmount.value = '';
});

// close account event

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // delete the account
    accounts.splice(index, 1); // goodbye

    // hide the ui making it seem he has logged out
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  } else {
    inputClosePin.value = '';
  }
});

// sort button

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//////////////////////////////////////////////////
////////// Basic Numbers

// basic math errors in js

// console.log(23 === 23.0);
// console.log(0.1 + 0.5 === 0.6);

// // Coersion

// console.log(Number('22'));
// //is the same as
// console.log(+('22'));

// // Parsing

// console.log(Number.parseInt('232c')); // 232
// console.log(Number.parseFloat('23.987g'));
// console.log(Number.parseInt('98j', 10));
// console.log(Number.parseFloat('23.3333f', 2)); //works for base 2

// // checking if a value is a number

// console.log(Number.isNaN(+('231')));
// console.log(Number.isFinite(20/0)); //Best way to CHECK
// console.log(Number.isInteger(+('20h')));

//////////////////////////////////////////////////
////////// Math operations

// //sqrt
// console.log(Math.sqrt(23));

// //exponent(power of)
// console.log(23 ** (1/2));
// console.log(23 ** (1/3));

// //max value/min value does coersion but not parsing
// console.log(Math.max(2 ,5, 6, 1, 12, 6));
// console.log(Math.min(2 ,5, 6, '1', 12, 6));

// //PI
// const areaCircle = (r) => Math.trunc(Math.PI * r**2);
// console.log(areaCircle(10));

// //random/ min max random number
// console.log(Math.trunc(Math.random()*10 +1));  // 1~10
// const randomGenerator = (min,max) => Math.trunc((Math.random()*(max-min))) + 1 + min;
// console.log(randomGenerator(10, 30));

// //rounding İNTEGERS

// console.log(Math.trunc(23.765)); //remove the decimal
// console.log(Math.ceil(23.4)); // 24 rounds UP
// console.log(Math.floor(23.9)); // 23 rounds up
// console.log(Math.round('23.5')); // 24 normal round

// // floor and trunc might be the same but not for negatives

// console.log(Math.trunc(-21.4)); // -21
// console.log(Math.floor(-21.4)); // -22
// console.log(Math.ceil(-21.9)); //-21 BUT CEIL IS SAME NOW

// //rounding decimals (works like normal round)
// console.log((2.3).toFixed(0)); // its a string
// console.log((6.9).toFixed(2));
// console.log((4.6798213).toFixed(3));
// console.log(+(2.453).toFixed(2)); //its a string

/////////////////////////////////////////////////////
/////// The reminder method

// console.log(5 % 2);
// console.log(5 / 2);

// console.log(8%2); //0

// const isEven = n => n%2 === 0;

// console.log(isEven(8));

// console.log([...document.querySelectorAll('.movements__row')]);

// labelBalance.addEventListener('click', function(e) {
//   e.preventDefault();
//   [...document.querySelectorAll('.movements__row')].forEach(function(row,i) // {
//     if(i%2 === 0) {
//       row.style.backgroundColor = '#eee';
//     } else {
//       row.style.backgroundColor = '#fff';
//     }
//   })
// })

/////////////////////////////////////////////////////
/////// Numeric separators

//only on numbers not on strings coersion doesnt get it

// const diameter = 287_231_980_003; // its a comma
// const price = 231_95; // its a cent

// console.log(diameter, price); // ıs the same not comma shit

// // you cant place it at the beginning end and after a point

/////////////////////////////////////////////////////
/////// BigInt (big integers)

// console.log(2 ** 52 + 21); // works
// console.log(2 ** 53 - 1); // limit
// console.log(Number.MAX_SAFE_INTEGER); // to see the limit

// // bigInt changes the game (es2020)

// //n and operations
// console.log(1274091748107234091287491024210n * 23141n);

// //bigInt
// console.log(BigInt(123097480912759663));
// console.log(('12309748091275966').length); // 17 is the limit for bigInt

// // main use of the bigInt is for converting small numbers to a bigInt limit 17

// // comperator dont have problems
// console.log(20n > 15);
// console.log(20n == 20);

// //plus string concatenation

// const huge = 13221901437144210873211412084723140n;

// console.log(huge + ' is a really big integer');

/////////////////////////////////////////////////////
/////// Creating Dates

// const now = new Date();
// console.log(now);

// //giving a date manually

// console.log(new Date('Aug 4 1999'));

// // by parameters
// console.log(new Date(1999, 0, 4, 14, 22, 5));
// console.log(new Date(2047, 6, 21, 15, 42, 3)); // it can round up

//console.log(new Date(3 * 24 * 60 * 60 * 1000)); // in milli second

// we can methods
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth()); //0 based add 1
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(future.getTimezoneOffset());

// const millisecond = future.getTime();
// const years = Date.now() / (1000 * 60 * 60 * 24 * 365);
// console.log(years);

// console.log(Date.now()); // shows how seconds passed

// we can even set a new year or month

/////////////////////////////////////////////////////
/////// Creating Dates and calculating them

// const simdi = new Date();
// const myBDay = new Date(1999, 7, 4);
// console.log(simdi, myBDay);

// const lifeTimeYear = (date1, date2) =>
//   Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24 * 365));
// const lifeTimeDay = (date1, date2) =>
//   Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

// console.log(lifeTimeYear(myBDay, simdi));
// console.log(lifeTimeDay(simdi, myBDay));

///////////////////////////////////////////////////////
//////// Implementing Intl formats

// const num = 2423849.32;

// const options = {
//   style: 'currency',
//   unit: 'kilometer-per-hour',
//   currency: 'EUR',
//   // useGrouping: false
// };

// console.log(new Intl.NumberFormat('en-US', options).format(num));
// console.log(new Intl.NumberFormat('de-DE', options).format(num));
// console.log(new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(new Intl.NumberFormat(navigator.language, options).format(num));

/////////////////////////////////////////////////////////
////////// Timers setTimeOut and setTimeInterval

//setTimeout before only once
// const accessories = ['whip', 'thong']

// const sexTimer = setTimeout((a1, a2) => console.log(`Here is your dildo order 🍆 containing ${a1} and ${a2}`), 3000, ...accessories);
// console.log('waiting....');

// if(accessories.includes('thong')) clearTimeout(sexTimer)

//setInterval continues
// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000)

// const options = {
//   hour: '2-digit',
//   minute: '2-digit',
//   second: '2-digit'
// }

//  setInterval(() => {
//    const now = new Date();
//    console.log(new Intl.DateTimeFormat(navigator.language, options).format(now));
//  }, 1000)
