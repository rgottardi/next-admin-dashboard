import { createClient } from '@/lib/supabase/server'

export async function getUserRole() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role || 'user'
}

export async function requireAdmin() {
  const role = await getUserRole()
  if (role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
}

export async function requireUser() {
  const role = await getUserRole()
  if (!role) {
    throw new Error('Unauthorized: Authentication required')
  }
} 