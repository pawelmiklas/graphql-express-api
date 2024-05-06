import { db } from '@lib/prismaClient'
import { ErrorCode, throwGraphQLError } from '@utils/graphqlError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = '1h'
const BCRYPT_SALT_ROUNDS = 10

const generateToken = (userId: string, jwtSecret: string) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: JWT_EXPIRY })
}

export const register = async ({ email, password }: { email: string; password: string }) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  const isEmailInUse = await db.user.findFirst({
    where: { email },
  })

  if (isEmailInUse) {
    return throwGraphQLError('Email is already in use', ErrorCode.BAD_USER_INPUT)
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
    },
  })

  const token = generateToken(user.id, JWT_SECRET)

  return { token, user }
}

export const login = async ({ email, password }: { email: string; password: string }) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  const user = await db.user.findFirst({
    where: { email },
  })

  if (!user) {
    return throwGraphQLError('Invalid credentials', ErrorCode.BAD_USER_INPUT)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return throwGraphQLError('Invalid credentials', ErrorCode.BAD_USER_INPUT)
  }

  const token = generateToken(user.id, JWT_SECRET)

  return { token, user }
}

export const getUserById = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
    },
  })

  return user
}

export const getUserFromToken = (token: string) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
