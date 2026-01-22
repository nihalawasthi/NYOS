export default function StatementSection() {
  return (
    <section
      className="p-24 bg-black/70 text-white relative -mt-[100vh] z-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
          Elevated Essentials
        </h1>
        <p className="text-lg text-stone-300 font-light leading-relaxed max-w-2xl mx-auto mb-12">
          Meticulously crafted tees that balance minimalism with premium quality. Each piece designed to become a wardrobe staple.
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-2">
            <div className="text-sm font-semibold tracking-widest text-stone-600 mb-4">
              QUALITY
            </div>
            <p className="text-lg font-light text-stone-700">
              Premium organic cotton with precision stitching for longevity
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold tracking-widest text-stone-600 mb-4">
              SUSTAINABILITY
            </div>
            <p className="text-lg font-light text-stone-700">
              Ethical production and eco-friendly packaging throughout
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold tracking-widest text-stone-600 mb-4">
              DESIGN
            </div>
            <p className="text-lg font-light text-stone-700">
              Minimalist aesthetics that transcend seasonal trends
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}