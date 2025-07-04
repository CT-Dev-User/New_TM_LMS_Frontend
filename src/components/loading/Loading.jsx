// import React from 'react'
// import "./loading.css"

// const Loading = () => {
//   return (
//     <div className='loading-page'>

//         <div className='loader'></div>
    
//     </div>
//   )
// }

// export default Loading



import React from "react";

const LoadingPage = () => {
  return (
    <div className="h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute w-96 h-96 bg-[#1E88E5] rounded-full blur-3xl opacity-10 top-[-100px] left-[-100px]" />
      <div className="absolute w-96 h-96 bg-[#1E88E5] rounded-full blur-3xl opacity-10 bottom-[-100px] right-[-100px]" />

      {/* Animated loader circles */}
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1E88E5] rounded-full animate-pulseSlow opacity-30" />
        {/* <div className="absolute top-4 left-4 w-32 h-32 border-4 border-[#1E88E5] border-dashed rounded-full animate-spinSlow opacity-50" /> */}
        <div className="absolute top-8 left-8 w-24 h-24 border-4 border-[#1E88E5] border-double rounded-full animate-reverseSpin opacity-80" />

        {/* TM in center */}
        <div className="absolute inset-0 flex items-center justify-center space-x-0.5 z-10">
          <span className="text-[#1E88E5] text-3xl font-extrabold tracking-wider drop-shadow-sm">T</span>
          <span className="text-white text-3xl font-extrabold tracking-wider drop-shadow-sm animate-bounceY">M</span>
        </div>

        {/* Rotating circular text ring */}
        <div className="absolute inset-0 animate-spinTextSlow z-0">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <path
                id="circlePath"
                d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                fill="none"
              />
            </defs>
            <text fill="white" fontSize="20" fontWeight="600" fontFamily="'Harlow Solid Italic', cursive" >
              <textPath href="#circlePath" startOffset="0%">
                Loading...
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* Brand title */}
      <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wide animate-fadeUp">
        <span className="text-[#1E88E5]">Tech</span><span className="text-white">Momentum</span>
      </h1>

      {/* Tagline */}
      <p className="mt-2 text-gray-400 text-sm md:text-base animate-fadeUp delay-200">
        Empowering Learning with Momentum...
      </p>
    </div>
  );
};

export default LoadingPage;
