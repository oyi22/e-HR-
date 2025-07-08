import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Star, StarHalf } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RatingDetail = () => {
  const { userId } = useParams()
  const [ratingData, setRatingData] = useState({ currentRating: 0, history: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/ratings/${userId}`)
        setRatingData(res.data)
        setLoading(false)
      } catch (err) {
        console.error('Gagal fetch rating:', err)
        setLoading(false)
      }
    }

    fetchRatingData()
  }, [userId])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 text-yellow-400 fill-yellow-400" />)
    }
    
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)
    }
    
    return stars
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="mt-6 bg-white/70 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistik Rating Kinerja</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="text-center p-6 bg-yellow-50 rounded-lg">
          <div className="flex justify-center mb-2">
            {renderStars(ratingData.currentRating)}
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {ratingData.currentRating.toFixed(1)}/5.0
          </p>
          <p className="text-sm text-gray-600">Rating saat ini</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratingData.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Rating"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Catatan: Grafik menampilkan perkembangan rating kinerja dalam 6 bulan terakhir.</p>
      </div>
    </div>
  )
}

export default RatingDetail