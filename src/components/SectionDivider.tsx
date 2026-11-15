// Pixel divider: dotted pixel rails fading out toward the edges, with a
// small diamond "gem" in the middle built from square pixels.
const rail = {
  height: 4,
  backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.14) 50%, transparent 50%)",
  backgroundSize: "8px 4px",
};

function Gem() {
  return (
    <svg width="20" height="20" viewBox="0 0 5 5" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="0" width="1" height="1" fill="#7a5dff" />
      <rect x="1" y="1" width="3" height="1" fill="#7a5dff" />
      <rect x="0" y="2" width="5" height="1" fill="#4edbec" />
      <rect x="1" y="3" width="3" height="1" fill="#5a3fd6" />
      <rect x="2" y="4" width="1" height="1" fill="#5a3fd6" />
      <rect x="2" y="1" width="1" height="1" fill="#c4b5ff" />
    </svg>
  );
}

export default function SectionDivider() {
  return (
    // Generous vertical gap so the animated grid shows between sections
    <div className="flex items-center gap-4 max-w-4xl mx-auto px-5 my-20 md:my-32" aria-hidden="true">
      <div className="flex-1" style={{ ...rail, maskImage: "linear-gradient(to right, transparent, #000)" }} />
      <Gem />
      <div className="flex-1" style={{ ...rail, maskImage: "linear-gradient(to left, transparent, #000)" }} />
    </div>
  );
}
