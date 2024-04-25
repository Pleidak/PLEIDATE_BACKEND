
// //aws
// const fs = require('fs')
// const S3 = require("aws-sdk/clients/s3")
// import { AWS } from '../configs/cloud.js'

// const bucketName = AWS.AWS_BUCKET_NAME
// const accessKeyId = AWS.AWS_ACCESS_KEY
// const secretAccessKey = AWS.AWS_SECRET_KEY
// const s3 = new S3({
//     accessKeyId,
//     secretAccessKey
// })

// //aws upload
// const AWSUpload = (file, filename, fileType) => {
//     const fileStream =  fs.createReadStream(file)

//     const uploadParams = {
//         Bucket: bucketName,
//         Body: fileStream,
//         Key: "lingyo-media/" + filename,
//         ContentType: fileType
//     }

//     return s3.upload(uploadParams).promise()
// }


// export { AWSUpload }