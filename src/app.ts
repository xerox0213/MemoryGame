type Fruits = 'apple' | 'banana' | 'cherry' | 'straw';
type Vegetables = 'brocoli' | 'pepper';
type FAndV = (Fruits | Vegetables)[];
type BoardGame = FAndV[];
type SelectedCards = HTMLDivElement[];

const cardsWrapper = document.querySelectorAll('.card-wrapper') as NodeListOf<HTMLDivElement>;
const hitsIndicator = document.querySelector('.game-indicator') as HTMLParagraphElement;
const infoGame = document.querySelector('.game-goal') as HTMLParagraphElement;
const backFaceCardImg = document.querySelectorAll('.card-back img') as NodeListOf<HTMLImageElement>;
const fruitsAndVegs: FAndV = ['apple', 'banana', 'cherry', 'straw', 'brocoli', 'pepper'];
let boardGame: BoardGame = [[], [], []];
let nTimesFAndVUsed = {
  apple: 0,
  banana: 0,
  cherry: 0,
  straw: 0,
  brocoli: 0,
  pepper: 0,
};
let nHit = 0;
let returnedCards = 0;
let selectedCards: SelectedCards = [];

generateBoardGame();

function generateBoardGame() {
  for (let i = 0; i < boardGame.length; i++) {
    for (let j = 0; j < 4; j++) {
      let randomIndex: number;
      let randomFruitOrVeg: Fruits | Vegetables;
      do {
        randomIndex = getRandomIntInclusive(0, fruitsAndVegs.length - 1);
        randomFruitOrVeg = fruitsAndVegs[randomIndex];
      } while (nTimesFAndVUsed[randomFruitOrVeg] === 2);
      nTimesFAndVUsed[randomFruitOrVeg] += 1;
      boardGame[i].push(randomFruitOrVeg);
      setImgBackFaceCard(i, j, randomFruitOrVeg);
    }
  }
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setImgBackFaceCard(nRow: number, nColumn: number, value: Fruits | Vegetables) {
  const cardWrapper = cardsWrapper[nRow * 4 + nColumn];
  const backFaceImg = cardWrapper.querySelector('.card-back img') as HTMLImageElement;
  cardWrapper.dataset.row = `${nRow}`;
  cardWrapper.dataset.column = `${nColumn}`;
  backFaceImg.src = `ressources/${value}.svg`;
}

cardsWrapper.forEach((cardWrapper) => {
  cardWrapper.addEventListener('click', () => {
    // Condition au cas où quelqu'un ajouterais un attribut style depuis le HTML pour désactiver la propriété de la classe disabled
    if (selectedCards.includes(cardWrapper)) {
      return;
    }

    if (selectedCards.length < 2) {
      cardWrapper.classList.add('active', 'disabled');
      selectedCards.push(cardWrapper);
    }

    if (selectedCards.length === 2) {
      setNumberOfHits(++nHit);
      setTimeout(() => checkSelectedCard(), 1000);
    }
  });
});

function checkSelectedCard() {
  const firstCard = selectedCards[0];
  const secondCard = selectedCards[1];

  const nRowFirstCard = Number(firstCard.dataset.row);
  const nColumnFirstCard = Number(firstCard.dataset.column);
  const nRowSecondCard = Number(secondCard.dataset.row);
  const nColumnSecondCard = Number(secondCard.dataset.column);

  const valueFirstCard = boardGame[nRowFirstCard][nColumnFirstCard];
  const valueSecondCard = boardGame[nRowSecondCard][nColumnSecondCard];

  if (valueFirstCard === valueSecondCard) {
    returnedCards += 2;
  } else {
    selectedCards.forEach((selectedCard) => selectedCard.classList.remove('active', 'disabled'));
  }

  selectedCards = [];
  checkWin();
}

function checkWin() {
  if (returnedCards === 12) {
    displayWin();
  }
}

function displayWin() {
  hitsIndicator.innerText = `Votre score final : ${nHit}`;
  infoGame.innerText = 'Bravo ! Appuyez sur « échap » pour relancer une partie.';
}

function setNumberOfHits(nHit: number) {
  hitsIndicator.innerText = `Nombre de coups : ${nHit}`;
}

window.addEventListener('keyup', handleRestartGame);

function handleRestartGame(e: KeyboardEvent) {
  if (e.key === 'Escape' && returnedCards === 12) {
    resetGame();
    setTimeout(generateBoardGame, 1000);
  }
}

function resetGame() {
  boardGame = [[], [], []];
  nTimesFAndVUsed = {
    apple: 0,
    banana: 0,
    cherry: 0,
    straw: 0,
    brocoli: 0,
    pepper: 0,
  };
  nHit = 0;
  returnedCards = 0;
  cardsWrapper.forEach((cardWrapper) => cardWrapper.classList.remove('active', 'disabled'));
  infoGame.innerText = "Tentez de gagner avec le moins d'essais possible.";
  setNumberOfHits(0);
}
