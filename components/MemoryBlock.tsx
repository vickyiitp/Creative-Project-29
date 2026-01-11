import React, { memo } from 'react';
import { MemoryNode, MemoryStatus, NodeType } from '../types';
import { Database, Cpu, Trash2, Lock, AlertCircle } from 'lucide-react';

interface MemoryBlockProps {
  node: MemoryNode;
  incomingEdges: number;
  onClick: (id: string) => void;
  onRightClick: (id: string, e: React.MouseEvent | React.KeyboardEvent) => void;
}

const MemoryBlock: React.FC<MemoryBlockProps> = ({ node, incomingEdges, onClick, onRightClick }) => {
  const isObject = node.type === NodeType.OBJECT;
  
  // Base classes for the cell container
  const baseClasses = "relative w-full h-full flex items-center justify-center transition-all duration-200 select-none group focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 rounded-sm overflow-hidden border";
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(node.id);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'm') {
      e.preventDefault();
      onRightClick(node.id, e);
    }
  };

  // Empty State
  if (!isObject) {
    return (
      <div 
        className={`${baseClasses} border-slate-800/50 bg-slate-900/30`}
        aria-hidden="true"
      >
        <div className="w-1 h-1 bg-slate-800 rounded-full" />
      </div>
    );
  }

  // Active (Root or Reachable)
  if (node.status === MemoryStatus.ACTIVE) {
    return (
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Active Memory Block at ${node.id}. Cannot delete.`}
        onClick={() => onClick(node.id)}
        onContextMenu={(e) => onRightClick(node.id, e)}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} border-green-500/50 bg-green-900/20 shadow-[0_0_15px_rgba(34,197,94,0.2)] cursor-not-allowed hover:bg-green-900/30 focus:ring-green-500`}
      >
        {/* Scanning Line overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent h-full w-full -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none" />
        
        {node.isRoot && (
            <div className="absolute top-0 right-0 z-20">
                <div className="bg-yellow-500 text-black text-[7px] font-bold px-1 rounded-bl-sm shadow-sm flex items-center gap-0.5">
                   <Lock size={6} strokeWidth={4} /> ROOT
                </div>
            </div>
        )}
        
        <div className="relative z-10">
            <Cpu size={24} className="text-green-500 animate-pulse-fast drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
        </div>
        
        {/* Tech Decor */}
        <div className="absolute bottom-0.5 right-1 text-[8px] text-green-500/70 font-mono tracking-tighter">
           0x{node.id.split('-').join('')}
        </div>
        <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-green-400 rounded-full animate-ping"></div>
      </div>
    );
  }

  // Dead (Unreachable)
  if (node.status === MemoryStatus.DEAD) {
    // Check if it can be collected
    const canCollect = incomingEdges === 0;

    return (
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Dead Memory Block at ${node.id}. ${canCollect ? 'Ready to collect.' : `Blocked by ${incomingEdges} references.`}`}
        onClick={() => onClick(node.id)}
        onContextMenu={(e) => onRightClick(node.id, e)}
        onKeyDown={handleKeyDown}
        className={`
            ${baseClasses} 
            ${canCollect 
                ? 'border-slate-500/50 bg-slate-700/50 hover:bg-slate-600/80 hover:border-slate-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer focus:ring-slate-400' 
                : 'border-red-900/40 bg-slate-900/80 cursor-help focus:ring-red-500'
            } 
        `}
      >
        {/* Noise overlay for dead blocks */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

        {canCollect ? (
            <>
                <Trash2 size={20} className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-transform duration-200" />
                {/* Target Corners on Hover */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </>
        ) : (
            <div className="relative">
                <Database size={20} className="text-slate-600" />
                <div className="absolute -top-3 -right-3 z-20 bg-red-950 text-red-200 text-[9px] px-1.5 py-0.5 rounded border border-red-500/50 font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)] flex items-center gap-0.5">
                    <AlertCircle size={8} /> {incomingEdges}
                </div>
            </div>
        )}
      </div>
    );
  }

  return null;
};

// Optimization: Only re-render if visual props change
export default memo(MemoryBlock, (prev, next) => {
  return (
    prev.node === next.node && 
    prev.incomingEdges === next.incomingEdges
  );
});