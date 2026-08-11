import axios from 'axios';
import { supabase } from './supabaseClient';
import clientCache from './cache';

const rawApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

rawApi.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Builds a deterministic cache key from URL and query parameters
 */
function buildCacheKey(url, params) {
  if (!params || Object.keys(params).length === 0) return url;
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  return `${url}?${new URLSearchParams(sorted).toString()}`;
}

const api = {
  ...rawApi,
  
  /**
   * Fast SWR GET request: returns cached data immediately if available,
   * while revalidating in background.
   */
  async get(url, config = {}) {
    const { skipCache = false, ttl = 2 * 60 * 1000, ...axiosConfig } = config;
    const cacheKey = buildCacheKey(url, axiosConfig.params);

    if (!skipCache) {
      const cachedData = clientCache.get(cacheKey);
      if (cachedData !== null) {
        // Trigger background silent revalidation to keep data fresh
        rawApi.get(url, axiosConfig)
          .then((res) => {
            clientCache.set(cacheKey, res.data, ttl);
          })
          .catch(() => {});

        return {
          data: cachedData,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {},
          config: axiosConfig,
          fromCache: true,
        };
      }
    }

    // No cache or cache skipped: fetch directly
    const res = await rawApi.get(url, axiosConfig);
    if (!skipCache && res.status >= 200 && res.status < 300) {
      clientCache.set(cacheKey, res.data, ttl);
    }
    return res;
  },

  async post(url, data, config) {
    const res = await rawApi.post(url, data, config);
    clientCache.invalidate(url);
    return res;
  },

  async put(url, data, config) {
    const res = await rawApi.put(url, data, config);
    clientCache.invalidate(url);
    return res;
  },

  async patch(url, data, config) {
    const res = await rawApi.patch(url, data, config);
    clientCache.invalidate(url);
    return res;
  },

  async delete(url, config) {
    const res = await rawApi.delete(url, config);
    clientCache.invalidate(url);
    return res;
  },

  interceptors: rawApi.interceptors,
  defaults: rawApi.defaults,
};

export default api;
