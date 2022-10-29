const TILE_SIZE: Number = 15;
const TILE_PADDING: Number = 2.5;
export const TILE_SPACE = (TILE_SIZE.valueOf()+(2*TILE_PADDING.valueOf()));
export const CONTROL_SPACE = 200;
export const ALGORITHMS = ["A* Pathfinder", "Dijkstra's Algorithm", "Breadth First Search"];
export enum Algorithms {
    A_STAR = "A* Pathfinder",
    DIJKSTRA = "Dijkstra's Algorithm",
    BREADTH = "Breadth First Search"
}