import { connectDatabase } from '@/config/databse'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import { shuffleArray } from '@/utils'
import { NextResponse } from 'next/server'
import '@/models/TagModel'
import '@/models/FlashsaleModel'

// Connect to database
connectDatabase()

// [GET]: /
export async function GET() {
  console.log('index')

  try {
    // get all products to show in home page
    const products: any[] = await ProductModel.find({ active: true })
      .populate('tags')
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
    const tags = Array.from(
      new Set(
        products.reduce((tags, product) => {
          if (product.tags && product.tags.length > 0) {
            tags.push(...product.tags)
          }
          return tags
        }, [])
      )
    )

    // create category list with corresponding products
    const categories = originalCategories
      .map(category => {
        const productsByCtg = products
          .filter(product => product.category && product.category.toString() === category._id.toString())
          .sort((a, b) => b.sold - a.sold)

        return {
          ...category,
          products: productsByCtg,
        }
      })
      .filter(category => category.products.length) // remove category with empty product
    // .sort((a, b) => b.products.length - a.products.length)

    // shuffle products to get random
    const shuffledProducts = shuffleArray([...products.filter(product => product.stock > 0)])
    const bannerProducts = [
      shuffledProducts.slice(0, 7),
      shuffledProducts.slice(7, 14),
      shuffledProducts.slice(14, 21),
    ]

    // get best seller
    const bestSellers = {
      title: 'Sản phẩm bán chạy nhất',
      isBestSeller: true,
      products: products.sort((a, b) => b.sold - a.sold).slice(0, 10),
    }

    // get products are currently on flash sale
    const flashsaleProducts = products.filter(product => product.flashsale)

    return NextResponse.json(
      {
        categories,
        bestSellers,
        allCates: originalCategories,
        flashsaleProducts,
        tags,
        bannerProducts,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
