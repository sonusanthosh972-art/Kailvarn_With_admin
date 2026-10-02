import { buildVideoKey, deleteObjects, headObject, isB2Configured, mediaUrl, presignPut } from '@/server/b2.js';
import { col } from '@/server/db.js';
import { findProject } from '@/server/designs.js';
import { MAX_VIDEO_BYTES, slugify, toObjectId, videoComplete, videoPresign } from '@/server/models.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

// Walkthrough videos live in Backblaze B2 next to the design images, uploaded
// straight from the browser with a presigned PUT. They cannot go through this
// server: a serverless request body is capped at 4.5 MB (well under
// MAX_VIDEO_BYTES) and the filesystem is read-only outside /tmp, so the old
// write into public/videos/ could never work once deployed.
//
// Presigned PUTs are good for an hour here rather than the images' 10 minutes --
// 120 MB over a slow connection needs the headroom.
const PRESIGN_TTL = 3600;

async function loadProject(id) {
  return toObjectId(id) ? findProject(id) : null;
}

// Guards against a presigned key being replayed against a different project.
function folderFor(project) {
  return `${process.env.B2_KEY_PREFIX || ''}designs/${slugify(project.category)}/${slugify(project.slug)}`;
}

// POST /api/admin/designs/:id/video { name, type, size }
// -> { uploadId, b2Key, uploadUrl } for a direct browser -> B2 PUT.
export async function POST(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  if (!isB2Configured()) return fail('Video storage (Backblaze B2) is not configured.', 503);

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail('Project not found', 404);

  const { data, response: bad } = validate(videoPresign, await readJson(request));
  if (bad) return bad;

  try {
    const keys = buildVideoKey({ category: project.category, projectSlug: project.slug, contentType: data.type });
    return ok({
      ...keys,
      name: data.name,
      contentType: data.type,
      uploadUrl: await presignPut(keys.b2Key, data.type, PRESIGN_TTL),
      expiresIn: PRESIGN_TTL,
    });
  } catch (err) {
    return serverError(err, 'presign project video');
  }
}

// PUT /api/admin/designs/:id/video { uploadId, b2Key, fileName, contentType, size }
// Called after the direct PUT: confirms the object is really in B2 before
// pointing the project at it, then drops the video it replaced.
export async function PUT(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail('Project not found', 404);

  const { data, response: bad } = validate(videoComplete, await readJson(request));
  if (bad) return bad;

  if (!data.b2Key.startsWith(`${folderFor(project)}/${data.uploadId}.`)) {
    return fail('Upload key does not match this project.', 400);
  }

  try {
    const head = await headObject(data.b2Key);
    if (!head.exists) return fail('The video was not found in storage. Please retry the upload.', 409);
    if (head.size > MAX_VIDEO_BYTES) return fail('Video is larger than 120 MB.', 413);

    const videoUrl = mediaUrl(data.b2Key);
    const previousKey = project.videoKey;
    await (await col('projects')).updateOne(
      { _id: project._id },
      { $set: { videoUrl, videoKey: data.b2Key, videoSize: head.size, videoContentType: data.contentType, updatedAt: new Date() } }
    );

    // Best effort: a stale object left in the bucket costs storage, not correctness.
    if (previousKey && previousKey !== data.b2Key) {
      await deleteObjects([previousKey]).catch(() => {});
    }

    return ok({ videoUrl, videoKey: data.b2Key, size: head.size });
  } catch (err) {
    return serverError(err, 'attach project video');
  }
}

// DELETE /api/admin/designs/:id/video — detaches the video and removes the
// object from B2. Videos from before B2 storage are plain paths under
// public/videos/ that ship with the build, so those only get detached: the file
// belongs to the deployment and cannot (and must not) be unlinked at runtime.
export async function DELETE(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail('Project not found', 404);

  try {
    await (await col('projects')).updateOne(
      { _id: project._id },
      { $set: { videoUrl: null, updatedAt: new Date() }, $unset: { videoKey: '', videoSize: '', videoContentType: '' } }
    );
    if (project.videoKey) await deleteObjects([project.videoKey]).catch(() => {});
    return ok({ deleted: true, message: 'Video removed from project' });
  } catch (err) {
    return serverError(err, 'remove project video');
  }
}
