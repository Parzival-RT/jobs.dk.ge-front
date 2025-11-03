export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            იტვირთება...
          </h2>
          <p className="text-sm text-gray-500">გთხოვთ მოითმინოთ</p>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
