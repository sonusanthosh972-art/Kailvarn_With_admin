Place the AR POC model here as:

```
modern-living-room-design-1.glb
```

Referenced by `AR_DESIGN.modelUrl` in `src/constants/arConfig.js`.
If this file is missing or fails to parse, the AR page shows "Unable to load the 3D design." instead of crashing.

**Current state:** `modern-living-room-design-1.glb` is a simple self-authored placeholder
-- a boxy LCD TV on a stand (flat screen + bezel + neck + foot + soundbar), built with
`three`'s primitives and exported via `GLTFExporter`. Regenerate it with
`node tools/build-placeholder-tv-model.mjs` from the project root. It's a rough stand-in
for the "TV on easel stand" object identified in `docs/ar/modern-living-room-design-1-spec.json`,
not a finished asset. Replace this file with a real model once one exists (e.g. a proper
textured TV, or eventually the full room scene) -- no code changes are needed elsewhere.
