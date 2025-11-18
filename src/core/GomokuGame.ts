// src/core/GomokuGame.ts (수정된 코드)

export enum Player {
    Empty = 0,
    Human = 1, // 흑돌 (선공)
    AI = 2     // 백돌
}

export enum GameState {
    Playing,
    HumanWin,
    AIWin,
    Draw
}

export class GomokuGame {
    private readonly BOARD_SIZE: number = 15;
    private readonly WIN_COUNT: number = 5;
    private board: Player[][];
    private currentPlayer: Player;
    private gameState: GameState;

    constructor() {
        this.board = [];
        this.currentPlayer = Player.Human;
        this.gameState = GameState.Playing;
        this.initializeBoard();
    }
    
    private initializeBoard(): void {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = new Array(this.BOARD_SIZE).fill(Player.Empty);
        }
    }
    
    public getBoardState(): Player[][] { return this.board; }
    public getCurrentPlayer(): Player { return this.currentPlayer; }
    public getGameState(): GameState { return this.gameState; }
    public getBoardSize(): number { return this.BOARD_SIZE; }

    public makeMove(row: number, col: number): boolean {
        if (this.gameState !== GameState.Playing || 
            row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE || 
            this.board[row][col] !== Player.Empty) {
            return false;
        }

        const playerToMove = this.currentPlayer;
        this.board[row][col] = playerToMove;

        if (this.checkWin(row, col, playerToMove)) {
            this.gameState = (playerToMove === Player.Human) ? GameState.HumanWin : GameState.AIWin;
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

    /**
     * 5목 승리 판정을 위해 돌을 놓은 위치를 포함하여 해당 선상의 연속된 돌의 총 개수를 계산합니다.
     */
    private checkWin(r: number, c: number, player: Player): boolean {
        // 4가지 주요 방향 (한쪽만 정의)
        const directions = [ [0, 1], [1, 0], [1, 1], [1, -1] ];

        for (const [dr, dc] of directions) {
            let count = 1; // 놓은 돌 포함

            // 1. 정방향 카운트 (예: 오른쪽, 아래, 우하향)
            for (let i = 1; i < this.WIN_COUNT; i++) {
                const nr = r + dr * i, nc = c + dc * i;
                if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
                count++;
            }

            // 2. 역방향 카운트 (예: 왼쪽, 위, 좌상향)
            for (let i = 1; i < this.WIN_COUNT; i++) {
                const nr = r - dr * i, nc = c - dc * i;
                if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
                count++;
            }
            
            // 총 연속된 돌의 개수가 5개 이상인지 확인
            if (count >= this.WIN_COUNT) return true;
        }
        return false;
    }

    public handleAIMove(): { row: number, col: number } | null {
        if (this.currentPlayer !== Player.AI || this.gameState !== GameState.Playing) return null;

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