import { SwapKitProvider } from "./swapkit.js";
import { ChainFlipProvider } from "./chainflip.js";
import { makeError } from "../utils/response.js";

const providers = {
    "chainflip": ChainFlipProvider,
    "swapkit": SwapKitProvider
}

export async function getPrice(request){
    const handler = providers[request.provider];

    if(!handler){ return makeError(`provider not found: ${request.provider}`) };

    try {
        return handler.getPrice(request);
    } catch(err) {
        return makeError(err.message);
    }
}
