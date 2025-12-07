// src/core/GomokuGame.ts
/**
 * 오목 게임 핵심 로직 클래스
 *
 * 게임 상태, 보드 관리, 승리 판정, AI 로직 등을 포함합니다.
 */

export enum Player {
  Empty = 0,
  Human = 1,
  AI = 2,
}

export enum GameState {
  Playing,
  HumanWin,
  AIWin,
  Draw,
}

export enum GameMode {
  HvAI = 'HvAI', // 인간 vs AI
  HvH = 'HvH',   // 인간 vs 인간
  AIvsAI = 'AIvsAI', // AI vs AI (관전)
  Challenge = 'Challenge', // 묘수 풀이
}

export enum Difficulty {
  Easy = 'Easy',     // 무작위 + 단순 방어
  Medium = 'Medium', // Minimax Depth 2
  Hard = 'Hard',     // Minimax Depth 4
}

export interface AIStrategy {
  offenseWeight: number; // 공격 가중치
  defenseWeight: number; // 방어 가중치
  randomness: number;    // 실수 확률
}

export class GomokuGame {
  private BOARD_SIZE: number = 15;
  private readonly WIN_COUNT: number = 5;
  private board: Player[][];
  private currentPlayer: Player;
  private gameState: GameState;
  private gameMode: GameMode = GameMode.HvAI; // 기본 모드는 AI 대전
  private difficulty: Difficulty = Difficulty.Easy; // 기본 난이도
  private aiStrategy: AIStrategy = { offenseWeight: 1.0, defenseWeight: 1.0, randomness: 0.1 }; // 기본 전략

  private lastMove: { row: number; col: number } | null = null;
  private winLine: { row: number; col: number }[] | null = null;
  private history: { board: Player[][]; player: Player }[] = [];
  private moveHistory: { row: number; col: number; player: Player }[] = []; // 착수 기록 (Replay용)

  constructor() {
    this.board = [];
    this.currentPlayer = Player.Human;
    this.gameState = GameState.Playing;
    this.initializeBoard();
  }

  public setBoardSize(size: number): void {
    this.BOARD_SIZE = size;
    this.initializeBoard();
  }

  // --- Getter 함수 ---
  public getBoardState(): Player[][] {
    return this.board;
  }
  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }
  public getGameState(): GameState {
    return this.gameState;
  }
  public getBoardSize(): number {
    return this.BOARD_SIZE;
  }
  public getLastMove(): { row: number; col: number } | null {
    return this.lastMove;
  }
  public getWinLine(): { row: number; col: number }[] | null {
    return this.winLine;
  }
  public getGameMode(): GameMode {
    return this.gameMode;
  }
  public getMoveHistory(): { row: number; col: number; player: Player }[] {
    return this.moveHistory;
  }

  public setGameMode(mode: GameMode): void {
    this.gameMode = mode;
    this.initializeBoard(); // 모드 변경 시 게임 리셋
  }

  public setDifficulty(diff: Difficulty): void {
    this.difficulty = diff;
  }

  public setAIStrategy(strategy: AIStrategy): void {
    this.aiStrategy = strategy;
  }

  /**
   * 보드를 초기화하고 게임 상태를 리셋합니다.
   */
  private initializeBoard(): void {
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      this.board[i] = new Array(this.BOARD_SIZE).fill(Player.Empty);
    }
    this.history = [];
    this.moveHistory = [];
    this.lastMove = null;
    this.winLine = null;
  }

  public setupChallenge(stones: { row: number; col: number; player: Player }[]): void {
    this.initializeBoard();
    this.gameMode = GameMode.Challenge;

    for (const stone of stones) {
      if (stone.row >= 0 && stone.row < this.BOARD_SIZE && stone.col >= 0 && stone.col < this.BOARD_SIZE) {
        this.board[stone.row][stone.col] = stone.player;
      }
    }
    this.currentPlayer = Player.Human; // Challenge always starts with Human (solve for win)
  }

  public setHandicap(count: number): void {
    this.initializeBoard();


    const center = Math.floor(this.BOARD_SIZE / 2);
    if (count === 1) {
      this.board[center][center] = Player.Human;
    } else {
      // 간단하게 랜덤이나 지정된 위치에 배치 (여기선 중앙 및 화점)
      // 로직 단순화: 중앙부터 배치
      this.board[center][center] = Player.Human;
      // 추가 구현 필요 시 확장
    }

    // 핸디캡이 있으면 백(AI)부터 시작
    this.currentPlayer = Player.AI;
  }

  // --- 히스토리 및 Undo ---
  /**
   * 현재 보드 상태를 히스토리에 저장합니다.
   */
  private saveHistory(): void {
    const currentBoardCopy = this.board.map((row) => [...row]);
    this.history.push({
      board: currentBoardCopy,
      player: this.currentPlayer,
    });
  }

  /**
   * 이전 수로 되돌립니다 (Undo).
   * @returns 성공 여부
   */
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
      this.moveHistory.pop(); // Undo 시 착수 기록도 제거
      return true;
    }
    return false;
  }

  // --- 돌 놓기 ---
  /**
   * 플레이어가 특정 위치에 돌을 놓습니다.
   * @param row 행 인덱스
   * @param col 열 인덱스
   * @returns 착수 성공 여부
   */
  public makeMove(row: number, col: number): boolean {
    if (
      this.gameState !== GameState.Playing ||
      row < 0 ||
      row >= this.BOARD_SIZE ||
      col < 0 ||
      col >= this.BOARD_SIZE ||
      this.board[row][col] !== Player.Empty
    ) {
      return false;
    }

    // 렌주룰: 흑돌(Player 1) 금지수 확인
    // 3-3, 4-4, 6목 이상 금지
    if (this.currentPlayer === Player.Human) {
      if (this.checkForbiddenMove(row, col, this.currentPlayer)) {
        console.log(`금지수입니다: ${row}, ${col}`);
        return false; // 금지수이면 착수 불가
      }
    }

    this.saveHistory();

    const playerToMove = this.currentPlayer;
    this.board[row][col] = playerToMove;
    this.moveHistory.push({ row, col, player: playerToMove }); // 착수 기록 저장

    this.lastMove = { row, col };

    const line = this.checkWinAndGetLine(row, col, playerToMove);

    if (line) {
      this.gameState = playerToMove === Player.Human ? GameState.HumanWin : GameState.AIWin;
      this.winLine = line;
    } else if (this.isBoardFull()) {
      this.gameState = GameState.Draw;
    } else {
      this.switchTurn();
    }
    return true;
  }

  /**
   * 턴을 넘깁니다.
   */
  private switchTurn(): void {
    this.currentPlayer = this.currentPlayer === Player.Human ? Player.AI : Player.Human;
  }

  /**
   * 보드가 가득 찼는지 확인합니다.
   */
  private isBoardFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== Player.Empty));
  }

  // --- 승리 판정 (승리 선 좌표 반환) ---
  /**
   * 승리 여부를 확인하고 승리 라인을 반환합니다.
   */
  private checkWinAndGetLine(
    r: number,
    c: number,
    player: Player
  ): { row: number; col: number }[] | null {
    const directions = [
      [0, 1], // 가로 (우측)
      [1, 0], // 세로 (하단)
      [1, 1], // 대각선 (우하향)
      [1, -1], // 대각선 (좌하향)
    ];

    for (const [dr, dc] of directions) {
      const line: { row: number; col: number }[] = [{ row: r, col: c }];

      // 정방향 카운트 + 좌표 저장
      for (let i = 1; i < this.WIN_COUNT; i++) {
        const nr = r + dr * i,
          nc = c + dc * i;
        if (
          nr < 0 ||
          nr >= this.BOARD_SIZE ||
          nc < 0 ||
          nc >= this.BOARD_SIZE ||
          this.board[nr][nc] !== player
        )
          break;
        line.push({ row: nr, col: nc });
      }

      // 역방향 카운트 + 좌표 저장
      for (let i = 1; i < this.WIN_COUNT; i++) {
        const nr = r - dr * i,
          nc = c - dc * i;
        if (
          nr < 0 ||
          nr >= this.BOARD_SIZE ||
          nc < 0 ||
          nc >= this.BOARD_SIZE ||
          this.board[nr][nc] !== player
        )
          break;
        line.push({ row: nr, col: nc });
      }

      if (line.length >= this.WIN_COUNT) {
        return line;
      }
    }
    return null;
  }

  // --- 🤖 AI 로직 (방어/공격) ---
  /**
   * AI가 승리할 수 있는 수 또는 막아야 할 수를 찾습니다.
   * 모든 빈 칸에 대해 시뮬레이션을 수행하여 승리 조건을 만족하는지 확인합니다.
   * @param playerToCheck 승리 여부를 확인할 플레이어 (AI 또는 Human)
   * @returns 승리/방어 좌표 또는 null
   */
  private findWinningMove(playerToCheck: Player): { row: number; col: number } | null {
    for (let r = 0; r < this.BOARD_SIZE; r++) {
      for (let c = 0; c < this.BOARD_SIZE; c++) {
        // 빈 칸인 경우에만 시뮬레이션
        if (this.board[r][c] === Player.Empty) {
          // 가상의 수를 둠
          this.board[r][c] = playerToCheck;

          // 승리 조건 만족 시 해당 좌표 반환
          if (this.checkWinAndGetLine(r, c, playerToCheck)) {
            this.board[r][c] = Player.Empty; // 원상복구
            return { row: r, col: c };
          }

          // 원상복구
          this.board[r][c] = Player.Empty;
        }
      }
    }
    return null;
  }

  /**
   * AI의 턴을 처리합니다.
   */
  public handleAIMove(): { row: number; col: number } | null {
    // 게임 중이 아니면 리턴
    if (this.gameState !== GameState.Playing) return null;

    // AI vs AI 모드가 아니고, HvAI 모드인데 Human 차례라면 리턴 (Human 차례엔 AI 안둠)
    if (this.gameMode !== GameMode.AIvsAI) {
      if (this.gameMode === GameMode.HvH) return null; // HvH는 AI 절대 안둠
      if (this.currentPlayer !== Player.AI) return null; // HvAI에서 Human 차례
    }
    // AIvsAI 모드면 누구 차례든 AI가 둠 (Player 1도 AI, Player 2도 AI 취급)

    // 1. AI의 즉각적인 승리 시도 (공격)
    // 현재 플레이어 기준 승리 수 탐색
    const aiWinMove = this.findWinningMove(this.currentPlayer);
    if (aiWinMove) {
      this.makeMove(aiWinMove.row, aiWinMove.col);
      return aiWinMove;
    }


    // 2. 상대방의 승리 방어
    // 상대 플레이어 결정
    // 주의: AIvsAI 모드에서는 둘 다 시스템상 'Player.Human', 'Player.AI' enum 값을 번갈아 쓰지만
    // 로직상 currentPlayer가 두는 주체. opponent는 반대.
    // GomokuGame에서는 currentPlayer가 1, 2로 바뀌므로 그냥 반대값 찾으면 됨.
    const actualOpponent = this.currentPlayer === Player.Human ? Player.AI : Player.Human;

    const humanWinMove = this.findWinningMove(actualOpponent);
    if (humanWinMove) {
      this.makeMove(humanWinMove.row, humanWinMove.col);
      return humanWinMove;
    }

    // 3. (Fallback) 무작위 이동
    // Minimax 적용 (Medium/Hard)
    // Randomness 적용: 일정 확률로 실수 (최적의 수가 아닌 차선의 수 또는 랜덤)
    if (Math.random() < this.aiStrategy.randomness && this.difficulty !== Difficulty.Hard) {
      // 실수 시뮬레이션: 무작위 빈 칸 반환 (치명적이지 않은 곳으로 하면 좋겠지만 일단 완전 랜덤)
      // ... (코드는 그대로 두고 아래 로직으로 넘어감)
    } else if (this.difficulty !== Difficulty.Easy) {
      // Hard mode: Depth 4 is good, but maybe too slow in JS?
      // Let's keep depth 4 but optimize or ensure offense weight is high.
      const depth = this.difficulty === Difficulty.Medium ? 2 : 4;
      const bestMove = this.getBestMoveMinimax(depth);
      if (bestMove) {
        this.makeMove(bestMove.row, bestMove.col);
        return bestMove;
      }
    }

    // Easy 모드 또는 Minimax 실패 시 기존 로직 (Random)
    const emptyCells: { row: number; col: number }[] = [];
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

  // --- Minimax Implementation ---

  private getBestMoveMinimax(depth: number): { row: number; col: number } | null {
    const candidates = this.getCandidateMoves();
    if (candidates.length === 0) {
      const center = Math.floor(this.BOARD_SIZE / 2);
      return { row: center, col: center };
    }

    let bestMove = null;
    let maxEval = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const move of candidates) {
      this.board[move.row][move.col] = Player.AI;
      const evalScore = this.minimax(depth - 1, alpha, beta, false);
      this.board[move.row][move.col] = Player.Empty;

      if (evalScore > maxEval) {
        maxEval = evalScore;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalScore);
    }

    return bestMove;
  }

  private minimax(depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0) {
      return this.evaluateBoard();
    }

    const currentScore = this.evaluateBoard();
    if (Math.abs(currentScore) >= 10000) return currentScore;

    const candidates = this.getCandidateMoves();
    if (candidates.length === 0) return currentScore;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of candidates) {
        this.board[move.row][move.col] = Player.AI;
        const evalScore = this.minimax(depth - 1, alpha, beta, false);
        this.board[move.row][move.col] = Player.Empty;

        // 공격 가중치 적용 (AI 턴이므로 자신의 이득)
        const weightedScore = evalScore * (evalScore > 0 ? this.aiStrategy.offenseWeight : 1);

        maxEval = Math.max(maxEval, weightedScore);
        alpha = Math.max(alpha, weightedScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of candidates) {
        this.board[move.row][move.col] = Player.Human;
        const evalScore = this.minimax(depth - 1, alpha, beta, true);
        this.board[move.row][move.col] = Player.Empty;

        // 방어 가중치 적용 (상대 턴이므로 상대의 이득 = 나의 손해)
        // 상대가 좋은 점수를 내는 것을 막아야 함.
        // 여기서 점수는 AI 기준이므로, 상대에게 좋은 수는 음수(AI에게 나쁨)
        // 상대의 공격(음수)을 더 크게 인식하게 하려면 defenseWeight를 곱함?
        // evalScore는 AI 관점 점수. Human이 이기면 매우 작은 음수.
        // 방어적 성향 = Human의 이득(음수)을 더 *민감하게* 받아들임. 
        // 즉 음수일 때 가중치를 곱해서 더 작은 음수로 만듦 (더 피해야 할 상황으로 인식).

        const weightedScore = evalScore * (evalScore < 0 ? this.aiStrategy.defenseWeight : 1);

        minEval = Math.min(minEval, weightedScore);
        beta = Math.min(beta, weightedScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  /**
   * 탐색 범위를 줄이기 위해 기존 돌 주변의 빈 칸만 반환합니다.
   */
  private getCandidateMoves(): { row: number; col: number }[] {
    const candidates: { row: number; col: number }[] = [];
    const visited = new Set<string>();

    for (let r = 0; r < this.BOARD_SIZE; r++) {
      for (let c = 0; c < this.BOARD_SIZE; c++) {
        if (this.board[r][c] !== Player.Empty) {
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              if (dr === 0 && dc === 0) continue;

              const nr = r + dr;
              const nc = c + dc;

              if (
                nr >= 0 && nr < this.BOARD_SIZE &&
                nc >= 0 && nc < this.BOARD_SIZE &&
                this.board[nr][nc] === Player.Empty
              ) {
                const key = `${nr},${nc}`;
                if (!visited.has(key)) {
                  candidates.push({ row: nr, col: nc });
                  visited.add(key);
                }
              }
            }
          }
        }
      }
    }
    return candidates;
  }

  /**
   * 모든 빈 칸에 대한 휴리스틱 점수를 계산하여 반환합니다. (Heatmap용)
   */
  public getHeuristicMap(): number[][] {
    const map: number[][] = Array.from({ length: this.BOARD_SIZE }, () =>
      Array(this.BOARD_SIZE).fill(0)
    );

    for (let r = 0; r < this.BOARD_SIZE; r++) {
      for (let c = 0; c < this.BOARD_SIZE; c++) {
        if (this.board[r][c] === Player.Empty) {
          // 가상의 수를 두고 평가
          this.board[r][c] = Player.AI;
          const scoreAI = this.evaluateBoard();
          this.board[r][c] = Player.Empty;

          this.board[r][c] = Player.Human;
          const scoreHuman = this.evaluateBoard();
          this.board[r][c] = Player.Empty;

          // AI 공격 점수 + Human 방어 점수 (절대값)
          // AI 입장에서는 자신이 이기는 곳도 중요하고, 상대가 이기는 곳을 막는 것도 중요함
          map[r][c] = scoreAI - scoreHuman;
        }
      }
    }
    return map;
  }

  /**
   * 보드 상태를 평가하여 점수를 반환합니다.
   * AI(백돌)에게 유리하면 양수, 불리하면 음수를 반환합니다.
   */
  private evaluateBoard(): number {
    let score = 0;
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let r = 0; r < this.BOARD_SIZE; r++) {
      for (let c = 0; c < this.BOARD_SIZE; c++) {
        if (this.board[r][c] !== Player.Empty) {
          const player = this.board[r][c];
          const isAI = player === Player.AI;

          for (const [dr, dc] of directions) {
            score += this.evaluateDirection(r, c, dr, dc, player) * (isAI ? 1 : -1);
          }
        }
      }
    }
    return score;
  }

  private evaluateDirection(r: number, c: number, dr: number, dc: number, player: Player): number {
    // 이미 확인한 방향(역방향)은 건너뜀 (중복 방지)
    const prevR = r - dr;
    const prevC = c - dc;
    if (
      prevR >= 0 && prevR < this.BOARD_SIZE &&
      prevC >= 0 && prevC < this.BOARD_SIZE &&
      this.board[prevR][prevC] === player
    ) {
      return 0;
    }

    let count = 0;
    let openEnds = 0;

    // 현재 위치부터 연속된 돌 개수 확인
    let i = 0;
    while (true) {
      const nr = r + dr * i;
      const nc = c + dc * i;
      if (
        nr < 0 || nr >= this.BOARD_SIZE ||
        nc < 0 || nc >= this.BOARD_SIZE ||
        this.board[nr][nc] !== player
      ) {
        // 연속이 끊긴 지점 확인 (열린 끝인지)
        if (
          nr >= 0 && nr < this.BOARD_SIZE &&
          nc >= 0 && nc < this.BOARD_SIZE &&
          this.board[nr][nc] === Player.Empty
        ) {
          openEnds++;
        }
        break;
      }
      count++;
      i++;
    }

    // 시작점 이전이 열려있는지 확인
    if (
      prevR >= 0 && prevR < this.BOARD_SIZE &&
      prevC >= 0 && prevC < this.BOARD_SIZE &&
      this.board[prevR][prevC] === Player.Empty
    ) {
      openEnds++;
    }

    // 점수 부여
    if (count >= 5) return 100000; // 승리
    if (count === 4) {
      if (openEnds === 2) return 10000; // Open 4 (필승)
      if (openEnds === 1) return 1000;  // Closed 4 (위협)
    }
    if (count === 3) {
      if (openEnds === 2) return 1000;  // Open 3 (위협)
      if (openEnds === 1) return 100;
    }
    if (count === 2) {
      if (openEnds === 2) return 100;
      if (openEnds === 1) return 10;
    }
    return 0;
  }

  // --- ⚖️ 렌주룰 (Renju Rules) ---
  /**
   * 금지수 여부를 확인합니다. (흑돌만 해당)
   * 1. 3-3 금지
   * 2. 4-4 금지
   * 3. 6목 이상 금지 (Overline)
   */
  public checkForbiddenMove(r: number, c: number, player: Player): boolean {
    if (player !== Player.Human) return false; // 백돌은 금지수 없음

    // 가상의 착수
    this.board[r][c] = player;

    // 1. 6목 이상 확인 (Overline)
    if (this.checkOverline(r, c, player)) {
      this.board[r][c] = Player.Empty;
      return true;
    }

    // 2. 3-3 및 4-4 확인
    const threeCount = this.countOpenThrees(r, c, player);
    const fourCount = this.countFours(r, c, player);

    this.board[r][c] = Player.Empty; // 원상복구

    if (threeCount >= 2) return true; // 3-3 금지
    if (fourCount >= 2) return true;  // 4-4 금지

    return false;
  }

  private checkOverline(r: number, c: number, player: Player): boolean {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      let count = 1;
      // 정방향
      let i = 1;
      while (true) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
        count++;
        i++;
      }
      // 역방향
      i = 1;
      while (true) {
        const nr = r - dr * i, nc = c - dc * i;
        if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
        count++;
        i++;
      }
      if (count > 5) return true;
    }
    return false;
  }

  private countOpenThrees(r: number, c: number, player: Player): number {
    let count = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
      if (this.isOpenThree(r, c, dr, dc, player)) {
        count++;
      }
    }
    return count;
  }

  private isOpenThree(r: number, c: number, dr: number, dc: number, player: Player): boolean {
    // 간단한 Open 3 판별 로직 (완벽한 렌주룰은 더 복잡함)
    // 패턴: 01110 (양쪽이 비어있는 3)

    // 현재 방향으로 연속된 돌의 개수와 양쪽 끝 상태 확인
    let stoneCount = 1;
    let openEnds = 0;

    // 정방향 탐색
    let i = 1;
    while (true) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE) break;
      if (this.board[nr][nc] === player) stoneCount++;
      else if (this.board[nr][nc] === Player.Empty) { openEnds++; break; }
      else break; // 상대 돌
      i++;
    }

    // 역방향 탐색
    i = 1;
    while (true) {
      const nr = r - dr * i, nc = c - dc * i;
      if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE) break;
      if (this.board[nr][nc] === player) stoneCount++;
      else if (this.board[nr][nc] === Player.Empty) { openEnds++; break; }
      else break; // 상대 돌
      i++;
    }

    // 3개이고 양쪽이 열려있으면 Open 3
    // (주의: 010110 같은 '건너뛴 3' 패턴도 고려해야 하지만 여기선 단순화)
    return stoneCount === 3 && openEnds === 2;
  }

  private countFours(r: number, c: number, player: Player): number {
    let count = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
      if (this.isFour(r, c, dr, dc, player)) {
        count++;
      }
    }
    return count;
  }

  private isFour(r: number, c: number, dr: number, dc: number, player: Player): boolean {
    // 4목 판별 (Open 4 또는 Closed 4)
    // 패턴: 1111 (양쪽이나 한쪽이 막혀도 4는 4)

    let stoneCount = 1;

    // 정방향
    let i = 1;
    while (true) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
      stoneCount++;
      i++;
    }

    // 역방향
    i = 1;
    while (true) {
      const nr = r - dr * i, nc = c - dc * i;
      if (nr < 0 || nr >= this.BOARD_SIZE || nc < 0 || nc >= this.BOARD_SIZE || this.board[nr][nc] !== player) break;
      stoneCount++;
      i++;
    }

    return stoneCount === 4;
  }
}
