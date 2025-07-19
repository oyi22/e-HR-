import React, { useState, useEffect } from 'react'
import { FaSearch, FaUser, FaEnvelope, FaBriefcase, FaKey, FaRedo } from 'react-icons/fa'
import NavbarHRD from '../../components/NavbarHRD'

const DataAkun = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await fetch('http://localhost:3001/api/akun')
  //     const data = await res.json()
  //     if (!res.ok) throw new Error(data.message || 'Gagal mengambil data')
  //     setUsers(data)
  //     setError(null)
  //   } catch (err) {
  //     console.error('Error:', err)
  //     setError(err.message || 'Terjadi kesalahan saat mengambil data')
  //     setUsers([])
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchUsers = () => {
  setLoading(true)

  setTimeout(() => {
    const dummy = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      nama: `Karyawan ${i + 1}`,
      email: `karyawan${i + 1}@example.com`,
      jabatan: ['Staff', 'HRD', 'Manager', 'Admin', 'IT Support'][i % 5],
      password: `pass${1000 + i}`,
      foto: null // atau bisa pakai: `https://i.pravatar.cc/150?img=${i + 10}` biar ada foto dummy
    }))
    setUsers(dummy)
    setError(null)
    setLoading(false)
  }, 1000)
}


  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(({ nama = '', email = '', jabatan = '', password = '' }) =>
    [nama, email, jabatan, password].some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <NavbarHRD />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Akun Karyawan
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Kelola dan pantau akun karyawan perusahaan
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama, email, jabatan..."
                className="w-full sm:w-80 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUser className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Akun</p>
                  <p className="text-2xl font-bold text-slate-800">{filteredUsers.length}</p>
                </div>
              </div>
              {searchTerm && (
                <div className="text-right">
                  <p className="text-sm text-slate-500">Hasil pencarian</p>
                  <p className="text-lg font-semibold text-blue-600">{filteredUsers.length} ditemukan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500 text-center">Memuat data akun karyawan...</p>
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
                onClick={fetchUsers} 
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaRedo className="h-4 w-4" />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-3 bg-slate-100 rounded-full mb-4">
                <FaSearch className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {searchTerm ? 'Tidak Ada Hasil' : 'Belum Ada Data'}
              </h3>
              <p className="text-slate-600 max-w-md">
                {searchTerm 
                  ? `Tidak ditemukan karyawan dengan kata kunci "${searchTerm}"`
                  : 'Belum ada data akun karyawan yang tersedia'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <FaUser className="h-3 w-3" />
                          <span>Karyawan</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <FaEnvelope className="h-3 w-3" />
                          <span>Email</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <FaBriefcase className="h-3 w-3" />
                          <span>Jabatan</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <FaKey className="h-3 w-3" />
                          <span>Password</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {user.foto ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
                                src={`http://localhost:3001/uploads/${user.foto}`}
                                alt={user.nama || 'User'}
                                onError={e => {
                                  e.target.onerror = null
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0...'
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-slate-200">
                                <span className="text-white font-semibold text-sm">
                                  {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {user.nama || 'Nama tidak tersedia'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {user.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.jabatan || 'Tidak ada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                          {user.password || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-slate-200">
                {filteredUsers.map((user, index) => (
                  <div key={user.id} className="p-4 hover:bg-slate-50 transition-colors duration-150">
                    <div className="flex items-start space-x-3">
                      {user.foto ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-200 flex-shrink-0"
                          src={`http://localhost:3001/uploads/${user.foto}`}
                          alt={user.nama || 'User'}
                          onError={e => {
                            e.target.onerror = null
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0...'
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-slate-200 flex-shrink-0">
                          <span className="text-white font-semibold">
                            {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {user.nama || 'Nama tidak tersedia'}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">#{index + 1}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs text-slate-600">
                            <FaEnvelope className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{user.email || 'Email tidak tersedia'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <FaBriefcase className="h-3 w-3 text-slate-400" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.jabatan || 'Tidak ada'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-600">
                            <FaKey className="h-3 w-3 text-slate-400" />
                            <span className="font-mono truncate">{user.password || 'Password tidak tersedia'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DataAkun