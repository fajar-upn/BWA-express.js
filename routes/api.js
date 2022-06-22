const router = require('express').Router() //router express library
const apiController = require('../controllers/ApiController') // controller
const { singleUpload } = require('../middlewares/multer') // multer library

/**
 * this router organize api in user page
 */

/**
 * endpoint landing page
 * endpoint detail page
 * endpoint post booking page
 */
router.get('/landing-page', apiController.landingPage)
router.get('/detail-page/:id', apiController.detailPage)
router.post('/booking-page', singleUpload, apiController.bookingPage)

module.exports = router