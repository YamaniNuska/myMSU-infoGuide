import { getDistanceMeters } from "./mapMath";
import {
  locationRoadAnchors,
  roadEdges,
  roadNodes,
  type RoadNode,
} from "../../data/mymsuDatabase";
import type { MapPoint } from "./types";

const nodesById = new Map(roadNodes.map((node) => [node.id, node]));
const START_NODE_ID = "__route_start__";
const GOAL_NODE_ID = "__route_goal__";

const graph = roadEdges.reduce<Record<string, { id: string; cost: number }[]>>(
  (accumulator, [from, to]) => {
    const fromNode = nodesById.get(from);
    const toNode = nodesById.get(to);

    if (!fromNode || !toNode) {
      return accumulator;
    }

    const cost = Math.hypot(
      toNode.mapX - fromNode.mapX,
      toNode.mapY - fromNode.mapY,
    );
    accumulator[from] = [...(accumulator[from] ?? []), { id: to, cost }];
    accumulator[to] = [...(accumulator[to] ?? []), { id: from, cost }];

    return accumulator;
  },
  {},
);

type RoadProjection = {
  point: MapPoint;
  fromId: string;
  toId: string;
  fromCost: number;
  toCost: number;
};

const getRoadProjection = (point: MapPoint): RoadProjection => {
  const fallback = roadNodes[0];
  let nearest: RoadProjection = {
    point: fallback,
    fromId: fallback.id,
    toId: fallback.id,
    fromCost: 0,
    toCost: 0,
  };
  let nearestDistance = Number.POSITIVE_INFINITY;

  roadEdges.forEach(([fromId, toId]) => {
    const fromNode = nodesById.get(fromId);
    const toNode = nodesById.get(toId);

    if (!fromNode || !toNode) {
      return;
    }

    const dx = toNode.mapX - fromNode.mapX;
    const dy = toNode.mapY - fromNode.mapY;
    const lengthSquared = dx * dx + dy * dy;
    const rawProgress =
      lengthSquared === 0
        ? 0
        : ((point.mapX - fromNode.mapX) * dx +
            (point.mapY - fromNode.mapY) * dy) /
          lengthSquared;
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    const projectedPoint = {
      mapX: fromNode.mapX + dx * progress,
      mapY: fromNode.mapY + dy * progress,
    };
    const distance = Math.hypot(
      projectedPoint.mapX - point.mapX,
      projectedPoint.mapY - point.mapY,
    );

    if (distance < nearestDistance) {
      const edgeCost = Math.hypot(dx, dy);

      nearest = {
        point: projectedPoint,
        fromId,
        toId,
        fromCost: edgeCost * progress,
        toCost: edgeCost * (1 - progress),
      };
      nearestDistance = distance;
    }
  });

  return nearest;
};

const addGraphConnection = (
  routeGraph: Record<string, { id: string; cost: number }[]>,
  fromId: string,
  toId: string,
  cost: number,
) => {
  routeGraph[fromId] = [...(routeGraph[fromId] ?? []), { id: toId, cost }];
  routeGraph[toId] = [...(routeGraph[toId] ?? []), { id: fromId, cost }];
};

const getRouteNodeIds = (
  routeGraph: Record<string, { id: string; cost: number }[]>,
  nodeIds: string[],
  startId: string,
  goalId: string,
) => {
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set(nodeIds);

  nodeIds.forEach((id) => distances.set(id, Number.POSITIVE_INFINITY));
  distances.set(startId, 0);

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let currentDistance = Number.POSITIVE_INFINITY;

    unvisited.forEach((id) => {
      const distance = distances.get(id) ?? Number.POSITIVE_INFINITY;

      if (distance < currentDistance) {
        currentId = id;
        currentDistance = distance;
      }
    });

    if (!currentId || currentId === goalId) {
      break;
    }

    unvisited.delete(currentId);

    routeGraph[currentId]?.forEach((neighbor) => {
      if (!unvisited.has(neighbor.id)) {
        return;
      }

      const nextDistance = currentDistance + neighbor.cost;

      if (
        nextDistance <
        (distances.get(neighbor.id) ?? Number.POSITIVE_INFINITY)
      ) {
        distances.set(neighbor.id, nextDistance);
        previous.set(neighbor.id, currentId as string);
      }
    });
  }

  const route = [goalId];
  let cursor = goalId;

  while (cursor !== startId) {
    const next = previous.get(cursor);

    if (!next) {
      return [startId, goalId];
    }

    route.unshift(next);
    cursor = next;
  }

  return route;
};

const interpolateSegment = (from: MapPoint, to: MapPoint, spacing = 2.6) => {
  const distance = Math.hypot(to.mapX - from.mapX, to.mapY - from.mapY);
  const steps = Math.max(Math.ceil(distance / spacing), 1);

  return Array.from({ length: steps }, (_, index) => {
    const progress = index / steps;

    return {
      mapX: from.mapX + (to.mapX - from.mapX) * progress,
      mapY: from.mapY + (to.mapY - from.mapY) * progress,
    };
  });
};

export const buildRoadRoutePoints = (
  from: MapPoint,
  to: MapPoint,
  destinationId?: string,
) => {
  const startProjection = getRoadProjection(from);
  const goalAnchorId = destinationId ? locationRoadAnchors[destinationId] : null;
  const goalProjection = goalAnchorId ? null : getRoadProjection(to);
  const routeGraph = Object.fromEntries(
    Object.entries(graph).map(([id, neighbors]) => [id, [...neighbors]]),
  );
  const virtualNodes = new Map<string, MapPoint>([
    [START_NODE_ID, startProjection.point],
  ]);

  addGraphConnection(
    routeGraph,
    START_NODE_ID,
    startProjection.fromId,
    startProjection.fromCost,
  );
  addGraphConnection(
    routeGraph,
    START_NODE_ID,
    startProjection.toId,
    startProjection.toCost,
  );

  let goalId = goalAnchorId ?? GOAL_NODE_ID;

  if (!goalAnchorId && goalProjection) {
    virtualNodes.set(GOAL_NODE_ID, goalProjection.point);
    addGraphConnection(
      routeGraph,
      GOAL_NODE_ID,
      goalProjection.fromId,
      goalProjection.fromCost,
    );
    addGraphConnection(
      routeGraph,
      GOAL_NODE_ID,
      goalProjection.toId,
      goalProjection.toCost,
    );
  }

  if (!goalAnchorId || !nodesById.has(goalAnchorId)) {
    goalId = GOAL_NODE_ID;
  }

  const nodeIds = [...roadNodes.map((node) => node.id), ...virtualNodes.keys()];
  const route = getRouteNodeIds(routeGraph, nodeIds, START_NODE_ID, goalId)
    .map((id) => virtualNodes.get(id) ?? nodesById.get(id))
    .filter(Boolean) as RoadNode[];

  return route.flatMap((point, index) =>
    index === route.length - 1
      ? [point]
      : interpolateSegment(point, route[index + 1]),
  );
};

export const getRouteDistanceMeters = (
  from: MapPoint,
  to: MapPoint,
  destinationId?: string,
) => {
  const points = buildRoadRoutePoints(from, to, destinationId);

  return points.slice(1).reduce((total, point, index) => {
    const previous = points[index];

    return total + getDistanceMeters(previous, point);
  }, 0);
};
