import { useEffect, useState } from 'react';
import api from '../../lib/api';

/**
 * <RelationSelect endpoint="/guests" labelKey="full_name" value={form.guest_id}
 *   onChange={(id) => setForm({ ...form, guest_id: id })} placeholder="Select guest…" />
 *
 * Fetches real records from the API and renders them as a normal <select>,
 * so admin forms link to actual Guests/Rooms/Roles instead of pasted UUIDs.
 */
export default function RelationSelect({ endpoint, labelKey = 'name', secondaryKey, value, onChange, placeholder = 'Select…', extraParams = {} }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoint, { params: { limit: 200, ...extraParams } })
      .then(({ data }) => setOptions(data?.data || []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <select className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} disabled={loading}>
      <option value="">{loading ? 'Loading…' : placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt[labelKey]}{secondaryKey && opt[secondaryKey] ? ` — ${opt[secondaryKey]}` : ''}
        </option>
      ))}
    </select>
  );
}
