import { GameManager, type GameState } from './game-manager';

class StartScreen {
  private startButton: HTMLButtonElement;
  private gridDisplay: HTMLDivElement;
  private gameStatus: HTMLDivElement;
  private gameManager: GameManager;

  constructor() {
    this.startButton = document.getElementById('startButton') as HTMLButtonElement;
    this.gridDisplay = document.getElementById('gridDisplay') as HTMLDivElement;
    this.gameStatus = document.getElementById('gameStatus') as HTMLDivElement;
    this.gameManager = new GameManager();
    
    console.log('Elements found:', {
      startButton: !!this.startButton,
      gridDisplay: !!this.gridDisplay,
      gameStatus: !!this.gameStatus
    });
    
    this.initializeEventListeners();
    this.updateDisplay();
  }

  private initializeEventListeners(): void {
    this.startButton.addEventListener('click', () => {
      this.handleStartClick();
    });
  }

  private handleStartClick(): void {
    console.log('START GAME button clicked');
    
    // Initialize a new game
    this.gameManager.initializeGame();
    console.log('Game initialized');
    
    // Update display
    this.updateDisplay();
    console.log('Display updated');
    
    // Game started - no need for instructions since NFC is already set up
    console.log('ゲーム開始！NFCタグをスキャンしてください。');
  }

  private updateDisplay(): void {
    const gameState = this.gameManager.getGameState();
    console.log('Game state:', gameState);
    
    if (gameState) {
      console.log('Rendering grid with game state');
      this.renderGrid(gameState);
      this.updateGameStatus(gameState);
      this.startButton.textContent = 'NEW GAME';
    } else {
      console.log('Rendering empty grid');
      this.renderEmptyGrid();
      this.gameStatus.textContent = 'ゲームを開始してください';
      this.startButton.textContent = 'START GAME';
    }
  }

  private renderGrid(gameState: GameState): void {
    this.gridDisplay.innerHTML = '';
    
    for (let row = 0; row < gameState.gridSize; row++) {
      for (let col = 0; col < gameState.gridSize; col++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = row.toString();
        cell.dataset.col = col.toString();
        
        // Check if this position was shot
        const wasShot = gameState.shots.some(shot => 
          shot.row === row && shot.col === col
        );
        
        if (wasShot) {
          // Check if it was a hit
          const wasHit = gameState.battleships.some(ship =>
            ship.positions.some(pos => pos.row === row && pos.col === col)
          );
          
          if (wasHit) {
            cell.classList.add('hit');
            cell.textContent = '💥';
          } else {
            cell.classList.add('miss');
            cell.textContent = '❌';
          }
        } else {
          cell.textContent = `${row + 1}${col + 1}`;
        }
        
        this.gridDisplay.appendChild(cell);
      }
    }
  }

  private renderEmptyGrid(): void {
    this.gridDisplay.innerHTML = '';
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.textContent = `${row + 1}${col + 1}`;
        this.gridDisplay.appendChild(cell);
      }
    }
  }

  private updateGameStatus(gameState: GameState): void {
    const shotsCount = gameState.shots.length;
    const sunkShips = gameState.battleships.filter(ship => ship.isSunk).length;
    const totalShips = gameState.battleships.length;
    
    if (gameState.victory) {
      this.gameStatus.textContent = `🎉 勝利！全${totalShips}隻の戦艦を撃沈！ (${shotsCount}発)`;
    } else {
      this.gameStatus.textContent = `発射: ${shotsCount}発 | 撃沈: ${sunkShips}/${totalShips}隻`;
    }
  }
}

// Initialize the start screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new StartScreen();
});
