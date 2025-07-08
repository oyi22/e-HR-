import React, { useState, useEffect } from 'react';
import { FaSearch, FaExclamationTriangle, FaBan, FaCalendarWeek, FaSync } from 'react-icons/fa';
import NavbarHRD from '../../components/NavbarHRD';

const DataSPPHK = () => {
  const [data, setData] = useState({ karyawan: [], absensi: [], izin: [] });
  const [spPhkData, setSpPhkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [weekRange, setWeekRange] = useState('');


  const ATTENDANCE_TIMES = {
    Pagi: { start: 390, end: 510 }, // 06:30 - 08:30
    Malam: { start: 1020, end: 1140 } // 17:00 - 19:00
  }

  const STATUS_CONFIG = {
    0: { status: 'Normal', color: 'bg-green-100 text-green-800', icon: null },
    1: { status: 'SP1', color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle className="text-yellow-600" /> },
    2: { status: 'SP2', color: 'bg-orange-100 text-orange-800', icon: <FaExclamationTriangle className="text-orange-600" /> },
    3: { status: 'PHK', color: 'bg-red-100 text-red-800', icon: <FaBan className="text-red-600" /> }
  }

  const isWithinAttendancePeriod = (dateTime, shift = 'Pagi') => {
    const date = new Date(dateTime);
    const timeInMinutes = date.getHours() * 60 + date.getMinutes()
    const { start, end } = ATTENDANCE_TIMES[shift]
    return timeInMinutes >= start && timeInMinutes <= end
  }

  const getCurrentWeekWorkingDays = () => {
    const today = new Date()
    const daysFromMonday = today.getDay() === 0 ? 6 : today.getDay() - 1
    const monday = new Date(today.setDate(today.getDate() - daysFromMonday))
    
    const workingDays = Array.from({ length: 5 }, (_, i) => {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      return day.toISOString().split('T')[0]
    })
  
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4);
    setWeekRange(`${monday.toLocaleDateString('id-ID')} - ${friday.toLocaleDateString('id-ID')}`)
    
    return workingDays
  }

  const checkEmployeeAttendance = (employee, workDay) => {
    const hasValidAbsensi = data.absensi.some(abs => 
      abs.nama === employee.nama &&
      new Date(abs.tanggal).toISOString().split('T')[0] === workDay &&
      isWithinAttendancePeriod(abs.tanggal, employee.shift)
    )
  
    const hasValidIzin = data.izin.some(izn => 
      izn.nama_karyawan === employee.nama &&
      new Date(izn.tanggal).toISOString().split('T')[0] === workDay &&
      izn.file
    )
    
    return hasValidAbsensi || hasValidIzin;
  }
  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [karyawanRes, absensiRes, izinRes] = await Promise.all([
        fetch('http://localhost:3001/api/akun'),
        fetch('http://localhost:3001/api/absensi'),
        fetch('http://localhost:3001/api/izin')
      ])

      if (!karyawanRes.ok || !absensiRes.ok || !izinRes.ok) {
        throw new Error('Gagal mengambil data')
      }

      const [karyawan, absensi, izin] = await Promise.all([
        karyawanRes.json(),
        absensiRes.json(),
        izinRes.json()
      ])

      setData({ karyawan, absensi, izin })
      setError(null)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false)
    }
  }

  const processWeeklySpPhkData = () => {
    setIsProcessing(true)
    try {
      const workingDays = getCurrentWeekWorkingDays();
      
      const processedData = data.karyawan.map(employee => {
        const alphaDetails = workingDays.filter(workDay => 
          !checkEmployeeAttendance(employee, workDay)
        )
        
        const alphaCount = alphaDetails.length;
        const statusKey = Math.min(alphaCount, 3)
        const statusInfo = STATUS_CONFIG[statusKey]
        
        return {
          ...employee,
          alphaCount,
          alphaDetails,
          status: statusInfo.status,
          statusColor: statusInfo.color,
          icon: statusInfo.icon
        }
      })
      
      setSpPhkData(processedData.filter(emp => emp.status !== 'Normal'))
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Gagal memproses data mingguan')
    } finally {
      setIsProcessing(false);
    }
  }

 
  useEffect(() => {
    fetchAllData()
  }, [])

  const filteredData = spPhkData.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    return [item.nama, item.jabatan, item.status]
      .some(field => field?.toLowerCase().includes(searchLower))
  })

  const renderStatCard = (status, icon, bgColor) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center">
        <div className={`${bgColor} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{status}</p>
          <p className="text-2xl font-bold text-gray-800">
            {filteredData.filter(item => item.status === status).length}
          </p>
        </div>
      </div>
    </div>
  )

  const renderTableContent = () => {
    if (loading || isProcessing) {
      return (
        <div className="p-8 text-center text-blue-500">
          <FaSync className="animate-spin mx-auto mb-4 text-2xl" />
          {loading ? 'Memuat data...' : 'Memproses data mingguan...'}
        </div>
      )
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-500">
          {error}
          <button onClick={fetchAllData} className="mt-2 text-blue-500 hover:text-blue-700 block">
            Coba Lagi
          </button>
        </div>
      )
    }

    if (!weekRange) {
      return (
        <div className="p-8 text-center text-gray-500">
          <FaCalendarWeek className="mx-auto mb-4 text-4xl text-gray-300" />
          <p className="mb-4">Klik tombol "Proses Mingguan" untuk menjalankan analisis SP dan PHK</p>
          <p className="text-sm text-gray-400">Sistem akan menganalisis data absensi minggu ini (Senin-Jumat)</p>
        </div>
      )
    }

    if (filteredData.length === 0) {
      return (
        <div className="p-8 text-center text-green-600">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <p className="font-medium">
            {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Semua karyawan dalam kondisi baik!'}
          </p>
          {!searchTerm && (
            <p className="text-sm text-gray-500 mt-2">Tidak ada karyawan yang mendapat SP atau PHK minggu ini</p>
          )}
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['No', 'Nama Karyawan', 'Jabatan', 'Shift', 'Jumlah Alpha', 'Status', 'Detail Alpha'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">
                        {item.nama?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.nama || 'Nama tidak tersedia'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jabatan || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.shift === 'Pagi' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.shift || 'Pagi'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {item.alphaCount} hari
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs space-y-1">
                    {item.alphaDetails.map((date, idx) => (
                      <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {new Date(date).toLocaleDateString('id-ID', {
                          day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <NavbarHRD />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporan SP dan PHK Mingguan</h2>
            <p className="text-gray-600">Sistem deteksi otomatis karyawan alpha dalam seminggu</p>
            {weekRange && <p className="text-sm text-blue-600 mt-1">Periode: {weekRange}</p>}
            <div className="mt-2 text-sm text-gray-500">
              <p>• Jam Absen Pagi: 06:30 - 08:30</p>
              <p>• Jam Absen Malam: 17:00 - 19:00</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, jabatan, atau status..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={processWeeklySpPhkData}
              disabled={loading || isProcessing || data.karyawan.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? <FaSync className="animate-spin" /> : <FaCalendarWeek />}
              {isProcessing ? 'Memproses...' : 'Proses Mingguan'}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {renderStatCard('SP1', <FaExclamationTriangle className="text-yellow-600" />, 'bg-yellow-100')}
          {renderStatCard('SP2', <FaExclamationTriangle className="text-orange-600" />, 'bg-orange-100')}
          {renderStatCard('PHK', <FaBan className="text-red-600" />, 'bg-red-100')}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {renderTableContent()}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Informasi Sistem SP dan PHK Mingguan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Cara Kerja Sistem:</h4>
              <ul className="space-y-1">
                <li>• Analisis dilakukan per minggu (Senin-Jumat)</li>
                <li>• Deteksi otomatis karyawan yang alpha</li>
                <li>• Validasi jam absen sesuai shift</li>
                <li>• Cek ketersediaan surat izin yang valid</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Status Peringatan:</h4>
              <ul className="space-y-1">
                <li>• SP1: 1 hari alpha dalam seminggu</li>
                <li>• SP2: 2 hari alpha dalam seminggu</li>
                <li>• PHK: 3 hari alpha atau lebih dalam seminggu</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DataSPPHK