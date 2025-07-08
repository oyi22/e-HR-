import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { User, Mail, Briefcase, Image, Check, UserPlus } from 'lucide-react'

const Register = () => {
  const [form, setForm] = useState({ nama: '', jabatan: '', email: '', foto: '' })
  const [akun, setAkun] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!form.nama || !form.jabatan || !form.email) return alert('Mohon lengkapi semua field yang wajib diisi')

    setIsLoading(true)
    try {
      const res = await register(form)
      setAkun(res.data.akun)
    } catch {
      alert('Gagal mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!akun ? (
          <form
            onSubmit={handleRegister}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} />
              </div>
              <h1 className="text-2xl font-bold mb-2">Buat Akun Baru</h1>
              <p className="text-blue-100 text-sm">Bergabunglah dengan tim kami</p>
            </div>

            <div className="p-6 space-y-5">
              {[
                {
                  label: 'Nama Lengkap', name: 'nama', icon: <User size={16} className="text-gray-500" />,
                  type: 'text', placeholder: 'Masukkan nama lengkap', required: true
                },
                {
                  label: 'Email', name: 'email', icon: <Mail size={16} className="text-gray-500" />,
                  type: 'email', placeholder: 'nama@email.com', required: true
                },
                {
                  label: 'Foto Profil (opsional)', name: 'foto', icon: <Image size={16} className="text-gray-500" />,
                  type: 'text', placeholder: 'https://contoh.com/foto.jpg', required: false
                }
              ].map(({ label, name, icon, type, placeholder, required }) => (
                <div key={name} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {icon} {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                  />
                </div>
              ))}

              {/* Jabatan */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Briefcase size={16} className="text-gray-500" /> Jabatan
                </label>
                <select
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                >
                  <option value="">Pilih jabatan Anda</option>
                  {['Karyawan Produksi', 'Karyawan Gudang', 'Operator Mesin', 'HRD'].map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} /> Daftar Sekarang
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Selamat! 🎉</h2>
              <p className="text-green-100 text-sm">Akun Anda berhasil dibuat</p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">Simpan informasi login Anda dengan aman:</p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p><strong>Username:</strong> {akun.username}</p>
                <p><strong>Password:</strong> {akun.password}</p>
              </div>
              <button
                onClick={() => navigate('/data-akun')}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
              >
                kembali
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
