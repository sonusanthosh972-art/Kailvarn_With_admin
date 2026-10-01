'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, ArrowRight } from 'lucide-react';
import { DESIGN_CATEGORIES } from '@/constants/adminEnums.js';
import { adminApi } from '@/lib/adminApi.js';
import { Alert, Button, Card, Field, PageHeader, Spinner, StatusBadge, inputClass } from '@/components/admin/ui.jsx';
import Uploader from '@/components/admin/Uploader.jsx';
import NewProjectDialog from '../designs/NewProjectDialog.jsx';

function UploadScreen() {
  const params = useSearchParams();
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState(params.get('project') || '');
  const [creating, setCreating] = useState(false);
  const [uploaded, setUploaded] = useState(0);

  useEffect(() => {
    adminApi('/api/admin/designs').then((r) => (r.ok ? setProjects(r.data.items) : setError(r.error?.message)));
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!projects) return <Spinner />;

  const visible = category ? projects.filter((p) => p.category === category) : projects;
  const project = projects.find((p) => p.id === projectId);

  return (
    <>
      <PageHeader title="Upload Images" subtitle="Choose a project, then drop its photos. They're optimised in your browser and stored in Backblaze B2." />
      <Card className="mb-6 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
          <Field label="Category" htmlFor="u-cat">
            <select id="u-cat" value={category} onChange={(e) => { setCategory(e.target.value); setProjectId(''); }} className={inputClass}>
              <option value="">All categories</option>
              {DESIGN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Project" htmlFor="u-proj">
            <select id="u-proj" value={projectId} onChange={(e) => { setProjectId(e.target.value); setUploaded(0); }} className={inputClass}>
              <option value="">Select a project…</option>
              {visible.map((p) => <option key={p.id} value={p.id}>{p.title} — {p.category} ({p.imageCount} img{p.status === 'draft' ? ', draft' : ''})</option>)}
            </select>
          </Field>
          <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New project</Button>
        </div>
        {project && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#0B103B]/10 pt-4 text-[13.5px]">
            <StatusBadge status={project.status} />
            <span className="text-[#6B675F]">{project.category}{project.location ? ` · ${project.location}` : ''}</span>
            <Link href={`/admin/designs/${project.id}`} className="ml-auto inline-flex items-center gap-1 font-bold text-[#0B103B] hover:underline">
              Manage project{uploaded ? ` (${uploaded} new)` : ''} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Card>

      <Card className="p-5">
        {!project && <p className="mb-4 text-[14px] text-[#6B675F]">Select a project above to enable uploading.</p>}
        <Uploader key={projectId || 'none'} projectId={projectId} defaultAlt={project?.title || ''} disabled={!project} onUploaded={() => setUploaded((n) => n + 1)} />
        {project?.status === 'draft' && uploaded > 0 && (
          <p className="mt-4 text-[13.5px] text-[#6B675F]">This project is still a draft — <Link href={`/admin/designs/${project.id}`} className="font-bold text-[#0B103B] underline underline-offset-4">publish it</Link> to show it on the website.</p>
        )}
      </Card>

      <NewProjectDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(p) => { setProjects((list) => [p, ...list]); setCategory(''); setProjectId(p.id); setCreating(false); }}
      />
    </>
  );
}

export default function UploadPage() {
  return <Suspense fallback={<Spinner />}><UploadScreen /></Suspense>;
}
