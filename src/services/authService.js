export const ensureDummyUsers = () => {
  const existing = JSON.parse(localStorage.getItem('users'))
  if (!existing || existing.length === 0) {
    const dummyUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        nama: 'Meulen Admin',
        jabatan: 'admin',
        foto: '',
        role: 'admin',
        user_id: 1
      },
      {
        email: 'user@example.com',
        password: 'user123',
        nama: 'Dita',
        jabatan: 'Karyawan Produksi',
        foto: '',
        role: 'user',
        user_id: 2
      }
    ]
    localStorage.setItem('users', JSON.stringify(dummyUsers))
    console.log('Dummy users berhasil ditambahkan:', dummyUsers)
  }
}


export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const user = users.find(
    (u) => u.email === email && u.password === password
  )
  return user || null
}


export const register = (newUser) => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const isExist = users.find((u) => u.email === newUser.email)
  if (isExist) {
    return { success: false, message: 'Email sudah terdaftar!' }
  }

  const newId = users.length > 0 ? users[users.length - 1].user_id + 1 : 1
  const userToSave = {
    ...newUser,
    username: newUser.email, 
    user_id: newId,
    password: 'user123' 
  }

  users.push(userToSave)
  localStorage.setItem('users', JSON.stringify(users))

  return { success: true, user: userToSave }
}

