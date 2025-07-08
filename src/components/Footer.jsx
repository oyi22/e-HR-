import { Clock, MapPin, Phone, Mail, Calendar, Users } from 'lucide-react';

const Footer = () => {
 
  return (
    <footer 
      className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #081F5C 0%, #334EAC 50%, #7096D1 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-8 gap-4 h-full opacity-30">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="bg-white rounded-full w-2 h-2 animate-pulse" 
                   style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Sistem Absensi Digital
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Solusi modern untuk manajemen kehadiran karyawan dengan teknologi terdepan. 
                Pantau produktivitas tim Anda dengan mudah dan efisien.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-blue-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <Users className="w-4 h-4" />
                <span className="text-sm">1000+ Pengguna</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-blue-200">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100 text-sm">
                  Jl. PIP No. 123, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 text-sm">+62 21-1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 text-sm">support@absensi.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div 
          className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: '#7096D1' }}
        >
          <div className="text-sm text-blue-200">
            © 2025 Sistem Absensi Digital. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
              Syarat & Ketentuan
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
              Bantuan
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1"
        style={{
          background: 'linear-gradient(90deg, #E7F1FF 0%, #D0E3FF 50%, #F9FCFF 100%)'
        }}
      />
    </footer>
  );
};

export default Footer