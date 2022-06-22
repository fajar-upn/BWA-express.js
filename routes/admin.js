const router = require('express').Router() //router express library
const adminController = require('../controllers/AdminController.js') // controller
const { singleUpload, multipleUpload } = require('../middlewares/multer') // multer library
const auth = require('../middlewares/auth') //auth middleware

/**
 * endpoint admin login
 * endpoint admin action login
 * endpoint admin action logout 
 */
router.get('/login', adminController.viewLogin)
router.post('/login', adminController.actionLogin)
router.use(auth) // if the user wants to '/dashboard', the user needs through this middleware
router.get('/logout', adminController.actionLogout)

/**
 * endpoint admin dashboard
 */
router.get('/dashboard', adminController.viewDashboard)

/**
 * endpoint admin category
 * endpoint admin add category
 * endpoint admin update category
 * endpoint admin delete category
 */
router.get('/category', adminController.viewCategory)
router.post('/category', adminController.addCategory)
router.put('/category', adminController.updateCategory)
router.delete('/category/:id', adminController.deleteCategory)

/**
 * endpoint admin bank 
 * endpoint admin add bank
 * endpoitn admin update bank
 */
router.get('/bank', adminController.viewBank)
router.post('/bank', singleUpload, adminController.addBank) // upload for check input file
router.put('/bank', singleUpload, adminController.updateBank)
router.delete('/bank/:id', adminController.deleteBank)

/**
 * endpoint admin item
 * endpoint admin add item
 * endpoint admin show image item
 * endpoint admin edit item
 * endpoint admin update item
 * endpoint admin delete item
 * 
 * endpoint admin view detail item
 * 
 * endpoint admin add feature in detail item
 * endpoint admin update feature in detail item
 * endpoint admin delete feature in detail item
 * 
 * endpoint admin add activity in detail item
 * endpoint admin update activity in detail item
 * endpoint admin delete activity in detail item
 */
router.get('/item', adminController.viewItem)
router.post('/item', multipleUpload, adminController.addItem)
router.get('/item/show-image/:id', adminController.showImageItem)
router.get('/item/:id', adminController.editItem)
router.put('/item/:id', multipleUpload, adminController.updateItem)
router.delete('/item/:id', adminController.deleteItem)

router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem)

router.post('/item/add/feature', singleUpload, adminController.addFeature)
router.put('/item/update/feature', singleUpload, adminController.updateFeature);
router.delete('/item/:itemId/feature/:id', multipleUpload, adminController.deleteFeature)

router.post('/item/add/activity', singleUpload, adminController.addActivity)
router.put('/item/update/activity', singleUpload, adminController.updateActivity)
router.delete('/item/:itemId/activity/:id', multipleUpload, adminController.deleteActivity)

/**
 * endpoint admin booking
 * 
 * endpoint admin detail booking
 * endpoint admin action confirmation success booking
 */
router.get('/booking', adminController.viewBooking)
router.get('/booking/show-detail-booking/:id', adminController.viewDetailBooking)
router.put('/booking/confirmation/:id', adminController.actionConfirmation)
router.put('/booking/reject/:id', adminController.actionReject)

module.exports = router