const Card = ({
  children,
  title,
  description,
  actions,
  className = "",
}) => {
  return (
    <section
      className={`
        rounded-xl border border-slate-200 bg-white shadow-sm
        ${className}
      `}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-900">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {children}
      </div>
    </section>
  );
};

export default Card;