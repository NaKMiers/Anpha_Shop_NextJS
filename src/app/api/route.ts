import { connectDatabase } from '@/config/databse'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import '@/models/FlashsaleModel'
import '@/models/TagModel'
import '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { shuffleArray } from '@/utils'
import { NextResponse } from 'next/server'
import { FullyProduct } from './product/[slug]/route'

export const dynamic = 'force-dynamic'

// [GET]: /
export async function GET() {
  console.log('- Get Home Page -')

  try {
    // connect to database
    await connectDatabase()

    // get all products to show in home page
    const products: FullyProduct[] = await ProductModel.find({ active: true })
      .populate('tags')
      .populate('category')
      .populate('flashsale')
      .lean()

    // get all categories from products to make sure that no category with empty products
    let categories: ICategory[] = Array.from(
      new Set(
        products.reduce((categories: ICategory[], product: FullyProduct) => {
          if (product.category && product.category._id) {
            categories.push(product.category)
          }
          return categories
        }, [])
      )
    )

    // sort category by sequence
    const sequenceCategory = process.env.SEQUENCE_CATEGORIES!.split(' ')
    categories = categories.sort((a, b) => {
      const indexA = sequenceCategory.indexOf(a.title.toLowerCase())
      const indexB = sequenceCategory.indexOf(b.title.toLowerCase())

      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
    })

    // get all tags from products to make sure that no tag with empty products
    const tags: ITag[] = Array.from(
      new Set(
        products.reduce((tags: ITag[], product: FullyProduct) => {
          if (product.tags && product.tags.length > 0) {
            tags.push(...product.tags)
          }
          return tags
        }, [])
      )
    )
    // create category list with corresponding products
    const productsByCategoryGroups = categories
      .map(category => {
        const productsByCtg = products
          .filter(product => product.category._id.toString() === category._id.toString())
          .sort((a, b) => b.sold - a.sold)

        return {
          category,
          products: productsByCtg,
        }
      })
      .filter(category => category.products.length) // remove category with empty product
      .sort((a, b) => b.products.length - a.products.length)

    // shuffle products to get random
    const shuffledProducts = shuffleArray([...products.filter(product => product.stock > 0)])
    const carouselProducts = shuffledProducts.slice(0, 7)

    // get best seller
    const bestSellerProducts = products.sort((a, b) => b.sold - a.sold).slice(0, 10)

    // get products are currently on flash sale
    const flashsaleProducts = products.filter(product => product.flashsale)

    return NextResponse.json(
      {
        productsByCategoryGroups,
        bestSellerProducts,
        flashsaleProducts,
        categories: categories,
        tags,
        carouselProducts,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
