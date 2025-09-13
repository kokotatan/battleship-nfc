export interface GridPosition {
  row: number;
  col: number;
}

export interface Battleship {
  id: string;
  positions: GridPosition[];
  hits: GridPosition[];
  isSunk: boolean;
}

export interface GameState {
  gridSize: number;
  battleships: Battleship[];
  shots: GridPosition[];
  gameOver: boolean;
  victory: boolean;
}

export class GameManager {
  private readonly GAME_STATE_KEY = 'battleship_game_state';
  private readonly GRID_SIZE = 4;

  /**
   * Initialize a new game with random battleship placement
   */
  initializeGame(): void {
    const battleships = this.generateBattleships();
    const gameState: GameState = {
      gridSize: this.GRID_SIZE,
      battleships,
      shots: [],
      gameOver: false,
      victory: false
    };
    
    localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(gameState));
  }

  /**
   * Generate battleships for the 4x4 grid
   * @returns Array of battleships with their positions
   */
  private generateBattleships(): Battleship[] {
    const battleships: Battleship[] = [];
    
    // Place a 3-cell battleship (main ship)
    const mainShip = this.placeBattleship(3, battleships);
    if (mainShip) battleships.push(mainShip);
    
    // Place a 2-cell battleship
    const subShip = this.placeBattleship(2, battleships);
    if (subShip) battleships.push(subShip);
    
    return battleships;
  }

  /**
   * Place a battleship of given size on the grid
   * @param size Number of cells the battleship occupies
   * @param existingShips Already placed ships
   * @returns New battleship or null if placement failed
   */
  private placeBattleship(size: number, existingShips: Battleship[]): Battleship | null {
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const isHorizontal = Math.random() < 0.5;
      const startRow = Math.floor(Math.random() * this.GRID_SIZE);
      const startCol = Math.floor(Math.random() * this.GRID_SIZE);
      
      const positions: GridPosition[] = [];
      
      // Check if battleship fits in the chosen direction
      for (let i = 0; i < size; i++) {
        const row = isHorizontal ? startRow : startRow + i;
        const col = isHorizontal ? startCol + i : startCol;
        
        if (row >= this.GRID_SIZE || col >= this.GRID_SIZE) {
          break; // Doesn't fit, try again
        }
        
        positions.push({ row, col });
      }
      
      if (positions.length === size) {
        // Check for overlaps with existing ships
        const hasOverlap = positions.some(pos => 
          existingShips.some(ship => 
            ship.positions.some(shipPos => 
              shipPos.row === pos.row && shipPos.col === pos.col
            )
          )
        );
        
        if (!hasOverlap) {
          return {
            id: `ship_${size}_${attempt}`,
            positions,
            hits: [],
            isSunk: false
          };
        }
      }
    }
    
    return null; // Failed to place battleship
  }

  /**
   * Get current game state
   * @returns Current game state or null if not found
   */
  getGameState(): GameState | null {
    const stateStr = localStorage.getItem(this.GAME_STATE_KEY);
    return stateStr ? JSON.parse(stateStr) : null;
  }

  /**
   * Update game state in localStorage
   * @param state Game state to store
   */
  private updateGameState(state: GameState): void {
    localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(state));
  }

  /**
   * Process a shot at the given position
   * @param position Grid position to shoot at
   * @returns Object with hit status and updated game state
   */
  processShot(position: GridPosition): { hit: boolean; sunk: boolean; gameOver: boolean; victory: boolean } {
    const gameState = this.getGameState();
    if (!gameState) {
      throw new Error('No game state found. Please start a new game.');
    }

    // Check if position was already shot
    const alreadyShot = gameState.shots.some(shot => 
      shot.row === position.row && shot.col === position.col
    );

    if (alreadyShot) {
      return { hit: false, sunk: false, gameOver: gameState.gameOver, victory: gameState.victory };
    }

    // Add shot to shots array
    gameState.shots.push(position);

    // Check for hits
    let hit = false;
    let sunk = false;

    for (const ship of gameState.battleships) {
      const shipHit = ship.positions.some(shipPos => 
        shipPos.row === position.row && shipPos.col === position.col
      );

      if (shipHit) {
        hit = true;
        ship.hits.push(position);
        
        // Check if ship is sunk
        if (ship.hits.length === ship.positions.length) {
          ship.isSunk = true;
          sunk = true;
        }
        break;
      }
    }

    // Check for victory (all ships sunk)
    const allShipsSunk = gameState.battleships.every(ship => ship.isSunk);
    if (allShipsSunk) {
      gameState.gameOver = true;
      gameState.victory = true;
    }

    // Update game state
    this.updateGameState(gameState);

    return {
      hit,
      sunk,
      gameOver: gameState.gameOver,
      victory: gameState.victory
    };
  }

  /**
   * Convert HID to grid position
   * @param hid The HID from NFC tag
   * @returns Grid position or null if invalid
   */
  hidToPosition(hid: string): GridPosition | null {
    // HID format: "RC" where R is row (1-4) and C is col (1-4)
    // Example: "12" = row 1, col 2
    if (hid.length !== 2) return null;
    
    const row = parseInt(hid[0]) - 1; // Convert to 0-based
    const col = parseInt(hid[1]) - 1; // Convert to 0-based
    
    if (row < 0 || row >= this.GRID_SIZE || col < 0 || col >= this.GRID_SIZE) {
      return null;
    }
    
    return { row, col };
  }

  /**
   * Get HID from URL parameters
   * @returns The HID from URL or null if not found
   */
  getHidFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('hid');
  }

  /**
   * Process NFC scan result
   * @returns The result page URL
   */
  processNfcScan(): string {
    const scannedHid = this.getHidFromUrl();
    
    if (!scannedHid) {
      console.error('No HID found in URL parameters');
      return '/';
    }

    const position = this.hidToPosition(scannedHid);
    if (!position) {
      console.error('Invalid HID format');
      return '/';
    }

    try {
      const result = this.processShot(position);
      
      if (result.victory) {
        return '/victory.html';
      } else if (result.hit) {
        return '/hit.html';
      } else {
        return '/miss.html';
      }
    } catch (error) {
      console.error('Error processing shot:', error);
      return '/';
    }
  }

  /**
   * Clear the game state
   */
  clearGameState(): void {
    localStorage.removeItem(this.GAME_STATE_KEY);
  }
}
