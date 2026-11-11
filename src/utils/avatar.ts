export function getInitials(name: string): string {
  if (!name || !name.trim()) return 'TB';
  const parts = name
    .trim()
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'TB';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
  'bg-violet-600 text-white border-violet-400/40',
  'bg-purple-600 text-white border-purple-400/40',
  'bg-indigo-600 text-white border-indigo-400/40',
  'bg-fuchsia-600 text-white border-fuchsia-400/40',
  'bg-blue-600 text-white border-blue-400/40',
  'bg-emerald-600 text-white border-emerald-400/40',
  'bg-amber-600 text-white border-amber-400/40',
  'bg-rose-600 text-white border-rose-400/40',
];

export function getAvatarColor(name: string): string {
  if (!name) return AVATAR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}
