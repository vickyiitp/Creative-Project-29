import React from 'react';
import { MemoryNode, MemoryEdge, GRID_SIZE, MemoryStatus } from '../types';

interface ConnectionLinesProps {
  nodes: Map<string, MemoryNode>;
  edges: MemoryEdge[];
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodes, edges }) => {
  // Helper to get center percentage of a cell
  const getCoord = (index: number) => {
    return (index * 100) / GRID_SIZE + (100 / GRID_SIZE) / 2;
  };

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible filter drop-shadow-[0_0_3px_rgba(34,197,94,0.5)]">
      <defs>
        <marker
          id="arrowhead-active"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
        </marker>
        <marker
          id="arrowhead-dead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#475569" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const source = nodes.get(edge.sourceId);
        const target = nodes.get(edge.targetId);

        if (!source || !target) return null;

        const x1 = getCoord(source.pos.col);
        const y1 = getCoord(source.pos.row);
        const x2 = getCoord(target.pos.col);
        const y2 = getCoord(target.pos.row);

        // Determine color based on source status
        const isLiveRef = source.status === MemoryStatus.ACTIVE;
        const color = isLiveRef ? '#22c55e' : '#475569'; // green-500 : slate-600
        const marker = isLiveRef ? 'url(#arrowhead-active)' : 'url(#arrowhead-dead)';
        
        const opacity = isLiveRef ? 0.9 : 0.3;

        return (
          <g key={edge.id}>
             {/* Background line for contrast */}
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#020617"
              strokeWidth="5"
              opacity="0.8"
              strokeLinecap="round"
            />
            
            {/* Main Connection Line */}
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={color}
              strokeWidth="2.5"
              markerEnd={marker}
              opacity={opacity}
              strokeLinecap="round"
              strokeDasharray={isLiveRef ? "10,5" : "none"}
              className={isLiveRef ? "animate-dash" : "transition-colors duration-500"}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default ConnectionLines;