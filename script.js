// --- 變數宣告 ---
let board = Array(9).fill(null); // 棋盤狀態 [cite: 93]
let current = 'X';               // 當前玩家 (玩家為 X) [cite: 94]
let active = true;               // 控制遊戲是否進行中 [cite: 96]

// --- 初始化遊戲 ---
function init() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board = Array(9).fill(null);
    active = true;
    current = 'X';
    document.getElementById('status').innerText = '玩家(X) 先手';

    // 建立 9 個格子 [cite: 109-116]
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => playerMove(i);
        boardEl.appendChild(cell);
    }
}

// --- 玩家點擊處理 ---
function playerMove(i) {
    // 如果遊戲結束或該格已有棋子，則不執行 [cite: 122]
    if (!active || board[i]) return;

    board[i] = 'X';
    updateBoard();

    // 檢查玩家是否獲勝
    if (checkWin('X')) {
        endGame('玩家(X)勝利!');
        return;
    } else if (isFull()) {
        endGame('平手!');
        return;
    }

    // 換電腦下棋
    current = 'O';
    document.getElementById('status').innerText = '電腦思考中...';
    setTimeout(computerMove, 700); // 模擬思考時間 [cite: 134]
}

// --- 電腦 AI 邏輯 ---
function computerMove() {
    if (!active) return;

    // 1. 嘗試自己獲勝 [cite: 140]
    let move = findWinningMove('O');

    // 2. 嘗試阻止玩家獲勝 [cite: 142]
    if (move === null) move = findWinningMove('X');

    // 3. 否則隨機下在空格 [cite: 144]
    if (move === null) move = getRandomMove();

    // 執行下棋
    board[move] = 'O';
    updateBoard();

    // 檢查電腦是否獲勝
    if (checkWin('O')) {
        endGame('電腦(O)勝利!');
        return;
    } else if (isFull()) {
        endGame('平手!');
        return;
    }

    // 換回玩家
    current = 'X';
    document.getElementById('status').innerText = '輪到玩家(X)';
}

// --- 輔助功能：尋找致勝/防守位置 ---
function findWinningMove(player) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of wins) {
        const line = [board[a], board[b], board[c]];
        // 如果一條線上有 2 個是 player 且剩下 1 個是 null
        if (line.filter(v => v === player).length === 2 && line.includes(null)) {
            // 回傳那個 null 的位置索引 [cite: 172]
            return [a, b, c][line.indexOf(null)];
        }
    }
    return null; // 修正：確保在迴圈結束後才回傳 null
}

// --- 輔助功能：隨機選擇空格 ---
function getRandomMove() {
    const empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)]; // [cite: 179-180]
}

// --- 畫面更新 ---
function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        cells[i].innerText = board[i] || ''; // [cite: 187]
    }
}

// --- 判斷勝利 ---
function checkWin(player) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    // 檢查是否有任一連線符合 [cite: 199]
    return wins.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}

// --- 判斷平手 ---
function isFull() {
    return board.every(cell => cell !== null); // [cite: 206]
}

// --- 結束遊戲 ---
function endGame(message) {
    document.getElementById('status').innerText = message;
    active = false; // [cite: 211]
}

// --- 重置遊戲 ---
function resetGame() {
    init(); // [cite: 216]
}

// 啟動初始化
init();
