import { connectDatabase } from '@/config/databse'
import { NextApiRequest, NextApiResponse } from 'next'

// Connect to database
connectDatabase()

export const config = {
  api: {
    bodyParser: false,
  },
}

// [POST]: /admin/product/add
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log('- Add Product -')
}
