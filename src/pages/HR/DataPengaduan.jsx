import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import {
  FaSearch,
  FaTrash,
  FaTrashAlt,
  FaFileAlt,
  FaInbox,
  FaCalendarAlt,
  FaUserCircle,
  FaEye
} from 'react-icons/fa';

import NavbarHRD from '../../components/NavbarHRD';

const DataPengaduan = () => {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);

  // Dummy data untuk demo
  const fetchPengaduan = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const dummyData = [
        {
          id: 1,
          user_id: 101,
          pesan: "Sistem absensi tidak berfungsi dengan baik hari ini. Saya sudah mencoba beberapa kali tapi tetap tidak berhasil melakukan check-in.",
          tanggal: new Date().toISOString(),
          nama_user: "Andi Pratama"
        },
        {
          id: 2,
          user_id: 102,
          pesan: "Mohon bantuan untuk reset password akun saya. Email reset tidak masuk ke inbox.",
          tanggal: new Date(Date.now() - 86400000).toISOString(),
          nama_user: "Siti Nurhaliza"
        },
        {
          id: 3,
          user_id: 103,
          pesan: "Ada bug di sistem izin, form tidak bisa di-submit setelah upload dokumen.",
          tanggal: new Date(Date.now() - 172800000).toISOString(),
          nama_user: "Budi Santoso"
        },
        {
          id: 4,
          user_id: 104,
          pesan: "Laporan absensi bulan lalu tidak akurat, mohon dicek kembali data saya.",
          tanggal: new Date(Date.now() - 259200000).toISOString(),
          nama_user: "Dewi Sartika"
        }
      ];
      setPengaduan(dummyData);
      setLoading(false);
    }, 1000);
  };

  const handleHapus = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengaduan ini?")) return;
    
    setPengaduan(pengaduan.filter(item => item.id !== id));
  };

  const handleBaca = (item) => {
    setSelectedPengaduan(item);
  };

  const closeModal = () => {
    setSelectedPengaduan(null);
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    return formatDate(dateString);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <NavbarHRD />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Data Pengaduan</h1>
              <p className="text-slate-600">Kelola dan pantau pengaduan dari karyawan</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Pengaduan</p>
                  <p className="text-2xl font-bold text-slate-800">{pengaduan.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaInbox className="text-blue-600 text-lg" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Hari Ini</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {pengaduan.filter(p => {
                      const today = new Date().toDateString();
                      return new Date(p.tanggal).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-green-600 text-lg" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Minggu Ini</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {pengaduan.filter(p => {
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return new Date(p.tanggal) >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FaUserCircle className="text-orange-600 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-700 font-medium">Memuat data pengaduan...</p>
            </div>
          ) : pengaduan.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
                <FaInbox className="text-slate-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum ada pengaduan</h3>
              <p className="text-slate-600">Tidak ada pengaduan yang masuk saat ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 bg-slate-50">ID</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 bg-slate-50">Pengirim</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 bg-slate-50">Pesan</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 bg-slate-50">Waktu</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 bg-slate-50">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pengaduan.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg text-sm font-semibold text-orange-800">
                          #{item.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {item.nama_user ? item.nama_user.charAt(0).toUpperCase() : item.user_id.toString().charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.nama_user || `User ${item.user_id}`}
                            </p>
                            <p className="text-xs text-slate-500">ID: {item.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-slate-700 truncate">{item.pesan}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {item.pesan.length} karakter
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-slate-700 font-medium">{getTimeAgo(item.tanggal)}</p>
                          <p className="text-xs text-slate-500">{formatDate(item.tanggal)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleBaca(item)}
                            className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                            title="Baca Pengaduan"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleHapus(item.id)}
                            className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                            title="Hapus Pengaduan"
                          >
                            <FaTrashAlt className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedPengaduan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <FaFileAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Detail Pengaduan</h3>
                      <p className="text-orange-100">ID: #{selectedPengaduan.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold">
                      {selectedPengaduan.nama_user ? selectedPengaduan.nama_user.charAt(0).toUpperCase() : selectedPengaduan.user_id.toString().charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {selectedPengaduan.nama_user || `User ${selectedPengaduan.user_id}`}
                    </h4>
                    <p className="text-sm text-slate-600">{formatDate(selectedPengaduan.tanggal)}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h5 className="font-medium text-slate-800 mb-2">Pesan Pengaduan:</h5>
                  <p className="text-slate-700 leading-relaxed">{selectedPengaduan.pesan}</p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      handleHapus(selectedPengaduan.id);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Hapus Pengaduan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataPengaduan