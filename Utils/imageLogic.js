const multer = require('multer');

// Function to generate multer setup with dynamic folder path
const uploadImages = (folderPath) => {
    // Configure storage with dynamic folder path
    const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folderPath);  // Use dynamic folder path
        },
        filename: function (req, file, cb) {
            const extension = file.mimetype.split('/')[1];
            const filename = `user-${Date.now()}.${extension}`;
            cb(null, filename);
        }
    });

    // File filter to accept only images
    const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        if (imageType === 'image') {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    };

    // Return multer instance
    return multer({
        storage: diskStorage,
        fileFilter,
    });
};

// Export the function
module.exports = uploadImages;
