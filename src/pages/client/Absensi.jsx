import { useEffect, useState } from 'react'
import { MapPin, Clock, User, Send, Loader2, CheckCircle2 } from 'lucide-react'

const Absensi = () => {
  const [lokasi, setLokasi] = useState('Menentukan lokasi...')
  const [coords, setCoords] = useState(null)
  const [waktu, setWaktu] = useState('')
  const [user, setUser] = useState(null)
  const [shift, setShift] = useState('Pagi')
  const [loadingLokasi, setLoadingLokasi] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    ambilLokasi()
    setWaktu(new Date().toLocaleString('id-ID'))
  }, [])

  useEffect(() => {
    if (coords && !map) {
      import('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js').then(() => {
        const mapInstance = window.L.map('leaflet-map').setView([coords.lat, coords.lng], 15)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance)
        const customIcon = window.L.divIcon({
          html: `<div style="
            background: #334EAC;
            width: 24px;
            height: 24px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          className: 'custom-marker'
        })
        const markerInstance = window.L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(mapInstance)
        setMap(mapInstance)
        setMarker(markerInstance)
      })
    } else if (coords && map && marker) {
      map.setView([coords.lat, coords.lng], 15)
      marker.setLatLng([coords.lat, coords.lng])
    }
  }, [coords, map, marker])

  const ambilLokasi = () => {
    setLoadingLokasi(true)
    if (!navigator.geolocation) {
      setLokasi('Geolocation tidak didukung')
      setLoadingLokasi(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
          const data = await res.json()
          const alamatLengkap = data.display_name || 'disini pokoknya'
          setLokasi(`${alamatLengkap} (Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)})`)
        } catch (err) {
          console.error('Gagal reverse geocode:', err)
          setLokasi(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`)
        } finally {
          setLoadingLokasi(false)
        }
      },
      () => {
        setLokasi('disini pokoknya')
        setLoadingLokasi(false)
      }
    )
  }

  const kirimAbsensi = async () => {
    if (!coords || !user) {
      alert('Data tidak lengkap!')
      return
    }
    setLoadingSubmit(true)
    setSuccess(false)
    try {
      const res = await fetch('http://localhost:3001/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user.user_id,
          nama: user.nama,
          jabatan: user.jabatan || 'Karyawan',
          shift,
          lokasi,
          keterangan: 'Hadir'
        })
      })
      if (res.ok) {
        const result = await res.json()
        setSuccess(true)
        alert('✅ Absensi berhasil disimpan!')
        console.log('Success:', result)
      } else {
        let errMsg = 'Terjadi kesalahan'
        try {
          const result = await res.json()
          errMsg = result.message || errMsg
        } catch {
          errMsg = `HTTP ${res.status}: ${res.statusText}`
        }
        alert('❌ Gagal menyimpan absensi: ' + errMsg)
        console.error('HTTP Error:', res.status, res.statusText)
      }
    } catch (err) {
      console.error('Network Error:', err)
      alert('done')
    } finally {
      setLoadingSubmit(false)
    }
  }

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-12 text-center animate-pulse">
          <div className="flex items-center justify-center mb-4 relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-200/30" />
          </div>
          <span className="text-2xl font-light text-gray-600">Memuat data...</span>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 p-6 lg:p-12">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div className="max-w-7xl mx-auto mb-12 text-center space-y-6">
        <div className="inline-block">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent tracking-tight">Absensi</h1>
          <div className="h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-sky-200 rounded-full mt-2 animate-pulse" />
        </div>
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl px-6 py-3 inline-flex items-center gap-3 shadow-lg border border-white/40">
          <Clock className="h-5 w-5 text-blue-400 animate-pulse" />
          <span className="font-light text-gray-700 text-lg">{waktu}</span>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-7xl mx-auto bg-white/20 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-700 grid lg:grid-cols-2">
        {/* Lokasi */}
        <section className="p-8 lg:p-12 relative space-y-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-6 left-6 w-32 h-32 bg-blue-300 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-6 right-6 w-24 h-24 bg-indigo-300 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg border border-white/50">
                <MapPin className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-light text-gray-800">Lokasi Anda</h2>
                <p className="text-gray-500 font-light">Posisi saat ini</p>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 h-80 group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]">
              <div id="leaflet-map" className="w-full h-full" style={{ borderRadius: '1.5rem' }} />
              {loadingLokasi && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-white/50 flex items-center gap-4">
                    <div className="relative">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                      <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-200/50" />
                    </div>
                    <span className="font-light text-gray-700 text-lg">Mengambil lokasi...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 hover:bg-white/50 transition">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 mb-2 text-lg">Alamat Saat Ini</p>
                  <p className="text-gray-600 leading-relaxed font-light">{lokasi}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="p-8 lg:p-12 bg-gradient-to-br from-white/10 to-white/5 relative">
          <div className="absolute top-8 right-8 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-10 animate-pulse" />
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-lg border border-white/50">
                <User className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-light text-gray-800">User Info</h2>
                <p className="text-gray-500 font-light">{user?.nama} <span className="text-indigo-600 font-medium">{user?.jabatan}</span></p>
              </div>
            </div>
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); kirimAbsensi() }}>
              <div className="flex flex-col space-y-1">
                <label htmlFor="shift" className="font-light text-gray-700 text-lg">Shift</label>
                <select id="shift" value={shift} onChange={(e) => setShift(e.target.value)} className="rounded-xl border border-gray-300 p-3 bg-white font-light text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400 transition" required>
                  <option value="Pagi">Pagi</option>
                  <option value="Malam">Malam</option>
                </select>
              </div>
              <button
                type='submit'
                disabled={loadingSubmit || success}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-light py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${loadingSubmit || success ? 'cursor-not-allowed opacity-70' : ''}`}>
                {loadingSubmit ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Mengirim...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    Terkirim!
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Kirim Absensi
                  </>
                )}
              </button>
              <button
                type='button'
                onClick={() => {
                  setSuccess(false)
                  ambilLokasi()
                }}
                className='w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-light py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300'>
                <MapPin className='h-5 w-5' />
                Reset Lokasi
              </button>
              <p className="text-sm text-center text-gray-400 mt-4">silahkan reload browser kalau sudah absen</p>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Absensi