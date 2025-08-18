"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
  Center,
  Clone,
} from "@react-three/drei";

const MODEL_URL = "/models/car.glb";

export default function Model3DPage() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="min-h-dvh bg-[#2E4270] text-slate-900">
      <div className="mx-auto max-w-[420px] px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-[#FBFCF9] shadow-xl ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-[#2E4270] px-6 pt-6 pb-4 text-center text-white">
            <h1 className="text-xl font-semibold tracking-wide">
              Bedah<span className="font-bold">Gang</span> • 3D Viewer
            </h1>
            <p className="mt-2 text-xs text-white/80">
              Pinch/scroll to zoom • drag to rotate • two-finger drag to pan
            </p>
          </div>

          {/* Viewer */}
          <div className="relative h-80 w-full overflow-hidden bg-white">
            <Canvas
              camera={{ position: [2.5, 1.6, 2.5], fov: 45 }}
              dpr={[1, 2]}
            >
              <Suspense fallback={<Loader />}>
                <Center>
                  <Model url={MODEL_URL} />
                </Center>

                {/* Soft ground shadow */}
                <ContactShadows
                  position={[0, -0.001, 0]}
                  opacity={0.4}
                  scale={6}
                  blur={2.5}
                  far={4}
                />

                {/* Image-based lighting (neutral studio) */}
                <Environment preset="studio" />
              </Suspense>

              <OrbitControls
                enableDamping
                dampingFactor={0.08}
                makeDefault
                autoRotate={autoRotate}
                autoRotateSpeed={0.8}
                minDistance={1}
                maxDistance={10}
                target={[0, 0, 0]}
              />
            </Canvas>

            {/* Overlay controls */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setAutoRotate((v) => !v)}
                className="pointer-events-auto rounded-full bg-[#3A54A0] px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#344C90] active:scale-[0.99]"
              >
                {autoRotate ? "Pause Rotate" : "Auto Rotate"}
              </button>
              <a
                href={MODEL_URL}
                className="pointer-events-auto rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm"
              >
                Download GLB
              </a>
            </div>
          </div>

          {/* File path hint */}
          <div className="px-5 pb-5 pt-3 text-xs text-slate-600">
            Model path: <code className="rounded bg-slate-100 px-1 py-0.5">{MODEL_URL}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- 3D Model component --------- */

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <Clone object={scene} />;
}
useGLTF.preload("/models/car.glb");


/* --------- Loading overlay --------- */
function Loader() {
  return (
    <Html center>
      <div className="rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow">
        Loading 3D…
      </div>
    </Html>
  );
}
