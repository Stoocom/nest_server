import { google } from "googleapis";
import { createReadStream } from 'fs';
import { rejects } from "assert";
import { resolve } from "path";
import { JWT } from "google-auth-library";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import { Schema } from "googleapis-common";

const scopes = ["https://www.googleapis.com/auth/drive"];

export const authorize = async () => {
    console.log('authorize', process.env.CLIENT_EMAIL);
    const client = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
        process.env.PRIVATE_KEY,
        scopes
    );

    await client.authorize();
    return client;
}
   
export const saveFileToGoogleDrive = async (file: Express.Multer.File, authClient: JWT) => {
    console.log('saveFileToGoogleDrive');

    const drive = google.drive({ version: 'v3', auth: authClient});

    let fileMetaData = {
        name: file.originalname,
        parents: ["1hIayFYHQg6ZnousgK34l-wu1W6z5U-9B"]
    }

    const result = await drive.files.create({
        media: {
            mimeType: file.mimetype,
            body: createReadStream(file.path)
        },
        requestBody: fileMetaData,
        fields: "id,name"
    })

    return result
} 

// authorize().then(uploadFile).catch((err) => {
//     console.log('err', err);
// });