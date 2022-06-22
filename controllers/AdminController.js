/**
 * import model Category from database
 * import model Bank from database
 * import model Item from database
 * import model image from database
 * import model Feature from database
 * import model Activity from database
 * import model User from database
 * import model Booking from database
 * import model Member from database
 */
const Category = require('../models/Category.js')
const Bank = require('../models/Bank.js')
const Item = require('../models/Item.js')
const Image = require('../models/Image.js')
const Feature = require('../models/Feature.js')
const Activity = require('../models/Activity.js')
const User = require('../models/User.js')
const Booking = require('../models/Booking.js')
const Member = require('../models/Member.js')

/**
 * import bcrypt for hash password (cryptography)
 */
const bcrypt = require('bcryptjs')


/**
 * this import associated with file system
 */
const fs = require('fs-extra') // fs for access file system
const path = require('path') //this is for organize path

/**
 * Admin Controller
 */
module.exports = {

    // this method for render sign in
    viewLogin: (req, res) => {
        try {

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            // console.log(req.query.logout)

            if (req.query.logout == '1') {
                req.flash('alertMessage', 'Logout success !');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/login')
            }

            //if the user login, can't go to '/admin/login' and otherwise
            if (req.session.user === null || req.session.user === undefined) {
                res.render('index', {
                    alert,
                    title: "Staycation | Login"
                })
            }
            else {
                req.flash('alertMessage', 'User in the session')
                req.flash('alertStatus', 'success');
                res.redirect('/admin/dashboard')
            }

        } catch (error) {
            res.redirect('/admin/login')
        }
    },

    // this method for process sign in
    actionLogin: async (req, res) => {
        try {
            const { username, password } = req.body;

            /**
             * check username available ?
             */
            const user = await User.findOne({ username: username });
            if (!user) {
                req.flash('alertMessage', 'Login failed: username not found!');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/login');
                return null // must return null, because call res.redirect twice 
            }

            /**
             * check password valid ?
             */
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                req.flash('alertMessage', 'Login failed: wrong username or password!');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/login');
                return null
            }

            /**
             * if password valid, we will request session
             * req.sesison.user iss call middleware/auth.js
             */
            req.session.user = {
                id: user.id,
                username: user.username
            }

            req.flash('alertMessage', 'Login success :)');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/dashboard');
        } catch (error) {
            req.flash('alertMessage', `Error:${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/login')
        }
    },

    //this method for destroy session
    actionLogout: (req, res) => {
        try {
            // req.flash('alertMessage', 'Logout success !');
            // req.flash('alertStatus', 'success');
            req.session.destroy()
            res.redirect('/admin/login?logout=1')
        } catch (error) {
            req.flash('alertMessage', `Error:${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/login')
        }

    },

    // this method for render view_dashboard.ejs
    viewDashboard: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const member = await Member.find()
            const booking = await Booking.find()
            const item = await Item.find()

            res.render('admin/dashboard/view_dashboard', {
                alert,
                title: "Staycation | Dashboard",
                user: req.session.user,
                member,
                booking,
                item
            })
        } catch (error) {
            req.flash('alertMessage', `Error:${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/dashboard')
        }

    },

    /**
     * this method for render view_category.ejs
     * this method for view category shema
     */
    viewCategory: async (req, res) => {
        try {

            // find from database
            const category = await Category.find()

            // initialize alert message
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            // parsing category and alert to view
            res.render('admin/category/view_category', {
                category,
                alert,
                title: 'Staycation | Category',
                user: req.session.user
            })
        } catch (errors) {
            req.flash('alertMessage', `Error:${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },
    // this method for add category schema 
    addCategory: async (req, res) => {
        try {
            const { name } = req.body
            await Category.create({ name })
            /**
             * 'alertMessage' send to viewCategory
             * 'alertStatus' send to viewCategory
             */
            req.flash('alertMessage', 'Success add category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `Failed to add category, error:${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }

    },
    // this method for update data from category schema
    updateCategory: async (req, res) => {
        try {
            const { id, name } = req.body
            const category = await Category.findOne({ _id: id })
            category.name = name
            await category.save()
            req.flash('alertMessage', 'Success update category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `Failed to update category, Error:${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }

    },
    // this method for delete data from category schema 
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Category.findOne({ _id: id })
            await category.remove()
            req.flash('alertMessage', 'Success delete category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `Failed to delete category. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    // this method for render view_bank.ejs
    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const booking = await Booking.find()
            // alert message
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/bank/view_bank', {
                title: "Staycation | Bank",
                alert,
                bank,
                booking,
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `Failed to view bank. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    // this method for add bank
    addBank: async (req, res) => {
        try {
            const { name, bankName, accountNumber } = req.body
            // images is folder name
            await Bank.create({
                name,
                bankName,
                accountNumber,
                imageUrl: `images/${req.file.filename}`
            })
            req.flash('alertMessage', 'Success add bank')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `Failed to add bank. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    // this method for update bank
    updateBank: async (req, res) => {
        try {
            const { id, bankName, accountNumber, name } = req.body
            const bank = await Bank.findOne({ _id: id })
            // check user input image ?
            if (req.file == undefined) {
                bank.name = name;
                bank.bankName = bankName;
                bank.accountNumber = accountNumber;
                await bank.save();

                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            } else {
                // if user input image
                await fs.unlink(path.join(`public/${bank.imageUrl}`)) //delete image from public folder
                bank.bankName = bankName
                bank.accountNumber = accountNumber
                bank.name = name
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save();

                req.flash('alertMessage', 'Success update bank')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/bank')
            }
        } catch (error) {
            req.flash('alertMessage', `Failed to update bank, error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    // this method for delete bank
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params
            const bank = await Bank.findOne({ _id: id })
            await fs.unlink(path.join(`public/${bank.imageUrl}`))
            await bank.remove()

            req.flash('alertMessage', 'Success delete bank')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `Failed to delete bank. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },

    /**
     *  this method for render view_item.ejs
     */
    viewItem: async (req, res) => {
        try {
            /**
             * .populate({path:'imageId', select:'id image'}) for select fields from relational schema
             * path is select field in Item.js schema
             * select is selected field in Image.js Schema
             */
            const item = await Item.find()
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' })

            const category = await Category.find()

            console.log(item)

            // alert message
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/item/view_item.ejs', {
                title: "Staycation | Item",
                item,
                category,
                alert,
                action: "view",
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `Failed to load item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },

    // add item to database
    addItem: async (req, res) => {
        try {
            const { _categoryId, title, price, city, about } = req.body
            // files because have a lot of file
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: _categoryId }) //_categoryId from req.body
                const newItem = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price,
                    city
                }
                const item = await Item.create(newItem) //insert data into item schema
                category.itemId.push({ _id: item._id }) //push 'item id' into category foregin key in category database
                await category.save() //dont forget to save category, because 'item id' has been pushed

                /**
                 * because image has more than one
                 * we use looping to save data
                 */
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` }) //_id is automatically create when insert data
                    item.imageId.push({ _id: imageSave._id }) //don't forget push image Id, because have relation with item schema
                    await item.save()
                }

                req.flash('alertMessage', `Success to add item`)
                req.flash('alertStatus', 'success')
                res.redirect("/admin/item")
            }
        } catch (error) {
            req.flash('alertMessage', `Failed to add item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    // this code for show image in the Item schema
    showImageItem: async (req, res) => {
        try {
            const { id } = req.params
            // this code for select field in Image Schema and Category Schema
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: "id imageUrl" })

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            res.render('admin/item/view_item.ejs', {
                title: "Staycation | Show Image Item",
                alert,
                item,
                action: 'show image',
                user: req.session.user
            })

        } catch (error) {
            req.flash('alertMessage', `Failed to view image item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    // this code for edit item schema
    editItem: async (req, res) => {
        try {
            const { id } = req.params

            // this code for select field in Image Schema and Category Schema
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: "id imageUrl" })
                .populate({ path: "categoryId", select: "id name" })

            const category = await Category.find()

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            res.render('admin/item/view_item.ejs', {
                title: "Staycation | Edit Item",
                alert,
                item,
                category,
                action: 'edit',
                user: req.session.user
            })

        } catch (error) {
            req.flash('alertMessage', `Failed to view image item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    // this method for update Item
    updateItem: async (req, res) => {
        const { id } = req.params
        const { _categoryId, title, price, city, about } = req.body
        try {
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: "id imageUrl" })
                .populate({ path: "categoryId", select: "id name" })
            // check images, wheter have been edited ?
            if (req.files.length > 0) {

                for (let i = 0; i < item.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id })
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`)) //for delete image in public/<IMAGE>
                    imageUpdate.imageUrl = `images/${req.files[i].filename}` //update image in Image schema

                    await imageUpdate.save()
                }
                item.title = title
                item.price = price
                item.city = city
                item.description = about
                item.categoryId = _categoryId

                await item.save()
                req.flash('alertMessage', `Success to update item`)
                req.flash('alertStatus', 'success')
                res.redirect('/admin/item')

            } else {
                item.title = title
                item.price = price
                item.city = city
                item.description = about
                item.categoryId = _categoryId

                await item.save()
                req.flash('alertMessage', `Success to update item`)
                req.flash('alertStatus', 'success')
                res.redirect('/admin/item')
            }

        } catch (error) {
            req.flash('alertMessage', `Failed to update item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    // this method for delete item
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id })
                .populate('imageId')
                .populate('featureId') //we can write .populate({path:"imageId"})

            /**
             * this code for delete image in the item schema
             * using 'loop' because in the one item schema have more than one images
             */
            for (let i = 0; i < item.imageId.length; i++) {
                // find appropiate _id with item.imageId[i]._id and delete images
                Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`))
                    image.remove()
                }).catch((error) => {
                    req.flash('alertMessage', `Failed to delete image in the item. error: ${error.message}`)
                    req.flash('alertStatus', 'danger')
                    res.redirect('/admin/item')
                })
            }

            await item.remove()

            req.flash('alertMessage', `Success delete item`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/item')
        } catch (error) {
            req.flash('alertMessage', `Failed to delete item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    // this method for detail item include feature and activity
    viewDetailItem: async (req, res) => {
        const { itemId } = req.params
        try {

            // alert message
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const feature = await Feature.find({ itemId: itemId })
            const activity = await Activity.find({ itemId: itemId })

            res.render('admin/item/detail_item/view_detail_item', {
                title: "Staycation | Detail Item",
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            })

        } catch (error) {
            req.flash('alertMessage', `Failed to view detail item. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    // this method for add feature in show_feature.ejs
    addFeature: async (req, res) => {
        const { name, qty, itemId } = req.body
        try {

            // check input has image ?
            if (!req.file) {
                req.flash('alertMessage', 'Failed add feature, please fill image!')
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }

            const feature = await Feature.create({
                name,
                qty,
                imageUrl: `/images/${req.file.filename}`,
                itemId
            })
            const item = await Item.findOne({ _id: itemId })

            item.featureId.push({ _id: feature._id })
            await item.save()

            req.flash('alertMessage', 'Success add feature')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)

        } catch (error) {
            req.flash('alertMessage', `Failed to add feature, error ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    // this method for update item
    updateFeature: async (req, res) => {
        const { id, name, qty, itemId } = req.body
        try {
            const feature = await Feature.findOne({ _id: id })
            // check user input image ?
            if (req.file == undefined) {
                feature.name = name;
                feature.qty = qty;
                await feature.save();

                req.flash('alertMessage', 'Success update feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            } else {
                // if user input image
                await fs.unlink(path.join(`public/${feature.imageUrl}`)) //delete image from public folder
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`
                await feature.save();

                req.flash('alertMessage', 'Success update feature')
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage', `Failed to update feature, error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    // this method for delete feature
    deleteFeature: async (req, res) => {
        const { id, itemId } = req.params
        try {
            const feature = await Feature.findOne({ _id: id })
            const item = await Item.findOne({ _id: itemId })
                .populate({ path: "featureId" })
            for (let i = 0; i < item.featureId.length; i++) {
                if (item.featureId[i]._id.toString() === feature._id.toString()) {
                    item.featureId.pull({ _id: feature._id })
                }
                await item.save()
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`))
            await feature.remove()

            req.flash('alertMessage', 'Success delete feature')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            req.flash('alertMessage', `Failed to delete feature. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    // this method for add activity
    addActivity: async (req, res) => {
        const { name, type, itemId } = req.body
        console.log(itemId)
        try {
            // check input has image ?
            if (!req.file) {
                req.flash('alertMessage', 'Failed add feature, please fill image!')
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }

            const activity = await Activity.create({
                name,
                type,
                imageUrl: `images/${req.file.filename}`,
                itemId
            })
            const item = await Item.findOne({ _id: itemId })
            item.activityId.push({ _id: activity._id })
            await item.save()

            req.flash('alertMessage', 'Success add activity')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            console.log(error)
            req.flash('alertMessage', `Failed to add activity. error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    // this method for update activity
    updateActivity: async (req, res) => {
        const { id, name, type, itemId } = req.body

        const activity = await Activity.findOne({ _id: id })
        try {
            if (req.file == undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save();

                req.flash('alertMessage', 'Success update activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            } else {
                // if user input image
                await fs.unlink(path.join(`public/${activity.imageUrl}`)) //delete image from public folder
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`
                await activity.save();

                req.flash('alertMessage', 'Success update activity')
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage', `Failed to update activity, error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    // this method for delete activity
    deleteActivity: async (req, res) => {
        const { id, itemId } = req.params

        try {
            const activity = await Activity.findOne({ _id: id })
            const item = await Item.findOne({ _id: itemId })
                .populate({ path: "activityId" })

            for (let i = 0; i < item.activityId.length; i++) {
                if (item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({ _id: activity._id })
                }
                await item.save()
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`))
            await activity.remove()

            req.flash('alertMessage', 'Success delete activity')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            req.flash('alertMessage', `Failed to delete activity, error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }

    },

    // this method for render view_booking.ejs
    viewBooking: async (req, res) => {
        try {

            const booking = await Booking.find()
                .populate("memberId")
                .populate("bankId")

            res.render('admin/booking/view_booking.ejs', {
                title: "Staycation | Booking",
                user: req.session.user,
                booking
            })

        } catch (error) {
            req.flash('alertMessage', `Error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/booking')
        }
    },
    // this method for render detail_booking.ejs
    viewDetailBooking: async (req, res) => {
        try {

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const { id } = req.params
            const booking = await Booking.findOne({ _id: id })
                .populate("memberId")
                .populate("bankId")

            res.render('admin/booking/show_detail_booking.ejs', {
                title: "Staycation | Booking",
                alert,
                booking,
                user: req.session.user
            })

        } catch (error) {
            req.flash('alertMessage', `Error: ${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/booking')
        }
    },

    // this method for action caofirmation
    actionConfirmation: async (req, res) => {

        const { id } = req.params

        try {
            const booking = await Booking.findOne({ _id: id })
            booking.payment.status = 'Accept'
            await booking.save()

            req.flash('alertMessage', 'Success accept payment status')
            req.flash('alertStatus', 'success')
            // res.redirect(`/admin/booking/${id}`)
            res.redirect(`/admin/booking/show-detail-booking/${id}`)

        } catch (error) {
            res.redirect(`/admin/booking/show-detail-booking/${id}`)
        }
    },
    // this method for reject confirmation booking
    actionReject: async (req, res) => {
        const { id } = req.params

        try {
            const booking = await Booking.findOne({ _id: id })
            booking.payment.status = 'Reject'
            await booking.save()

            req.flash('alertMessage', 'Success reject payment status')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/booking/show-detail-booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/show-detail-booking/${id}`)
        }
    }
}