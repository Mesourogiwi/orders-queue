export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    tokenExpirationTime: process.env.JWT_EXPIRATION_TIME || '30 minutes'
}
