import { GameManager } from './game-manager';

class VictoryScreen {
  private newGameButton: HTMLButtonElement;
  private gameManager: GameManager;

  constructor() {
    this.newGameButton = document.getElementById('newGameButton') as HTMLButtonElement;
    this.gameManager = new GameManager();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.newGameButton.addEventListener('click', () => {
      this.handleNewGameClick();
    });
  }

  private handleNewGameClick(): void {
    // Clear the current game state and start a new game
    this.gameManager.clearGameState();
    
    // Redirect to start screen
    window.location.href = '/';
  }
}

// Initialize the victory screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VictoryScreen();
});
