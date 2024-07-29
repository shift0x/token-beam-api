import { SwapKitProvider } from "./swapkit.js";
import { ChainFlipProvider } from "./chainflip.js";
import { makeError } from "../utils/response.js";

const ERROR_UNDEFINED_PROVIDER = "provider is required"
const ERROR_UNDEFINED_METHOD = "method is required"

function ERROR_METHOD_NOT_FOUND(provider, method){ return `method '${method}' not found on ${provider} provider`}
function ERROR_PROVIDER_NOT_FOUND(provider){ return `provider not found: ${provider}`};

const providers = {
    "chainflip": ChainFlipProvider,
    "swapkit": SwapKitProvider
}

export async function execute(request){
    const provider = request.method.split(".")[0];
    const method = request.method.split(".")[1];

    if(!provider){ return makeError(ERROR_UNDEFINED_PROVIDER)}
    if(!method){ return makeError(ERROR_UNDEFINED_METHOD)}

    const handler = providers[request.provider];

    if(!handler){ return makeError(ERROR_PROVIDER_NOT_FOUND(provider)) };
    if(!handler[method]){ return makeError(ERROR_METHOD_NOT_FOUND(provider, method))}

    try {
        return handler[method](request);
    } catch(err) {
        return makeError(err.message);
    }
}
