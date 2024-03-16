import { connectDatabase } from '@/config/databse'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [PUT]: /api/admin/tag/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit Tags -')

  // get tag values to edit
  const { editingValues } = await req.json()
  console.log(editingValues)

  try {
    const editedTags = []

    // Loop through each editing value
    for (let editValue of editingValues) {
      // Update the tag with the corresponding id
      const updatedTag = await TagModel.findByIdAndUpdate(
        editValue._id,
        {
          $set: {
            title: editValue.title,
          },
        },
        { new: true }
      )
      editedTags.push(updatedTag)
    }

    return NextResponse.json({
      editedTags,
      message: `Edited Tags: ${editedTags.map(t => t.title).join(', ')}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
