import { Shape, Body, World } from "cannon-es";
import { Color3, Mesh, Scene } from "@babylonjs/core";
export type DebugOptions = {
    color?: string | number | Color3;
    scale?: number;
    onInit?: (body: Body, mesh: Mesh, shape: Shape) => void;
    onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void;
};
export default function CannonDebugger(scene: Scene, world: World, { color, scale, onInit, onUpdate }?: DebugOptions): {
    update: () => void;
};

//# sourceMappingURL=cannon-es-debugger.d.ts.map
