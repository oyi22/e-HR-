import React, { useState, useEffect } from 'react'
import { FaSearch, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaFilter, FaDownload, FaRedo, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import NavbarHRD from '../../components/NavbarHRD'

const DataAbsensi = () => {
  const [absensi, setAbsensi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // const fetchAbsensi = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await fetch('http://localhost:3001/api/absensi')
  //     const data = await res.json()
  //     if (!res.ok) throw new Error(data.message || 'Gagal mengambil data absensi')
  //     setAbsensi(data)
  //     setError(null)
  //   } catch (err) {
  //     setError(err.message || 'Terjadi kesalahan saat mengambil data')
  //     setAbsensi([])
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchAbsensi = () => {
  setLoading(true)

  setTimeout(() => {
    const dummyData = Array.from({ length: 43 }, (_, i) => {
      const tanggal = new Date()
      tanggal.setDate(tanggal.getDate() - Math.floor(Math.random() * 7))
      return {
        id: i + 1,
        nama: `Karyawan ${i + 1}`,
        jabatan: ['Staff', 'Manager', 'HR', 'Admin'][Math.floor(Math.random() * 4)],
        shift: Math.random() > 0.5 ? 'Pagi' : 'Malam',
        lokasi: ['Jakarta', 'Bandung', 'Surabaya', 'Semarang'][Math.floor(Math.random() * 4)],
        tanggal: tanggal.toISOString(),
        keterangan: ['Hadir', 'Terlambat', 'Izin', 'Sakit'][Math.floor(Math.random() * 4)],
      }
    })

    setAbsensi(dummyData)
    setError(null)
    setLoading(false)
  }, 1000)
}


  useEffect(() => {
    fetchAbsensi()
  }, [])

  const filteredAbsensi = absensi.filter((item) => {
    const search = searchTerm.toLowerCase()
    return (
      (item.nama || '').toLowerCase().includes(search) ||
      (item.jabatan || '').toLowerCase().includes(search) ||
      (item.lokasi || '').toLowerCase().includes(search) ||
      (item.keterangan || '').toLowerCase().includes(search) ||
      (item.shift || '').toLowerCase().includes(search)
    )
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAbsensi.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAbsensi.length / itemsPerPage)

  const getShiftBadge = (shift) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    return shift === 'Pagi'
      ? `${base} bg-amber-100 text-amber-800 border border-amber-200`
      : shift === 'Malam'
      ? `${base} bg-indigo-100 text-indigo-800 border border-indigo-200`
      : `${base} bg-slate-100 text-slate-800 border border-slate-200`
  }

  const getKeteranganBadge = (keterangan) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    const ket = (keterangan || '').toLowerCase()
    if (ket.includes('hadir')) return `${base} bg-emerald-100 text-emerald-800 border border-emerald-200`
    if (ket.includes('terlambat')) return `${base} bg-orange-100 text-orange-800 border border-orange-200`
    if (ket.includes('sakit')) return `${base} bg-red-100 text-red-800 border border-red-200`
    if (ket.includes('izin')) return `${base} bg-violet-100 text-violet-800 border border-violet-200`
    return `${base} bg-slate-100 text-slate-800 border border-slate-200`
  }

  const StatsCard = ({ icon, color, label, value, bgColor }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          {React.cloneElement(icon, { className: `${color} text-xl` })}
        </div>
      </div>
    </div>
  )

  const Pagination = () => {
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1)

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 bg-white border-t border-slate-200">
        <div className="flex items-center text-sm text-slate-600 mb-3 sm:mb-0">
          <span>
            Menampilkan <span className="font-semibold">{indexOfFirstItem + 1}</span> - <span className="font-semibold">{Math.min(indexOfLastItem, filteredAbsensi.length)}</span> dari <span className="font-semibold">{filteredAbsensi.length}</span> data
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>
          
          <div className="flex space-x-1">
            {[...Array(endPage - adjustedStartPage + 1)].map((_, i) => {
              const pageNum = adjustedStartPage + i
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <FaChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavbarHRD />
      
      {/* Main Content with Fixed Height */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            
            {/* Header Section */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Data Absensi Karyawan
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Pantau kehadiran dan aktivitas karyawan secara real-time
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-medium shadow-sm">
                    <FaFilter className="mr-2 h-4 w-4" />
                    Filter Data
                  </button>
                  <button className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm">
                    <FaDownload className="mr-2 h-4 w-4" />
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama, jabatan, lokasi, status..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                icon={<FaCalendarAlt />}
                color="text-emerald-600"
                bgColor="bg-emerald-50"
                label="Total Absensi"
                value={filteredAbsensi.length}
              />
              <StatsCard
                icon={<FaClock />}
                color="text-amber-600"
                bgColor="bg-amber-50"
                label="Shift Pagi"
                value={filteredAbsensi.filter(i => i.shift === 'Pagi').length}
              />
              <StatsCard
                icon={<FaClock />}
                color="text-indigo-600"
                bgColor="bg-indigo-50"
                label="Shift Malam"
                value={filteredAbsensi.filter(i => i.shift === 'Malam').length}
              />
              <StatsCard
                icon={<FaMapMarkerAlt />}
                color="text-violet-600"
                bgColor="bg-violet-50"
                label="Lokasi Unik"
                value={new Set(filteredAbsensi.map(i => i.lokasi)).size}
              />
            </div>

            {/* Data Content with Fixed Height */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-slate-600 text-center">Memuat data absensi karyawan...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="p-3 bg-red-100 rounded-full mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
                  <p className="text-slate-600 mb-4 max-w-md">{error}</p>
                  <button 
                    onClick={fetchAbsensi}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaRedo className="h-4 w-4" />
                    <span>Coba Lagi</span>
                  </button>
                </div>
              ) : filteredAbsensi.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="p-3 bg-slate-100 rounded-full mb-4">
                    <FaSearch className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {searchTerm ? 'Tidak Ada Hasil' : 'Belum Ada Data'}
                  </h3>
                  <p className="text-slate-600 max-w-md">
                    {searchTerm 
                      ? `Tidak ditemukan data absensi dengan kata kunci "${searchTerm}"`
                      : 'Belum ada data absensi karyawan yang tersedia'
                    }
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table with Fixed Height */}
                  <div className="hidden lg:block">
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              No
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              <div className="flex items-center space-x-1">
                                <FaCalendarAlt className="h-3 w-3" />
                                <span>Karyawan</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              <div className="flex items-center space-x-1">
                                <FaClock className="h-3 w-3" />
                                <span>Shift</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              <div className="flex items-center space-x-1">
                                <FaMapMarkerAlt className="h-3 w-3" />
                                <span>Lokasi</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              Tanggal & Waktu
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {currentItems.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-slate-200">
                                    <span className="text-white font-semibold text-sm">
                                      {(item.nama || 'U').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-slate-900">
                                      {item.nama || 'Nama tidak tersedia'}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {item.jabatan || 'Jabatan tidak tersedia'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={getShiftBadge(item.shift)}>
                                  {item.shift || '-'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                <div className="flex items-center max-w-32">
                                  <FaMapMarkerAlt className="text-slate-400 mr-2 text-xs flex-shrink-0" />
                                  <span className="truncate">{item.lokasi || '-'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {item.tanggal_formatted ||
                                  (item.tanggal
                                    ? new Date(item.tanggal).toLocaleString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : '-')}
                              </td>
                              <td className="px-6 py-4">
                                <span className={getKeteranganBadge(item.keterangan)}>
                                  {item.keterangan || '-'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards with Fixed Height */}
                  <div className="lg:hidden">
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-200">
                      {currentItems.map((item, index) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-slate-200 flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {(item.nama || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {item.nama || 'Nama tidak tersedia'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{item.jabatan || '-'}</p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 font-medium flex-shrink-0">
                              #{indexOfFirstItem + index + 1}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Shift</p>
                              <span className={getShiftBadge(item.shift)}>
                                {item.shift || '-'}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Status</p>
                              <span className={getKeteranganBadge(item.keterangan)}>
                                {item.keterangan || '-'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-slate-600">
                              <FaMapMarkerAlt className="mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{item.lokasi || '-'}</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-600">
                              <FaClock className="mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">
                                {item.tanggal_formatted ||
                                  (item.tanggal
                                    ? new Date(item.tanggal).toLocaleString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : '-')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && <Pagination />}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DataAbsensi