const { genSaltSync, hashSync } = require('bcryptjs')
const uid = require('uid-safe')

function makeInsertUsers (db) {
  return (user) => {
    // TODO: Not use sync versions
    let password
    if (user.password) {
      const salt = genSaltSync(10)
      password = hashSync(user.password, salt)
    }
    const token = uid.sync(24)

    const params = [
      user.username,
      password,
      user.name,
      user.placeId,
      user.placeCategoryId,
      token
    ]

    const sql = `
      INSERT INTO users(
       username,
       password,
       name,
       placeid,
       placecategoryid,
       token
      )
      VALUES (
        $1, $2, $3, $4, $5, $6
      )
      RETURNING
        id`

    return db
      .query(sql, params)
      .then(res => ({ id: res.rows[0].id }))
  }
}

module.exports = makeInsertUsers
