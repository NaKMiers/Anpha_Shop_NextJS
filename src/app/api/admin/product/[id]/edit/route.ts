import { connectDatabase } from '@/config/database'
import ProductModel, { IProduct } from '@/models/ProductModel'
import { generateSlug } from '@/utils'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// [PUT]: /api/admin/tag/:code/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Product -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create product
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, price, oldPrice, description, isActive, category } = data
    const tags = JSON.parse(data.tags as string)
    const originalImages = JSON.parse(data.originalImages as string)
    let images = formData.getAll('images')

    // get product from database to edit
    const product: IProduct | null = await ProductModel.findById(id).lean()
    // product does exist
    if (!product) {
      return NextResponse.json({ message: 'Product does not exist' }, { status: 404 })
    }

    // upload images to aws s3
    const imageUrls = await Promise.all(images.map(file => uploadFile(file)))

    const stayImages = product.images.filter(img => originalImages.includes(img))
    const needToRemovedImages = product.images.filter(img => !originalImages.includes(img))

    // delete the images do not associated with the product in aws s3
    if (needToRemovedImages && !!needToRemovedImages.length) {
      await Promise.all(needToRemovedImages.map(deleteFile))
    }

    // merge the available images and new upload images
    const newImages = Array.from(new Set([...stayImages, ...imageUrls]))

    // update product in database
    await ProductModel.findByIdAndUpdate(id, {
      $set: {
        title: title,
        price,
        oldPrice: oldPrice === 'null' ? null : oldPrice,
        description,
        active: isActive,
        tags,
        category,
        images: newImages,
        slug: generateSlug(title as string, id),
      },
    })

    // return response
    return NextResponse.json({ message: `Product ${product.title} has been updated` }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
