import passport from "passport"

passport.serializeUser(async (user: any, cb) => {
  console.log(user)
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    })
  })
})

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, null)
  })
})
