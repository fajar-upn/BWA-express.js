const Item = require('../models/Item.js')
const Activity = require('../models/Activity.js')
const Booking = require('../models/Booking.js')
const Category = require('../models/Category.js')
const Bank = require('../models/Bank.js')
const Member = require('../models/Member.js')

/**
 * this controller for organize API
 */

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
                .select('_id title country city price unit imageId')
                .limit(5)
                .populate({ path: 'imageId', select: 'id imageUrl' })

            const traveller = await Booking.find()
            const treasure = await Activity.find()
            const city = await Item.find()

            /**
             * this code have cases populate in the populate
             * in this cases we want take imageUrl from schema category -> item -> image
             */
            const category = await Category.find()
                .select("_id name")
                .limit(3)
                .populate({
                    path: 'itemId',
                    select: "_id title country city isPopular imageId",
                    perDocumentLimit: 4,
                    option: { sort: { sumBooking: -1 } }, //create sort, -1 = DESC
                    populate: {
                        path: "imageId",
                        select: "_id imageUrl",
                        perDocumentLimit: 1
                    },
                })

            /**
             * this code to determine isPopular variable
             */
            for (let i = 0; i < category.length; i++) { //2
                for (let j = 0; j < category[i].itemId.length; j++) { //6
                    const item = await Item.findOne({ _id: category[i].itemId[j]._id })
                    item.isPopular = false
                    await item.save()
                    // condition to determine isPopular = true
                    if (category[i].itemId[0] == category[i].itemId[j]) {
                        item.isPopular = true
                        await item.save()
                    }
                }
            }

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "/images/testimonial-landingpages.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            res.status(200).json({
                hero: {
                    travelers: traveller.length,
                    treasures: treasure.length,
                    cities: city.length
                },
                mostPicked,
                category,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "internal server error" })
        }
    },

    // this method for detail page
    detailPage: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id })
                .populate({ path: "imageId", select: "_id imageUrl" })
                .populate({ path: "featureId", select: "_id name qty imageUrl" })
                .populate({ path: "activityId", select: "_id name type imageUrl" })

            const bank = await Bank.find()

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "/images/testimonial-detailspage.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            // ... for get item inside 'item : {}' recently
            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            })

        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },

    bookingPage: async (req, res) => {
        try {
            const {
                idItem,
                duration,
                // price,
                bookingStartDate,
                bookingEndDate,
                firstName,
                lastName,
                email,
                phoneNumber,
                accountHolder,
                bankFrom
            } = req.body

            if (!req.file) {
                return res.status(404).json({ message: "Image not found" })
            }

            if (idItem === undefined ||
                duration === undefined ||
                // price === undefined ||
                bookingStartDate === undefined ||
                bookingEndDate === undefined ||
                firstName === undefined ||
                lastName === undefined ||
                email === undefined ||
                phoneNumber === undefined ||
                accountHolder === undefined ||
                bankFrom === undefined) {
                return res.status(404).json({ message: "Please full fill the form!" })
            }

            const item = await Item.findOne({ _id: idItem })

            if (!item) {
                return res.status(404).json({ message: "Item not found" })
            }

            // add sumBooking in the item schema
            item.sumBooking += 1
            await item.save()

            let total = item.price * duration
            let tax = total * 0.1

            // for generate invoice random
            const invoice = Math.floor(1000000 + Math.random() * 9000000)

            // insert member name
            const member = await Member.create({
                firstName,
                lastName,
                email,
                phoneNumber
            })

            // get data bank  for booking
            const newBooking = {
                invoice,
                bookingStartDate,
                bookingEndDate,
                total: total + tax,
                itemId: {
                    _id: item.id,
                    title: item.title,
                    price: item.price,
                    duration: duration
                },
                memberId: member.id,
                payment: {
                    proofPayment: `images/${req.file.filename}`,
                    bankFrom: bankFrom,
                    accountHolder: accountHolder
                }
            }

            const booking = await Booking.create(newBooking)

            return res.status(201).json({ message: "Success Booking", booking })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}