const gameList = document.querySelector('.game__list');
const form = document.querySelector('.form');
const input = document.querySelector('.game__input');
const gameTitle = document.querySelector('.game__title');
const buttonStart = document.querySelector('.button__start');

let firstCard = null;
let secondCard = null;
let resultArr = [];
let time = 60;
let timer;
let openCards = false;

function createCard(container, number) {
  const card = document.createElement('li');

  card.classList.add('game__card');
  card.textContent = number;

  card.addEventListener('click', function () {
    if (openCards) return false;

    setGameLogic(card);
  });

  container.append(card);
}

function createArrayOfCards(value) {
  let arrayOfCards = [];
  for (let i = 1; i <= value ** 2 / 2; i++) {
    arrayOfCards.push(i, i);
  }

  arrayOfCards.sort(() => Math.random() - 0.5);
  resultArr = arrayOfCards;
  return arrayOfCards;
}

function startGame(container, value = 4) {
  let newArr = createArrayOfCards(value);

  gameTitle.textContent = 'Guess the couple';
  gameList.style.width = `${value * 105}px`;

  newArr.forEach((el) => {
    createCard(container, el);
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let promptValue = '';

  // gameTitle.textContent = 'Guess the couple';
  buttonStart.textContent = 'Restart Game';
  input.classList.add('closed__input');

  let inputValue = Number(input.value);

  if (inputValue) time = 200 * inputValue;

  clearInterval(timer);
  seTime();

  input.value = '';
  gameList.innerHTML = '';

  if (inputValue < 2 || inputValue > 10 || inputValue % 2) {
    promptValue = prompt(`
        Please enter a valid value ! 
        Even number from 2 to 10 ...
        Or play by default cards.`);

    if (promptValue === '') {
      startGame(gameList);
    } else if (promptValue === null) {
      startGame(gameList);
      input.classList.remove('closed__input');

      clearInterval(timer);
    } else if (promptValue >= 2 && promptValue <= 10 && promptValue % 2 === 0) {
      startGame(gameList, promptValue);
    }
  } else {
    startGame(gameList, inputValue);
  }
});

function setGameLogic(card) {
  card.setAttribute('data-id', Date.now());

  card.classList.add('open__card');

  if (firstCard === null) {
    firstCard = card;
  } else if (firstCard !== null && secondCard === null) {
    secondCard = card;
    openCards = true;
  }

  if (firstCard && secondCard) {
    if (
      firstCard.textContent === secondCard.textContent &&
      firstCard.dataset.id !== secondCard.dataset.id
    ) {
      firstCard.classList.add('card__success');
      secondCard.classList.add('card__success');
      firstCard = null;
      secondCard = null;
      openCards = false;
    } else {
      setTimeout(() => {
        firstCard.classList.remove('open__card');
        secondCard.classList.remove('open__card');
        firstCard = null;
        secondCard = null;
        openCards = false;
      }, 500);
    }

    if (
      gameList.querySelectorAll('.card__success').length === resultArr.length
    ) {
      setTimeout(() => {
        if (time > 0) {
          gameTitle.textContent = `You won !!! ${time} seconds left`;
        }
        clearInterval(timer);
        input.classList.remove('closed__input');
        buttonStart.textContent = `Let's play again ?`;
      }, 500);
    }
  }
}

function seTime() {
  timer = setInterval(() => {
    time--;
    gameTitle.textContent = time;

    if (!time) {
      clearInterval(timer);
      if (
        gameList.querySelectorAll('.card__success').length !== resultArr.length
      ) {
        gameTitle.textContent = `Time's up,  you lost`;
        buttonStart.textContent = `Let's play again ?`;
      }
    }
  }, 1000);
}

startGame(gameList);
