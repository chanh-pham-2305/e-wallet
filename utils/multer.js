const multer = require('multer')

const storage = multer.diskStorage({
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage})
                .fields([{name:'front_photo', maxCount:1},{name: 'back_photo', maxCount:1}])

module.exports = upload