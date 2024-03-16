import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [POST]: /admin/tag/add
export async function POST(req: NextRequest) {
  console.log('- Add Category -')

  // get data field to add new category
  const { title } = await req.json()

  console.log('title:', title)

  try {
    // create new tag
    const newCategory = new CategoryModel({
      title: title.trim(),
    })

    // save new tag to database
    await newCategory.save()

    // stay current page
    return NextResponse.json({ message: 'Category has been created' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
