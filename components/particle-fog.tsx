'use client'

export default function ParticleFog() {
  return (
    <>
      <style>{`
        .fog-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          pointer-events: none;
          z-index: 40;
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.5) 30%,
            rgba(255, 255, 255, 0.3) 60%,
            rgba(255, 255, 255, 0.1) 100%
          );
          filter: blur(30px);
        }
      `}</style>
      
      <div className="fog-layer" />
    </>
  )
}
