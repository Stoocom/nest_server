import { google } from "googleapis";
import { createReadStream } from 'fs';
import apiKeys from "../../src/utils/service_account.json";
import { rejects } from "assert";
import { resolve } from "path";
import { JWT } from "google-auth-library";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import { Schema } from "googleapis-common";

const scopes = ["https://www.googleapis.com/auth/drive"];

export const authorize = async () => {
    console.log('authorize');
    const client = new google.auth.JWT(
        "true-planet@live-1568921268337.iam.gserviceaccount.com",
        null,
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpj3q4jKMngxcX\np+ARoL9AZPJEdVFQpaKXJbzf+r1m7Fal5q9xnVAur1BRXYBL8vvSi8xsvoIYq/Gd\n6t68HnpML+LbfpOgShuKkswoe1mfw0Gz3ik16ddNCvm+nojSZuXf3lPmBAJ2oBXE\n+3b+KMlrSCnaxN7hIxEAaGr48yvaqU9sxsxKnAjvCuRAoSFgCq9luTQj515gJcNo\n4MgldDxvolOhCbIcneXGEw0c9rv6ERAq7PeVMc526ZlnyOEfIbLFqlVSm+hquCW+\nDPViyo4IQ3BLjKS8MlEB9wG04r1AgaOPF5GnRXqduveP7+Yx45ftYl+kCsAJRA7l\nAhZE0KtPAgMBAAECggEAEijuwNM3KiUtFPiC1AB+Wzw0gkZ6VgPXXQ7KosZtAJfx\nU8VYJvftPYLDPGOiOQAmHk+grkjdEB1iPEKKZmVxPbWnO1DcKL+nIXlFalSDrcuw\nvr3ddgu8ZmD1jIfYKYihuA9MtwbY6LGOg1FXVjMyF05cRTTulfg2eu+z/UO1/64T\nbbVHTmD233piTLJOD9ZzpLxgLCo8UyowwvAvBGSNDzooJ9ba0lqFvShixLTEq3wQ\nAmAcp4DfPfCNke/OKNBVn1VZYbEZ9LfgLl2vfEDBxyHD/n16CIE6Zy928Pk9XzH4\nAcBTRYW3/8h4xLZwq97fXSxCAt6F9m2j4T0/tqjBUQKBgQDubziXR6uFXRXr/XII\nSwDFhkRDIuSb7ftnus2WpoJmqinq/p0BJCRz9n43l6OCRb5Mq7bGT3igIb1t73qb\nmzHvWSc0lFfGUHMmhxhEobg3Mq/9idEJMRi43nSTigHMOEFGzJR57oJrnoDxUVWc\nqW6S69mKcgYbWnzMAP39ahis9wKBgQC2DVKATZa1qskHUpb682R1AiQx3mIwpqq+\nZ/oaGJURtCNXT2m2gb57x42K0miC9+FHqDPIwaMyiK3Y4OUeNkTNGec3+YQnudex\nVlO04LiK/nEWLi9HcEiATp/ukil4/FAAa/zDjIVwCCUts3Pne9qyNkA+9fcLkr7c\nhFgYRi+WaQKBgBuKeUzwGF3VPLz/j3Zpw3MNaUEf/KwONyXqK+kk3pchPKpKMrR5\nCkTiyf195IMdrzeH9hq9/z7v5sOWD+F9ca0l7SNjpyffDw36ONFkpLSrhCyTCLQ5\nGZPxDiIkpMSEEvYsl1HmPOZVbqtxK6Rm5cDOwVf+h7oNH7EoxC3LXYJNAoGAY30e\nU/2S2g7OM5E/7z6p7IPSEeqtEFdUwh+Cf1ZlyLoAAkvkwpde6LgiMvZPpRsf4xAZ\n1KF1tT0afIZSz9LqgIeiY2WZgjg+lqxNrHCOiW8JkAyHS+whwvS01CTOQ07nzYM2\nLAuUNKhO4Q3LznpSBsg9DetPKeT1Jv+wQPvCL9kCgYEAxfHCfzKLL5VmtLEOTasE\n3uCnuU2iGtTEE2cvHcA3tvx9tNDSJbM/pT4PrDOY1Yv07ZPm/LuF8apLd31sbdYj\nKjg1csBgTkVS8whsego06DzwELHZBlLsIE6BeYA/zjCX1SLPGyS1vgnlXY9doHef\npzYI5KMQjJqfmt7YecFHqDs=\n-----END PRIVATE KEY-----\n",
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