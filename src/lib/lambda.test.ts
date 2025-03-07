import { ExecuteLambda } from './lambda';
import { LambdaClient, InvokeCommand, InvokeCommandOutput } from "@aws-sdk/client-lambda";

import { describe, expect, test } from '@jest/globals';

let client = new LambdaClient({ region: "us-east-2" });

type request = {
    Fail?: boolean;
    WaitTimeSeconds?: number
}


test('invoke lambda and expect success', async () => {
    let resp = await ExecuteLambda(client, "sam-app-HelloWorldFunction-oV0EBi0s0mxN", {
        Fail: false,
        WaitTimeSeconds: 5,
    })

    console.log(resp)
    console.log(resp.ResponsePayload)

    expect(resp.Succeeded).toBe(true);
}, 60000);

test('invoke lambda and expect failure', async () => {
    let resp = await ExecuteLambda(client, "sam-app-HelloWorldFunction-oV0EBi0s0mxN", {
        Fail: true,
        WaitTimeSeconds: 5,
    })

    console.log(resp)
    console.log(resp.ResponsePayload)

    expect(resp.Succeeded).toBe(false);
}, 60000);