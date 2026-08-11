const map = {
  green: 'badge-green', yellow: 'badge-yellow', red: 'badge-red',
  blue: 'badge-blue', purple: 'badge-purple', gray: 'badge-gray',
};

export default function Badge({ color = 'gray', children }) {
  return <span className={map[color] || map.gray}>{children}</span>;
}
