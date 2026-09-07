const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
          aria-label="Loading"
        />

        <p className="text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;