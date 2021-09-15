import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { api } from '../services/api'
import { User } from '../types/User'

export function HomePage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api
      .get<User[]>('users')
      .then(({ data }) => {
        setUsers(data)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      {users.map(user => {
        return (
          <Link key={user.id} to={user.id}>
            <div>{user.name}</div>
          </Link>
        )
      })}
    </div>
  )
}
