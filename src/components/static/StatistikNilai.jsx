import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Calendar, Clock, Star } from 'lucide-react'
import axios from 'axios'
import JamKerjaDetail from './JamKerjaDetail'
import RatingDetail from './RatingDetail'

const StatistikNilai = () => {
  const navigate = useNavigate()
  const userData = localStorage.getItem('user')
  const userId = userData ? JSON.parse(userData).id :null
  const [statistik, setStatistik] = useState({
    hariKerja: 0,
    jamKerja: 0,
    rating: 0
  })
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/statistik/${userId}`)
        setStatistik(res.data)
      } catch (err) {
        console.error('Gagal fetch statistik:', err)
      }
    }

    if (userId) {
      fetchStatistik()
    }
  }, [userId])

  const handleHariKerjaClick = () => {
    if(userId) {
      navigate(`/hari-kerja/${userId}`)
    } else {
      console.warn('user id tidak ditemukan')
      alert('user blm login / data ngak di temukan')
    }
  }
  const handleJamKerjaClick = () =>{
    navigate(`/jam-kerja/${userId}`)
  }
  const handleRatinClick = () =>{
    navigate(`/rating/${userId}`)
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-indigo-900 mb-2">Statistik Singkat</h3>
        <p className="text-gray-600">Ringkasan aktivitas Anda</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Calendar}
          title="Hari Kerja"
          value={statistik.hariKerja}
          subtitle="bulan ini"
          color="text-blue-600"
          bgColor="bg-blue-100"
          onClick={handleHariKerjaClick}
        />
        <StatCard
          icon={Clock}
          title="Jam Kerja"
          value={statistik.jamKerja}
          subtitle="jam total"
          color="text-green-600"
          bgColor="bg-green-100"
          onClick={handleJamKerjaClick}
        />
        <StatCard
          icon={Star}
          title="Rating"
          value={statistik.rating}
          subtitle="performa"
          color="text-yellow-600"
          bgColor="bg-yellow-100"
          onClick={handleRatinClick}
        />
      </div>

      <div className="mt-6">
        {selected && (
          <button
            className="text-sm text-red-500 mb-2 underline"
            onClick={() => setSelected(null)}
          >
            Tutup Detail
          </button>
        )}
        {selected === 'jamKerja' && <JamKerjaDetail userId={userId} />}
        {selected === 'rating' && <RatingDetail userId={userId} />}
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor, onClick }) => (
  <div
    className="text-center p-6 rounded-2xl bg-white/50 border border-white/30 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
    onClick={onClick}
  >
    <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
    <p className="text-lg font-semibold text-gray-800">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
)

export default StatistikNilai