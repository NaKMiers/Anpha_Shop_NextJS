import { IProduct } from '@/models/ProductModel'
import { getSuggestedProductsApi } from '@/requests'
import React, { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import GroupProducts from './GroupProducts'
import LoadingGroupProducts from './loading/LoadingGroupProducts'
import { useAppSelector } from '@/libs/hooks'

interface SuggestionsProps {
  className?: string
}

function CartSuggestions({ className = '' }: SuggestionsProps) {
  // store
  let localCartItems = useAppSelector(state => state.cart.localItems)
  let cartItems = useAppSelector(state => state.cart.items)

  // states
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // get suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      // start loading
      setLoading(true)

      try {
        let query = '?'
        const items = [...localCartItems, ...cartItems]
        items.forEach((item, index) => (query += `${index === 0 ? '' : '&'}exclude=${item.productId}`))

        const { products } = await getSuggestedProductsApi(query, { next: { revalidate: 10 } })

        // set products
        setProducts(products)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }

    getSuggestions()
  }, [localCartItems, cartItems])

  return (
    (loading || products.length > 0) && (
      <div className={`w-full ${className}`}>
        {loading ? (
          <LoadingGroupProducts hideTop />
        ) : (
          <GroupProducts
            products={products}
            hideTop
          />
        )}
      </div>
    )
  )
}

export default memo(CartSuggestions)
