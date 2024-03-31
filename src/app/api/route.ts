import { connectDatabase } from '@/config/databse'
import { NextResponse } from 'next/server'
import '@/models/TagModel'
import '@/models/CategoryModel'
import '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { FullyProduct } from './product/[slug]/route'
import { ITag } from '@/models/TagModel'
import { shuffleArray } from '@/utils'

// [GET]: /
export async function GET() {
  console.log('- Get Home Page -')

  // connect to database
  connectDatabase()

  try {
    // get all products to show in home page
    const products: FullyProduct[] = await ProductModel.find({ active: true })
      .populate('tags')
      .populate('category')
      .populate('flashsale')
      .lean()

    // get all categories from database
    let originalCategories: ICategory[] = await CategoryModel.find().lean()
    const sequenceCategory = process.env.SEQUENCE_CATEGORIES!.split(' ')
    originalCategories = originalCategories.sort(
      (a, b) =>
        sequenceCategory.indexOf(a.title.toLowerCase()) - sequenceCategory.indexOf(b.title.toLowerCase())
    )
    // get all tags
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
    const productsByCategoryGroups = originalCategories
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
    const carouselProducts = [...shuffledProducts.slice(0, 7), ...shuffledProducts.slice(7, 14)]

    // get best seller
    const bestSellerProducts = products.sort((a, b) => b.sold - a.sold).slice(0, 10)

    // get products are currently on flash sale
    const flashsaleProducts = products.filter(product => product.flashsale)

    return NextResponse.json(
      {
        productsByCategoryGroups,
        bestSellerProducts,
        flashsaleProducts,
        categories: originalCategories,
        tags,
        carouselProducts,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
