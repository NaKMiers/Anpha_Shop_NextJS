import crypto from 'crypto'
import { Types } from 'mongoose'
import slugify from 'slugify'
import unidecode from 'unidecode'

// generate slug
const generateSlug = (value: string, id: Types.ObjectId): string => {
  const baseSlug = slugify(unidecode(value.trim()), {
    lower: true,
    remove: /[*+~.()'"!:@,]/g,
    strict: true,
  })

  const cleanSlug = baseSlug.replace(/[^a-zA-Z0-9]/g, '-')

  return encodeURIComponent(cleanSlug)
}

// generate random code
function generateCode(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase()
}

// generate order code
// async function generateOrderCode(length:number):string {
//   let isUnique = false
//   let code:string

//   while (!isUnique) {
//     code = generateCode(length)

//     const isCodeExists = await OrderModel.findOne({ code }).lean()

//     if (!isCodeExists) {
//       isUnique = true
//     }
//   }

//   return code
// }

// make array becomes chaotic
function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// get times
function getTimes(d = 0, h = 0, m = 0, s = 0) {
  // convert all to seconds
  const totalSeconds = h * 3600 + m * 60 + s

  // calc days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / (24 * 3600))
  const remainingSeconds = totalSeconds % (24 * 3600)
  const hours = Math.floor(remainingSeconds / 3600)
  const remainingSecondsAfterHours = remainingSeconds % 3600
  const minutes = Math.floor(remainingSecondsAfterHours / 60)
  const seconds = remainingSecondsAfterHours % 60

  return {
    days: days + d,
    hours,
    minutes,
    seconds,
  }
}

// from numbers of (day, hour, minute, second) => expire time
function calcExpireTime(d = 0, h = 0, m = 0, s = 0) {
  // calc days, hours, minutes, seconds
  const { days, hours, minutes, seconds } = getTimes(d, h, m, s)

  // get current time
  const currentTime = new Date()

  // add time to current time
  const expireTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate() + days,
    currentTime.getHours() + hours,
    currentTime.getMinutes() + minutes,
    currentTime.getSeconds() + seconds
  )

  return expireTime
}

// create a unique random image name
const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// apply voucher to product
function productPriceAfterAppliedFlashsale(product: any) {
  let price = product.price

  const { flashsale } = product

  if (flashsale) {
    const now = new Date()
    if (now > new Date(flashsale.begin)) {
      switch (flashsale.type) {
        case 'fixed-reduce':
          price = price + +flashsale.value >= 0 ? price + +flashsale.value : 0
          break
        case 'fixed':
          price = flashsale.value
          break
        case 'percentage':
          price = price + Math.floor((price * parseFloat(flashsale.value)) / 100)
          break
      }
    }
  }

  return price
}

// group product by category
const groupProductByCategory = (categories: any, products: any, sortBy: any, sortDirection = 'asc') => {
  // initialize an object of category groups
  const categoryMap = categories.reduce((result: any, category: any) => {
    result[category._id] = category.title
    return result
  }, {})

  // Group products by category title and sort products in each category by ...
  const groupedProducts = products.reduce((result: any, product: any) => {
    const categoryId = product.category
    const categoryTitle = categoryMap[categoryId]

    // Check if the category title is already a key in the result object
    if (!result[categoryTitle]) {
      result[categoryTitle] = []
    }

    // Add the current product to the category
    result[categoryTitle].push(product)

    // Sort products in the category by ...
    result[categoryTitle].sort((a: any, b: any) =>
      sortDirection === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    )

    return result
  }, {})

  return groupedProducts
}

export {
  generateCode,
  generateSlug,
  shuffleArray,
  calcExpireTime,
  getTimes,
  randomFileName,
  productPriceAfterAppliedFlashsale,
  groupProductByCategory,
}
