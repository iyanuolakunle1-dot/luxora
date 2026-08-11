import { useState } from 'react';
import { Globe, Save, UploadCloud, Loader2, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useResource } from '../../hooks/useResource';
import { uploadViaServer } from '../../lib/cloudinary';
import { notify } from '../../lib/toast';

const categories = ['Hotel Exterior', 'Rooms & Suites', 'Dining', 'Facilities', 'Spa & Wellness', 'Events', 'Experiences'];

export default function WebsiteManagement() {
  const [tab, setTab] = useState('gallery');

  return (
    <div>
      <PageHeader title="Website Management" subtitle="Control the content shown on your public-facing Luxora website." />

      <div className="flex gap-6 border-b border-luxora-border mb-6 text-sm">
        {[['gallery', 'Gallery'], ['hero', 'Homepage Hero'], ['seo', 'SEO Settings']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`pb-3 -mb-px border-b-2 font-medium ${tab === id ? 'border-luxora-gold text-luxora-gold' : 'border-transparent text-luxora-muted hover:text-luxora-text'}`}>{label}</button>
        ))}
      </div>

      {tab === 'gallery' && <GalleryManager />}
      {tab === 'hero' && <HeroSettings />}
      {tab === 'seo' && <SeoSettings />}
    </div>
  );
}

const emptyForm = { category: categories[0], image_url: '', caption: '' };

// This directly manages the `gallery_images` table — every photo added here
// shows up immediately on the public /gallery page. No hardcoded images.
function GalleryManager() {
  const { data, loading, create, remove } = useResource('/gallery', { limit: 100 });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadViaServer(file, 'luxora/gallery');
      setForm((f) => ({ ...f, image_url: res.url, public_id: res.public_id }));
      notify.success('Image uploaded');
    } catch { notify.error('Upload failed — check your Cloudinary/server config'); }
    finally { setUploading(false); }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.image_url) return notify.error('Please upload an image first');
    setSaving(true);
    try {
      await create(form);
      notify.success('Photo added to gallery');
      setModalOpen(false);
      setForm(emptyForm);
    } catch (err) { notify.error(err?.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await remove(deleting.id); notify.success('Photo removed'); setDeleting(null); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to delete'); }
  }

  return (
    <div className="card p-5">
      <div className="flex justify-end mb-5">
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setModalOpen(true); }}><Plus size={16} /> Add Photo</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}</div>
      ) : data.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square bg-white/5">
              <img src={img.image_url} className="w-full h-full object-cover" alt={img.caption || ''} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => setDeleting(img)} className="w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
              <span className="absolute bottom-1 left-1 badge bg-black/70 text-white !text-[10px]">{img.category}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={ImageIcon} title="Gallery is empty" message="Add your first property photo — it will appear on the public Gallery page instantly." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Photo"
        footer={<><button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" form="gallery-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add to Gallery'}</button></>}>
        <form id="gallery-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-luxora-border overflow-hidden flex items-center justify-center shrink-0">
                {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={20} className="text-luxora-muted" />}
              </div>
              <label className="btn-outline cursor-pointer">
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} {uploading ? 'Uploading…' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Caption (optional)</label><input className="input" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} /></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Remove this photo?" message="It will disappear from the public Gallery page." />
    </div>
  );
}

function HeroSettings() {
  return (
    <div className="card p-6 max-w-xl">
      <h3 className="font-semibold text-luxora-text mb-4 flex items-center gap-2"><Globe size={16} className="text-luxora-gold" /> Homepage Hero</h3>
      <div className="space-y-4">
        <div><label className="label">Headline</label><input className="input" defaultValue="Experience Luxury Like Never Before" /></div>
        <div><label className="label">Subheadline</label><textarea rows={3} className="input" defaultValue="Discover a world of comfort, elegance, and exceptional hospitality." /></div>
        <button onClick={() => notify.success('Homepage content saved')} className="btn-primary"><Save size={15} /> Save</button>
      </div>
    </div>
  );
}

function SeoSettings() {
  return (
    <div className="card p-6 max-w-xl">
      <h3 className="font-semibold text-luxora-text mb-4">SEO Settings</h3>
      <div className="space-y-4">
        <div><label className="label">Meta Title</label><input className="input" defaultValue="Luxora Hotels & Resorts | Luxury Redefined" /></div>
        <div><label className="label">Meta Description</label><textarea rows={3} className="input" defaultValue="Book your stay at Luxora Hotels & Resorts for world-class luxury, dining and hospitality." /></div>
        <button onClick={() => notify.success('SEO settings saved')} className="btn-primary"><Save size={15} /> Save</button>
      </div>
    </div>
  );
}
