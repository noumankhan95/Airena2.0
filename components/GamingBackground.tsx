// components/GlowingBackground.tsx
const GamingBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      {/* Top Left Glow */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-green-900 opacity-40 blur-2xl rounded-full" />

      {/* Top Right Glow */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-600 opacity-55 blur-2xl rounded-full" />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-7/12 w-72 h-72 bg-green-600 opacity-20 blur-2xl rounded-full transform -translate-x-1/2 -translate-y-1/2" />

      {/* Bottom Left Glow */}
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-emerald-800 opacity-25 blur-2xl rounded-full" />

      {/* Small Dot Glow */}
      {/* <div className="absolute bottom-12 right-16 w-4 h-2 bg-emerald-500 opacity-70 rounded-full" /> */}
    </div>
  );
};

export default GamingBackground;
