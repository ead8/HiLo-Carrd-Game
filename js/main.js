const deck = [
  "A-C", "A-D", "A-H", "A-S",
  "2-C", "2-D", "2-H", "2-S",
  "3-C", "3-D", "3-H", "3-S",
  "4-C", "4-D", "4-H", "4-S",
  "5-C", "5-D", "5-H", "5-S",
  "6-C", "6-D", "6-H", "6-S",
  "7-C", "7-D", "7-H", "7-S",
  "8-C", "8-D", "8-H", "8-S",
  "9-C", "9-D", "9-H", "9-S",
  "10-C", "10-D", "10-H", "10-S",
  "J-C", "J-D", "J-H", "J-S",
  "Q-C", "Q-D", "Q-H", "Q-S",
  "K-C", "K-D", "K-H", "K-S"
];

const cardImages = [
  "img/A-C.png", "img/A-D.png", "img/A-H.png", "img/A-S.png",
  "img/2-C.png", "img/2-D.png", "img/2-H.png", "img/2-S.png",
  "img/3-C.png", "img/3-D.png", "img/3-H.png", "img/3-S.png",
  "img/4-C.png", "img/4-D.png", "img/4-H.png", "img/4-S.png",
  "img/5-C.png", "img/5-D.png", "img/5-H.png", "img/5-S.png",
  "img/6-C.png", "img/6-D.png", "img/6-H.png", "img/6-S.png",
  "img/7-C.png", "img/7-D.png", "img/7-H.png", "img/7-S.png",
  "img/8-C.png", "img/8-D.png", "img/8-H.png", "img/8-S.png",
  "img/9-C.png", "img/9-D.png", "img/9-H.png", "img/9-S.png",
  "img/10-C.png", "img/10-D.png", "img/10-H.png", "img/10-S.png",
  "img/J-C.png", "img/J-D.png", "img/J-H.png", "img/J-S.png",
  "img/Q-C.png", "img/Q-D.png", "img/Q-H.png", "img/Q-S.png",
  "img/K-C.png", "img/K-D.png", "img/K-H.png", "img/K-S.png"
];

let currentCard;
let points = 0;
let previousCard;
let currentGuess = "";

const user = {
  balance: 1000,
  bet: 0,
};

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCard() {

  const card = deck.pop();
  previousCard = currentCard;
  currentCard = card;
  const cardIndex = cardImages.indexOf(`img/${card}.png`);
  if (cardIndex !== -1) {
    document.getElementById('card').src = `${cardImages[cardIndex]}`;
    document.getElementById('guess').textContent = `Your Guess: ${currentGuess}`;
  } else {
    console.log("Image not found for this card.");
  }
  updateOddsDisplay()
  console.log(card)
}

function updateBalance() {
  document.getElementById('balance').textContent = user.balance;
}

//place holder
function placeBet() {
  const betAmount = parseInt(document.getElementById('bet').value);

  if (betAmount > user.balance || betAmount <= 0) {
    alert('Invalid bet amount.');
    return;
  }

  user.bet = betAmount;
  user.balance -= user.bet;
  updateBalance();
}

function checkResult(guess) {
  if (deck.length === 0) {
    showPopup('Out of cards! Game Over!');
    return;
  }

  currentGuess = guess;
  dealCard();
  const nextCardValue = getValue(currentCard);
  const previousCardValue = getValue(previousCard);
  console.log(previousCardValue,nextCardValue)
  const odds = calculateOdds();

  if (currentGuess === 'higher' && nextCardValue > previousCardValue) {
    user.balance += user.bet * odds.higher;
  } else if (currentGuess === 'lower' && nextCardValue < previousCardValue) {
    user.balance += user.bet * odds.lower;
  } else if (currentGuess === 'same' && nextCardValue === previousCardValue) {
    user.balance += user.bet * odds.same;
  } else {
    resetGame()
    user.balance -= user.bet;
  }

  document.getElementById('points').textContent = points;
  updateBalance();
}

function getValue(card) {
  const cardValue = card.charAt(0);
  const cardValues = "A2345678910JQK";
  return cardValues.indexOf(cardValue);
}

function calculateOdds() {
  const remainingHigher = countHigherCards();
  const remainingLower = countLowerCards();
  const remainingSame = countSameCards();

  const totalRemaining = remainingHigher + remainingLower + remainingSame;

  const odds = {
    higher: remainingHigher > 0 ? totalRemaining / remainingHigher : 0,
    lower: remainingLower > 0 ? totalRemaining / remainingLower : 0,
    same: remainingSame > 0 ? totalRemaining / remainingSame : 0,
  };

  return odds;
}


function countHigherCards() {
  const currentCardValue = getValue(currentCard);
  const higherCards = deck.filter(card => getValue(card) > currentCardValue);
  return higherCards.length;
}

function countLowerCards() {
  const currentCardValue = getValue(currentCard);
  const lowerCards = deck.filter(card => getValue(card) < currentCardValue);
  return lowerCards.length;
}

function countSameCards() {
  const currentCardValue = getValue(currentCard);
  const sameCards = deck.filter(card => getValue(card) === currentCardValue);
  return sameCards.length;
}

shuffleDeck();

document.getElementById('deal').addEventListener('click', () => {
  dealCard()
});

document.getElementById('higher').addEventListener('click', () => {
  placeBet();
  checkResult('higher');
});

document.getElementById('lower').addEventListener('click', () => {
  placeBet();
  checkResult('lower');
});

document.getElementById('same').addEventListener('click', () => {
  placeBet();
  checkResult('same');
});

const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupClose = document.getElementById('popup-close');

function showPopup(message) {
  popupText.textContent = message;
  popup.style.display = 'block';
}

function closePopup() {
  popup.style.display = 'none';
  resetGame();
}

popupClose.addEventListener('click', closePopup);

function resetGame() {
  user.bet = 0;
  points = 0;
  user.balance = 1000;
  updateBalance();
  document.getElementById('points').textContent = points;
  document.getElementById('bet').value = '';
  document.getElementById('guess').textContent = 'Your Guess: -';
  document.getElementById('card').src = 'img/BACK.png';
  currentCard = '';
  previousCard = '';
  currentGuess = '';
}

resetGame();
function updateOddsDisplay() {
  const odds = calculateOdds();

  document.getElementById('odds-higher').textContent = odds.higher;
  document.getElementById('odds-lower').textContent = odds.lower;
  document.getElementById('odds-same').textContent = odds.same;
}

// Call updateOddsDisplay to display initial odds
updateOddsDisplay();
