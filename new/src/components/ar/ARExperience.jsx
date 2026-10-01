'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, RotateCw, Plus, Minus, RefreshCw } from 'lucide-react';
import { AR_DESIGN } from '@/constants/arConfig.js';

// Phases: checking -> idle -> searching -> found -> placing -> placed
// Terminal/error phases: unsupported-desktop | unsupported-browser | denied | model-error
const STATUS_TEXT = {
  checking: 'Starting AR...',
  searching: 'Move your phone slowly to find the floor.',
  found: 'Tap to place the design.',
  placing: `Loading ${AR_DESIGN.name}...`,
  placed: AR_DESIGN.name,
};

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

export default function ARExperience() {
  const [phase, setPhase] = useState('checking');
  const [diagnostic, setDiagnostic] = useState('');
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  // Mutable, non-render-triggering AR/Three.js state kept in refs.
  const threeRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const reticleRef = useRef(null);
  const controllerRef = useRef(null);
  const sessionRef = useRef(null);
  const sessionEndedRef = useRef(true);
  const hitTestSourceRef = useRef(null);
  const hitTestSourceRequestedRef = useRef(false);
  const modelRef = useRef(null);
  const placedRef = useRef(false);
  const phaseRef = useRef('checking');
  const rotationYRef = useRef(0);
  const scaleRef = useRef(1);

  const setPhaseSafe = useCallback((next) => {
    if (phaseRef.current === next) return;
    phaseRef.current = next;
    setPhase(next);
  }, []);

  // --- Support check (client-only; runs after mount) ---
  useEffect(() => {
    let cancelled = false;

    async function checkSupport() {
      const secure = typeof window !== 'undefined' ? window.isSecureContext : 'unknown';

      if (!isMobileDevice()) {
        setPhaseSafe('unsupported-desktop');
        return;
      }
      if (typeof navigator === 'undefined' || !('xr' in navigator)) {
        setDiagnostic(`navigator.xr is unavailable. isSecureContext=${secure}, UA="${navigator.userAgent}"`);
        setPhaseSafe('unsupported-browser');
        return;
      }
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (cancelled) return;
        if (!supported) {
          setDiagnostic(`isSessionSupported("immersive-ar") returned false. isSecureContext=${secure}, UA="${navigator.userAgent}"`);
        }
        setPhaseSafe(supported ? 'idle' : 'unsupported-browser');
      } catch (err) {
        if (!cancelled) {
          setDiagnostic(`isSessionSupported threw: ${err && err.message ? err.message : String(err)}. isSecureContext=${secure}`);
          setPhaseSafe('unsupported-browser');
        }
      }
    }

    checkSupport();
    return () => {
      cancelled = true;
    };
  }, [setPhaseSafe]);

  // --- Cleanup: dispose Three.js resources, end the XR session ---
  const cleanup = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const controller = controllerRef.current;
    const session = sessionRef.current;

    if (controller && selectListenerRef.current) {
      controller.removeEventListener('select', selectListenerRef.current);
    }
    if (session && !sessionEndedRef.current) {
      sessionEndedRef.current = true;
      // end() returns a promise that rejects (InvalidStateError) if the
      // session already ended on its own (e.g. a system back-gesture) --
      // catch it here so it doesn't surface as an unhandled rejection.
      session.end().catch(() => {});
    }
    if (renderer) {
      renderer.setAnimationLoop(null);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((mat) => {
            Object.values(mat).forEach((value) => {
              if (value && value.isTexture) value.dispose();
            });
            mat.dispose();
          });
        }
      });
    }

    rendererRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
    reticleRef.current = null;
    controllerRef.current = null;
    sessionRef.current = null;
    hitTestSourceRef.current = null;
    hitTestSourceRequestedRef.current = false;
    modelRef.current = null;
    placedRef.current = false;
    selectListenerRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const onSelectRef = useRef(() => {});
  const selectListenerRef = useRef(null);

  const placeOrMoveModel = useCallback((position, quaternion) => {
    const THREE = threeRef.current;
    const scene = sceneRef.current;
    if (!THREE || !scene) return;

    if (!placedRef.current) {
      setPhaseSafe('placing');
      import('three/examples/jsm/loaders/GLTFLoader.js')
        .then(({ GLTFLoader }) => {
          const loader = new GLTFLoader();
          loader.load(
            AR_DESIGN.modelUrl,
            (gltf) => {
              const model = gltf.scene;
              model.position.copy(position);
              model.quaternion.copy(quaternion);
              rotationYRef.current = 0;
              scaleRef.current = 1;
              model.scale.setScalar(scaleRef.current);
              scene.add(model);
              modelRef.current = model;
              placedRef.current = true;
              setPhaseSafe('placed');
            },
            undefined,
            () => {
              setPhaseSafe('model-error');
            }
          );
        })
        .catch(() => setPhaseSafe('model-error'));
    } else if (modelRef.current) {
      modelRef.current.position.copy(position);
    }
  }, [setPhaseSafe]);

  onSelectRef.current = () => {
    const reticle = reticleRef.current;
    const THREE = threeRef.current;
    if (!reticle || !reticle.visible || !THREE) return;

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    reticle.matrix.decompose(position, quaternion, scale);
    placeOrMoveModel(position, quaternion);
  };

  const onXRFrame = useCallback((timestamp, frame) => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const reticle = reticleRef.current;
    if (!renderer || !scene || !camera || !frame) return;

    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (!hitTestSourceRequestedRef.current) {
      hitTestSourceRequestedRef.current = true;
      session.requestReferenceSpace('viewer').then((viewerSpace) => {
        session.requestHitTestSource({ space: viewerSpace }).then((source) => {
          hitTestSourceRef.current = source;
        });
      });
    }

    if (hitTestSourceRef.current) {
      const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        reticle.visible = true;
        reticle.matrix.fromArray(pose.transform.matrix);
        if (!placedRef.current) setPhaseSafe('found');
      } else {
        reticle.visible = false;
        if (!placedRef.current) setPhaseSafe('searching');
      }
    }

    renderer.render(scene, camera);
  }, [setPhaseSafe]);

  // --- Start the AR session (must run from a user gesture) ---
  const startAR = useCallback(async () => {
    try {
      const [THREE] = await Promise.all([import('three')]);
      threeRef.current = THREE;

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor'],
        domOverlay: { root: overlayRef.current },
      });
      sessionRef.current = session;
      sessionEndedRef.current = false;
      session.addEventListener('end', () => {
        sessionEndedRef.current = true;
        placedRef.current = false;
        hitTestSourceRef.current = null;
        hitTestSourceRequestedRef.current = false;
      });

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      containerRef.current.appendChild(renderer.domElement);
      await renderer.xr.setSession(session);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera();
      cameraRef.current = camera;

      const light = new THREE.HemisphereLight(0xffffff, 0x555577, 1.2);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      const reticleGeometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
      const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00e0a0 });
      const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);
      reticleRef.current = reticle;

      const controller = renderer.xr.getController(0);
      const selectListener = () => onSelectRef.current();
      controller.addEventListener('select', selectListener);
      selectListenerRef.current = selectListener;
      scene.add(controller);
      controllerRef.current = controller;

      setPhaseSafe('searching');
      renderer.setAnimationLoop(onXRFrame);
    } catch (err) {
      if (err && err.name === 'NotAllowedError') {
        setPhaseSafe('denied');
      } else {
        setDiagnostic(`requestSession("immersive-ar") failed: ${err && err.name ? err.name + ': ' : ''}${err && err.message ? err.message : String(err)}`);
        setPhaseSafe('unsupported-browser');
      }
    }
  }, [onXRFrame, setPhaseSafe]);

  const handleExit = useCallback(() => {
    cleanup();
    setPhaseSafe('idle');
  }, [cleanup, setPhaseSafe]);

  const handleReset = useCallback(() => {
    const scene = sceneRef.current;
    const model = modelRef.current;
    if (scene && model) {
      scene.remove(model);
      model.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((mat) => mat.dispose());
        }
      });
    }
    modelRef.current = null;
    placedRef.current = false;
    setPhaseSafe('searching');
  }, [setPhaseSafe]);

  const handleRotate = useCallback(() => {
    const model = modelRef.current;
    if (!model) return;
    rotationYRef.current += Math.PI / 4;
    model.rotation.y = rotationYRef.current;
  }, []);

  const handleScale = useCallback((factor) => {
    const model = modelRef.current;
    if (!model) return;
    scaleRef.current = Math.min(3, Math.max(0.2, scaleRef.current * factor));
    model.scale.setScalar(scaleRef.current);
  }, []);

  const isFullscreenAR = ['searching', 'found', 'placing', 'placed'].includes(phase);

  return (
    <div className="fixed inset-0 bg-black z-[9999]">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Non-AR informational states (no camera feed) */}
      {phase === 'checking' && (
        <FullscreenMessage>{STATUS_TEXT.checking}</FullscreenMessage>
      )}

      {phase === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#1A1A2E] text-white px-6 text-center">
          <h1 className="font-nunito font-semibold text-[18px]">{AR_DESIGN.name}</h1>
          <p className="text-white/70 text-[14px] max-w-xs">
            Point your camera at an open floor area to place this design in your room.
          </p>
          <button
            onClick={startAR}
            className="bg-[#C9A84C] hover:bg-[#b59540] text-[#1A1A2E] font-nunito font-bold text-[15px] px-8 py-3.5 rounded-lg transition-colors duration-300"
          >
            Start AR
          </button>
          <BackLink />
        </div>
      )}

      {phase === 'unsupported-desktop' && (
        <FullscreenMessage>
          AR is available on supported mobile devices.
        </FullscreenMessage>
      )}

      {phase === 'unsupported-browser' && (
        <FullscreenMessage>
          AR is not supported on this device or browser.
          {diagnostic && <DiagnosticBlock text={diagnostic} />}
        </FullscreenMessage>
      )}

      {phase === 'denied' && (
        <FullscreenMessage>
          Camera permission is required to use AR.
        </FullscreenMessage>
      )}

      {phase === 'model-error' && (
        <FullscreenMessage>
          Unable to load the 3D design.
        </FullscreenMessage>
      )}

      {/* AR dom-overlay root: must exist in the DOM *before* startAR() calls
          requestSession({ domOverlay: { root } }), so this stays mounted for
          the whole 'idle' -> AR-session lifetime, not just while isFullscreenAR. */}
      {(phase === 'idle' || isFullscreenAR) && (
        <div ref={overlayRef} className="absolute inset-0 pointer-events-none">
          {isFullscreenAR && (
            <>
              <div className="absolute top-4 left-4 pointer-events-auto">
                <button
                  onClick={handleExit}
                  aria-label="Close AR"
                  className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {phase !== 'placed' && (
                <div className="absolute top-20 inset-x-0 flex justify-center pointer-events-none px-6">
                  <p className="bg-black/60 text-white px-4 py-2 rounded-full text-[13px] text-center font-nunito">
                    {STATUS_TEXT[phase]}
                  </p>
                </div>
              )}

              {phase === 'placed' && (
                <>
                  <div className="absolute top-20 inset-x-0 flex justify-center pointer-events-none px-6">
                    <p className="bg-black/60 text-white px-4 py-2 rounded-full text-[13px] text-center font-nunito">
                      {AR_DESIGN.name}
                    </p>
                  </div>
                  <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 pointer-events-auto px-4">
                    <ControlButton onClick={handleRotate} label="Rotate">
                      <RotateCw className="w-5 h-5" />
                    </ControlButton>
                    <ControlButton onClick={() => handleScale(1.1)} label="Scale up">
                      <Plus className="w-5 h-5" />
                    </ControlButton>
                    <ControlButton onClick={() => handleScale(0.9)} label="Scale down">
                      <Minus className="w-5 h-5" />
                    </ControlButton>
                    <ControlButton onClick={handleReset} label="Reset">
                      <RefreshCw className="w-5 h-5" />
                    </ControlButton>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DiagnosticBlock({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable -- text is still selectable via long-press.
    }
  };

  return (
    <div className="mt-3 max-w-xs mx-auto">
      <p className="text-white/80 text-[12px] font-mono break-words select-all bg-black/40 rounded-lg p-3">
        {text}
      </p>
      <button
        onClick={handleCopy}
        className="mt-2 text-[12px] font-nunito font-semibold text-[#C9A84C] underline"
      >
        {copied ? 'Copied!' : 'Copy error details'}
      </button>
    </div>
  );
}

function FullscreenMessage({ children }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#1A1A2E] text-white px-6 py-10 text-center overflow-y-auto">
      <div className="font-nunito text-[15px] max-w-sm">{children}</div>
      <BackLink />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/our-design"
      className="border-2 border-white/80 text-white hover:bg-white hover:text-[#1A1A2E] font-nunito font-semibold text-[14px] px-6 py-2.5 rounded-lg transition-all duration-300"
    >
      Back to Designs
    </Link>
  );
}

function ControlButton({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-95 transition-transform"
    >
      {children}
    </button>
  );
}
