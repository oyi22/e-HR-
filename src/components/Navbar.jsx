import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, BarChart3, Clock, FileText, MessageSquare, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard-karyawan', label: 'Dashboard', icon: BarChart3 },
    { path: '/absensi', label: 'Absensi', icon: Clock },
    { path: '/izin', label: 'Izin', icon: FileText },
    { path: '/pengaduan', label: 'Pengaduan', icon: MessageSquare },
  ];

  const linkStyle = (path) =>
    `group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
      pathname === path
        ? 'bg-gradient-to-r from-[#7096D1]/30 to-[#D0E3FF]/20 text-white shadow-lg backdrop-blur-sm border border-[#E7F1FF]/30'
        : 'text-[#E7F1FF]/90 hover:text-white hover:bg-[#7096D1]/20 hover:backdrop-blur-sm hover:border hover:border-[#E7F1FF]/20'
    }`;

  const mobileMenuItemStyle = (path) =>
    `flex items-center gap-4 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
      pathname === path
        ? 'bg-gradient-to-r from-[#334EAC]/20 to-[#7096D1]/20 text-[#081F5C] shadow-lg border border-[#7096D1]/30'
        : 'text-[#334EAC] hover:text-[#081F5C] hover:bg-[#E7F1FF]/70'
    }`;

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#081F5C] via-[#334EAC] to-[#7096D1] backdrop-blur-lg border-b border-[#E7F1FF]/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E7F1FF]/30 to-[#D0E3FF]/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-[#E7F1FF]/30 shadow-lg">
                <span className="text-2xl font-bold text-white">e</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-white tracking-tight">e-HRD</h1>
                <p className="text-[#E7F1FF]/80 text-sm font-medium">Dashboard</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path} className={linkStyle(item.path)}>
                    <IconComponent size={20} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-semibold">{item.label}</span>
                    {pathname === item.path && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D0E3FF]/15 to-[#E7F1FF]/10 rounded-2xl animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl text-white hover:bg-[#7096D1]/30 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-[#081F5C]/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div className="absolute top-20 left-0 right-0 bg-gradient-to-b from-[#E7F1FF]/95 to-[#D0E3FF]/90 backdrop-blur-lg shadow-2xl border-t border-[#7096D1]/30 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="p-6 space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={mobileMenuItemStyle(item.path)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent size={24} />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar