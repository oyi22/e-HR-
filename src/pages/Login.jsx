import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ensureDummyUsers, login } from '../services/authService'
import { FaUser, FaLock } from 'react-icons/fa'
import BahanImage from '../assets/bahan.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    ensureDummyUsers()
  },[])

  const handleLogin = (e) => {
    e.preventDefault()
    const user = login(email, password)

    console.log('login input : ', email, password)
    console.log('kagak nemu: ', user)

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        if (user.role === 'admin') navigate('/dashboard-hrd')
        else if (user.role === 'user') navigate('/dashboard-karyawan')
        else alert('Role tidak valid')
      } else {
        alert('Login gagal! Cek email dan password.')
      }
  }



  return (
    <div className="min-h-screen bg-[#081F5C] flex items-center justify-center p-4">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#334EAC] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-[#7096D1] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#D0E3FF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl bg-[#E7F1FF]/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-[#D0E3FF]/20">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-1/2 p-12 flex flex-col items-center justify-center text-center bg-[#E7F1FF]/5">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 text-[#E7F1FF]">
              Selamat Datang
            </h1>
            <div className="w-24 h-1 bg-[#7096D1] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-[#D0E3FF] leading-relaxed max-w-md">
              Masuk ke sistem manajemen absensi yang modern dan efisien
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#334EAC] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={BahanImage} 
              alt="absensi" 
              className="relative w-full max-w-sm rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border border-[#D0E3FF]/20"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-center bg-[#E7F1FF]/5">
          <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#E7F1FF] mb-2">Masuk Akun</h2>
                  <p className="text-[#D0E3FF] mb-4">Silakan masukkan kredensial Anda</p>
                    <pre className="bg-[#334EAC]/10 text-[#D0E3FF] p-4 rounded-xl text-sm leading-relaxed overflow-auto whitespace-pre-wrap">
              </pre>
            </div>


          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#334EAC] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center bg-[#E7F1FF]/10 backdrop-blur-sm border border-[#D0E3FF]/20 rounded-2xl px-6 py-4 focus-within:border-[#7096D1] transition-all duration-300">
                <FaUser className="text-[#7096D1] mr-4 text-lg" />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-none flex-1 bg-transparent text-[#E7F1FF] placeholder-[#D0E3FF] text-lg"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#334EAC] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center bg-[#E7F1FF]/10 backdrop-blur-sm border border-[#D0E3FF]/20 rounded-2xl px-6 py-4 focus-within:border-[#7096D1] transition-all duration-300">
                <FaLock className="text-[#7096D1] mr-4 text-lg" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="outline-none flex-1 bg-transparent text-[#E7F1FF] placeholder-[#D0E3FF] text-lg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#334EAC] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button
                type="submit"
                className="relative w-full bg-[#334EAC] text-[#E7F1FF] rounded-2xl py-4 font-semibold text-lg hover:bg-[#7096D1] transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Masuk
              </button>
            </div>

            {/* Register Lupa PW */}
            <div className="text-center pt-4">
              <p className="text-[#D0E3FF]">
               Lupa Password?{' '}
                <Link 
                  to=" " 
                  className="text-[#7096D1] font-semibold hover:text-[#D0E3FF] transition-all duration-300"
                >
                  klik di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login