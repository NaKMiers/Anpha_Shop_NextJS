import OrderModel from '@/models/OrderModel'
import crypto from 'crypto'
import toast from 'react-hot-toast'
import slugify from 'slugify'
import unidecode from 'unidecode'

// generate slug
export const generateSlug = (value: string, id?: string): string => {
  const baseSlug: string = slugify(unidecode(value.trim()), {
    lower: true,
    remove: /[*+~.()'"!:@,]/g,
    strict: true,
  })

  const cleanSlug: string = baseSlug.replace(/[^a-zA-Z0-9]/g, '-')

  return encodeURIComponent(cleanSlug)
}

// generate random code
export const generateCode = (length: number): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase()
}

// generate order code
export const generateOrderCode = async (length: number) => {
  let isUnique: boolean = false
  let code: string = ''

  while (!isUnique) {
    code = generateCode(length)

    const isCodeExists = await OrderModel.findOne({ code }).lean()

    if (!isCodeExists) {
      isUnique = true
    }
  }

  return code
}

// make array becomes chaotic
export const shuffleArray = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// get times
export const getTimes = (d = 0, h = 0, m = 0, s = 0) => {
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
export const calcExpireTime = (d = 0, h = 0, m = 0, s = 0) => {
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
export const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
