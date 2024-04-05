// Page
export const getHomeApi = async () => {
  const res = await fetch(`${process.env.APP_URL}/api`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getProductPageApi = async (slug: string) => {
  const res = await fetch(`${process.env.APP_URL}/api/product/${slug}`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

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

  const res = await fetch(url)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

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

  const res = await fetch(url)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getFlashSalePageApi = async () => {
  const res = await fetch(`${process.env.APP_URL}/api/flash-sale`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
