import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    MemoryNode, 
    MemoryEdge, 
    NodeType, 
    MemoryStatus, 
    GameState, 
    GRID_SIZE, 
    MAX_MEMORY 
} from '../types';
import { calculateReachability, getIncomingEdgeCount } from '../utils/graphUtils';
import ConnectionLines from './ConnectionLines';
import MemoryBlock from './MemoryBlock';
import { Play, RotateCcw, ShieldAlert, Skull, Info, ArrowLeft, Pause, Terminal, Cpu, Activity } from 'lucide-react';

const INITIAL_SPAWN_RATE = 2000;
const MIN_SPAWN_RATE = 500;

interface GameProps {
  onBack: () => void;
}

const Game: React.FC<GameProps> = ({ onBack }) => {
  // Game State
  const [nodes, setNodes] = useState<Map<string, MemoryNode>>(new Map());
  const [edges, setEdges] = useState<MemoryEdge[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    nodes: new Map(),
    edges: [],
    score: 0,
    memoryUsage: 0,
    gameOver: false,
    gamePaused: true,
    systemLog: ['System Initialized. Waiting for allocation...'],
    level: 1
  });

  const [shakeId, setShakeId] = useState<string | null>(null);

  // Refs for loop management to avoid closure staleness
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const stateRef = useRef(gameState);
  
  // Sync refs
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  const addLog = (msg: string) => {
    setGameState(prev => ({
        ...prev,
        systemLog: [msg, ...prev.systemLog].slice(0, 5)
    }));
  };

  const triggerShake = (id: string) => {
    setShakeId(id);
    setTimeout(() => setShakeId(null), 500);
  };

  // --- Core Logic ---

  const initGrid = useCallback(() => {
    const newNodes = new Map<string, MemoryNode>();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const id = `${r}-${c}`;
        newNodes.set(id, {
          id,
          pos: { row: r, col: c },
          type: NodeType.EMPTY,
          isRoot: false,
          status: MemoryStatus.FREE,
          createdAt: 0
        });
      }
    }
    setNodes(newNodes);
    setEdges([]);
    setGameState({
        nodes: newNodes,
        edges: [],
        score: 0,
        memoryUsage: 0,
        gameOver: false,
        gamePaused: true, // Start paused
        systemLog: ['System Ready. Press Start.'],
        level: 1
    });
  }, []);

  const spawnObject = () => {
    const currentNodes = new Map<string, MemoryNode>(nodesRef.current);
    const emptyIds = Array.from(currentNodes.values())
        .filter(n => n.type === NodeType.EMPTY)
        .map(n => n.id);

    if (emptyIds.length === 0) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        addLog('CRITICAL: OUT OF MEMORY');
        return;
    }

    const id = emptyIds[Math.floor(Math.random() * emptyIds.length)];
    const oldNode = currentNodes.get(id)!;
    
    const newNode: MemoryNode = {
        ...oldNode,
        type: NodeType.OBJECT,
        createdAt: Date.now(),
        isRoot: Math.random() < 0.3
    };
    
    currentNodes.set(id, newNode);

    const newEdges = [...edgesRef.current];

    if (!newNode.isRoot) {
        const activeNodes = Array.from(currentNodes.values()).filter(n => n.status === MemoryStatus.ACTIVE && n.type === NodeType.OBJECT);
        if (activeNodes.length > 0) {
            const parent = activeNodes[Math.floor(Math.random() * activeNodes.length)];
            newEdges.push({
                id: `e-${Date.now()}-${Math.random()}`,
                sourceId: parent.id,
                targetId: newNode.id
            });
        } else {
            newNode.isRoot = true; 
            currentNodes.set(id, newNode);
        }
    }

    if (Math.random() > 0.6) {
        const objects = Array.from(currentNodes.values()).filter(n => n.type === NodeType.OBJECT);
        if (objects.length >= 2) {
            const src = objects[Math.floor(Math.random() * objects.length)];
            const tgt = objects[Math.floor(Math.random() * objects.length)];
            if (src.id !== tgt.id && !newEdges.some(e => e.sourceId === src.id && e.targetId === tgt.id)) {
                 newEdges.push({
                    id: `e-${Date.now()}-${Math.random()}`,
                    sourceId: src.id,
                    targetId: tgt.id
                });
            }
        }
    }

    const roots = Array.from(currentNodes.values()).filter(n => n.isRoot);
    if (roots.length > 2 && Math.random() > 0.7) {
        const victim = roots[Math.floor(Math.random() * roots.length)];
        currentNodes.set(victim.id, { ...victim, isRoot: false });
        addLog(`Scope Exit: ${victim.id}`);
    }

    const reachability = calculateReachability(currentNodes, newEdges);
    currentNodes.forEach((n, key) => {
        if (n.type === NodeType.OBJECT) {
            const newStatus = reachability.get(key) || MemoryStatus.DEAD;
            if (n.status !== newStatus) {
                currentNodes.set(key, { ...n, status: newStatus });
            }
        }
    });

    const used = Array.from(currentNodes.values()).filter(n => n.type === NodeType.OBJECT).length;
    const usage = Math.floor((used / MAX_MEMORY) * 100);

    setNodes(currentNodes);
    setEdges(newEdges);
    setGameState(prev => ({ 
        ...prev, 
        memoryUsage: usage,
        nodes: currentNodes,
        edges: newEdges
    }));

    if (usage >= 100) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        addLog('SYSTEM CRASH: HEAP OVERFLOW');
    }
  };

  const handleNodeClick = (id: string) => {
    if (stateRef.current.gameOver || stateRef.current.gamePaused) return;

    const currentNodes = new Map<string, MemoryNode>(nodesRef.current);
    const node = currentNodes.get(id);
    if (!node || node.type !== NodeType.OBJECT) return;

    if (node.status === MemoryStatus.ACTIVE) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        addLog(`SEGFAULT: Accessed Active Object ${id}`);
        return;
    }

    const incomingCount = getIncomingEdgeCount(id, edgesRef.current);
    if (incomingCount > 0) {
        addLog(`ACCESS DENIED: Object ${id} is referenced!`);
        triggerShake(id);
        return;
    }

    currentNodes.set(id, {
        ...node,
        type: NodeType.EMPTY,
        status: MemoryStatus.FREE,
        isRoot: false
    });

    const newEdges = edgesRef.current.filter(e => e.sourceId !== id && e.targetId !== id);

    setNodes(currentNodes);
    setEdges(newEdges);
    
    const newScore = stateRef.current.score + 100;
    
    const used = Array.from(currentNodes.values()).filter(n => n.type === NodeType.OBJECT).length;
    const usage = Math.floor((used / MAX_MEMORY) * 100);

    setGameState(prev => ({
        ...prev,
        score: newScore,
        memoryUsage: usage,
        nodes: currentNodes,
        edges: newEdges
    }));

    addLog(`Freed 64KB at ${id}`);
  };

  const handleRightClick = (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    if ((e as React.MouseEvent).preventDefault) {
        (e as React.MouseEvent).preventDefault();
    }
    
    if (stateRef.current.gameOver || stateRef.current.gamePaused) return;

    const node = nodesRef.current.get(id);
    if (!node || node.type !== NodeType.OBJECT) return;

    if (node.status === MemoryStatus.ACTIVE) {
        addLog(`ERROR: Cannot modify Active Object ${id}`);
        triggerShake(id);
        return;
    }

    const outgoingEdges = edgesRef.current.filter(e => e.sourceId === id);
    if (outgoingEdges.length === 0) return;

    const newEdges = edgesRef.current.filter(e => e.sourceId !== id);
    
    setEdges(newEdges);
    addLog(`Nullified pointers from ${id}`);
  };

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    if (gameState.gamePaused || gameState.gameOver) return;
    const spawnRate = Math.max(MIN_SPAWN_RATE, INITIAL_SPAWN_RATE - (gameState.score / 10)); 
    const interval = setInterval(() => {
        spawnObject();
    }, spawnRate);
    return () => clearInterval(interval);
  }, [gameState.gamePaused, gameState.gameOver, gameState.score]);


  // --- Render ---

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 md:p-4 select-none relative z-10 w-full animate-fade-in pb-20 md:pb-4 bg-[#050a10]">
      
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-circuit background-fixed"></div>

      {/* HUD Container */}
      <div className="w-full max-w-2xl mb-6 flex flex-col md:flex-row justify-between items-stretch gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-lg border border-slate-700 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        
        {/* Left Side: Controls & Title */}
        <div className="flex flex-col justify-between">
            <button 
                onClick={onBack}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-400 mb-2 transition-colors focus:outline-none font-mono tracking-wide w-fit"
                aria-label="Exit Game"
            >
                <ArrowLeft size={12} /> ../EXIT_PROCESS
            </button>
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest flex items-center gap-2 font-display">
                    <Terminal className="text-green-500" size={20} /> 
                    GC_MONITOR <span className="text-[10px] bg-green-900 text-green-400 px-1 rounded animate-pulse">LIVE</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-mono mt-1 border-l-2 border-slate-700 pl-2">
                    PID: 88492 // HEAP_SIZE: {MAX_MEMORY * 64}KB
                </p>
            </div>
        </div>
        
        {/* Right Side: Stats Panel */}
        <div className="flex items-center gap-6 font-mono border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
            
            {/* Memory Usage Dial */}
            <div className="flex flex-col items-center">
                 <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Heap Usage</div>
                 <div className="relative flex items-center justify-center w-16 h-16">
                     <svg className="w-full h-full transform -rotate-90">
                         <circle cx="32" cy="32" r="28" stroke="#1e293b" strokeWidth="4" fill="none" />
                         <circle 
                            cx="32" cy="32" r="28" 
                            stroke={gameState.memoryUsage > 80 ? '#ef4444' : '#22c55e'} 
                            strokeWidth="4" 
                            fill="none" 
                            strokeDasharray={175} 
                            strokeDashoffset={175 - (175 * gameState.memoryUsage) / 100}
                            className="transition-all duration-500 ease-out"
                         />
                     </svg>
                     <span className={`absolute text-sm font-bold ${gameState.memoryUsage > 80 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {gameState.memoryUsage}%
                     </span>
                 </div>
            </div>

            {/* Score & Status */}
            <div className="flex flex-col gap-2 min-w-[100px]">
                <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest">Bytes Freed</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                        {gameState.score * 64} <span className="text-xs text-slate-600">KB</span>
                    </div>
                </div>
                <div>
                     <div className="text-[9px] text-slate-400 uppercase tracking-widest">State</div>
                     {gameState.gamePaused ? (
                        <span className="text-yellow-500 text-xs font-bold flex items-center gap-1 bg-yellow-900/20 px-1.5 py-0.5 rounded w-fit"><Pause size={8}/> FROZEN</span>
                    ) : (
                        <span className="text-green-500 text-xs font-bold flex items-center gap-1 bg-green-900/20 px-1.5 py-0.5 rounded w-fit"><Activity size={8}/> RUNNING</span>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* GAME BOARD CONTAINER */}
      <div className="relative p-1 rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl">
        <div className="bg-[#050a10] p-2 md:p-6 rounded border border-slate-700 relative overflow-hidden">
            
            {/* Grid Decor */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-10">
                {Array.from({length: 36}).map((_, i) => (
                    <div key={i} className="border border-slate-500/20"></div>
                ))}
            </div>

            {/* Connection Layer */}
            <div className="absolute inset-0 m-2 md:m-6 pointer-events-none z-10">
                <ConnectionLines nodes={nodes} edges={edges} />
            </div>

            {/* Interactive Grid */}
            <div 
                className="grid gap-2 md:gap-4 relative z-20"
                style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    width: 'min(90vw, 500px)',
                    aspectRatio: '1/1'
                }}
            >
                {Array.from(nodes.values()).map((node: MemoryNode) => {
                    const incoming = getIncomingEdgeCount(node.id, edges);
                    const isShaking = shakeId === node.id;
                    
                    return (
                        <div key={node.id} className={isShaking ? 'animate-shake' : ''}>
                            <MemoryBlock 
                                node={node} 
                                incomingEdges={incoming}
                                onClick={handleNodeClick}
                                onRightClick={handleRightClick}
                            />
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Start / Pause Overlay */}
        {gameState.gamePaused && !gameState.gameOver && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-50 rounded-lg backdrop-blur-sm p-6 text-center border border-green-900/50">
                <ShieldAlert size={48} className="text-green-500 mb-4 animate-pulse" />
                <h2 className="text-3xl text-white font-bold mb-6 font-display tracking-widest">SYSTEM HALTED</h2>
                
                <div className="grid grid-cols-1 gap-3 text-left w-full max-w-xs mb-8">
                     <div className="bg-slate-900 p-3 rounded border-l-2 border-green-500">
                        <p className="text-[10px] text-green-400 font-bold uppercase mb-1">Objective</p>
                        <p className="text-xs text-slate-300">Free memory by removing <span className="text-slate-500 bg-slate-800 px-1 rounded">DEAD</span> objects.</p>
                     </div>
                     <div className="bg-slate-900 p-3 rounded border-l-2 border-red-500">
                        <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Warning</p>
                        <p className="text-xs text-slate-300">Do not delete <span className="text-green-500 bg-green-900/20 px-1 rounded">ACTIVE</span> objects or <span className="text-white font-bold">referenced</span> data.</p>
                     </div>
                </div>

                <button 
                    onClick={() => setGameState(prev => ({ ...prev, gamePaused: false }))}
                    className="flex items-center gap-3 px-10 py-4 bg-green-600 text-black font-bold text-lg rounded-sm transition-all hover:bg-green-500 hover:scale-105 font-display shadow-[0_0_25px_rgba(34,197,94,0.4)] clip-corner"
                >
                    <Play size={20} fill="black" /> {gameState.systemLog.length > 1 ? 'RESUME_SESSION' : 'EXECUTE_PROTOCOL'}
                </button>
            </div>
        )}

        {/* Game Over Overlay */}
        {gameState.gameOver && (
            <div 
                className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center z-50 rounded-lg backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300 border-2 border-red-600"
            >
                <div className="relative">
                    <Skull size={64} className="text-red-500 mb-4 animate-bounce" />
                    <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse"></div>
                </div>
                <h2 className="text-5xl text-white font-bold mb-2 font-display tracking-tighter text-shadow-red glitch-text">FATAL_ERROR</h2>
                <p className="text-red-300 font-mono mb-8 text-center bg-black/40 p-2 rounded border border-red-500/30">
                    CODE: 0xDEADBEEF // HEAP_OVERFLOW
                </p>
                
                <div className="text-center mb-8 bg-black/60 p-6 rounded-lg w-full max-w-xs border-t-4 border-red-500 shadow-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Total Memory Reclaimed</p>
                    <p className="text-4xl font-bold text-white font-mono">{gameState.score * 64} KB</p>
                </div>
                
                <button 
                    onClick={initGrid}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-slate-200 transition-all font-display shadow-lg clip-corner uppercase tracking-wider"
                >
                    <RotateCcw size={18} /> System_Reboot
                </button>
            </div>
        )}
      </div>

      {/* Log Console */}
      <div 
        className="w-full max-w-2xl mt-4 bg-black p-4 rounded border border-slate-800 font-mono text-[10px] md:text-xs h-32 overflow-hidden shadow-inner opacity-90 relative"
        aria-live="polite"
      >
        <div className="absolute top-0 right-0 p-2 text-slate-700">
            <Cpu size={16} />
        </div>
        <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-900 pb-1 sticky top-0 bg-black/95 backdrop-blur z-10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> KERNEL_LOG_OUTPUT
        </div>
        <div className="flex flex-col-reverse">
            {gameState.systemLog.map((log, i) => (
                <div key={`${i}-${log}`} className={`mb-1 pl-2 border-l-2 ${i===0 ? 'border-green-500 text-green-400 font-bold bg-green-900/10' : 'border-transparent text-slate-500'}`}>
                    <span className="opacity-40 select-none mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    {log}
                </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 2;
        }
        .text-shadow-red {
            text-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
        }
        .clip-corner {
             clip-path: polygon(
                10px 0, 100% 0, 100% calc(100% - 10px), 
                calc(100% - 10px) 100%, 0 100%, 0 10px
            );
        }
      `}</style>
    </div>
  );
};

export default Game;