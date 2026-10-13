// Server-side only: which Hugging Face model performs wall/ceiling
// segmentation. Kept isolated here so it can be swapped for a larger/more
// accurate ADE20K-trained model later without touching route logic.
export const SURFACE_SEGMENTATION_MODEL = 'nvidia/segformer-b5-finetuned-ade-640-640';

// Primary detector: Gemini's image model (Google API) redraws the
// photo as a flat color-coded map -- walls pure red, ceiling pure blue,
// everything else black. Unlike the ADE20K model above, it understands
// the scene (what is a wall vs. a cupboard, a window, a false ceiling
// light) instead of matching texture, so the masks it produces exclude
// furniture and fixtures far more reliably. The HF model stays as the
// fallback if this call fails.
export const AI_SURFACE_MODEL = 'gemini-3.1-flash-image';

// "AI realistic preview" (app/api/paint-preview): Gemini's image model takes
// the original photo + the browser-painted guide and returns a photorealistic
// render. Separate from AI_SURFACE_MODEL so each can be changed on its own.
// ~Rs 6.5 per call (image output); see src/constants/aiPricing.js.
export const PAINT_PREVIEW_MODEL = 'gemini-3.1-flash-image';

export const AI_SURFACE_PROMPT = `You are a precise semantic segmentation tool for an interior paint visualizer.
Convert the input room photo into a flat color-coded segmentation map with EXACTLY the same framing, perspective, camera angle and dimensions as the input. Every pixel must line up with the same location in the original photo.

Colors (flat fills only):
- PURE RED (#FF0000): every paintable WALL surface -- all walls, including partly hidden ones and wall areas visible between or behind objects.
- PURE BLUE (#0000FF): the CEILING surface, including false ceilings / cove areas that are painted plaster.
- PURE GREEN (#00FF00): every object mounted ON the ceiling -- ceiling lights, round/flush-mount lights, panel lights, recessed downlights and spotlights (even tiny ones), chandeliers and pendants, ceiling fans (blades, motor and rod), smoke detectors, speakers, AC vents, curtain tracks. Fill each object's full visible outline with green, including its rim and any shadow it casts on itself.
- PURE BLACK (#000000): EVERYTHING ELSE -- floor, skirting boards, doors and door frames, windows and window frames, glass, curtains and blinds, furniture, beds, sofas, cabinets, wardrobes, shelves, TV units, TVs, appliances, AC units, fans, lights and light fixtures, switches and sockets, paintings, frames, mirrors, clocks, plants, decor, tiles, wallpaper panels, wood/stone cladding, people and pets.

Rules:
- If an object is in front of a wall or ceiling, the object's pixels are BLACK, not red/blue.
- Windows, glass doors, balcony openings, the outdoor view (sky, buildings, trees), window frames, grills and sheer curtains are ALWAYS BLACK -- never blue or red, even though the sky looks like a ceiling.
- RED is ONLY flat, smooth, paintable plaster. Wooden slat / fluted / ribbed / acoustic panels, wall panelling and wainscoting, wood or stone cladding, brick, tiles, wallpaper and any textured feature wall are ALWAYS BLACK -- including the thin gaps between slats -- even though they cover a wall.
- Built-in furniture that covers a wall is ALWAYS BLACK: wall-to-wall storage units, cabinets, wardrobes, glossy or lacquered panel walls, shelving and open niches -- even when they are the same colour as the wall.
- Only paint the walls of the room the photo was taken in. Anything seen THROUGH an open door, doorway, arch, passage or corridor (walls, doors and floors of other rooms) is ALWAYS BLACK.
- BLUE is used ONLY for the overhead ceiling plane above the walls; nothing below the top edge of the walls can be blue.
- The ceiling must have a hole (GREEN) for every light or fixture on it -- scan the whole ceiling for small round lights and downlights and do not miss any.
- Walls and ceiling meet at a sharp boundary -- never blend red into blue.
- Solid flat colors only: no gradients, shading, anti-aliasing glow, textures, outlines, labels or text.
- A solid black border around the photo is padding, not part of the room: keep it BLACK.
- Do not add, remove, move or redraw anything. Output only the segmentation map.`;

// Gemini only accepts these output aspect ratios; we pick the one
// closest to the uploaded photo so the map stretches back onto it with
// minimal distortion.
export const AI_SURFACE_ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];

// The supported ratio closest to width/height, e.g. '4:5'. The client pads
// the photo to exactly this ratio before sending it, so the returned map
// lines up with the photo instead of being stretched back onto it.
export function closestAspectRatio(width, height) {
  const target = width / height;
  let best = '1:1';
  let bestDiff = Infinity;
  for (const r of AI_SURFACE_ASPECT_RATIOS) {
    const [w, h] = r.split(':').map(Number);
    const diff = Math.abs(Math.log(w / h) - Math.log(target));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = r;
    }
  }
  return best;
}
