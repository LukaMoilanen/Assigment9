import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const logonUsers = new Map()

const url = process.env.MONGO_URL
const dbName = process.env.MONGO_DB

const client = new MongoClient(url)

let db

async function connect() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}

const findUser = async (username) => {
  const db = await connect()
  return db.collection('users').findOne({ username })
}

const getAllData = async () => {
  const db = await connect()
  return db.collection('data').find().toArray()
}

const getDataById = async (id) => {
  const db = await connect()
  return db.collection('data').findOne({ id: Number(id) })
}

const addData = async ({ id, Firstname, Surname, userid }) => {
  const db = await connect()
  return db.collection('data').insertOne({
    id,
    Firstname,
    Surname,
    userid
  })
}

const updateData = async (id, { Firstname, Surname, userid }) => {
  const db = await connect()
  return db.collection('data').updateOne(
    { id: Number(id) },
    { $set: { Firstname, Surname, userid } }
  )
}

const deleteDataById = async (id) => {
  const db = await connect()
  return db.collection('data').deleteOne({ id: Number(id) })
}

const getUsersRecords = async () => {
  const db = await connect()

  return db.collection('data').aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userid',
        foreignField: 'id',
        as: 'user'
      }
    }
  ]).toArray()
}

export {
  addData,
  updateData,
  deleteDataById,
  findUser,
  getAllData,
  getDataById,
  logonUsers,
  getUsersRecords
}