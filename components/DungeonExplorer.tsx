import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import '../styles/DungeonExplorer.css';

enum GameState {
    Playing,
    Won,
    Lost,
    AwaitingAI
}

const levels = [
    // Level 6: Complex Puzzle
    [
        "###########",
        "#P..b.s.t#",
        "#.#.#.#.d.#",
        "#s..b...k.#",
        "#.d...#T#.#",
        "#.....#.#E#",
        "#.T...#####",
        "###########"
    ]
];

const TILE_SIZE = 40;

const drawSprite = (ctx: CanvasRenderingContext2D, char: string, x: number, y: number, frame: number) => {
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;

    ctx.fillStyle = '#4a5568';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = '#2d3748';
    ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

    switch (char) {
        case '#': ctx.fillStyle = '#2d3748'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
        case 'P':
            const bob = Math.sin(frame * 0.1) * 2;
            ctx.fillStyle = '#4299e1';
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2 + bob, TILE_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'E': ctx.fillStyle = '#48bb78'; ctx.fillRect(px + 10, py + 10, TILE_SIZE - 20, TILE_SIZE - 20); break;
        case 'k':
            const keyBob = Math.sin(frame * 0.05) * 3;
            ctx.fillStyle = '#f6e05e';
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2 + keyBob, TILE_SIZE / 4, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'd': ctx.fillStyle = '#f56565'; ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8); break;
        case 'D': ctx.fillStyle = '#a0aec0'; ctx.fillRect(px + 15, py, TILE_SIZE - 30, TILE_SIZE); break;
        case 'b': ctx.fillStyle = '#a0aec0'; ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16); break;
        case 's':
            ctx.fillStyle = '#718096';
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 't':
            ctx.fillStyle = '#e53e3e';
            ctx.beginPath();
            ctx.moveTo(px + TILE_SIZE/2, py + 10);
            ctx.lineTo(px + 10, py + TILE_SIZE - 10);
            ctx.lineTo(px + TILE_SIZE - 10, py + TILE_SIZE - 10);
            ctx.closePath();
            ctx.fill();
            break;
        case 'T':
            const pulse = Math.abs(Math.sin(frame * 0.05)) * 10;
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 2.5 - pulse / 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#9f7aea';
            ctx.lineWidth = 2 + pulse / 4;
            ctx.stroke();
            break;
    }
};

const getNextState = (currentGrid: string[][], currentKeys: number, move: { dx: number, dy: number }, levelData: string[]) => {
    const newGrid = currentGrid.map(r => [...r]);
    let playerPos = { x: -1, y: -1 };
    for (let y = 0; y < newGrid.length; y++) {
        for (let x = 0; x < newGrid[y].length; x++) {
            if (newGrid[y][x] === 'P') { playerPos = { x, y }; break; }
        }
    }
    if (playerPos.x === -1) return { grid: currentGrid, keys: currentKeys, gameState: GameState.Lost, sound: null };

    const { dx, dy } = move;
    const newPos = { x: playerPos.x + dx, y: playerPos.y + dy };

    if (newPos.y < 0 || newPos.y >= newGrid.length || newPos.x < 0 || newPos.x >= newGrid[0].length) return { grid: currentGrid, keys: currentKeys, gameState: GameState.Playing, sound: null };

    const targetCell = newGrid[newPos.y][newPos.x];

    if (targetCell === '#') return { grid: currentGrid, keys: currentKeys, gameState: GameState.Playing, sound: null };
    if (targetCell === 'd' && currentKeys < 1) return { grid: currentGrid, keys: currentKeys, gameState: GameState.Playing, sound: null };
    
    if (targetCell === 'b') {
        const afterBlockPos = { x: newPos.x + dx, y: newPos.y + dy };
        if (afterBlockPos.y < 0 || afterBlockPos.y >= newGrid.length || afterBlockPos.x < 0 || afterBlockPos.x >= newGrid[0].length) return { grid: currentGrid, keys: currentKeys, gameState: GameState.Playing, sound: null };
        const afterBlockCell = newGrid[afterBlockPos.y][afterBlockPos.x];
        if (['.', 's', 't'].includes(afterBlockCell)) {
            newGrid[afterBlockPos.y][afterBlockPos.x] = 'b';
        } else {
            return { grid: currentGrid, keys: currentKeys, gameState: GameState.Playing, sound: null };
        }
    }

    newGrid[playerPos.y][playerPos.x] = '.';
    
    let finalPlayerPos = { ...newPos };
    let newKeysValue = currentKeys;
    let soundToPlay: string | null = 'move';
    let newGameStateValue = GameState.Playing;
    
    if (targetCell === 'k') { newKeysValue++; soundToPlay = 'key'; }
    if (targetCell === 'd' && currentKeys > 0) { newKeysValue--; }
    if (targetCell === 'E') { newGameStateValue = GameState.Won; soundToPlay = 'win'; }
    if (targetCell === 't') {
        soundToPlay = 'trap';
        let startPos = {x:-1, y:-1};
        levelData.forEach((row, y) => row.split('').forEach((char, x) => { if (char === 'P') startPos = {x,y}; }));
        finalPlayerPos = startPos;
    }
    if (targetCell === 'T') {
        soundToPlay = 'teleport';
        let otherT = { x: -1, y: -1 };
        newGrid.forEach((row, y) => row.forEach((cell, x) => {
            if (cell === 'T' && (x !== newPos.x || y !== newPos.y)) { otherT = { x, y }; }
        }));
        if (otherT.x !== -1) finalPlayerPos = otherT;
    }
    
    newGrid[finalPlayerPos.y][finalPlayerPos.x] = 'P';
    
    let aBlockIsOnASwitch = false;
    levelData.forEach((row, y) => row.split('').forEach((char, x) => {
        if(char === 's' && newGrid[y][x] === 'b') { aBlockIsOnASwitch = true; }
    }));
    levelData.forEach((row, y) => row.split('').forEach((char, x) => {
        if(char === 'd') { newGrid[y][x] = aBlockIsOnASwitch ? 'D' : 'd'; }
    }));

    return { grid: newGrid, keys: newKeysValue, gameState: newGameStateValue, sound: soundToPlay };
};

const DungeonExplorer: React.FC = () => {
    const [levelIndex, setLevelIndex] = useState(0);
    const [grid, setGrid] = useState<string[][]>([]);
    const [gameState, setGameState] = useState(GameState.Playing);
    const [keys, setKeys] = useState(0);
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiStatus, setAiStatus] = useState('Idle');
    const [lastAiMove, setLastAiMove] = useState<string | null>(null);
    const soundsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

    const aiController = useRef<GoogleGenAI | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const moves = useRef(0);
    const animationFrameId = useRef<number | null>(null);
    const frameCount = useRef(0);
    
    const initLevel = useCallback(() => {
        const levelData = levels[levelIndex].map(row => row.split(''));
        setGrid(levelData);
        setKeys(0);
        setGameState(GameState.Playing);
        moves.current = 0;
        setAiStatus('Idle');
        setLastAiMove(null);
    }, [levelIndex]);

    useEffect(() => {
        const preloadDungeonExplorerSounds = () => {
            const sounds = soundsRef.current;
            if (Object.keys(sounds).length === 0) { // Only load once
                sounds.move = new Audio("https://cdn.freesound.org/previews/403/403017_5121236-lq.mp3");
                sounds.key = new Audio("https://cdn.freesound.org/previews/442/442598_5121236-lq.mp3");
                sounds.win = new Audio("https://cdn.freesound.org/previews/391/391539_5121236-lq.mp3");
                sounds.trap = new Audio("https://cdn.freesound.org/previews/253/253174_4368942-lq.mp3");
                sounds.teleport = new Audio("https://cdn.freesound.org/previews/399/399303_5121236-lq.mp3");
                Object.values(sounds).forEach(sound => { sound.volume = 0.3; });
            }
        };
        preloadDungeonExplorerSounds();
        initLevel();
        if (!aiController.current) {
            try {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("API key not configured");
                aiController.current = new GoogleGenAI({ apiKey });
            } catch (error) { console.error("Error initializing Gemini:", error); }
        }
    }, [levelIndex, initLevel]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        frameCount.current++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.forEach((row, y) => row.forEach((cell, x) => drawSprite(ctx, cell, x, y, frameCount.current)));
        animationFrameId.current = requestAnimationFrame(draw);
    }, [grid]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(draw);
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [draw]);

    const processMove = useCallback((dx: number, dy: number) => {
        if (gameState !== GameState.Playing) return;
        const { grid: nextGrid, keys: nextKeys, gameState: nextGameState, sound } = getNextState(grid, keys, { dx, dy }, levels[levelIndex]);
        
        const sounds = soundsRef.current;
        if (sound && sounds[sound]) {
            sounds[sound].currentTime = 0;
            sounds[sound].play().catch((e: any) => console.error("Sound play failed:", e));
        }

        if(JSON.stringify(grid) !== JSON.stringify(nextGrid)) moves.current++;

        setGrid(nextGrid);
        setKeys(nextKeys);
        setGameState(nextGameState);
    }, [gameState, grid, keys, levelIndex]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isAiMode || gameState !== GameState.Playing) return;
            const moveMap: { [key: string]: [number, number] } = {
                'ArrowUp': [0, -1], 'ArrowDown': [0, 1], 'ArrowLeft': [-1, 0], 'ArrowRight': [1, 0]
            };
            if (moveMap[e.key]) {
                e.preventDefault();
                processMove(...moveMap[e.key]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [processMove, isAiMode, gameState]);

    const requestAiMove = useCallback(async () => {
        if (!aiController.current || gameState !== GameState.Playing) return;
        setGameState(GameState.AwaitingAI);
        setAiStatus('Thinking...');
        
        try {
            const gameStateString = `Grid:\n${grid.map(row => row.join('')).join('\n')}\nKeys: ${keys}`;
            const prompt = `You are a puzzle-solving AI controlling a player (P) in a grid-based dungeon. Your goal is to reach the Exit (E).

            RULES:
            - '.' is an empty space. '#' is a wall.
            - 'k' is a key. You need one key to open a locked door 'd'.
            - 'b' is a block you can push into empty spaces.
            - 's' is a switch. Pushing a block onto a switch opens doors. 'D' is an open door.
            - 't' is a trap that resets you. Avoid it.
            - 'T' is a teleporter to another 'T'.
            
            CURRENT STATE:
            ${gameStateString}
            
            Analyze the state and provide the single best next move to reach the exit. Your response must be only one of the following words: UP, DOWN, LEFT, RIGHT.`;
            
            const response = await aiController.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { thinkingConfig: { thinkingBudget: 0 } }
            });

            const move = response.text.trim().toUpperCase();
            setLastAiMove(move);
            const validMoves: { [key: string]: [number, number] } = { 'UP': [0, -1], 'DOWN': [0, 1], 'LEFT': [-1, 0], 'RIGHT': [1, 0] };
            
            if (validMoves[move]) {
                setAiStatus('Executing: ' + move);
                processMove(...validMoves[move]);
            } else {
                console.warn("AI returned invalid move:", move);
                setAiStatus(`Invalid move. Retrying...`);
                setGameState(GameState.Playing); 
            }
        } catch (error) {
            console.error("Error getting AI move:", error);
            setAiStatus('API Error. Retrying...');
            setGameState(GameState.Playing); 
        }
    }, [gameState, grid, keys, processMove]);
    
    useEffect(() => {
        if (isAiMode && gameState === GameState.Playing) {
            const timeoutId = setTimeout(requestAiMove, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [isAiMode, gameState, grid, requestAiMove]);

    return (
        <div className="dungeon-container">
            <div className="game-area">
                <canvas ref={canvasRef} width={levels[levelIndex][0].length * TILE_SIZE} height={levels[levelIndex].length * TILE_SIZE}/>
            </div>
            <div className="dungeon-sidebar">
                <h3 className="dungeon-title">AI Dungeon Explorer</h3>
                <div className="dungeon-controls">
                    <div>
                        <span className="font-semibold">Level:</span> <span className="font-bold">Challenge</span>
                    </div>
                    <button onClick={initLevel}>Reset</button>
                    <div className="ai-toggle">
                        <span>Manual</span>
                        <label className="switch">
                            <input type="checkbox" checked={isAiMode} onChange={() => setIsAiMode(!isAiMode)} />
                            <span className="slider round"></span>
                        </label>
                        <span>AI</span>
                    </div>
                </div>
                <div className="dungeon-status">
                    <div><span className="status-label">Moves:</span> {moves.current}</div>
                    <div><span className="status-label">Keys:</span> {keys}</div>
                    <div className="status-message">
                        {gameState === GameState.Won && <span className="win-message">Level Complete!</span>}
                        {isAiMode && gameState !== GameState.Won && <span className="ai-message">{aiStatus}</span>}
                    </div>
                </div>
                 <div className="dungeon-legend">
                    <h4>Legend</h4>
                    <div className="legend-grid">
                        <div className="legend-item"><span className="legend-tile player"></span> Player</div>
                        <div className="legend-item"><span className="legend-tile exit"></span> Exit</div>
                        <div className="legend-item"><span className="legend-tile key"></span> Key</div>
                        <div className="legend-item"><span className="legend-tile door"></span> Door</div>
                        <div className="legend-item"><span className="legend-tile block"></span> Block</div>
                        <div className="legend-item"><span className="legend-tile switch"></span> Switch</div>
                        <div className="legend-item"><span className="legend-tile trap"></span> Trap</div>
                        <div className="legend-item"><span className="legend-tile teleport"></span> Teleporter</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DungeonExplorer;