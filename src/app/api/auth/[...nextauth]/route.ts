import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'

import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'

// Connect to database
connectDatabase()

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    // GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // FACEBOOK
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // TIKTOK

    // CREDENTIALS
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        console.log('credentials', credentials)

        // check if credentials is empty
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null
        }

        // get data from credentials
        const { usernameOrEmail, password } = credentials

        // find user from database
        const user: any = await UserModel.findOne({
          $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        }).lean()

        // check user exists or not in database
        if (!user) {
          throw new Error('Tài khoản hoặc mật khẩu không đúng')
        }

        // check if user is not local
        if (user.authType !== 'local') {
          throw new Error('Tài khoản này được xác thực bởi ' + user.authType)
        }

        // check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          // push error to call back
          throw new Error('Tài khoản hoặc mật khẩu không đúng')
        }

        // // exclude password from user who have just logined
        const { password: _, avatar: image, ...otherDetails } = user

        // return to session callback
        return { ...otherDetails, image, name: user.firstname + ' ' + user.lastname }
      },
    }),

    // ...add providers here
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // console.log('session-xxxx', session)
      // console.log('token-xxxx', token)
      const user: any = await UserModel.findOne({
        email: session.user.email,
      }).lean()

      const { password: _, ...otherDetails } = user

      session.user = otherDetails
      token.role = user.role
      token._id = user._id

      return session
    },

    async signIn({ user, account, profile }: any): Promise<string | boolean> {
      if (account && account.provider === 'google') {
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
      }
      return true
    },
  },
})

export { handler as GET, handler as POST }
