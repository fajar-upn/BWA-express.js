/**
 * this middleware use for organize login session
 */
const isLogin = (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
        req.flash('alertMessage', 'Session has been over, please login again !!!')
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/login')
    } else {
        next() //if the user have a session
    }
}

module.exports = isLogin