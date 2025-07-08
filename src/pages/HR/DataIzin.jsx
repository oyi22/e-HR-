import React, { useState, useEffect } from 'react'
import { FaSearch, FaTrash, FaDownload } from 'react-icons/fa'
import NavbarHRD from '../../components/NavbarHRD'

const DataIzin = () => {
  const [izinData, setIzinData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  const fetchIzinData = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3001/api/izin')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Gagal mengambil data izin')
      setIzinData(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Terjadi kesalahan saat mengambil data')
      setIzinData([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data izin ini?')) return
    try {
      setDeleteLoading(id)
      const res = await fetch(`http://localhost:3001/api/izin/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus data')
      fetchIzinData()
      alert('Data izin berhasil dihapus')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Gagal menghapus data')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleDownloadFile = async (filename) => {
    try {
      const res = await fetch(`http://localhost:3001/api/izin/file/${filename}`)
      if (!res.ok) throw new Error('Gagal mendownload file')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
      alert('Gagal mendownload file')
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  useEffect(() => { fetchIzinData() }, [])

  const filteredData = izinData.filter((item) => {
    const term = searchTerm.toLowerCase()
    return (
      (item.nama_karyawan || '').toLowerCase().includes(term) ||
      (item.jabatan || '').toLowerCase().includes(term) ||
      (item.shift || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <NavbarHRD />
      <main className="flex-1 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Izin</h2>
            <p className="text-gray-600">Daftar pengajuan izin karyawan</p>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, jabatan, atau shift..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
              <button onClick={fetchIzinData} className="mt-2 text-blue-500 hover:text-blue-700 block">Coba Lagi</button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Tidak ada data izin'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['No', 'Nama Karyawan', 'Jabatan', 'Shift', 'Tanggal Pengajuan', 'Surat Izin', 'Aksi'].map((th, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.nama_karyawan || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.jabatan || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.shift === 'Pagi'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.tanggal)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.file ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownloadFile(item.file)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Download File"
                            >
                              <FaDownload />
                            </button>
                            <span className="text-xs text-gray-400 self-center">{item.file.substring(0, 20)}...</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteLoading === item.id}
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          title="Hapus Data"
                        >
                          {deleteLoading === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                          ) : <FaTrash />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DataIzin
