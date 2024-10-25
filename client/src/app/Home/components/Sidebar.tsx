import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DialogD from './Addgroup'
import axios from 'axios'

interface Group {
  _id: string
  name: string
  joinCode: string
  createdBy: string
  members: string[]
  jobPostings: any[]
  createdAt: string
  updatedAt: string
  __v: number
}

export default function Sidebar() {
  const storedUserData = localStorage.getItem('UserData')
  const user = storedUserData ? JSON.parse(storedUserData) : null
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.BACKEND_URL}/${user.email}`)
          setGroups(response.data.groups || [])
        } catch (error) {
          console.error('Error fetching groups:', error)
        }
      }

      fetchData()
    }
  }, [user])

  const addGroup = async () => {
    if (!user) return // Ensure user exists

    const newGroup = {
      _id: `newGroupId${groups.length + 1}`,
      name: `Group ${groups.length + 1}`,
      joinCode: `code${groups.length + 1}`,
      createdBy: user.userId, // Assuming you have userId in UserData
      members: [],
      jobPostings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 1,
    }

    // Add the new group to the backend (replace with your API endpoint)
    try {
      await axios.post(`${process.env.BACKEND_URL}/addGroup`, newGroup)
      setGroups([...groups, newGroup]) // Update state with the new group
    } catch (error) {
      console.error('Error adding group:', error)
    }
  }

  return (
    <div className="flex flex-col justify-between gap-4 p-4 h-full">
      <div>
        <div className="text-2xl font-bold mb-4">Your Groups</div>
        <div className="flex flex-col gap-2 mt-8">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group._id} className="text-sm text-black px-3 py-1 border-b rounded-md">
                <Link href={`/Home/${group._id}`}>{group.name}</Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No groups available.</p>
          )}
        </div>
      </div>

      <button onClick={addGroup} className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600">
        Add Group
      </button>

      <DialogD />
    </div>
  )
}
