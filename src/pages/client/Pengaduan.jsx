import { useEffect, useState } from "react"
import { MessageSquare, User, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const Pengaduan = () => {
  const [user, setUser] = useState(null)
  const [pesan, setPesan] = useState("")
  const [isHovered, setIsHovered] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleKirim = async () => {
    if (!pesan.trim()) return alert("Pesan pengaduan tidak boleh kosong!")
    if (!user.id) return alert("User ID tidak ditemukan!")
    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:3001/api/pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, pesan })
      })
      if (res.ok) {
        alert("Pengaduan berhasil dikirim!")
        setPesan("")
        setCharCount(0)
      } else throw new Error("Network response was not ok")
    } catch (err) {
      console.error(err)
      alert("Gagal mengirim pengaduan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePesanChange = e => {
    const val = e.target.value
    setPesan(val)
    setCharCount(val.length)
  }

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-12 text-center animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-violet-400" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-violet-200/30"></div>
          </div>
        </div>
        <span className="text-2xl font-light text-gray-600">Memuat data pengguna...</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-12 px-4 lg:px-8">
      {/* Background */} 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl shadow-lg border border-white/50">
                <MessageSquare className="h-12 w-12 text-violet-500" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-light bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight mb-3">
              Form Pengaduan
            </h1>
            <div className="h-1 bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 rounded-full animate-pulse mx-auto w-32"></div>
            <p className="text-gray-600 font-light text-lg mt-4">Sampaikan keluhan atau saran Anda dengan mudah</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-700">
          <div className="p-8 lg:p-12 space-y-10">
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl shadow-lg border border-white/50">
                  <User className="h-7 w-7 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-800">Informasi Pengirim</h2>
                  <p className="text-gray-500 font-light">Data otomatis dari akun Anda</p>
                </div>
              </div>

              <div className={`relative transform transition-all duration-300 ${isHovered === 'nama' ? 'scale-102' : ''}`}
                onMouseEnter={() => setIsHovered('nama')}
                onMouseLeave={() => setIsHovered(null)}>
                <label className="flex items-center gap-3 text-gray-700 font-medium text-lg mb-3">
                  <User className="h-5 w-5 text-violet-400" />
                  Nama Lengkap
                </label>
                <input
                  value={user.nama}
                  disabled
                  className={`w-full bg-white/50 backdrop-blur-xl border-2 rounded-2xl px-6 py-4 text-gray-700 font-light text-lg focus:outline-none shadow-lg transition-all duration-300 ${
                    isHovered === 'nama' ? 'border-violet-300 bg-white/70 shadow-xl' : 'border-white/40'
                  }`}
                />
                <div className={`absolute right-6 top-12 transform transition-all duration-300 ${isHovered === 'nama' ? 'scale-110' : ''}`}>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>

            {/* Pesan */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg border border-white/50">
                  <MessageSquare className="h-7 w-7 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-800">Pesan Pengaduan</h2>
                  <p className="text-gray-500 font-light">Jelaskan keluhan atau saran Anda</p>
                </div>
              </div>

              <div className={`relative transform transition-all duration-300 ${isHovered === 'pesan' ? 'scale-102' : ''}`}
                onMouseEnter={() => setIsHovered('pesan')}
                onMouseLeave={() => setIsHovered(null)}>
                <label className="flex items-center gap-3 text-gray-700 font-medium text-lg mb-3">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  Tulis Pesan Anda
                </label>
                <div className="relative">
                  <textarea
                    value={pesan}
                    onChange={handlePesanChange}
                    rows={8}
                    placeholder="Sampaikan keluhan, saran, atau masalah yang ingin Anda laporkan dengan detail..."
                    className={`w-full bg-white/50 backdrop-blur-xl border-2 rounded-2xl px-6 py-4 text-gray-700 font-light text-lg focus:outline-none shadow-lg transition-all duration-300 resize-none ${
                      isHovered === 'pesan' || pesan ? 'border-purple-300 bg-white/70 shadow-xl' : 'border-white/40'
                    }`}
                  />
                  <div className="absolute bottom-4 right-6 flex items-center gap-2">
                    <div className={`text-sm font-light transition-colors duration-300 ${charCount > 500 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {charCount} karakter
                    </div>
                    {charCount > 0 && <div className="w-2 h-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full animate-pulse"></div>}
                  </div>
                </div>
                {pesan.trim() && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-light">Pesan siap dikirim</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <span className="text-sm font-light">Pastikan informasi yang Anda berikan akurat</span>
                </div>
                <button
                  onClick={handleKirim}
                  disabled={!pesan.trim() || isSubmitting}
                  onMouseEnter={() => setIsHovered('submit')}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 transform shadow-lg ${
                    !pesan.trim() || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="relative">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <div className="absolute inset-0 h-6 w-6 animate-ping rounded-full bg-white/30"></div>
                      </div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className={`h-6 w-6 transition-transform duration-300 ${isHovered === 'submit' ? 'translate-x-1' : ''}`} />
                      Kirim Pengaduan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl px-6 py-4 inline-flex items-center gap-3 shadow-lg border border-white/40">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-light">Tim kami akan merespons pengaduan Anda dalam 1x24 jam</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pengaduan