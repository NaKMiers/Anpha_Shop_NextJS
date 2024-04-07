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
export const getTagsPageApi = async (searchParams: { [key: string]: string[] } | undefined) => {
  const url = handleQuery(searchParams, `${process.env.APP_URL}/api/tag`)

  // revalidate every 1 minute
  const res = await fetch(url, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCategoriesPageApi = async (searchParams: { [key: string]: string[] } | undefined) => {
  const url = handleQuery(searchParams, `${process.env.APP_URL}/api/category`)

  // revalidate every 1 minute
  const res = await fetch(url, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getFlashSalePageApi = async (searchParams: { [key: string]: string[] } | undefined) => {
  const url = handleQuery(searchParams, `${process.env.APP_URL}/api/flash-sale`)

  // revalidate every 1 minute
  const res = await fetch(url, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
