import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import NavbarHRD from '../../components/NavbarHRD';

const DataKaryawan = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/akun');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengambil data');
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(({ nama = '', jabatan = '' }) => (
    nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <NavbarHRD />
      <main className="flex-1 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Karyawan</h2>
            <p className="text-gray-600">Daftar nama dan jabatan karyawan</p>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari karyawan..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <button onClick={fetchUsers} className="mt-2 text-blue-500 hover:text-blue-700">Coba Lagi</button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Tidak ada data karyawan'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['No', 'Nama', 'Jabatan'].map((head, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, i) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nama || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.jabatan || '-'}</td>
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

export default DataKaryawan