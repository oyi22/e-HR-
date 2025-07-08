import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { FaUser, FaCalendarCheck, FaFileAlt, FaTrash, FaBell, FaPlus } from 'react-icons/fa'
import NavbarHRD from '../../components/NavbarHRD'

const AbsenChart = ({ data }) => {
  const chartData = useMemo(() => data, [data])
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="tanggal" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip contentStyle={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }} />
        <Line
          type="monotone"
          dataKey="jumlah"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

const IzinChart = ({ data }) => {
  const chartData = useMemo(() => data, [data])
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="tanggal" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip contentStyle={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }} />
        <Bar dataKey="jumlah" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const SPChart = ({ spData }) => {
  const pieData = useMemo(() => spData, [spData])
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }} />
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [karyawanRes, absensiRes, izinRes] = await Promise.all([
        fetch('http://localhost:3001/api/akun'),
        fetch('http://localhost:3001/api/absensi'),
        fetch('http://localhost:3001/api/izin')
      ])

      const [karyawanData, absensiData, izinData] = await Promise.all([
        karyawanRes.json(),
        absensiRes.json(),
        izinRes.json()
      ])

      const totalKaryawan = karyawanData.length
      const today = new Date().toISOString().split('T')[0]

      const hadirHariIni = absensiData.filter(item => {
        const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
        return itemDate === today && item.keterangan?.toLowerCase().includes('hadir')
      }).length

      const alpha = absensiData.filter(item => {
        const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
        return itemDate === today && (
          !item.keterangan ||
          item.keterangan.toLowerCase().includes('alpha') ||
          item.keterangan.toLowerCase().includes('tidak hadir')
        )
      }).length

      const izinSakit = izinData.length + absensiData.filter(item =>
        item.keterangan?.toLowerCase().includes('sakit') ||
        item.keterangan?.toLowerCase().includes('izin')
      ).length

      const absensiChart = []
      const izinChart = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dateFormatted = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })

        absensiChart.push({
          tanggal: dateFormatted,
          jumlah: absensiData.filter(item => {
            const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
            return itemDate === dateStr && item.keterangan?.toLowerCase().includes('hadir')
          }).length
        })

        izinChart.push({
          tanggal: dateFormatted,
          jumlah: absensiData.filter(item => {
            const itemDate = new Date(item.tanggal).toISOString().split('T')[0]
            return itemDate === dateStr &&
              item.keterangan?.toLowerCase().match(/izin|sakit/)
          }).length
        })
      }

      const spChart = [
        { name: 'SP1', value: Math.floor(totalKaryawan * 0.05), color: '#F59E0B' },
        { name: 'SP2', value: Math.floor(totalKaryawan * 0.03), color: '#EF4444' },
        { name: 'PHK', value: Math.floor(totalKaryawan * 0.01), color: '#DC2626' }
      ]

      setDashboardData({
        totalKaryawan,
        hadirHariIni,
        izinSakit,
        alpha,
        absensiChart,
        izinChart,
        spChart
      })

      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Gagal memuat data dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 300000)
    return () => clearInterval(interval)
  }, [])

  const statsData = useMemo(() => [
    { title: 'Total Karyawan', value: dashboardData.totalKaryawan.toString(), color: 'bg-blue-500', icon: FaUser },
    { title: 'Hadir Hari Ini', value: dashboardData.hadirHariIni.toString(), color: 'bg-green-500', icon: FaCalendarCheck },
    { title: 'Izin/Sakit', value: dashboardData.izinSakit.toString(), color: 'bg-yellow-500', icon: FaFileAlt },
    { title: 'Alpha', value: dashboardData.alpha.toString(), color: 'bg-red-500', icon: FaTrash }
  ], [dashboardData])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <NavbarHRD />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <span className="ml-4 text-gray-600">Memuat data dashboard...</span>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <NavbarHRD />
        <main className="flex-1 p-8">
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <NavbarHRD />
      <main className="flex-1 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Management</h2>
            <p className="text-gray-600">Selamat datang di sistem manajemen HRD</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <FaPlus /> <span>Karyawan</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className={`rounded-xl p-5 text-white shadow-lg ${stat.color}`}>
              <div className="flex items-center gap-3">
                <stat.icon className="text-2xl" />
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-sm">{stat.title}</div>
                </div>
              </div>
              <div className="mt-2 text-sm">Data real-time</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Absen Harian (7 Hari Terakhir)</h3>
            <AbsenChart data={dashboardData.absensiChart} />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Izin / Sakit (7 Hari Terakhir)</h3>
            <IzinChart data={dashboardData.izinChart} />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Surat Peringatan</h3>
            <SPChart spData={dashboardData.spChart} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardHRD
