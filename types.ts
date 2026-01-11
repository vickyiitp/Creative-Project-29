export enum NodeType {
  EMPTY = 'EMPTY',
  OBJECT = 'OBJECT',
}

export enum MemoryStatus {
  FREE = 'FREE',
  ACTIVE = 'ACTIVE', // Reachable from Root
  DEAD = 'DEAD',     // Unreachable from Root
}

export interface GridPos {
  row: number;
  col: number;
}

export interface MemoryNode {
  id: string;
  pos: GridPos;
  type: NodeType;
  isRoot: boolean;
  status: MemoryStatus;
  // Visual props
  createdAt: number;
}

export interface MemoryEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface GameState {
  nodes: Map<string, MemoryNode>; // Keyed by coordinate "row-col" for easy grid lookup
  edges: MemoryEdge[];
  score: number;
  memoryUsage: number; // Percentage 0-100
  gameOver: boolean;
  gamePaused: boolean;
  systemLog: string[];
  level: number;
}

export const GRID_SIZE = 6;
export const MAX_MEMORY = GRID_SIZE * GRID_SIZE;
