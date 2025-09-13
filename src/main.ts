import { GameManager, type GameState } from './game-manager';

class StartScreen {
  private startButton: HTMLButtonElement;
  private gridDisplay: HTMLDivElement;
  private gameStatus: HTMLDivElement;
  private gameManager: GameManager;
  private resultModal: HTMLDivElement;
  private resultIcon: HTMLDivElement;
  private resultTitle: HTMLHeadingElement;
  private resultMessage: HTMLParagraphElement;
  private continueButton: HTMLButtonElement;

  constructor() {
    this.startButton = document.getElementById('startButton') as HTMLButtonElement;
    this.gridDisplay = document.getElementById('gridDisplay') as HTMLDivElement;
    this.gameStatus = document.getElementById('gameStatus') as HTMLDivElement;
    this.resultModal = document.getElementById('resultModal') as HTMLDivElement;
    this.resultIcon = document.getElementById('resultIcon') as HTMLDivElement;
    this.resultTitle = document.getElementById('resultTitle') as HTMLHeadingElement;
    this.resultMessage = document.getElementById('resultMessage') as HTMLParagraphElement;
    this.continueButton = document.getElementById('continueButton') as HTMLButtonElement;
    this.gameManager = new GameManager();
    
    console.log('Elements found:', {
      startButton: !!this.startButton,
      gridDisplay: !!this.gridDisplay,
      gameStatus: !!this.gameStatus,
      resultModal: !!this.resultModal
    });
    
    this.initializeEventListeners();
    this.updateDisplay();
    this.checkForNfcResult();
  }

  private initializeEventListeners(): void {
    this.startButton.addEventListener('click', () => {
      this.handleStartClick();
    });
    
    this.continueButton.addEventListener('click', () => {
      this.hideResultModal();
    });
    
    // テスト用ボタン
    const testButton = document.getElementById('testModalButton');
    if (testButton) {
      testButton.addEventListener('click', () => {
        console.log('Test modal button clicked');
        this.showHitModal(false);
      });
    }
  }

  private handleStartClick(): void {
    console.log('START GAME button clicked');
    
    // Initialize a new game
    this.gameManager.initializeGame();
    console.log('Game initialized');
    
    // Update display
    this.updateDisplay();
    console.log('Display updated');
    
    // Show alert for mobile debugging
    alert('ゲーム開始！NFCタグをスキャンしてください。');
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

  private checkForNfcResult(): void {
    // URLパラメータからNFCスキャン結果をチェック
    const urlParams = new URLSearchParams(window.location.search);
    const hid = urlParams.get('hid');
    
    console.log('Checking for NFC result, URL:', window.location.href);
    console.log('URL params:', urlParams.toString());
    console.log('HID found:', hid);
    
    if (hid) {
      console.log('NFC scan detected, HID:', hid);
      this.processNfcScan(hid);
    } else {
      console.log('No HID parameter found');
    }
  }

  private processNfcScan(hid: string): void {
    const position = this.gameManager.hidToPosition(hid);
    if (!position) {
      console.error('Invalid HID format:', hid);
      return;
    }

    try {
      const result = this.gameManager.processShot(position);
      this.showResult(result, position);
    } catch (error) {
      console.error('Error processing shot:', error);
    }
  }

  private showResult(result: { hit: boolean; sunk: boolean; gameOver: boolean; victory: boolean }, position: { row: number; col: number }): void {
    if (result.victory) {
      this.showVictoryModal();
    } else if (result.hit) {
      this.showHitModal(result.sunk);
    } else {
      this.showMissModal();
    }
    
    // グリッドを更新
    this.updateDisplay();
  }

  private showHitModal(sunk: boolean): void {
    console.log('Showing hit modal, sunk:', sunk);
    this.resultIcon.textContent = '💥';
    this.resultTitle.textContent = 'HIT!';
    this.resultMessage.textContent = sunk ? '戦艦を撃沈しました！' : '戦艦に命中！';
    this.resultModal.classList.remove('hidden');
    console.log('Hit modal should be visible now');
  }

  private showMissModal(): void {
    this.resultIcon.textContent = '❌';
    this.resultTitle.textContent = 'MISS!';
    this.resultMessage.textContent = '外れました。もう一度挑戦してください！';
    this.resultModal.classList.remove('hidden');
  }

  private showVictoryModal(): void {
    this.resultIcon.textContent = '🎉';
    this.resultTitle.textContent = 'VICTORY!';
    this.resultMessage.textContent = '全戦艦を撃沈！おめでとうございます！';
    this.continueButton.textContent = 'NEW GAME';
    this.resultModal.classList.remove('hidden');
  }

  private hideResultModal(): void {
    this.resultModal.classList.add('hidden');
    
    // 勝利の場合は新しいゲームを開始
    if (this.resultTitle.textContent === 'VICTORY!') {
      this.gameManager.clearGameState();
      this.updateDisplay();
    }
  }
}

// Initialize the start screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new StartScreen();
});
