const multer = require('multer');

const uploadImages = (folderPath) => {
    const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folderPath);
        },
        filename: function (req, file, cb) {
            const extension = file.mimetype.split('/')[1];
            const filename = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
            cb(null, filename);
        }
    });

    const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        if (imageType === 'image') {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    };

    return multer({
        storage: diskStorage,
        fileFilter,
    });
};

module.exports = uploadImages;
