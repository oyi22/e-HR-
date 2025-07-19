import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { FiTrendingUp } from 'react-icons/fi';
import { FaUser, FaCalendarCheck, FaFileAlt, FaTrash, FaBell, FaPlus, FaUsers, FaClock } from 'react-icons/fa'

import NavbarHRD from '../../components/NavbarHRD'

const AbsenChart = ({ data }) => {
  const chartData = useMemo(() => data, [data])
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="absenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="tanggal" 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} 
        />
        <Line
          type="monotone"
          dataKey="jumlah"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
          fillOpacity={1}
          fill="url(#absenGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

const IzinChart = ({ data }) => {
  const chartData = useMemo(() => data, [data])
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData} barCategoryGap="20%">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="tanggal" 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} 
        />
        <Bar 
          dataKey="jumlah" 
          fill="url(#barGradient)" 
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

const SPChart = ({ spData }) => {
  const pieData = useMemo(() => spData, [spData])
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <defs>
          {pieData.map((entry, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={entry.color} stopOpacity={0.9}/>
              <stop offset="95%" stopColor={entry.color} stopOpacity={0.7}/>
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#gradient-${index})`}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

const DashboardHRD = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    totalKaryawan: 0,
    hadirHariIni: 0,
    izinSakit: 0,
    alpha: 0,
    absensiChart: [],
    izinChart: [],
    spChart: []
  })

  const navigate = useNavigate()

  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true)

  //     const [karyawanRes, absensiRes, izinRes] = await Promise.all([
  //       fetch('http://localhost:3001/api/akun'),
  //       fetch('http://localhost:3001/api/absensi'),
  //       fetch('http://localhost:3001/api/izin')
  //     ])

  //     const [karyawanData, absensiData, izinData] = await Promise.all([
  //       karyawanRes.json(),
  //       absensiRes.json(),
  //       izinRes.json()
  //     ])

  //     const totalKaryawan = karyawanData.length
  //     const today = new Date().toISOString().split('T')[0]

  //     const hadirHariIni = absensiData.filter(item => {
  //       const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
  //       return itemDate === today && item.keterangan?.toLowerCase().includes('hadir')
  //     }).length

  //     const alpha = absensiData.filter(item => {
  //       const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
  //       return itemDate === today && (
  //         !item.keterangan ||
  //         item.keterangan.toLowerCase().includes('alpha') ||
  //         item.keterangan.toLowerCase().includes('tidak hadir')
  //       )
  //     }).length

  //     const izinSakit = izinData.length + absensiData.filter(item =>
  //       item.keterangan?.toLowerCase().includes('sakit') ||
  //       item.keterangan?.toLowerCase().includes('izin')
  //     ).length

  //     const absensiChart = []
  //     const izinChart = []

  //     for (let i = 6; i >= 0; i--) {
  //       const date = new Date()
  //       date.setDate(date.getDate() - i)
  //       const dateStr = date.toISOString().split('T')[0]
  //       const dateFormatted = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })

  //       absensiChart.push({
  //         tanggal: dateFormatted,
  //         jumlah: absensiData.filter(item => {
  //           const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
  //           return itemDate === dateStr && item.keterangan?.toLowerCase().includes('hadir')
  //         }).length
  //       })

  //       izinChart.push({
  //         tanggal: dateFormatted,
  //         jumlah: absensiData.filter(item => {
  //           const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
  //           return itemDate === dateStr &&
  //             item.keterangan?.toLowerCase().match(/izin|sakit/)
  //         }).length
  //       })
  //     }

  //     const spChart = [
  //       { name: 'SP1', value: Math.floor(totalKaryawan * 0.05), color: '#F59E0B' },
  //       { name: 'SP2', value: Math.floor(totalKaryawan * 0.03), color: '#EF4444' },
  //       { name: 'PHK', value: Math.floor(totalKaryawan * 0.01), color: '#DC2626' }
  //     ]

  //     setDashboardData({
  //       totalKaryawan,
  //       hadirHariIni,
  //       izinSakit,
  //       alpha,
  //       absensiChart,
  //       izinChart,
  //       spChart
  //     })

  //     setError(null)
  //   } catch (err) {
  //     console.error('Error fetching dashboard data:', err)
  //     setError('Gagal memuat data dashboard')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchDashboardData = () => {
    setLoading(true)
    setTimeout(() => {
      const totalKaryawan = 50
      const hadirHariIni = Math.floor(Math.random() * totalKaryawan)
      const alpha = Math.floor(Math.random() * (totalKaryawan - hadirHariIni))
      const izinSakit = totalKaryawan - hadirHariIni - alpha

      const absensiChart = []
      const izinChart = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateFormatted = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
        })
        absensiChart.push({
          tanggal: dateFormatted,
          jumlah: Math.floor(Math.random() * totalKaryawan),
        })
        izinChart.push({
          tanggal: dateFormatted,
          jumlah: Math.floor(Math.random() * 10),
        })
      }

      const spChart = [
        { name: "SP1", value: Math.floor(totalKaryawan * 0.05), color: "#F59E0B" },
        { name: "SP2", value: Math.floor(totalKaryawan * 0.03), color: "#EF4444" },
        { name: "PHK", value: Math.floor(totalKaryawan * 0.01), color: "#DC2626" },
      ]

      setDashboardData({
        totalKaryawan,
        hadirHariIni,
        izinSakit,
        alpha,
        absensiChart,
        izinChart,
        spChart,
      })

      setError(null)
      setLoading(false)
    }, 1000)
  }

  // useEffect(() => {
  //   fetchDashboardData()
  //   const interval = setInterval(fetchDashboardData, 300000)
  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const statsData = useMemo(() => [
    { 
      title: 'Total Karyawan', 
      value: dashboardData.totalKaryawan.toString(), 
      gradient: 'from-blue-500 via-blue-600 to-indigo-600', 
      icon: FaUsers,
      trend: '+5%',
      description: 'dari bulan lalu'
    },
    { 
      title: 'Hadir Hari Ini', 
      value: dashboardData.hadirHariIni.toString(), 
      gradient: 'from-emerald-500 via-green-600 to-teal-600', 
      icon: FaCalendarCheck,
      trend: '+12%',
      description: 'tingkat kehadiran'
    },
    { 
      title: 'Izin/Sakit', 
      value: dashboardData.izinSakit.toString(), 
      gradient: 'from-amber-500 via-orange-600 to-yellow-600', 
      icon: FaFileAlt,
      trend: '-3%',
      description: 'dari minggu lalu'
    },
    { 
      title: 'Alpha', 
      value: dashboardData.alpha.toString(), 
      gradient: 'from-red-500 via-rose-600 to-pink-600', 
      icon: FaClock,
      trend: '-8%',
      description: 'penurunan signifikan'
    }
  ], [dashboardData])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
        <NavbarHRD />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-blue-50 opacity-20 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-700">Memuat Dashboard</h3>
                <p className="text-slate-500">Sedang mengambil data terbaru...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
        <NavbarHRD />
        <main className="flex-1 p-8">
          <div className="flex flex-col justify-center items-center h-96">
            <div className="text-center space-y-6 max-w-md">
              <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">Terjadi Kesalahan</h3>
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      <NavbarHRD />
      <main className="flex-1 p-4 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <FiTrendingUp className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Dashboard Management
                </h2>
                <p className="text-slate-600">Pantau performa dan aktivitas karyawan secara real-time</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-3 text-slate-600 hover:text-slate-800 hover:bg-white/70 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">3</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:-translate-y-0.5"
            >
              <FaPlus /> 
              <span>Tambah Karyawan</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="group relative overflow-hidden">
              <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                  <div className="w-20 h-20 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-0 left-0 -ml-4 -mb-4 opacity-10">
                  <div className="w-16 h-16 bg-white rounded-full"></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <stat.icon className="text-2xl" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium opacity-90">{stat.trend}</div>
                      <div className="text-xs opacity-70">{stat.description}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm font-medium opacity-90">{stat.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Absen Harian</h3>
                <p className="text-sm text-slate-500">7 hari terakhir</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCalendarCheck className="text-blue-600" />
              </div>
            </div>
            <AbsenChart data={dashboardData.absensiChart} />
          </div>

          {/* Leave Chart */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Izin & Sakit</h3>
                <p className="text-sm text-slate-500">7 hari terakhir</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FaFileAlt className="text-green-600" />
              </div>
            </div>
            <IzinChart data={dashboardData.izinChart} />
          </div>

          {/* Warning Letters Chart */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Surat Peringatan</h3>
                <p className="text-sm text-slate-500">Distribusi SP</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTrash className="text-red-600" />
              </div>
            </div>
            <SPChart spData={dashboardData.spChart} />
            
            {/* Legend */}
            <div className="flex justify-center space-x-4 mt-4">
              {dashboardData.spChart.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardHRD