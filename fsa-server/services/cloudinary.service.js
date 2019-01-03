const cloudinary = require('cloudinary').v2;
// const keySecretConfig = require('../configs/keySecret.config');

// cloudinary.config({
//     cloud_name: keySecretConfig.cloudinary.cloud_name,
//     api_key: keySecretConfig.cloudinary.api_key,
//     api_secret: keySecretConfig.cloudinary.api_secret
// })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class CloudinaryService {
    upload(path, public_id){
        return new Promise(resolve => {
            cloudinary.uploader.upload(path, {public_id: public_id},function(err, image){
                if(err) resolve({success: false});
                else{
                    resolve({
                        success: true,
                        public_id: image.public_id,
                        format: image.format,
                    })
                }
            })
        })
    }

    delete(public_id){
        return new Promise(resolve => {
            cloudinary.uploader.destroy(public_id, function(err, result){
                if(err) {
                    console.log(err);
                    resolve({ success: false});
                }
                resolve({success: true});
            })
        })
    }
}

module.exports = new CloudinaryService();