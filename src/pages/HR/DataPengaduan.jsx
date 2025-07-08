import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarHRD from '../../components/NavbarHRD';

const DataPengaduan = () => {
  const [pengaduan, setPengaduan] = useState([]);

  const fetchPengaduan = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/pengaduan');
      setPengaduan(res.data);
    } catch (err) {
      console.error('Gagal ambil data pengaduan', err);
    }
  };

  const handleHapus = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengaduan ini?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/pengaduan/${id}`);
      setPengaduan(pengaduan.filter(item => item.id !== id));
    } catch (err) {
      console.error('Gagal hapus pengaduan', err);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📩 Data Pengaduan</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Pesan</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengaduan.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  Belum ada pengaduan 😴
                </td>
              </tr>
            ) : (
              pengaduan.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.user_id}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{item.pesan}</td>
                  <td className="px-4 py-2">{new Date(item.tanggal).toLocaleString()}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => alert(item.pesan)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Baca
                    </button>
                    <button
                      onClick={() => handleHapus(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPengaduan