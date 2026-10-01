// Server-side only: which Hugging Face model performs wall/ceiling
// segmentation. Kept isolated here so it can be swapped for a larger/more
// accurate ADE20K-trained model later without touching route logic.
export const SURFACE_SEGMENTATION_MODEL = 'nvidia/segformer-b5-finetuned-ade-640-640';
