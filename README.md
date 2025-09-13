# BATTLESHIP NFC GAME

A static web-based mini game that uses NFC tags to create an interactive battleship experience. Players scan NFC tags to try to hit the hidden battleship.

## Features

- **NFC Integration**: Uses URL parameters to process NFC tag scans
- **Full Viewport Images**: Designed to work with pre-generated screen images
- **Minimal UI**: Only essential buttons for game interaction
- **Static Hosting**: Optimized for GitHub Pages deployment
- **Mobile Optimized**: Designed for iPhone Safari

## Game Flow

1. Player clicks "START GAME" button
2. System generates a 4×4 grid with randomly placed battleships:
   - 1 battleship (3 cells)
   - 1 battleship (2 cells)
3. Player scans NFC tags that open `/h/?hid=RC` (R=row 1-4, C=col 1-4)
4. System processes the shot and updates the grid display
5. Player sees "HIT", "MISS", or "VICTORY" screen
6. Game continues until all battleships are sunk

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Deployment

### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder contains the static files
3. Deploy the contents of `dist` to your GitHub Pages repository
4. The app will be available at `https://USERNAME.github.io/battleship-nfc/`

### Image Assets

Place your final screen images in the `/public/` directory:
- `start-screen.jpg` - Start screen image
- `hit-screen.jpg` - Hit result screen image  
- `miss-screen.jpg` - Miss result screen image
- `victory-screen.jpg` - Victory screen image
- `processing-screen.jpg` - NFC processing screen image

## NFC Tag Configuration

### Required NFC Tags: 16 tags (4×4 grid)

Configure your NFC tags to open URLs in the format:
```
https://battleship-nfc.kotaro-design-lab.com/h/?hid=RC
```

Where `RC` is the grid position:
- `R` = Row (1-4)
- `C` = Column (1-4)

### Example NFC Tag URLs:
```
https://battleship-nfc.kotaro-design-lab.com/h/?hid=11  (Row 1, Col 1)
https://battleship-nfc.kotaro-design-lab.com/h/?hid=12  (Row 1, Col 2)
https://battleship-nfc.kotaro-design-lab.com/h/?hid=13  (Row 1, Col 3)
https://battleship-nfc.kotaro-design-lab.com/h/?hid=14  (Row 1, Col 4)
https://battleship-nfc.kotaro-design-lab.com/h/?hid=21  (Row 2, Col 1)
...and so on for all 16 positions
```

## Technical Details

- **Framework**: Vite + TypeScript (no React)
- **Styling**: Pure CSS with full viewport image display
- **State Management**: localStorage for game state
- **Build Target**: Static files optimized for GitHub Pages
- **Base Path**: `/battleship-nfc/` for GitHub Pages compatibility

## File Structure

```
battleship-nfc/
├── public/                 # Static assets (images)
├── src/
│   ├── game-manager.ts    # Core game logic
│   ├── main.ts           # Start screen logic
│   ├── hit.ts            # Hit screen logic
│   ├── miss.ts           # Miss screen logic
│   ├── nfc-handler.ts    # NFC scan processing
│   └── styles.css        # Global styles
├── h/
│   └── index.html        # NFC handler page
├── index.html            # Start page
├── hit.html              # Hit result page
├── miss.html             # Miss result page
├── victory.html          # Victory page
└── vite.config.ts        # Vite configuration
```
