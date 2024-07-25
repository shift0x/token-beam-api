import { ChainflipSDK } from "../providers/chainflip.js";

export async function GET(req){
    const url = new URL(req.url);
    const request = {
        from: url.searchParams.get("from"),
        to: url.searchParams.get("to"),
        amount: url.searchParams.get("amount"),
    }
    const quote = await ChainflipSDK.quote("mainnet", request);

    return Response.json(quote);
}