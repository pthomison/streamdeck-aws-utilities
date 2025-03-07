import { APIGatewayProxyResult } from 'aws-lambda';

type request = {
    Fail?: boolean;
    WaitTimeSeconds?: number
}

export const lambdaHandler = async (event: request): Promise<APIGatewayProxyResult> => {
    console.log("Request: ", event)

    let fail = event.Fail ?? false;
    let waitTimeSeconds = event.WaitTimeSeconds ?? 5;

    await new Promise(resolve => setTimeout(resolve, waitTimeSeconds * 1000));

    if (!fail) {
        return {
            statusCode: 205,
            body: JSON.stringify({
                message: 'hello world',
            }),
        };
    } else {
        process.exit(1);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
