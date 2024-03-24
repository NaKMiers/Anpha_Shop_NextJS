import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import TagModel from '@/models/TagModel'
import { uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [POST]: /admin/product/add
export async function POST(req: NextRequest) {
  console.log('- Add Product -')

  // get data to create product
  const formData = await req.formData()
  const data = Object.fromEntries(formData)
  const { title, price, oldPrice, description, isActive, category } = data
  const tags = JSON.parse(data.tags as string)
  let images = formData.getAll('images')

  console.log('tags', tags)
  console.log('category', category)

  try {
    // check images
    if (!images.length) {
      return NextResponse.json({ message: 'Images are required' }, { status: 400 })
    }

    if (!Array.isArray(images)) {
      images = [images]
    }

    const imageUrls = await Promise.all(images.map(file => uploadFile(file)))

    // create new product
    const newProduct = new ProductModel({
      title,
      price,
      description,
      active: isActive,
      tags,
      category,
      oldPrice,
      images: imageUrls,
    })

    // save new product to database
    await newProduct.save()

    // increase related category and tags product quantity
    await TagModel.updateMany({ _id: { $in: tags } }, { $inc: { productQuantity: 1 } })
    await CategoryModel.findByIdAndUpdate(category, {
      $inc: { productQuantity: 1 },
    })

    // return new product
    return NextResponse.json(
      { product: newProduct, message: `Product "${newProduct.title}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
