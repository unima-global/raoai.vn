'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  image_url: string
  price?: number
  category?: string
}

export default function TimKiemPage() {
  const supabase = createPagesBrowserClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  const keyword = searchParams.get('q')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''
  const minPrice = Number(searchParams.get('minPrice') || '0')
  const maxPrice = Number(searchParams.get('maxPrice') || '0')

  const [results, setResults] = useState<Post[]>([])

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase
        .from('posts')
        .select('id, title, image_url, price, category')
        .order('id', { ascending: false })

      if (keyword) {
        query = query.ilike('title', `%${keyword}%`)
      }

      if (category) {
        query = query.eq('category', category)
      }

      if (minPrice > 0) {
        query = query.gte('price', minPrice)
      }

      if (maxPrice > 0) {
        query = query.lte('price', maxPrice)
      }

      const { data } = await query
      if (data) setResults(data)
    }

    fetchData()
  }, [keyword, category, minPrice, maxPrice])

  const updateFilters = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    router.push(`/tim-kiem?${params.toString()}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kết quả tìm kiếm: "{keyword}"</h1>

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Từ khóa..."
          className="p-2 border rounded"
          defaultValue={keyword}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilters('q', (e.target as HTMLInputElement).value)
            }
          }}
        />
        <select
          className="p-2 border rounded"
          value={category}
          onChange={(e) => updateFilters('category', e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          <option value="nhadat">Nhà đất</option>
          <option value="oto">Ô tô</option>
          <option value="dienthoai">Điện thoại</option>
        </select>
        <input
          type="number"
          placeholder="Giá từ"
          className="p-2 border rounded"
          defaultValue={minPrice || ''}
          onBlur={(e) => updateFilters('minPrice', e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá đến"
          className="p-2 border rounded"
          defaultValue={maxPrice || ''}
          onBlur={(e) => updateFilters('maxPrice', e.target.value)}
        />
      </div>

      {results.length === 0 ? (
        <p className="text-gray-600">Không tìm thấy kết quả nào.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((post) => (
            <li key={post.id} className="border rounded p-4 shadow-sm">
              <h2 className="font-semibold">{post.title}</h2>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto mt-2 rounded"
                />
              )}
              <Link
                href={`/tin/${post.id}`}
                className="text-blue-600 text-sm inline-block mt-2"
              >
                Xem chi tiết →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
