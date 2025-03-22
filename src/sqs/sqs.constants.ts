type QueueConstants = {
    region: string
    url: string
    accessKeyId: string
    secretAccessKey: string
}

const region = process.env.AWS_REGION
const url = process.env.SQS_QUEUE_URL
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

export const SQSConstants = {region, url, accessKeyId, secretAccessKey} as QueueConstants
