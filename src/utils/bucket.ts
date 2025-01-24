import { ListObjectsV2Command, S3 } from "@aws-sdk/client-s3";

const client = new S3({
    endpoint: import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_ENDPOINT!,
    region: import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_REGION!,
    credentials: {
        accessKeyId: import.meta.env.VITE_DIGITAL_OCEAN_ACCESS_TOKEN!,
        secretAccessKey: import.meta.env.VITE_DIGITAL_OCEAN_SECRET_ACCESS_TOKEN!,
    }
});




export const getAvailablePickerImages  = async (): Promise<string[]> => {
    const imageLocationPrefix = `${import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_IMAGES_PATH!}/`

    const listObjectsCommand = new ListObjectsV2Command({
        Bucket: import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_NAME!,
        Prefix: imageLocationPrefix
    });

    try {
        const response = await client.send(listObjectsCommand);

        const images = response.Contents?.reduce((acc, item) => {

            const imageNameWithoutPrefix = item.Key?.split(imageLocationPrefix)[1];
            if(imageNameWithoutPrefix && imageNameWithoutPrefix.split('.').length > 1) {
                acc.push(imageNameWithoutPrefix);
            }
            return acc;
        }, [] as string[]) ?? [];
        return images;

    } catch (error) {
        console.log(error);
        return [];
    }

}