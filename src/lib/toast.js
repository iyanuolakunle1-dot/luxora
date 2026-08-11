import toast from 'react-hot-toast';

export const notify = {
  success: (msg) => toast.success(msg, { style: toastStyle('#10b981') }),
  error: (msg) => toast.error(msg, { style: toastStyle('#ef4444') }),
  info: (msg) => toast(msg, { icon: 'ℹ️', style: toastStyle('#e0a83c') }),
  loading: (msg) => toast.loading(msg, { style: toastStyle('#8b92a3') }),
  dismiss: (id) => toast.dismiss(id),
  promise: (promise, msgs) => toast.promise(promise, msgs, { style: toastStyle('#e0a83c') }),
};

function toastStyle(accent) {
  return {
    background: '#131722',
    color: '#e7e9ee',
    border: `1px solid ${accent}33`,
    borderRadius: '12px',
    fontSize: '13px',
    padding: '12px 14px',
  };
}
