const toneClasses = {
  leaf: 'bg-viva-leaf text-white',
  maroon: 'bg-viva-maroon text-white',
  saffron: 'bg-viva-saffron text-white',
  ink: 'bg-viva-ink text-white',
};

const StatCard = ({ isLoading = false, label, value, icon: Icon, tone }) => {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-viva-ink">{isLoading ? '...' : value}</p>
        </div>
        <span className={`inline-flex size-11 items-center justify-center rounded-md ${toneClasses[tone]}`}>
          <Icon size={21} />
        </span>
      </div>
    </article>
  );
};

export default StatCard;
