import { GameManager } from './game-manager';

class NfcHandler {
  private gameManager: GameManager;

  constructor() {
    this.gameManager = new GameManager();
    this.processNfcScan();
  }

  private processNfcScan(): void {
    // Process the NFC scan and get the result URL
    const resultUrl = this.gameManager.processNfcScan();
    
    // Add a small delay for better UX
    setTimeout(() => {
      window.location.href = resultUrl;
    }, 1500);
  }

}

// Initialize the NFC handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NfcHandler();
});
