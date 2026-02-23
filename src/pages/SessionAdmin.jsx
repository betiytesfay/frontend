import { useState } from 'react'
import bgpicture from './assets/sessionAdminBg.png'
import { BackButton } from './component/backButton'


export default function UserPage() {

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgpicture})` }}
    >
      <BackButton />
      <div className="absolute inset-0 bg-black/40">
        <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">

          <h1 className="text-3xl font-bold text-black mb-4">
            Welcome, Session Admin!
          </h1>
          <p className="text-gray-700">You’ve successfully logged in to your dashboard.</p>
        </div>
      </div>
    </div>
  )
}
















