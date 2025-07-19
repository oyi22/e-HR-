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
  
  // const fetchAllData = async () => {
  //   setLoading(true);
  //   try {
  //     const [karyawanRes, absensiRes, izinRes] = await Promise.all([
  //       fetch('http://localhost:3001/api/akun'),
  //       fetch('http://localhost:3001/api/absensi'),
  //       fetch('http://localhost:3001/api/izin')
  //     ])

  //     if (!karyawanRes.ok || !absensiRes.ok || !izinRes.ok) {
  //       throw new Error('Gagal mengambil data')
  //     }

  //     const [karyawan, absensi, izin] = await Promise.all([
  //       karyawanRes.json(),
  //       absensiRes.json(),
  //       izinRes.json()
  //     ])

  //     setData({ karyawan, absensi, izin })
  //     setError(null)
  //   } catch (err) {
  //     setError(err.message || 'Terjadi kesalahan saat mengambil data');
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchAllData = async () => {
  setLoading(true)
  setTimeout(() => {
    const karyawan = [
      { id: 1, nama: 'Andi', jabatan: 'Staff', shift: 'Pagi' },
      { id: 2, nama: 'Budi', jabatan: 'Admin', shift: 'Malam' },
      { id: 3, nama: 'Citra', jabatan: 'HRD', shift: 'Pagi' },
      { id: 4, nama: 'Dewi', jabatan: 'Manager', shift: 'Malam' },
      { id: 5, nama: 'Eka', jabatan: 'Staff', shift: 'Pagi' }
    ]

    const today = new Date()
    const getDate = (offset) => {
      const d = new Date(today)
      d.setDate(today.getDate() - offset)
      return d.toISOString()
    }

    const absensi = [
      { nama: 'Andi', tanggal: getDate(0) }, // hadir hari ini
      { nama: 'Budi', tanggal: getDate(1) },
      { nama: 'Citra', tanggal: getDate(1) },
      { nama: 'Dewi', tanggal: getDate(2) },
      { nama: 'Eka', tanggal: getDate(2) },
      { nama: 'Andi', tanggal: getDate(3) },
      { nama: 'Budi', tanggal: getDate(3) },
      { nama: 'Citra', tanggal: getDate(4) },
      // sisanya akan dianggap alpha
    ]

    const izin = [
      { nama_karyawan: 'Eka', tanggal: getDate(1), file: 'izin1.pdf' },
      { nama_karyawan: 'Budi', tanggal: getDate(2), file: 'izin2.pdf' }
    ]

    setData({ karyawan, absensi, izin })
    setError(null)
    setLoading(false)
  }, 1000)
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
            <div className="relative overflow-hidden">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${bgColor} p-4 rounded-xl shadow-sm`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-medium">{status}</p>
                      <p className="text-3xl font-bold text-slate-800">
                        {filteredData.filter(item => item.status === status).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full opacity-50"></div>
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
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <FaSync className="animate-spin text-orange-600 text-xl" />
            </div>
              <p className="text-slate-700 font-medium">
                {loading ? 'Memuat data...' : 'Memproses data mingguan...'}
              </p>
              <p className="text-slate-500 text-sm mt-1">Mohon tunggu sebentar</p>
          </div>
      )
    }

    if (!weekRange) {
      return (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full mb-6">
            <FaCalendarWeek className="text-orange-600 text-2xl" />
          </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Siap Memulai Analisis</h3>
                <p className="text-slate-600 mb-4 max-w-md mx-auto">
                  Klik tombol "Proses Mingguan" untuk menjalankan analisis SP dan PHK
                </p>
                <p className="text-sm text-slate-500">
                  Sistem akan menganalisis data absensi minggu ini (Senin-Jumat)
                </p>
        </div>
      )
    }

    if (filteredData.length === 0) {
      return (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full mb-6">
            <div className="text-green-600 text-3xl font-bold">✓</div>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Semua karyawan dalam kondisi baik!'}
          </h3>
          {!searchTerm && (
            <p className="text-green-600 max-w-md mx-auto">
              Tidak ada karyawan yang mendapat SP atau PHK minggu ini
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {['No', 'Nama Karyawan', 'Jabatan', 'Shift', 'Jumlah Alpha', 'Status', 'Detail Alpha'].map(header => (
                  <th key={header} className="text-left py-4 px-6 text-sm font-semibold text-slate-700 bg-slate-50">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {item.nama?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.nama || 'Nama tidak tersedia'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.jabatan || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      item.shift === 'Pagi' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.shift || 'Pagi'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      {item.alphaCount} hari
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {item.icon && <span>{item.icon}</span>}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 max-w-xs">
                      {item.alphaDetails.map((date, idx) => (
                        <div key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
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
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <NavbarHRD />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaBan className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Laporan SP dan PHK Mingguan</h1>
                <p className="text-slate-600">Sistem deteksi otomatis karyawan alpha dalam seminggu</p>
              </div>
            </div>
            {weekRange && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 inline-block">
                <p className="text-sm font-medium text-orange-800">Periode: {weekRange}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Jam Absen Pagi: 06:30 - 08:30</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Jam Absen Malam: 17:00 - 19:00</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, jabatan, atau status..."
                className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-80 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={processWeeklySpPhkData}
              disabled={loading || isProcessing || data.karyawan.length === 0}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              {isProcessing ? <FaSync className="animate-spin" /> : <FaCalendarWeek />}
              <span>{isProcessing ? 'Memproses...' : 'Proses Mingguan'}</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {renderTableContent()}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-lg font-bold">i</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-800 mb-6">Informasi Sistem SP dan PHK Mingguan</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 text-lg">Cara Kerja Sistem:</h4>
                  <div className="space-y-2 text-blue-600">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Analisis dilakukan per minggu (Senin-Jumat)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Deteksi otomatis karyawan yang alpha</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Validasi jam absen sesuai shift</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Cek ketersediaan surat izin yang valid</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 text-lg">Status Peringatan:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">SP1</span>
                      <span className="text-blue-600">1 hari alpha dalam seminggu</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">SP2</span>
                      <span className="text-blue-600">2 hari alpha dalam seminggu</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">PHK</span>
                      <span className="text-blue-600">3 hari alpha atau lebih dalam seminggu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DataSPPHK