const multer = require("multer")
const path = require("path")

/**
 * take data from public/ images
 * take extension name
 */
const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        // save name with date now + extension
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

/**
 * upload image with single image
 * limit file in storage 1 MB
 * check filter name with func checkFileType
 */
const singleUpload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
    // upload single image
}).single("imageUrl") //imageUrl must be same name="imageUrl" in bank/edit_modal.ejs

/**
 * upload image with multiple images
 */
const multipleUpload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).array("image") //image must be same name="image" in item/add_modal.ejs

/**
 * initiate filetypes and extension
 */
const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimetype)

    if (extName && mimeType) {
        return cb(null, true)
    } else {
        console.log("Error: must fill images !")
    }
}

module.exports = { singleUpload, multipleUpload }