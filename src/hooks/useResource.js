import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';
import { notify } from '../lib/toast';

/**
 * useResource('/rooms', { limit: 8 })
 * Handles: list fetching (page/search/filters), create, update, remove.
 */
export function useResource(endpoint, initialParams = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 8, ...initialParams });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(endpoint, { params });
      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function create(payload) {
    const { data: res } = await api.post(endpoint, payload);
    await fetchData();
    return res.data;
  }

  async function update(id, payload) {
    const { data: res } = await api.put(`${endpoint}/${id}`, payload);
    await fetchData();
    return res.data;
  }

  async function remove(id) {
    await api.delete(`${endpoint}/${id}`);
    await fetchData();
  }

  const totalPages = Math.max(1, Math.ceil(total / params.limit));

  return {
    data, total, totalPages, loading, params, setParams,
    refetch: fetchData, create, update, remove,
  };
}
