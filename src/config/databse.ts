import mongoose from 'mongoose'

export async function connectDatabase() {
  try {
    mongoose.connect(process.env.MONGODB!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('MongoDB connected successfully')
    })

    connection.on('error', error => {
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error)
    })
  } catch (error) {
    console.log('Something goes wrong!')
    console.log(error)
  }
}
