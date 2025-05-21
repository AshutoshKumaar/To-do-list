import React from 'react'
import Link from 'next/link'

function Loginpage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 text-white">
      {/* Quote Section */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Quote of the day
      </h1>
      <h2 className="text-lg text-blue-100 mb-8">
        You are never too old to set another goal or dream a new dream
      </h2>

      {/* Login Button */}
      <Link href='userpage'>
       <button className="px-8 py-3 border border-white rounded-md hover:bg-white hover:text-blue-800 font-medium transition-all duration-300">
        Login
      </button>

      </Link>
     
    </div> )
}

export default Loginpage