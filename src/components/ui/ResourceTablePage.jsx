import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import PageHeader from './PageHeader';
import SearchInput from './SearchInput';
import Select from './Select';
import Pagination from './Pagination';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { useResource } from '../../hooks/useResource';
import { notify } from '../../lib/toast';

/**
 * A configurable CRUD list page.
 *
 * @param endpoint       API endpoint, e.g. '/guests'
 * @param title/subtitle Page header text
 * @param icon           lucide icon for empty state
 * @param columns        [{ key, label, render(row) }]
 * @param searchColumn    column the search box filters on
 * @param filterOptions   [{ key, label, options: [{value,label}] }]
 * @param FormFields      component({ form, setForm }) rendering the add/edit form fields
 * @param emptyForm       default object for the create form
 * @param buildCreatePayload(form) -> payload sent on create (defaults to form)
 * @param statCards       optional array of rendered <StatCard/> elements
 * @param addLabel        label for the "add" button
 */
export default function ResourceTablePage({
  endpoint, title, subtitle, icon, columns, searchColumn, filterOptions = [],
  FormFields, emptyForm = {}, buildCreatePayload, statCards, addLabel = 'Add New',
  extraActions,
}) {
  const { data, total, totalPages, loading, params, setParams, create, update, remove } = useResource(endpoint, { limit: 8 });
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ ...emptyForm, ...row }); setModalOpen(true); }
  function openView(row) { setViewing(row); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await update(editing.id, form); notify.success(`${title.replace(/s$/, '')} updated`); }
      else { await create(buildCreatePayload ? buildCreatePayload(form) : form); notify.success(`${title.replace(/s$/, '')} created`); }
      setModalOpen(false);
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Something went wrong');
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await remove(deleting.id); notify.success('Deleted successfully'); setDeleting(null); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to delete'); }
  }

  const renderedStatCards = typeof statCards === 'function' ? statCards({ data, total, loading }) : statCards;

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} actions={<>
        {extraActions}
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> {addLabel}</button>
      </>} />

      {renderedStatCards && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">{renderedStatCards}</div>}

      <div className="card p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          {searchColumn && <SearchInput value={params.search || ''} onChange={(v) => setParams((p) => ({ ...p, search: v, searchColumn, page: 1 }))} />}
          {filterOptions.map((f) => (
            <Select key={f.key} value={params[f.key] || 'all'} onChange={(v) => setParams((p) => ({ ...p, [f.key]: v, page: 1 }))} className="max-w-[170px]" options={f.options} />
          ))}
        </div>

        <div className="table-wrap">
          <table className="table-base">
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th></th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={columns.length + 1}><Skeleton className="h-6 w-full" /></td></tr>
              )) : data.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
                  <td>
                    <div className="flex gap-1">
                      <button className="btn-ghost !px-2" title="View Details" onClick={() => openView(row)}><Eye size={15} /></button>
                      <button className="btn-ghost !px-2" title="Edit" onClick={() => openEdit(row)}><Pencil size={15} /></button>
                      <button className="btn-ghost !px-2 hover:!text-red-400" title="Delete" onClick={() => setDeleting(row)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !data.length && <EmptyState icon={icon} title={`No ${title.toLowerCase()} found`} message="Try adjusting your filters, or add a new record." />}
        </div>

        <Pagination page={params.page} totalPages={totalPages} onChange={(p) => setParams((prev) => ({ ...prev, page: p }))} totalLabel={`Showing ${data.length} of ${total}`} />
      </div>

      {/* VIEW DETAILS MODAL */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`${title.replace(/s$/, '')} Details`} size="lg"
        footer={<button className="btn-outline" onClick={() => setViewing(null)}>Close</button>}>
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {columns.map((c) => (
                <div key={c.key} className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                  <p className="text-xs text-luxora-muted mb-1">{c.label}</p>
                  <div className="text-luxora-text font-medium">{c.render ? c.render(viewing) : viewing[c.key] || '—'}</div>
                </div>
              ))}
            </div>
            {viewing.description && (
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted mb-1">Description</p>
                <p className="text-luxora-text">{viewing.description}</p>
              </div>
            )}
            {viewing.created_at && (
              <p className="text-xs text-luxora-muted">Created on {new Date(viewing.created_at).toLocaleString()}</p>
            )}
          </div>
        )}
      </Modal>

      {/* EDIT / CREATE MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title.replace(/s$/, '')}` : addLabel} size="lg"
        footer={<>
          <button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" form="resource-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </>}>
        <form id="resource-form" onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FormFields ? (
            <FormFields form={form} setForm={setForm} />
          ) : (
            <p className="text-sm text-luxora-muted sm:col-span-2">No form fields configured for this resource.</p>
          )}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this record?" message="This action cannot be undone." />
    </div>
  );
}
