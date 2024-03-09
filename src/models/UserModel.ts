import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: function (this: { authType: string }) {
        return this.authType === 'local'
      },
      unique: function (this: { authType: string }) {
        return this.authType === 'local'
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function (this: { authType: string }) {
        return this.authType === 'local'
      },
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(value)
        },
        message: 'Invalid password',
      },
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    accumulated: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'editor', 'collaborator'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: process.env.DEFAULT_AVATAR,
    },
    firstname: {
      type: String,
      default: '',
    },
    lastname: {
      type: String,
      default: '',
    },
    birthday: Date,
    phone: String,
    address: String,
    job: String,
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    authGoogleId: {
      type: String,
      default: null,
    },
    authFacebookId: {
      type: String,
      default: null,
    },
    commission: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: {
        type: String,
      },
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  console.log('UserSchema pre save')

  // check authType & username before saving
  if (this.authType !== 'local' || !this.isModified('password')) {
    return next()
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password || '', process.env.BCRYPT_SALT_ROUND || 10)
    this.password = hashedPassword
    next()
  } catch (err: any) {
    return next(err)
  }
})

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)
export default UserModel
