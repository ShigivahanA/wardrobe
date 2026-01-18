import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { verifyAccessToken } from '../utils/jwt.js'

const auth = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('Authentication required', 401))
  }

  try {
    const decoded = verifyAccessToken(token)

    // 🔒 CRITICAL: verify session still exists
    const user = await User.findOne({
      _id: decoded.userId,
      'sessions.refreshTokenId': decoded.sid
    }).select('_id')

    if (!user) {
      return next(new AppError('Session expired', 401))
    }

    req.user = {
      id: decoded.userId,
      sessionId: decoded.sid
    }

    next()
  } catch {
    return next(new AppError('Invalid or expired token', 401))
  }
}

export default auth
