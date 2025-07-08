import { useNavigate } from 'react-router-dom'
const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#081F5C] flex items-center justify-center px-4">
      <div className="bg-white/10 border border-white/20 rounded-3xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-[#334EAC] rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-white">
          Selamat Datang di e-HRD
        </h1>
        
        <p className="text-white/80 mb-8 text-lg">
          Sistem Manajemen SDM Modern
        </p>

        <button
          onClick={()=>navigate('/login')}
          className="w-full bg-[#334EAC] hover:bg-[#7096D1] text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors duration-200"
        >
          Masuk
        </button>

        <p className="text-white/60 mt-8 text-sm">
          Powered by Modern Technology
        </p>
      </div>
    </div>
  )
}

export default Landing