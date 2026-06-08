import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAdminAuth, AdminLogin } from '../../components/AdminLayout'

export default function AdminIndex() {
  const { authed } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (authed === true) router.replace('/admin/guests')
  }, [authed, router])

  if (authed === null) return null
  if (!authed) return <AdminLogin />
  return null
}
