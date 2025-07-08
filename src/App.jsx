import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import DashboardHRD from './pages/HR/DashboardHRD'
import DataAkun from './pages/HR/DataAkun'
import DataIzin from './pages/HR/DataIzin'
import DataAbsensi from './pages/HR/DataAbsensi'
import DataPengaduan from './pages/HR/DataPengaduan'
import DataSPPHK from './pages/HR/DataSPPHK'
import DataKaryawan from './pages/HR/DataKaryawan'
import DashboardKaryawan from './pages/client/DashboardKaryawan'
import Absensi from './pages/client/Absensi'
import Izin from './pages/client/Izin'
import Pengaduan from './pages/client/Pengaduan'
import Footer from './components/Footer'
import HariKerjaDetail from './components/static/HariKerjaDetail'
import JamKerjaDetail from './components/static/JamKerjaDetail'

const App = () => {
  const location = useLocation()
  
  const noNavbarRoutes = [
    '/', '/login', '/register',
    '/dashboard-hrd', '/data-akun', '/data-izin',
    '/data-absensi', '/data-karyawan', '/data-pengaduan',
    '/data-spphk'
  ]

  const noFooterRoutes = noNavbarRoutes 

  const hideNavbar = noNavbarRoutes.includes(location.pathname)
  const hideFooter = noFooterRoutes.includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? 'pt-20' : ''}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard-hrd" element={<DashboardHRD />} />
          <Route path="/data-akun" element={<DataAkun />} />
          <Route path="/data-izin" element={<DataIzin />} />
          <Route path="/data-absensi" element={<DataAbsensi />} />
          <Route path="/data-karyawan" element={<DataKaryawan />} />
          <Route path="/data-pengaduan" element={<DataPengaduan />} />
          <Route path="/data-spphk" element={<DataSPPHK />} />
          <Route path="/dashboard-karyawan" element={<DashboardKaryawan />} />
          <Route path="/absensi" element={<Absensi />} />
          <Route path="/izin" element={<Izin />} />
          <Route path="/pengaduan" element={<Pengaduan />} />
          <Route path="/hari-kerja/:userId" element={<HariKerjaDetail />} />
          <Route path="/jam-kerja/:userId" element={<JamKerjaDetail />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </>
  )
}

export default App
