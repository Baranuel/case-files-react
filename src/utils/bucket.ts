import { ListObjectsV2Command, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3({
    endpoint: "https://ams3.digitaloceanspaces.com",
    region: "ams3",
    credentials: {
        accessKeyId: import.meta.env.VITE_DIGITAL_OCEAN_ACCESS_TOKEN!,
        secretAccessKey: import.meta.env.VITE_DIGITAL_OCEAN_SECRET_ACCESS_TOKEN!,
    }
});




export const loadRemoteImages = async (): Promise<string[]> => {

    const imageLocationPrefix = "images/"

    const listObjectsCommand = new ListObjectsV2Command({
        Bucket: "casefiles",
        Prefix: imageLocationPrefix
    });

    try {
        const response = await client.send(listObjectsCommand);

        const images = response.Contents?.reduce((acc, item) => {
            if(item.Key && item.Key.split('.').length > 1) {
                acc.push(item.Key);
            }
            return acc;
        }, [] as string[]) ?? [];
        return images;

    } catch (error) {
        console.log(error);
        return [];
    }

}