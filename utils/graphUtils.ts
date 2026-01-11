import { MemoryNode, MemoryEdge, MemoryStatus, NodeType } from '../types';

/**
 * Performs a Mark-and-Sweep style analysis to determine which nodes are ACTIVE (reachable)
 * and which are DEAD (unreachable).
 */
export const calculateReachability = (
  nodes: Map<string, MemoryNode>,
  edges: MemoryEdge[]
): Map<string, MemoryStatus> => {
  const statusMap = new Map<string, MemoryStatus>();
  const adjacencyList = new Map<string, string[]>();

  // Initialize adjacency list
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.sourceId)) {
      adjacencyList.set(edge.sourceId, []);
    }
    adjacencyList.get(edge.sourceId)?.push(edge.targetId);
  });

  // 1. Mark phase: Identify Roots
  const queue: string[] = [];
  
  nodes.forEach((node, id) => {
    if (node.type === NodeType.EMPTY) {
      statusMap.set(id, MemoryStatus.FREE);
    } else if (node.isRoot) {
      statusMap.set(id, MemoryStatus.ACTIVE);
      queue.push(id);
    } else {
      // Default to DEAD, will be marked ACTIVE if reachable
      statusMap.set(id, MemoryStatus.DEAD);
    }
  });

  // 2. Traverse from Roots
  const visited = new Set<string>(queue);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const neighbors = adjacencyList.get(currentId) || [];

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        // Only traverse to existing objects
        const neighborNode = nodes.get(neighborId);
        if (neighborNode && neighborNode.type === NodeType.OBJECT) {
          visited.add(neighborId);
          statusMap.set(neighborId, MemoryStatus.ACTIVE);
          queue.push(neighborId);
        }
      }
    }
  }

  return statusMap;
};

export const getIncomingEdgeCount = (nodeId: string, edges: MemoryEdge[]): number => {
  return edges.filter(e => e.targetId === nodeId).length;
};
