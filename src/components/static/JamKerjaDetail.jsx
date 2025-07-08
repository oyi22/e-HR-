import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts'
import { Clock, Moon, Sun } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F']

const JamKerjaDetail = () => {
  const { userId } = useParams()
  const [workHours, setWorkHours] = useState({ totalHours: 0, weeklyData: [] })
  const [shiftData, setShiftData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const [hoursRes, shiftRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/jam-kerja/${userId}`),
          axios.get(`http://localhost:3001/api/jam-kerja/shift/${userId}`)
        ])

        setWorkHours(hoursRes.data)

        const formattedShiftData = [
          { name: 'Shift Pagi', value: shiftRes.data.Pagi || 0 },
          { name: 'Shift Malam', value: shiftRes.data.Malam || 0 }
        ]

        setShiftData(formattedShiftData)
        setLoading(false)
      } catch (err) {
        console.error('Gagal fetch jam kerja:', err)
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) return <div className="text-center mt-10">Loading data...</div>

  return (
    <div className="mt-6 bg-white/70 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistik Jam Kerja</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Jam Kerja */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <p className="text-lg font-medium">
              Total Jam Kerja: <span className="font-bold text-blue-600">{workHours.totalHours} jam</span>
            </p>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Setiap kehadiran dihitung 8 jam kerja
          </p>
        </div>

        {/* Pie Chart Shift */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-center font-medium mb-2">Distribusi Shift</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shiftData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {shiftData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart Mingguan */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Jam Kerja 7 Hari Terakhir</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workHours.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} jam`, 'Jam Kerja']}
                labelFormatter={(label) =>
                  `Tanggal: ${
                    workHours.weeklyData.find((d) => d.day === label)?.date || '-'
                  }`
                }
              />
              <Bar dataKey="hours" fill="#4f46e5" name="Jam Kerja" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Catatan: Perhitungan jam kerja berdasarkan data kehadiran dengan asumsi 8 jam per shift.</p>
      </div>
    </div>
  )
}

export default JamKerjaDetail
