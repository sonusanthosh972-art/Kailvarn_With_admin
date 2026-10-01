import { writeFile, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { col } from '@/server/db.js';
import { findProject } from '@/server/designs.js';
import { toObjectId } from '@/server/models.js';
import { fail, ok, requireAdmin, serverError } from '@/server/http.js';

const execFileAsync = promisify(execFile);
const MAX_VIDEO_BYTES = 120 * 1024 * 1024; // 120 MB max raw video
const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];

async function loadProject(id) {
  return toObjectId(id) ? findProject(id) : null;
}

// POST /api/admin/designs/:id/video — Upload and attach a walkthrough video to a design
export async function POST(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail('Project not found', 404);

  try {
    const formData = await request.formData();
    const file = formData.get('video');

    if (!file || typeof file === 'string') {
      return fail('No video file provided', 400);
    }

    if (!ACCEPTED_TYPES.includes(file.type) && !/\.(mp4|webm|mov|m4v)$/i.test(file.name)) {
      return fail('Please upload an MP4, WebM, or MOV video file', 400);
    }

    if (file.size > MAX_VIDEO_BYTES) {
      return fail('Video is larger than 120 MB. Please compress or trim it.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const designsDir = path.join(process.cwd(), 'public', 'videos', 'designs');
    await mkdir(designsDir, { recursive: true });

    const safeSlug = project.slug || `project-${id}`;
    const rawFileName = `${safeSlug}-${Date.now()}-raw.mp4`;
    const finalFileName = `${safeSlug}-${Date.now()}.mp4`;
    const rawFilePath = path.join(designsDir, rawFileName);
    const finalFilePath = path.join(designsDir, finalFileName);

    await writeFile(rawFilePath, buffer);

    // Try compressing with ffmpeg if available: CRF 24 + faststart progressive streaming
    let usedFile = rawFileName;
    try {
      await execFileAsync('ffmpeg', [
        '-y',
        '-i', rawFilePath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '24',
        '-profile:v', 'high',
        '-level', '4.2',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-c:a', 'aac',
        '-b:a', '128k',
        finalFilePath,
      ], { timeout: 60000 });

      // Compression succeeded -> remove raw, keep compressed
      await unlink(rawFilePath).catch(() => {});
      usedFile = finalFileName;
    } catch {
      // ffmpeg failed or not in PATH -> use raw file directly
      usedFile = rawFileName;
    }

    const publicVideoUrl = `/videos/designs/${usedFile}`;

    // Update MongoDB project document
    await (await col('projects')).updateOne(
      { _id: project._id },
      { $set: { videoUrl: publicVideoUrl, updatedAt: new Date() } }
    );

    return ok({
      ok: true,
      videoUrl: publicVideoUrl,
      message: 'Video uploaded and attached to project successfully',
    });
  } catch (err) {
    return serverError(err, 'upload project video');
  }
}

// DELETE /api/admin/designs/:id/video — Detach and delete video from a design
export async function DELETE(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail('Project not found', 404);

  try {
    const oldUrl = project.videoUrl;

    // Clear videoUrl from MongoDB
    await (await col('projects')).updateOne(
      { _id: project._id },
      { $set: { videoUrl: null, updatedAt: new Date() } }
    );

    // If it was a local file in /videos/designs/, delete it to free space
    if (oldUrl && oldUrl.startsWith('/videos/designs/')) {
      const filePath = path.join(process.cwd(), 'public', oldUrl);
      await unlink(filePath).catch(() => {});
    }

    return ok({ deleted: true, message: 'Video removed from project' });
  } catch (err) {
    return serverError(err, 'remove project video');
  }
}
