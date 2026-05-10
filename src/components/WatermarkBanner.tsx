import React from 'react'
// WatermarkBanner: yellow diagonal band, position-fixed top
export default function WatermarkBanner() {
  return <div className="bg-warning text-black p-2 w-full fixed top-0 left-0 text-center font-bold" style={{transform: 'rotate(-2deg)'}}>REHEARSAL — NEPA Playground · Not for production use</div>;
}