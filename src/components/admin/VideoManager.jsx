'use client';

import React, { useState, useRef } from 'react';
import { Video, UploadCloud, Trash2, CheckCircle2, AlertCircle, Loader2, Play } from 'lucide-react';
import { adminApi } from '@/lib/adminApi.js';
import { putWithProgress } from '@/lib/imageProcess.js';
import { Button, Alert, ConfirmDialog } from '@/components/admin/ui.jsx';

const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];
const MAX_VIDEO_BYTES = 120 * 1024 * 1024;

export default function VideoManager({ projectId, currentVideoUrl, onVideoUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const fileInputRef = useRef(null);

  // Three steps, the same as the image uploader: ask the server for a presigned
  // PUT, send the file straight to B2 (never through the server -- a serverless
  // body is capped at 4.5 MB), then have the server confirm it landed.
  async function handleFileUpload(file) {
    if (!file) return;
    setError('');
    setSuccess('');

    if (!ACCEPTED_TYPES.includes(file.type) && !/\.(mp4|webm|mov|m4v)$/i.test(file.name)) {
      setError('Please upload an MP4, WebM or MOV video file.');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError('Video is larger than 120 MB. Please compress or trim it first.');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const type = ACCEPTED_TYPES.includes(file.type) ? file.type : 'video/mp4';
      const pres = await adminApi(`/api/admin/designs/${projectId}/video`, {
        method: 'POST',
        body: { name: file.name, type, size: file.size },
      });
      if (!pres.ok) throw new Error(pres.error?.message || 'Could not start the upload.');

      try {
        await putWithProgress(pres.data.uploadUrl, file, type, setProgress);
      } catch (err) {
        // No server-side fallback is possible for a file this size, so say what
        // actually needs fixing instead of a bare network error.
        if (err?.status === 0) {
          throw new Error('Storage rejected the upload. This domain may be missing from the B2 bucket CORS rule.');
        }
        throw err;
      }

      const done = await adminApi(`/api/admin/designs/${projectId}/video`, {
        method: 'PUT',
        body: {
          uploadId: pres.data.uploadId,
          b2Key: pres.data.b2Key,
          fileName: file.name,
          contentType: type,
          size: file.size,
        },
      });
      if (!done.ok) throw new Error(done.error?.message || 'Could not save the video.');

      setSuccess('Walkthrough video uploaded successfully!');
      onVideoUpdated(done.data.videoUrl);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error uploading video');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleRemoveVideo() {
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const res = await adminApi(`/api/admin/designs/${projectId}/video`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(res.error?.message || 'Failed to remove video');
      }

      setSuccess('Video removed. This design will now display images only.');
      onVideoUpdated(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error removing video');
    } finally {
      setUploading(false);
      setConfirmRemove(false);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog
        open={confirmRemove}
        onClose={() => !uploading && setConfirmRemove(false)}
        onConfirm={handleRemoveVideo}
        loading={uploading}
        title="Remove this video?"
        text="The walkthrough video will be removed from this design, and visitors will see its photos instead."
        confirmLabel="Remove video"
      />
      {error && <Alert>{error}</Alert>}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[13.5px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {currentVideoUrl ? (
        <div className="space-y-3">
          {/* Active Video Player Preview */}
          <div className="relative rounded-lg overflow-hidden bg-black/90 aspect-video max-w-lg border border-[#0B103B]/15">
            <video
              src={currentVideoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAFAF7] rounded-lg border border-[#0B103B]/10 max-w-lg">
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A6A1C] block">
                Active Walkthrough Video
              </span>
              <p className="text-[12.5px] font-mono text-[#0B103B]/80 truncate">
                {currentVideoUrl}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                loading={uploading}
              >
                Replace Video
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => setConfirmRemove(true)}
                disabled={uploading}
              >
                <Trash2 className="w-4 h-4" /> Remove
              </Button>
            </div>
          </div>
          <p className="text-[12px] text-[#6B675F]">
            This design has an active video. When clicked on the site, it will play the video.
          </p>
        </div>
      ) : (
        /* No Video Attached -> Dropzone / File Picker */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-[#F2B21B] bg-[#F2B21B]/5'
              : 'border-[#0B103B]/15 hover:border-[#0B103B]/30 bg-[#FAFAF7]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            disabled={uploading}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#0B103B]/5 flex items-center justify-center text-[#0B103B]">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#F2B21B]" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-[14px] font-bold text-[#0B103B]">
                {uploading ? `Uploading to storage… ${Math.round(progress * 100)}%` : 'Upload Walkthrough Video'}
              </p>
              <p className="text-[12px] text-[#6B675F] mt-0.5">
                Drag and drop your video file here, or browse from computer.
              </p>
              <p className="text-[11px] text-[#6B675F]/75 mt-0.5">
                Supports MP4, WebM, MOV (up to 120 MB). Please compress before uploading —
                MP4 (H.264) plays back most reliably.
              </p>
            </div>

            {uploading && (
              <div className="w-full max-w-xs h-1.5 rounded-full bg-[#0B103B]/10 overflow-hidden mt-1">
                <div
                  className="h-full bg-[#F2B21B] transition-[width] duration-200"
                  style={{ width: `${Math.max(2, Math.round(progress * 100))}%` }}
                />
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              loading={uploading}
            >
              <UploadCloud className="w-4 h-4 mr-1.5" /> Select Video File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
