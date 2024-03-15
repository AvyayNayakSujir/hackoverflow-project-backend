const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const CLOUD_NAME ="dh0sqelog";
const CLOUD_API_KEY ="392653166693636";
const CLOUD_API_SECRET ="VHCj31Ru3 - GeQUy8nu6OjqbGeXY";

cloudinary.config({
  cloud_name: "dh0sqelog",
  api_key: "392653166693636",
  api_secret: "VHCj31Ru3 - GeQUy8nu6OjqbGeXY",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'HiNeighbour_DEV',
        allowedFormats: ["png","jpg","jpeg"], // supports promises as well
      
    },
});

module.exports={
    cloudinary,
    storage

}