// Page
export * from './pageRequest'

// Auth
export * from './authRequest'

// Product
export * from './productRequest'

// Category
export * from './categoryRequest'

// Tag
export * from './tagRequest'

// Account
export * from './accountRequest'

// Order
export * from './orderRequest'

// User
export * from './userRequest'

// Voucher
export * from './voucherRequest'

// Flash Sale
export * from './flashSaleRequest'

// Cart
export * from './cartRequest'

// Comment

// Admin
export * from './adminRequest'

const baseUrl = 'https://api.themoviedb.org/3'

type MovieType = 'upcoming' | 'popular' | 'top_rated'
type TvType = 'popular' | 'top_rated' | 'on_the_air'
type Cate = 'movie' | 'tv'

export const getMoviesList = async (type: MovieType, params: any) => {
  const url = `${baseUrl}/movie/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}
