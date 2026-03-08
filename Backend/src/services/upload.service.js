const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')

const client = new ImageKit({
  privateKey: process.env.IMAGE_PRIVATE_KEY
})

async function uploadFile(buffer, fileName, folder){

    const file = await client.files.upload({
        file: await toFile(buffer, fileName),
        fileName,
        folder
    })

    return file

}

module.exports = uploadFile