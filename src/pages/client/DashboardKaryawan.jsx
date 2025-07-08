/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { User, Mail, Building, Hash, Clock } from 'lucide-react'
import StatistikNilai from '../../components/static/StatistikNilai'

const DashboardKaryawan = () => {
  const [user, setUser] = useState(null)
  const [currentTime, setCurrentTime] = useState('')
  const [greeting, setGreeting] = useState('')

  const navigate = (path) => console.log(`Navigate to: ${path}`)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    const hour = new Date().getHours()
    if (hour < 10) setGreeting('Selamat Pagi')
    else if (hour < 12) setGreeting('Selamat Siang')
    else if (hour < 17) setGreeting('Selamat Sore')
    else setGreeting('Selamat Malam')

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-indigo-600 font-medium">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Dashboard Karyawan
          </h1>
          <p className="text-gray-600 text-lg">Selamat datang di portal karyawan</p>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-white/50">
            <Clock className="w-6 h-6 text-indigo-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-indigo-800">{currentTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border border-white/50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user.nama.split(' ').map((n) => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">
              {greeting}, {user.nama.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600 text-lg">Semoga hari Anda produktif dan menyenangkan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UserInfoCard
            icon={User}
            title="Nama Lengkap"
            value={user.nama}
            gradient="from-blue-500 to-indigo-600"
            bgGradient="from-blue-50 to-indigo-50"
          />
          <UserInfoCard
            icon={Building}
            title="Jabatan"
            value={user.jabatan}
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-purple-50 to-pink-50"
          />
          <UserInfoCard
            icon={Mail}
            title="Email"
            value={user.email}
            gradient="from-green-500 to-teal-600"
            bgGradient="from-green-50 to-teal-50"
          />
          <UserInfoCard
            icon={Hash}
            title="Nomor Induk Karyawan"
            value={user.password}
            gradient="from-orange-500 to-red-600"
            bgGradient="from-orange-50 to-red-50"
          />
        </div>

        <StatistikNilai />
      </div>
    </div>
  )
}

const UserInfoCard = ({ icon: Icon, title, value, gradient, bgGradient }) => (
  <div className={`bg-gradient-to-r ${bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-start space-x-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </div>
)

const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
  <div className="text-center p-6 rounded-2xl bg-white/50 border border-white/30 hover:shadow-lg transition-all duration-300">
    <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
    <p className="text-lg font-semibold text-gray-800">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
)

export default DashboardKaryawan
