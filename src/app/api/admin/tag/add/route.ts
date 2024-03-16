import { connectDatabase } from '@/config/databse'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [POST]: /admin/tag/add
export async function POST(req: NextRequest) {
  console.log('- Add Tag -')

  // get data field to add new tag
  const { title, isFeatured } = await req.json()

  console.log('title:', title)

  try {
    // create new tag
    const newTag = new TagModel({
      title: title.trim(),
      isFeatured: !!isFeatured,
    })

    // save new tag to database
    await newTag.save()

    // stay current page
    return NextResponse.json({ message: 'Tag has been created' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
