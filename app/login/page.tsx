'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(formData.email, formData.password)
    
    if (result) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      router.push('/account')
    } else {
      setError('Invalid email or password')
    }
    
    setIsLoading(false)
  }

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-5xl font-light tracking-tight">Login</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white border border-stone-200 rounded-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm font-light">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-light mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-600 text-white py-3 font-light tracking-wide transition-all rounded-sm"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>

            <p className="text-center text-sm text-stone-600 font-light">
              Don't have an account?{' '}
              <Link href="/register" className="text-stone-900 hover:text-stone-700 font-semibold">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
