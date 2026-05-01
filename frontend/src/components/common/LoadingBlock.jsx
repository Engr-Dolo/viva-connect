const LoadingBlock = ({ label = 'Loading...' }) => {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
      <div className="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 border-t-viva-leaf" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
    </div>
  );
};

export default LoadingBlock;
