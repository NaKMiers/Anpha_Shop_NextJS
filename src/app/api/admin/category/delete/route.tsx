import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [DELETE]: /admin/tag/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Categories - ')

  // get tag id to delete
  const { ids } = await req.json()
  console.log(ids)

  try {
    // get delete tags
    const deletedCategories = await CategoryModel.find({ _id: { $in: ids } }).lean()

    // delete tag from database
    await CategoryModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedCategories,
        message: `Tag ${deletedCategories
          .map(tag => `"${tag.title}"`)
          .reverse()
          .join(', ')} has been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
