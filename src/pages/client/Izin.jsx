import { useEffect, useState } from "react"
import {
  Upload, User, Clock, FileText, Download, Send, CheckCircle,
} from "lucide-react"

const Izin = () => {
  const [user, setUser] = useState(null)
  const [shift, setShift] = useState("Pagi")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof Storage !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        const userData = JSON.parse(stored)
        console.log("User loaded from localStorage:", userData)
        setUser(userData)
      } else {
        alert("Anda belum login! Silakan login terlebih dahulu.")
      }
    } else {
      setUser({ user_id: 123, nama: "John Doe", password: "EMP001" })
    }
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer?.files?.[0]
    const allowed = [
      "application/pdf", "image/jpeg", "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (droppedFile) {
      if (allowed.includes(droppedFile.type)) {
        setFile(droppedFile)
      } else {
        alert("Format file tidak didukung. Harap upload PDF, JPG, PNG, atau DOCX.")
      }
    }
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userId = user?.user_id || user?.id || user?.userId
    if (!user || (!userId && userId !== 0)) {
      alert("Data user tidak ada atau tidak valid. Coba login ulang.")
      return
    }

    if (!file) {
      alert("File surat izin wajib diupload.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("user_id", userId.toString())
      formData.append("shift", shift)
      formData.append("file", file)

      const res = await fetch("http://localhost:3001/api/izin/upload", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Server error: ${res.status} - ${errorText}`)
      }

      await res.json()
      alert("IZIN BERHASIL DIKIRIM!")

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFile(null)
      }, 3000)
    } catch (err) {
      alert(`GAGAL MENGIRIM IZIN: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-indigo-600 text-center font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Berhasil Terkirim!</h2>
          <p className="text-green-600 mb-6">
            Permohonan izin Anda telah berhasil dikirim dan akan segera diproses.
          </p>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Formulir Izin Karyawan
          </h1>
          <p className="text-gray-600">Ajukan permohonan izin dengan mudah dan cepat</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 space-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-medium">Nama:</span>
              <span className="ml-2 text-gray-700">{user.nama || user.name || "Tidak tersedia"}</span>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-medium">No Induk:</span>
              <span className="ml-2 text-gray-700">
                {user.password || user.no_induk || user.user_id || user.id || "Tidak tersedia"}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-indigo-600 mr-2" />
              <label className="text-indigo-800 font-medium mr-2">Shift:</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="border border-indigo-300 rounded-lg px-3 py-1 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pagi">Pagi</option>
                <option value="Malam">Malam</option>
              </select>
            </div>
          </div>

          <div
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed ${
              dragActive ? "border-indigo-600 bg-indigo-50" : "border-indigo-300"
            } rounded-2xl p-8 text-center transition-all duration-200 hover:border-indigo-400`}
          >
            <Upload className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
            <p className="text-indigo-700 font-semibold mb-2">
              Seret dan lepaskan file surat izin Anda di sini
            </p>
            <p className="text-sm text-gray-500 mb-4">Atau klik untuk memilih file</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {file && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">✅ File terpilih: {file.name}</p>
                <p className="text-xs text-green-600">Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <a
              href="/template-suratTamplateIzin.docx"
              download
              className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Unduh template surat izin
            </a>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading || !file
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105"
              }`}
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Mengirim..." : "Kirim Izin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Izin
