declare module "three/examples/jsm/controls/OrbitControls.js" {
  import { Camera, EventDispatcher, Vector3 } from "three";
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    enabled: boolean;
    target: Vector3;
    enableZoom: boolean;
    enablePan: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    rotateSpeed: number;
    update(): void;
    dispose(): void;
  }
}
