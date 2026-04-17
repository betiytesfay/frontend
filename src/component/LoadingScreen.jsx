export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 animate-spin" />
      </div>

      {/* Logo / brand */}
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400 tracking-wide">GIBI</div>
        <div className="text-sm text-gray-400 mt-1">{message}</div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
