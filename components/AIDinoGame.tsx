import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import '../styles/AIDinoGame.css';

enum GameRunState {
    Idle,
    Playing,
    Paused,
    GameOver
}

const AIDinoGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const game = useRef<any>({}).current;
    const aiController = useRef<GoogleGenAI | null>(null);
    const selectedModelRef = useRef('gemini-2.5-flash');

    const [isAiMode, setIsAiMode] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
    const [gameState, setGameState] = useState<GameRunState>(GameRunState.Idle);
    const [geminiMessage, setGeminiMessage] = useState('');

    const availableModels = ['gemini-2.5-flash'];

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setSelectedModel(newModel);
        selectedModelRef.current = newModel;
    };

    const toggleAiMode = () => {
        setIsAiMode(prev => !prev);
    };
    
    const EndGame = useCallback(() => {
        if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
        }
        
        if (game.score > game.highscore) {
            game.highscore = game.score;
            localStorage.setItem('highscore_geminirush', game.highscore);
        }
        setGameState(GameRunState.GameOver);
    }, [game]);


    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        
        Object.assign(game, {
            score: 0, highscore: 0, player: null, gravity: 1, 
            gameSpeed: 5, obstacles: [], stars: [],
            animationFrameId: null, spawnTimer: 0, aiActionThrottle: 0, frameCount: 0
        });

        const initializeAiController = () => {
            if (!aiController.current) {
                try {
                    const apiKey = process.env.API_KEY;
                    if (!apiKey) throw new Error("API key not configured");
                    aiController.current = new GoogleGenAI({ apiKey });
                } catch (error) {
                    console.error("Error initializing Gemini:", error);
                    setGeminiMessage("Error: Could not initialize AI Controller.");
                    EndGame();
                }
            }
        };
        initializeAiController();

        class Player {
            x: number; y: number; w: number; h: number; dy: number; jumpForce: number; 
            grounded: boolean; jumpTimer: number;
            constructor(x:number, y:number, w:number, h:number) {
                this.x = x; this.y = y; this.w = w; this.h = h; this.dy = 0;
                this.jumpForce = 16; this.grounded = false; this.jumpTimer = 0;
            }
            Animate() {
                if (this.jumpTimer > 0) this.jumpTimer--;
                this.y += this.dy;
                if (this.y + this.h < canvas.height) {
                    this.dy += game.gravity; this.grounded = false;
                } else {
                    this.dy = 0; this.grounded = true; this.y = canvas.height - this.h;
                } this.Draw();
            }
            Jump() {
                if (this.grounded && this.jumpTimer === 0) {
                    this.jumpTimer = 10; this.dy = -this.jumpForce;
                }
            }
            Draw() {
                ctx.save();
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 15;
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 4;
                ctx.beginPath();
                // Head
                ctx.arc(this.x + this.w / 2, this.y + 10, 10, 0, Math.PI * 2);
                // Body
                ctx.moveTo(this.x + this.w / 2, this.y + 20);
                ctx.lineTo(this.x + this.w / 2, this.y + 40);
                // Arms
                const armAngle = Math.sin(game.frameCount * 0.4) * 0.4;
                ctx.moveTo(this.x + this.w / 2, this.y + 25);
                ctx.lineTo(this.x + this.w / 2 - 15 * Math.cos(armAngle), this.y + 25 + 15 * Math.sin(armAngle));
                ctx.moveTo(this.x + this.w / 2, this.y + 25);
                ctx.lineTo(this.x + this.w / 2 + 15 * Math.cos(armAngle), this.y + 25 - 15 * Math.sin(armAngle));
                // Legs
                const legAngle = Math.sin(game.frameCount * 0.4) * 0.8;
                if (!this.grounded) { // Jumping pose
                    ctx.moveTo(this.x + this.w / 2, this.y + 40);
                    ctx.lineTo(this.x + this.w / 2 - 10, this.y + 55);
                    ctx.moveTo(this.x + this.w / 2, this.y + 40);
                    ctx.lineTo(this.x + this.w / 2 + 10, this.y + 55);
                } else { // Running pose
                    ctx.moveTo(this.x + this.w / 2, this.y + 40);
                    ctx.lineTo(this.x + this.w / 2 - 15 * Math.cos(legAngle), this.y + 40 + 15 * Math.sin(legAngle));
                    ctx.moveTo(this.x + this.w / 2, this.y + 40);
                    ctx.lineTo(this.x + this.w / 2 + 15 * Math.cos(legAngle), this.y + 40 - 15 * Math.sin(legAngle));
                }
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
        class Obstacle {
            x: number; y: number; w: number; h: number; dx: number; type: number;
            constructor(x:number, y:number, w:number, h:number, type:number) {
                this.x = x; this.y = y; this.w = w; this.h = h; this.type = type; this.dx = -game.gameSpeed;
            }
            Update() { this.x += this.dx; this.Draw(); this.dx = -game.gameSpeed; }
            Draw() {
                ctx.beginPath();
                const glitch = () => {
                    for(let i = 0; i < 3; i++) {
                        let glitchX = this.x + (Math.random() - 0.5) * 6;
                        let glitchY = this.y + (Math.random() - 0.5) * 6;
                        ctx.strokeStyle = ['#f87171', '#fb923c', '#facc15'][i];
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(glitchX, glitchY, this.w, this.h);
                    }
                }
                switch (this.type) {
                    case 0: // Tall ground spike
                        ctx.fillStyle = '#ef4444';
                        ctx.fillRect(this.x, this.y, this.w, this.h);
                        break;
                    case 1: // Flying drone
                        ctx.fillStyle = '#a855f7';
                        ctx.fillRect(this.x, this.y, this.w, this.h);
                        break;
                    case 2: // Wide ground block
                        ctx.fillStyle = '#f97316';
                        ctx.fillRect(this.x, this.y, this.w, this.h);
                        break;
                }
                glitch();
                ctx.closePath();
            }
        }
        class Star {
            x: number; y: number; radius: number; velocity: number;
            constructor(x: number, y: number, radius: number, velocity: number) {
                this.x = x; this.y = y; this.radius = radius; this.velocity = velocity;
            }
            Draw() { ctx.fillStyle = '#4b5563'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
            Update() { this.x -= this.velocity; if (this.x < -this.radius) this.x = canvas.width + this.radius; this.Draw(); }
        }
        class Text {
            t: string; x: number; y: number; a: CanvasTextAlign; c: string; s: string;
            constructor(t:string, x:number, y:number, a:CanvasTextAlign, c:string, s:string) {
                this.t = t; this.x = x; this.y = y; this.a = a; this.c = c; this.s = s;
            }
            Draw() { ctx.beginPath(); ctx.fillStyle = this.c; ctx.font = this.s + "px 'Roboto Mono', monospace"; ctx.textAlign = this.a; ctx.fillText(this.t, this.x, this.y); ctx.closePath(); }
        }
        
        const getWittyRemark = async (playerScore: number) => {
            if(!aiController.current) return;
            setGeminiMessage('Analyzing performance data...');
            const prompt = `You are a sarcastic system AI. A user just played a game called "Gemini Rush" and scored ${playerScore} points. Give them a short, witty, one-sentence remark about their score. Keep it under 20 words and fit the tech/cyberpunk theme.`;
            try {
                const response = await aiController.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                setGeminiMessage(response.text);
            } catch (error) {
                console.error("Gemini API error:", error);
                setGeminiMessage("My wit module has apparently suffered a segmentation fault.");
            }
        };

        const getAIAction = async (gameState: string) => {
            if (!aiController.current) return 'WAIT';
            const prompt = `You are an expert AI gamer playing a side-scrolling runner game. Your only possible actions are 'JUMP' or 'WAIT'. Based on the following state, respond with ONLY 'JUMP' or 'WAIT'. Game State: ${gameState}`;
            try {
                const response = await aiController.current.models.generateContent({
                    model: selectedModelRef.current, contents: prompt, config: { thinkingConfig: { thinkingBudget: 0 } }
                });
                return response.text.trim();
            } catch (error) {
                console.error(`AI Action error with model ${selectedModelRef.current}:`, error);
                setGeminiMessage(`Error: Model '${selectedModelRef.current}' may be unavailable or invalid.`);
                EndGame();
                return 'WAIT';
            }
        };

        const RandomIntInRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);
        const SpawnObstacle = () => {
            let type = RandomIntInRange(0, 2);
            let obstacle;
        
            switch (type) {
                case 0: // Tall ground spike
                    obstacle = new Obstacle(canvas.width + 20, canvas.height - 80, 20, 80, type);
                    break;
                case 1: // Flying drone
                    obstacle = new Obstacle(canvas.width + 50, canvas.height - 120, 50, 30, type);
                    break;
                case 2: // Wide ground block
                    obstacle = new Obstacle(canvas.width + 60, canvas.height - 40, 60, 40, type);
                    break;
                default:
                    obstacle = new Obstacle(canvas.width + 40, canvas.height - 50, 40, 50, 0);
            }
        
            game.obstacles.push(obstacle);
        }

        const InitStars = () => {
            for (let i = 0; i < 100; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let radius = Math.random() * 1.5;
                let velocity = Math.random() * 2 + 0.5; // Different speeds for parallax
                game.stars.push(new Star(x, y, radius, velocity));
            }
        }

        game.Update = () => {
            if (gameState !== GameRunState.Playing) return;
            game.animationFrameId = requestAnimationFrame(game.Update);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.frameCount++;

            game.stars.forEach((s: Star) => s.Update());

            game.spawnTimer--;
            if (game.spawnTimer <= 0) {
                SpawnObstacle(); game.spawnTimer = Math.max(40, Math.floor(150 - game.gameSpeed * 8));
            }
            for (let i = game.obstacles.length - 1; i >= 0; i--) {
                let o = game.obstacles[i]; if (o.x + o.w < 0) { game.obstacles.splice(i, 1); }
                const playerHitbox = { x: game.player.x, y: game.player.y, w: 20, h: 60 };
                if (playerHitbox.x < o.x + o.w && playerHitbox.x + playerHitbox.w > o.x && playerHitbox.y < o.y + o.h && playerHitbox.y + playerHitbox.h > o.y) {
                    EndGame(); getWittyRemark(game.score); return;
                } o.Update();
            }

            game.player.Animate();

            if (isAiMode && game.obstacles.length > 0) {
                const nextObstacle = game.obstacles.find((o: Obstacle) => o.x + o.w > game.player.x);
                if (nextObstacle) {
                    const distance = nextObstacle.x - (game.player.x + game.player.w);
                    if (distance > 0 && distance < 350 && game.aiActionThrottle <= 0) {
                        game.aiActionThrottle = 8;
                        const obstacleType = (nextObstacle.y < canvas.height - nextObstacle.h) ? 'FLYING' : 'GROUND';
                        const gameStateStr = `Next obstacle is a ${obstacleType} object, ${Math.floor(nextObstacle.w)}px wide, at a distance of ${Math.floor(distance)}px.`;
                        getAIAction(gameStateStr).then(action => { if (gameState === GameRunState.Playing && action.includes('JUMP')) game.player.Jump(); });
                    }
                }
            }
            if (game.aiActionThrottle > 0) game.aiActionThrottle--;

            game.score++;
            new Text("SCORE: " + game.score, 25, 35, "left", "#c9d1d9", "16").Draw();
            if (game.highscore > 0) { new Text("HIGH: " + game.highscore, canvas.width - 25, 35, "right", "#8b949e", "16").Draw(); }
            game.gameSpeed += 0.003;
        }
        
        game.Start = () => {
            if (game.animationFrameId) cancelAnimationFrame(game.animationFrameId);
            setGeminiMessage(''); setGameState(GameRunState.Playing);
            game.gameSpeed = 5; game.gravity = 1; game.score = 0;
            game.highscore = localStorage.getItem('highscore_geminirush') || 0;
            game.player = new Player(50, 0, 30, 60); game.obstacles = [];
            game.spawnTimer = 100; game.frameCount = 0;
            if (game.stars.length === 0) InitStars();
            game.Update();
        }

        const handleInput = () => { if (!isAiMode) { if (gameState !== GameRunState.Playing) game.Start(); else game.player.Jump(); } }
        const handleKeyDown = (evt: KeyboardEvent) => { if (evt.code === 'Space') { evt.preventDefault(); handleInput(); } };
        
        canvas.addEventListener('click', handleInput);
        document.addEventListener('keydown', handleKeyDown);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(game.stars.length === 0) InitStars();
        game.stars.forEach((s: Star) => s.Draw());

        if (gameState === GameRunState.Idle) { new Text("Awaiting Initialization...", canvas.width / 2, canvas.height / 2, "center", "#8b949e", "16").Draw(); }
        if (gameState === GameRunState.GameOver) {
             new Text("CORE DUMP", canvas.width / 2, canvas.height / 2 - 40, "center", "#ef4444", "30").Draw();
             new Text("SCORE: " + game.score, canvas.width / 2, canvas.height / 2 + 5, "center", "#c9d1d9", "20").Draw();
             new Text("HIGH: " + game.highscore, canvas.width / 2, canvas.height / 2 + 40, "center", "#8b949e", "16").Draw();
        }
        if (gameState === GameRunState.Paused) { new Text("PAUSED", canvas.width / 2, canvas.height / 2, "center", "#facc15", "30").Draw(); }


        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (game.animationFrameId) {
                cancelAnimationFrame(game.animationFrameId);
            }
        }

    }, [gameState, EndGame, isAiMode]);

    return (
        <div className="gemini-rush-container">
            <h2 className="gemini-rush-title">GEMINI RUSH</h2>
            <div className="game-canvas-wrapper">
                <canvas ref={canvasRef} id="gameCanvas" width="700" height="300"></canvas>
            </div>
            
            <div className="game-controls-wrapper">
                <div className="controls-grid">
                    <div className="player-toggle-wrapper">
                        <span className="player-toggle-label">Player:</span>
                        <span className="player-toggle-option">Human</span>
                        <div className="ai-toggle-switch">
                            <input type="checkbox" name="ai-toggle" id="ai-toggle" checked={isAiMode} onChange={toggleAiMode} className="ai-toggle-checkbox"/>
                            <label htmlFor="ai-toggle" className="ai-toggle-label"></label>
                        </div>
                        <label htmlFor="ai-toggle" className="player-toggle-option ai">Gemini</label>
                    </div>
                    <div className="model-selector-wrapper">
                        <label htmlFor="model-select" className="model-selector-label">Model:</label>
                        <select id="model-select" value={selectedModel} onChange={handleModelChange} disabled={!isAiMode} className="game-select" aria-label="Select AI Model">
                            {availableModels.map(model => (<option key={model} value={model}>{model}</option>))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="game-actions-wrapper">
                {(gameState === GameRunState.Idle || gameState === GameRunState.GameOver) && <button onClick={() => game.Start()} className="game-button">Initialize</button>}
                {gameState === GameRunState.Playing && <button onClick={() => setGameState(GameRunState.Paused)} className="game-button pause-button">Pause</button>}
                {gameState === GameRunState.Paused && <button onClick={() => setGameState(GameRunState.Playing)} className="game-button">Resume</button>}
            </div>

            {gameState === GameRunState.GameOver && (
                 <div className="gemini-response">
                    <span className="gemini-response-prompt">&gt; Gemini: </span>{geminiMessage}
                 </div>
            )}
        </div>
    );
};

export default AIDinoGame;