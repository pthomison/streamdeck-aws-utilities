import { streamDeck, action, KeyDownEvent, SingletonAction, WillAppearEvent, WillDisappearEvent } from "@elgato/streamdeck";
import { LambdaClient, InvokeCommand, InvokeCommandOutput } from "@aws-sdk/client-lambda";


export type ExecuteLambdaOutput = {
    Succeeded: boolean
    _strResponsePayload: string
    ResponsePayload: any
}

export async function ExecuteLambda(client: LambdaClient, funcName: string, data: any): Promise<ExecuteLambdaOutput> {
    var out: ExecuteLambdaOutput = {
        Succeeded: false,
        _strResponsePayload: "",
        ResponsePayload: {},
    }

    let resp = await client.send(new InvokeCommand({
        FunctionName: funcName,
        Payload: Buffer.from(JSON.stringify(data)),
    }));

    if (resp.Payload != undefined) {
        out._strResponsePayload = Buffer.from(resp.Payload!).toString()
        try {
            out.ResponsePayload = JSON.parse(out._strResponsePayload)
        } catch (error) {
            console.log(error)
        }

    }

    if ((resp.FunctionError == undefined) && (out.ResponsePayload.errorType == undefined)) {
        out.Succeeded = true
    }

    return out
}
