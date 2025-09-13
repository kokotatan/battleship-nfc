import { GameManager } from './game-manager';

class HitScreen {
  private retryButton: HTMLButtonElement;
  private gameManager: GameManager;

  constructor() {
    this.retryButton = document.getElementById('retryButton') as HTMLButtonElement;
    this.gameManager = new GameManager();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.retryButton.addEventListener('click', () => {
      this.handleRetryClick();
    });
  }

  private handleRetryClick(): void {
    // Clear the current game state and start a new game
    this.gameManager.clearGameState();
    
    // Redirect to start screen
    window.location.href = '/';
  }
}

// Initialize the hit screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HitScreen();
});
