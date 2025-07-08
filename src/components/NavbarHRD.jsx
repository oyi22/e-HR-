import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaDatabase, FaCalendarCheck, FaBookOpen, FaFileAlt, FaFlag } from 'react-icons/fa';

const NavbarHRD = () => {
  const navigate = useNavigate()
  const location = useLocation()

  
  const isActive = (path) => {
    return location.pathname === path
  }

  
  const getButtonClass = (path) => {
    if (isActive(path)) {
      return "flex items-center gap-3 text-orange-400 font-semibold bg-orange-400/10 p-3 rounded-xl w-full hover:bg-orange-400/20 transition-all duration-200";
    }
    return "flex items-center gap-3 p-3 rounded-xl w-full hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white";
  }


  const getActiveIndicator = (path) => {
    if (isActive(path)) {
      return <div className="w-1 h-6 bg-orange-400 rounded-full" />;
    }
    return null
  }

  return (
    <aside className="bg-gradient-to-b from-slate-900 to-slate-800 text-white w-72 p-6 space-y-6 flex flex-col shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
          <FaUser className="text-white text-lg" />
        </div>
        <h1 className="text-orange-400 text-2xl font-bold">e-HRD</h1>
      </div>

      <div className="space-y-3 text-sm">
        <button 
          onClick={() => navigate('/dashboard-hrd')}
          className={getButtonClass('/dashboard-hrd')}
        >
          {getActiveIndicator('/dashboard-hrd')}
          <span>Dashboard</span>
        </button>
        
        <button 
          onClick={() => navigate('/data-karyawan')}
          className={getButtonClass('/data-karyawan')}
        >
          {getActiveIndicator('/data-karyawan')}
          <FaUser className="text-lg" /> 
          <span>Data Karyawan</span>
        </button>
        
        <button 
          onClick={() => navigate('/data-akun')}
          className={getButtonClass('/data-akun')}
        >
          {getActiveIndicator('/data-akun')}
          <FaDatabase className="text-lg" /> 
          <span>Data Akun</span>
        </button>
        
        <button 
          onClick={() => navigate('/data-absensi')}
          className={getButtonClass('/data-absensi')}
        >
          {getActiveIndicator('/absensi')}
          <FaCalendarCheck className="text-lg" /> 
          <span>Absensi</span>
        </button>

        <button 
        onClick={() => navigate('/data-izin')}
          className={getButtonClass('/data-izin')}
        >
          {getActiveIndicator('/saved')}
          <FaBookOpen className="text-lg" /> 
          <span>Izin</span>
        </button>
      
      </div>


      <div className="mt-auto space-y-3 text-sm border-t border-gray-700 pt-6">
        
        <button 
          onClick={() => navigate('/data-pengaduan')}
          className={getButtonClass('/data-pengaduan')}
        >
          {getActiveIndicator('/data-pengaduan')}
          <FaFileAlt className="text-lg" /> 
          <span>Pengaduan</span>
        </button>
        
        <button 
        onClick={() => navigate('/data-spphk')}
          className={getButtonClass('/data-spphk')}
        >
          {getActiveIndicator('/hapus')}
          <FaFlag className="text-lg" /> 
          <span>Auto SP / PHK</span>
        </button>
      </div>
    </aside>
  )
}

export default NavbarHRD