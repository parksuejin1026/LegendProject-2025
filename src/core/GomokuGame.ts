// src/core/GomokuGame.ts (최종 수정 버전)

export enum Player {
    Empty = 0, Human = 1, AI = 2
}

export enum GameState {
    Playing, HumanWin, AIWin, Draw
}

export class GomokuGame {
    private readonly BOARD_SIZE: number = 15;
    private readonly WIN_COUNT: number = 5;
    private board: Player[][];
    private currentPlayer: Player;
    private gameState: GameState;
    
    private lastMove: { row: number, col: number } | null = null;
    private winLine: { row: number, col: number }[] | null = null;
    private history: { board: Player[][], player: Player }[] = []; 

    constructor() {
        this.board = [];
        this.currentPlayer = Player.Human;
        this.gameState = GameState.Playing;
        this.initializeBoard();
    }
    
    // --- Getter 함수 ---
    public getBoardState(): Player[][] { return this.board; }
    public getCurrentPlayer(): Player { return this.currentPlayer; }
    public getGameState(): GameState { return this.gameState; }
    public getBoardSize(): number { return this.BOARD_SIZE; }
    public getLastMove(): { row: number, col: number } | null { return this.lastMove; }
    public getWinLine(): { row: number, col: number }[] | null { return this.winLine; }

    private initializeBoard(): void {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = new Array(this.BOARD_SIZE).fill(Player.Empty);
        }
        this.history = [];
        this.lastMove = null;
        this.winLine = null;
    }
    
    // --- 히스토리 및 Undo ---
    private saveHistory(): void {
        const currentBoardCopy = this.board.map(row => [...row]);
        this.history.push({ 
            board: currentBoardCopy, 
            player: this.currentPlayer 
        });
    }

    public undoMove(): boolean {
        if (this.history.length < 2) return false; 

        this.history.pop(); 
        const stateBeforeHuman = this.history.pop(); 

        if (stateBeforeHuman) {
            this.board = stateBeforeHuman.board;
            this.currentPlayer = stateBeforeHuman.player;
            this.gameState = GameState.Playing;
            
            this.lastMove = null;
            this.winLine = null;
            return true;
        }
        return false;
    }


    // --- 돌 놓기 ---
    public makeMove(row: number, col: number): boolean {
        if (this.gameState !== GameState.Playing || 
            row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE || 
            this.board[row][col] !== Player.Empty) {
            return false;
        }

        this.saveHistory(); 
        
        const playerToMove = this.currentPlayer;
        this.board[row][col] = playerToMove;
        
        this.lastMove = { row, col }; 

        const line = this.checkWinAndGetLine(row, col, playerToMove);
        
        if (line) {
            this.gameState = (playerToMove === Player.Human) ? GameState.HumanWin : GameState.AIWin;
            this.winLine = line; 
        } else if (this.isBoardFull()) {
            this.gameState = GameState.Draw;
        } else {
            this.switchTurn();
        }
        return true;
    }

    private switchTurn(): void {
        this.currentPlayer = (this.currentPlayer === Player.Human) ? Player.AI : Player.Human;
    }

    private isBoardFull(): boolean {
        return this.board.every(row => row.every(cell => cell !== Player.Empty));
    }

    // --- 승리 판정 (승리 선 좌표 반환) ---
    private checkWinAndGetLine(r: number, c: number, player: Player): { row: number, col: number }[] | null {
        const directions = [ [0, 1], [1, 0], [1, 1], [1, -1] ];

        for (const [dr, dc] of directions) {
            // ⬇️ ESLint 오류 해결: 'let'을 'const'로 변경
            const line: { row: number, col: number }[] = [{ row: r, col: c }];

            // 정방향 카운트 + 좌표 저장
            for (let i = 1; i < this.WIN_COUNT; i++) {
                const nr = r + dr * i, nc = c + dc * i;
                if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
                line.push({ row: nr, col: nc });
            }

            // 역방향 카운트 + 좌표 저장
            for (let i = 1; i < this.WIN_COUNT; i++) {
                const nr = r - dr * i, nc = c - dc * i;
                if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
                line.push({ row: nr, col: nc });
            }
            
            if (line.length >= this.WIN_COUNT) {
                return line;
            }
        }
        return null;
    }

    // --- 🤖 AI 로직 (방어/공격) ---
    private findWinningMove(playerToCheck: Player): { row: number, col: number } | null {
        for (let r = 0; r < this.BOARD_SIZE; r++) {
            for (let c = 0; c < this.BOARD_SIZE; c++) {
                if (this.board[r][c] === Player.Empty) {
                    this.board[r][c] = playerToCheck;
                    
                    if (this.checkWinAndGetLine(r, c, playerToCheck)) {
                        this.board[r][c] = Player.Empty; 
                        return { row: r, col: c };
                    }
                    
                    this.board[r][c] = Player.Empty;
                }
            }
        }
        return null;
    }

    public handleAIMove(): { row: number, col: number } | null {
        if (this.currentPlayer !== Player.AI || this.gameState !== GameState.Playing) return null;

        // 1. AI의 즉각적인 승리 시도 (공격)
        const aiWinMove = this.findWinningMove(Player.AI);
        if (aiWinMove) {
            this.makeMove(aiWinMove.row, aiWinMove.col);
            return aiWinMove;
        }

        // 2. 플레이어의 즉각적인 승리 방어 (방어)
        const humanWinMove = this.findWinningMove(Player.Human);
        if (humanWinMove) {
            this.makeMove(humanWinMove.row, humanWinMove.col); 
            return humanWinMove;
        }
        
        // 3. (Fallback) 무작위 이동
        const emptyCells: { row: number, col: number }[] = [];
        for (let r = 0; r < this.BOARD_SIZE; r++) {
            for (let c = 0; c < this.BOARD_SIZE; c++) {
                if (this.board[r][c] === Player.Empty) {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }
        if (emptyCells.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        
        this.makeMove(row, col);
        return { row, col };
    }
}