import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import { generateSlug } from '@/utils/number'
import { NextRequest, NextResponse } from 'next/server'

// [PUT]: /admin/categories/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit Categories -')

  // connect to database
  await connectDatabase()

  // get category values to edit
  const { editingValues } = await req.json()
  console.log(editingValues)

  try {
    const editedCategories = []

    // Loop through each editing value
    for (let editValue of editingValues) {
      // Update the category with the corresponding id
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        editValue._id,
        {
          $set: {
            title: editValue.title,
            slug: generateSlug(editValue.title),
          },
        },
        { new: true }
      )
      editedCategories.push(updatedCategory)
    }

    return NextResponse.json({
      editedCategories,
      message: `Edited Categories: ${editedCategories.map(cate => cate.title).join(', ')}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
