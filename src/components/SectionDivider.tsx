export default function SectionDivider() {
  return (
    <div className="flex items-center max-w-4xl mx-auto px-5 my-16">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
      <span className="px-4 text-white/25 text-[10px] font-press-start tracking-widest">✦ ✦ ✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}
