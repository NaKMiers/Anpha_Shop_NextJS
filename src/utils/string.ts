import { IUser } from '@/models/UserModel'

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getUserName = (user?: IUser, exclude?: string) => {
  if (!user) return

  const firstName = user.firstName || (user as any).firstname
  const lastName = user.lastName || (user as any).lastname

  if (firstName && lastName) {
    return firstName + ' ' + lastName
  }

  if (firstName && !lastName) {
    return firstName
  }

  if (!firstName && lastName) {
    return lastName
  }

  if (user.username) {
    return user.username
  }
}
