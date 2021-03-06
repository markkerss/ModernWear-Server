const { signToken } = require('../helpers/jwt')
const { checkPass } = require('../helpers/passwordHelper')
const { User } = require('../models')
const {hashPassword} = require('../helpers/passwordHelper')

class UserController {
    static login (req, res, next) {
        let email = req.body.email
        let password = req.body.password
        User.findOne({where: {email}})
            .then(data => {
                if (!data) {
                    next({code: 400, message: 'Invalid email/password'})
                } else {
                    let checkPasss = checkPass(password, data.password)
                    if (checkPasss) {
                        let access_token = signToken(data.id, data.email, data.role)
                        res.status(200).json({access_token, email: data.email, id: +data.id, role: data.role})
                    } else {
                        next({code: 400, message: 'Invalid email/password'})
                    }
                }
            })
            .catch(err => {
                console.log(err)
                next(err)
            })
    }

    static register(req, res, next) {
        const user = {
            email: req.body.email,
            password: hashPassword(req.body.password)
        }
        User.create(user)
            .then(data => {
                let access_token = signToken(data.id, data.email, data.role)
                res.status(201).json({access_token, email: data.email, id: +data.id, role: data.role})
            })
            .catch(err => {
                console.log(err)
                next(err)
            })
      }
}

module.exports = UserController 