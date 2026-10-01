// One-off script that generated public/models/modern-living-room-design-1.glb
// (a rough placeholder LCD TV: foot + neck + bezel + display panel + soundbar).
// Not wired into any build step -- run manually with `node tools/build-placeholder-tv-model.mjs`
// from the project root if the placeholder ever needs to be regenerated.
import * as THREE from 'three';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// GLTFExporter's binary path uses the browser FileReader API, which Node lacks.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

const root = new THREE.Group();
root.name = 'LCD_TV';

// Stand base (foot), sitting on the floor (y = 0 is the AR floor anchor)
const footGeo = new THREE.BoxGeometry(0.5, 0.03, 0.25);
const standMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.4, metalness: 0.3 });
const foot = new THREE.Mesh(footGeo, standMat);
foot.position.set(0, 0.015, 0);
foot.name = 'Stand_Foot';
root.add(foot);

// Neck connecting the foot to the screen
const neckGeo = new THREE.BoxGeometry(0.06, 0.35, 0.04);
const neck = new THREE.Mesh(neckGeo, standMat);
neck.position.set(0, 0.03 + 0.175, 0);
neck.name = 'Stand_Neck';
root.add(neck);

// Screen bezel (slightly larger, dark frame)
const bezelGeo = new THREE.BoxGeometry(1.3, 0.75, 0.04);
const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.5, metalness: 0.2 });
const bezel = new THREE.Mesh(bezelGeo, bezelMat);
const screenCenterY = 0.03 + 0.35 + 0.375;
bezel.position.set(0, screenCenterY, 0);
bezel.name = 'Screen_Bezel';
root.add(bezel);

// Display panel (glossy black glass, sits slightly in front of the bezel)
const panelGeo = new THREE.BoxGeometry(1.22, 0.68, 0.01);
const panelMat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.08, metalness: 0.1 });
const panel = new THREE.Mesh(panelGeo, panelMat);
panel.position.set(0, screenCenterY, 0.025);
panel.name = 'Display_Panel';
root.add(panel);

// Soundbar beneath the screen
const soundbarGeo = new THREE.BoxGeometry(0.9, 0.06, 0.08);
const soundbarMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.1 });
const soundbar = new THREE.Mesh(soundbarGeo, soundbarMat);
soundbar.position.set(0, 0.03 + 0.35 - 0.02, 0.05);
soundbar.name = 'Soundbar';
root.add(soundbar);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'public', 'models', 'modern-living-room-design-1.glb');

const exporter = new GLTFExporter();
exporter.parse(
  root,
  (result) => {
    fs.writeFileSync(outPath, Buffer.from(result));
    console.log('Wrote', outPath, '-', Buffer.from(result).length, 'bytes');
  },
  (err) => {
    console.error('Export error:', err);
    process.exit(1);
  },
  { binary: true }
);
