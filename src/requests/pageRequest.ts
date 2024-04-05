// Page -------------------------------------

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
  let url = `${process.env.APP_URL}/api/tag?`
  for (let key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (let value of searchParams[key]) {
        url += `${key}=${value}&`
      }
    } else {
      url += `${key}=${searchParams[key]}&`
    }
  }

  // remove final '&'
  url = url.slice(0, -1)

  // revalidate every 1 minute
  const res = await fetch(url, { next: { revalidate: 60 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCategoriesPageApi = async (searchParams: { [key: string]: string[] } | undefined) => {
  let url = `${process.env.APP_URL}/api/category?`
  for (let key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (let value of searchParams[key]) {
        url += `${key}=${value}&`
      }
    } else {
      url += `${key}=${searchParams[key]}&`
    }
  }

  // remove final '&'
  url = url.slice(0, -1)

  // revalidate every 1 minute
  const res = await fetch(url, { next: { revalidate: 60 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getFlashSalePageApi = async () => {
  // revalidate every 1 minute
  const res = await fetch(`${process.env.APP_URL}/api/flash-sale`, { next: { revalidate: 60 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
