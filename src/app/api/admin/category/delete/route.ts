import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// [DELETE]: /admin/category/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Categories - ')

  // connect to database
  connectDatabase()

  // get category ids to delete
  const { ids } = await req.json()
  console.log(ids)

  try {
    // get delete categories
    const deletedCategories = await CategoryModel.find({ _id: { $in: ids } }).lean()

    // delete category from database
    await CategoryModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedCategories,
        message: `Category ${deletedCategories
          .map(cate => `"${cate.title}"`)
          .reverse()
          .join(', ')} ${deletedCategories.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
