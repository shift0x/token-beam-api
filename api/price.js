import { getPrice } from "../swap-providers/providers.js";
import { ensureRequestContains, executeAndStoreResult, makeResponse } from "../utils/response.js";

const ERROR_FROM_ASSET_UNDEFINED = "from asset undefined"
const ERROR_TO_ASSET_UNDEFINED = "to asset undefined"
const ERROR_AMOUNT_UNDEFINED = "amount undefined"

export async function GET(req){
    let response = makeResponse(req, "getPrice")

    response = ensureRequestContains(response, "from", ERROR_FROM_ASSET_UNDEFINED)
    response = ensureRequestContains(response, "to", ERROR_TO_ASSET_UNDEFINED)
    response = ensureRequestContains(response, "amount", ERROR_AMOUNT_UNDEFINED)

    response = await executeAndStoreResult(response, () => { return getPrice(response.request) })

    return Response.json(response);
}