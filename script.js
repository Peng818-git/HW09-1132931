// --- 變數宣告 ---
let board = Array(9).fill(null);
let current = 'X';
let active = true;

// --- 初始化遊戲 ---
function init() {
    const boardEl = document.getElementById('board');
    const winLine = document.getElementById('winLine');
    
    // 清空棋盤但保留 winLine
    boardEl.innerHTML = '';
    boardEl.appendChild(winLine); 
    
    // 重置連線動畫樣式
    winLine.style.display = 'none';
    winLine.style.width = '0';
    
    board = Array(9).fill(null);
    active = true;
    current = 'X';
    document.getElementById('status').innerText = '玩家 (X) 準備';

    // 建立 9 個格子
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => playerMove(i, cell);
        boardEl.appendChild(cell);
    }
}

// --- 玩家下棋 ---
function playerMove(i, cellEl) {
    if (!active || board[i]) return;

    // 玩家下棋
    board[i] = 'X';
    cellEl.innerText = 'X';
    cellEl.classList.add('x', 'pop');
    
    // 檢查結果
    let winPattern = checkWin('X');
    if (winPattern) {
        endGame('太強了！玩家 (X) 獲勝 🎉', winPattern);
        return;
    } else if (isFull()) {
        endGame('平手！再來一局吧 🤝');
        return;
    }

    // 換電腦下棋
    current = 'O';
    document.getElementById('status').innerText = '電腦思考中... 💭';
    
    // 稍微延遲讓玩家看到動畫
    setTimeout(computerMove, 500); 
}

// --- 電腦 AI 下棋 (Minimax 版本) ---
function computerMove() {
    if (!active) return;

    // 使用 Minimax 演算法計算最佳位置
    let bestScore = -Infinity;
    let move = -1;

    // 遍歷所有空格，模擬下棋
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O'; // 嘗試下這一步
            let score = minimax(board, 0, false); // 計算這一步的分數
            board[i] = null; // 復原 (Backtrack)

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    // 執行最佳步數
    board[move] = 'O';
    
    // 更新畫面
    const cells = document.getElementsByClassName('cell');
    const targetCell = cells[move];
    targetCell.innerText = 'O';
    targetCell.classList.add('o', 'pop');

    let winPattern = checkWin('O');
    if (winPattern) {
        endGame('電腦 (O) 贏了！別氣餒 💪', winPattern);
        return;
    } else if (isFull()) {
        endGame('平手！再來一局吧 🤝');
        return;
    }

    current = 'X';
    document.getElementById('status').innerText = '輪到玩家 (X)';
}

// --- Minimax 核心演算法 ---
function minimax(board, depth, isMaximizing) {
    // 1. 檢查終止狀態 (Base Cases)
    let winO = checkWin('O');
    if (winO) return 10 - depth; // 電腦贏 (越快贏分數越高)
    
    let winX = checkWin('X');
    if (winX) return depth - 10; // 玩家贏 (越慢輸分數越高)
    
    if (isFull()) return 0; // 平手

    // 2. 遞迴計算 (Recursive Step)
    if (isMaximizing) {
        // 電腦的回合 (找最高分)
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // 玩家的回合 (假設玩家極聰明，會讓電腦拿最低分)
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// --- 畫出連線動畫 ---
function drawWinLine(pattern) {
    const line = document.getElementById('winLine');
    const [a, b, c] = pattern;
    
    line.style.display = 'block';
    
    let width = '90%';
    let angle = 0;
    let top = '50%';
    let left = '50%';

    // 橫向
    if (a === 0 && b === 1) top = '16.66%'; 
    else if (a === 3 && b === 4) top = '50%'; 
    else if (a === 6 && b === 7) top = '83.33%'; 
    // 直向
    else if (a === 0 && b === 3) { left = '16.66%'; angle = 90; }
    else if (a === 1 && b === 4) { left = '50%'; angle = 90; }
    else if (a === 2 && b === 5) { left = '83.33%'; angle = 90; } 
    // 斜向
    else if (a === 0 && b === 4) { angle = 45; width = '130%'; }
    else if (a === 2 && b === 4) { angle = 135; width = '130%'; }

    line.style.top = top;
    line.style.left = left;
    line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    setTimeout(() => { line.style.width = width; }, 50);
}

// --- 判斷勝利 ---
function checkWin(player) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of wins) {
        const [a, b, c] = combo;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return combo;
        }
    }
    return null;
}

// --- 判斷平手 ---
function isFull() {
    return board.every(cell => cell !== null);
}

// --- 結束遊戲 ---
function endGame(message, winPattern) {
    document.getElementById('status').innerText = message;
    active = false;
    if (winPattern) drawWinLine(winPattern);
}

// --- 重置遊戲 ---
function resetGame() {
    init();
}

// 啟動
init();
