import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, ArrowLeft, Calendar,
  CheckCircle, XCircle, Clock, User, Briefcase, MapPin
} from 'lucide-react'
import axios from 'axios'

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const colorClasses = {
  hadir: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: CheckCircle },
  izin: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: Clock },
  alpha: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: XCircle },
  libur: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Calendar }
}

const HariKerjaDetail = () => {
  const { userId } = useParams()
  console.log("PARAMS: ", userId)
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [data, setData] = useState({ attendance: [], izin: [], user: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

    useEffect(() => {
      if (!userId || isNaN(+userId)) {
        setError('User ID tidak valid')
        setLoading(false)
        return
      }

      const fetchDummyData = async () => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 800)) // simulasi loading

        const dummyUser = {
          waktu: '2024-06-01',
          nama: 'Dita',
          jabatan: 'Karyawan Produksi'
        }

        const dummyKalender = Array.from({ length: 31 }, (_, i) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
          const dateStr = date.toISOString().split('T')[0]
          let status = 'Libur'
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            if (i % 6 === 0) status = 'Izin'
            else if (i % 8 === 0) status = 'Alpha'
            else status = 'Hadir'
          }
          return {
            tanggal: dateStr,
            status,
            shift: 'Pagi',
            lokasi: 'Pabrik A',
            keterangan: status === 'Alpha' ? 'Tanpa keterangan' : ''
          }
        })

        setData({
          user: dummyUser,
          attendance: dummyKalender,
          izin: dummyKalender.filter(d => d.status === 'Izin'),
          kalender: dummyKalender
        })

        setError(null)
        setLoading(false)
      }

      fetchDummyData()
    }, [userId, currentDate])


// eslint-disable-next-line no-unused-vars
const getDateStatus = (day) => {
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
  const dateStr = date.toISOString().split('T')[0]
  const dataKalender = Array.isArray(data.kalender)? data.kalender.find(item => item.tanggal === dateStr) : null
  return dataKalender?.status?.toLowerCase() || 'libur'
}


  const getStats = () => {
  let hadir = 0, izin = 0, alpha = 0, total = 0
  const now = new Date()
  const thisMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

  if (Array.isArray(data.kalender)) {
    data.kalender.forEach(item => {
      if (!item.tanggal.startsWith(thisMonth)) return
      const date = new Date(item.tanggal)
      const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      if (date.getDay() === 0 || date.getDay() === 6 || compareDate > now) return

      if (data.user?.waktu) {
        const startDate = new Date(data.user.waktu)
        if (compareDate < new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) return
      }

      total++
      if (item.status === 'Hadir') hadir++
      else if (item.status === 'Izin') izin++
      else if (item.status === 'Alpha') alpha++
    })
  }

  return { hadir, izin, alpha, total }
}

  const formatWorkStartDate = (dateStr) => {
    if (!dateStr) return 'Tidak diketahui'
    const date = new Date(dateStr)
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  const getWorkingDays = () => {
    if (!data.user?.waktu) return 0
    const startDate = new Date(data.user.waktu)
    const now = new Date()
    return Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))
  }

  const renderCalendar = () => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const cells = [...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} className="p-2" />)

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split('T')[0]

    const info = Array.isArray(data.kalender)? data.kalender.find(item => item.date === dateStr || item.tanggal === dateStr) : null

    const status = info?.status?.toLowerCase() || 'libur'
    const { bg, text, border, icon: Icon } = colorClasses[status]

    let tooltip = ''
    if (status === 'hadir') {
      tooltip = `Hadir - ${info.shift || '-'} shift\nLokasi: ${info.lokasi || 'Tidak diketahui'}`
      if (info.keterangan) tooltip += `\nKeterangan: ${info.keterangan}`
    } else if (status === 'izin') {
      tooltip = `Izin - ${info.shift || '-'} shift`
    } else {
      tooltip = (date.getDay() === 0 || date.getDay() === 6)
        ? 'Libur - Weekend'
        : (status === 'alpha'
          ? 'Alpha - Tidak hadir tanpa keterangan'
          : 'Libur')
    }

    cells.push(
      <div key={day} className="p-1">
        <div
          className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer hover:shadow-md transition-all ${bg} ${text} ${border}`}
          title={tooltip}
        >
          <span>{day}</span>
          <Icon className="w-3 h-3 mt-0.5" />
        </div>
      </div>
    )
  }

  return cells
}


  const { hadir, izin, alpha, total } = getStats()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg">
        <Clock className="mx-auto h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-gray-600">Memuat data...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-4 text-gray-600">{error}</p>
        <div className="mt-4 flex gap-2 justify-center">
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Coba Lagi</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Kembali</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        {/* Header & Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition">
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-indigo-900">Detail Hari Kerja</h1>
              {data.user && (
                <div className="flex gap-4 mt-2 text-sm text-gray-600 justify-center">
                  <div className="flex items-center gap-1"><User className="w-4 h-4" /><span>{data.user.nama}</span></div>
                  <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /><span>{data.user.jabatan}</span></div>
                </div>
              )}
            </div>
            <div className="w-20" />
          </div>
          {data.user && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-4 text-center">
              <p className="text-sm text-indigo-600 mb-1">Mulai Bekerja</p>
              <p className="font-semibold text-indigo-900">{formatWorkStartDate(data.user.waktu)}</p>
              <p className="text-xs text-indigo-500 mt-1">{getWorkingDays()} hari bergabung dengan perusahaan</p>
            </div>
          )}
          <div className="flex justify-center gap-4 items-center">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition">
              <ChevronLeft className="w-5 h-5 text-indigo-600" />
            </button>
            <h2 className="text-xl font-bold text-indigo-900">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition">
              <ChevronRight className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            ['Hadir', hadir, 'hadir'],
            ['Izin', izin, 'izin'],
            ['Alpha', alpha, 'alpha'],
            ['Total Hari Kerja', total, 'libur']
          ].map(([label, count, type]) => {
            const { bg, text, icon: Icon } = colorClasses[type === 'libur' ? 'libur' : type];
            return (
              <div key={label} className={`text-center p-3 ${bg} rounded-lg border hover:shadow-md transition`}>
                <Icon className={`w-5 h-5 ${text} mx-auto mb-1`} />
                <div className={`text-2xl font-bold ${text}`}>{count}</div>
                <div className={`text-sm ${text}`}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-indigo-900">Kalender Kehadiran</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-6">{renderCalendar()}</div>

          {/* Legend dengan Icon */}
          <div className="flex gap-4 justify-center text-sm flex-wrap">
            {Object.entries(colorClasses).map(([type, { bg, text, icon: Icon }]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${bg} rounded flex items-center justify-center`}>
                  <Icon className={`w-2 h-2 ${text}`} />
                </div>
                <span className="text-gray-600 capitalize">
                  {type === 'hadir' ? 'Hadir' : type === 'izin' ? 'Izin' : type === 'alpha' ? 'Alpha' : 'Libur'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center">💡 Hover pada tanggal untuk melihat detail kehadiran</p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default HariKerjaDetail;
