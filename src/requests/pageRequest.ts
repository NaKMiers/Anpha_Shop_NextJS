// Page -------------------------------------

import { handleQuery } from '@/utils/handleQuery'

// [GET]
export const getHomeApi = async () => {
  // revalidate every 1 minute
  const res = await fetch(`${process.env.APP_URL}/api`, { next: { revalidate: 60 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getProductPageApi = async (slug: string) => {
  // revalidate every 1 minute
  const res = await fetch(`${process.env.APP_URL}/api/product/${slug}`, { next: { revalidate: 60 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getTagsPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.APP_URL}/api/tag${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCategoriesPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.APP_URL}/api/category${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getFlashSalePageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.APP_URL}/api/flash-sale${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getBestSellerPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.APP_URL}/api/best-seller${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
