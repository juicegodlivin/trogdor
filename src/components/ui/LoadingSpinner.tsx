export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative w-24 h-24">
        {/* Hand-drawn spinner */}
        <div className="absolute inset-0 border-4 border-sketch border-t-accent-red rounded-full animate-spin" />
        <div className="absolute inset-2 border-2 border-sketch border-t-accent-yellow rounded-full animate-spin" />
        <div className="absolute inset-4 border-2 border-sketch border-t-accent-green rounded-full animate-spin" />
      </div>
    </div>
  );
}

