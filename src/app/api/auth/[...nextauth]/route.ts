import { user } from './../../../../libs/reducers/userReducer'
import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'

import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'

// Connect to database
connectDatabase()

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    // ...add providers here
  ],
  callbacks: {
    async session({ session }: { session: any }) {
      const user: any = await UserModel.findOne({
        email: session.user.email,
      }).lean()

      const { password: hiddenPassword, ...otherDetails } = user

      session.user = otherDetails
      return session
    },

    async signIn({ user, account, profile }: any): Promise<string | boolean> {
      if (account && account.provider === 'google') {
        // console.log('user', user)
        // console.log('account', account)
        // console.log('profile', profile)
        // return profile.email_verified && profile.email.endsWith('@example.com')

        if (!user || !profile) {
          return false
        }
        // get data for authentication
        const id = user.id
        const email = user.email
        const avatar = user.image
        const firstname = profile.given_name
        const lastname = profile.family_name

        // get user from database to check exist
        const existingUser: any = await UserModel.findOne({ email }).lean()

        // check whether user exists
        if (existingUser) {
          // update user in case user change the google account info
          await UserModel.findByIdAndUpdate(existingUser._id, { $set: { avatar } })

          // exclude password from user who have just logined
          const { password: hiddenPassword, ...otherDetails } = existingUser

          return true
        }
        // create new user with google infomation
        const newUser = new UserModel({
          email: email,
          avatar,
          firstname,
          lastname,
          authType: 'google',
          authGoogleId: id,
        })

        await newUser.save()

        // exclude password from userRegistered
        const { password: hiddenPassword, ...otherDetails } = newUser._doc
      }
      return true
    },
  },
})

export { handler as GET, handler as POST }
