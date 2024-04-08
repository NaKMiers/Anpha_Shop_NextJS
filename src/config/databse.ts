import mongoose from 'mongoose'

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('MongoDB connected successfully')
    })

    connection.on('error', error => {
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error)
    })

    // cachedConnection = connection
    return connection
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to database')
  }
}
