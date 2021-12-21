// Game variables
let gameScreen = document.querySelector('.game-screen');
let scoreWrappers = document.querySelectorAll('.score-wrapper');
let scores = document.querySelectorAll('.score');
let servingBalls = document.querySelectorAll('.serving-balls');

// Settings variables
let settingsScreen = document.querySelector('.settings-screen');
let pointsToWin = document.querySelector('.points-to-win');
let applyButton = document.querySelector('.apply');

// Game state variables
let moreOrLess = false;
let gameProgress = [];

function updateServes() {
    for (let i = 0; i < servingBalls.length; i++) {
        if (!servingBalls[i].textContent) {
            continue;
        }

        if (servingBalls[i].textContent == '••') {
            servingBalls[i].textContent = '•';
        } else {
            servingBalls[i].textContent = '';
            servingBalls[(i + 1) % 2].textContent = moreOrLess ? '•' : '••';
        }

        break;
    }
}

function checkWinner(player) {
    let playerScore = Number(scores[player].textContent);

    if (playerScore < Number(pointsToWin.value)) {
        return;
    }

    if (playerScore > Number(scores[(player + 1) % 2].textContent) + 1) {
        settingsScreen.style.visibility = '';
    } else {
        moreOrLess = true;
    }
}

function paintScores() {
    scoreWrappers[0].className = 'score-wrapper';
    scoreWrappers[1].className = 'score-wrapper';
    gameScreen.className = 'game-screen';

    playerScores = [
        Number(scores[0].textContent),
        Number(scores[1].textContent),
    ];

    if (playerScores[0] > playerScores[1]) {
        scoreWrappers[0].classList.add('winning');
        scoreWrappers[1].classList.add('losing');
    } else if (playerScores[0] < playerScores[1]) {
        scoreWrappers[1].classList.add('winning');
        scoreWrappers[0].classList.add('losing');
    } else {
        gameScreen.classList.add('draw-screen');
    }
}

function incrementScore(player) {
    if (scores[player].textContent == 'S') {
        for (let i = 0; i < scores.length; i++) {
            let score = scores[i];

            score.textContent = '0';
        }

        servingBalls[player].textContent = '••';
    } else {
        scores[player].textContent = Number(scores[player].textContent) + 1;

        updateServes();
    }

    checkWinner(player);

    paintScores();

    gameProgress.push(player);
}

function revertServes() {
    for (let i = 0; i < servingBalls.length; i++) {
        if (!servingBalls[i].textContent) {
            continue;
        }

        if (servingBalls[i].textContent == '••') {
            servingBalls[i].textContent = '';
            servingBalls[(i + 1) % 2].textContent = '•';
        } else {
            if (moreOrLess) {
                servingBalls[i].textContent = '';
                servingBalls[(i + 1) % 2].textContent = '•';
            } else {
                servingBalls[i].textContent = '••';
            }
        }

        break;
    }
}

function revert() {
    let player = gameProgress.pop();

    scores[player].textContent = Number(scores[player].textContent) - 1;

    revertServes();
}

applyButton.onclick = function () {
    settingsScreen.style.visibility = 'hidden';

    for (let i = 0; i < scores.length; i++) {
        let score = scores[i];

        score.textContent = 'S';
    }

    for (let i = 0; i < servingBalls.length; i++) {
        let servingBall = servingBalls[i];

        servingBall.textContent = '';
    }

    moreOrLess = false;

    scoreWrappers[0].className = 'score-wrapper';
    scoreWrappers[1].className = 'score-wrapper';
    gameScreen.classList.add('draw-screen');
};

for (let i = 0; i < scoreWrappers.length; i++) {
    let scoreWrapper = scoreWrappers[i];

    scoreWrapper.onclick = function () {
        incrementScore(i);
    };
}

// Special variables for swipe
let touchPositions = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
];
let swipeLength = 100;

document.addEventListener(
    'touchstart',
    function (evt) {
        // Store swipe start points
        touchPositions[0].x = evt.changedTouches[0].pageX;
        touchPositions[0].y = evt.changedTouches[0].pageY;
    },
    false
);

// When user finished swipe
document.addEventListener(
    'touchend',
    function (evt) {
        // Store swipe end points
        touchPositions[1].x = evt.changedTouches[0].pageX;
        touchPositions[1].y = evt.changedTouches[0].pageY;

        // Store horizontal or not direction of swipe
        let horizontal =
            Math.abs(touchPositions[0].x - touchPositions[1].x) >
            Math.abs(touchPositions[0].y - touchPositions[1].y);

        // If swipe is horizontal and longer than 'swipeLength'
        if (
            horizontal &&
            Math.abs(touchPositions[0].x - touchPositions[1].x) > swipeLength
        ) {
            revert();
        }
        // If swipe is vertical and longer than 'swipeLength'
        else if (
            Math.abs(touchPositions[0].y - touchPositions[1].y) > swipeLength
        ) {
            settingsScreen.style.visibility = '';
        }
    },
    false
);
