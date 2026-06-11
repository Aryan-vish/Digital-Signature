export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 text-sm text-steel">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-mint" />
      {label}
    </div>
  );
}
