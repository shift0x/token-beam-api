import { getNetworks } from "../networks/network.js";
import { executeAndStoreResult, makeResponse } from "../utils/response.js";


export async function GET(req){
    let response = makeResponse(req, "getNetworks")

    response = await executeAndStoreResult(response, () => { return getNetworks() })

    return Response.json(response);
}