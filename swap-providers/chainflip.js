import { Assets, Chains, SwapSDK } from "@chainflip/sdk/swap";
import { makeError, makeSuccess } from "../utils/response.js";

const ERROR_UNKNOWN_NETWORK = "unknown network"
const ERROR_UNKNOWN_TOKEN = "unknown token"
const ERROR_UNDEFINED_DESTINATION_ADDRESS = "destinationAddress is required"

const mappings = {
    networks: {
        mainnet: "mainnet",
        testnet: "perseverance"
    },
    chains: {
        "BTC": Chains.Bitcoin,
        "ETH": Chains.Ethereum,
        "ARB": Chains.Arbitrum,
        "DOT": Chains.Polkadot
    },
    tokens: {
        "BTC": Assets.BTC,
        "ETH": Assets.ETH,
        "FLIP": Assets.FLIP,
        "DOT": Assets.DOT,
        "USDC": Assets.USDC,
        "USDT": Assets.USDT
    }
}

function makeSDK(network){
    return new SwapSDK({ network: mappings.networks[network]});
}

function getAssetsFrom(waypoint){
    const requestedNetwork = waypoint.split(".")[0].toUpperCase();
    const requestedAsset = waypoint.split(".")[1].toUpperCase();

    const network = mappings.chains[requestedNetwork];
    const asset = mappings.tokens[requestedAsset];
    
    let error = null;

    if(!network){ error = `${ERROR_UNKNOWN_NETWORK}: ${requestedNetwork}` }
    if(!asset) { error = `${ERROR_UNKNOWN_TOKEN}: ${requestedAsset}` }

    return { network, asset, error };
}

function formatQuoteResponse(response){
    return makeSuccess({
        amountIn: response.amount,
        amountOut: response.quote.egressAmount,
        lowLiquidity: response.quote.lowLiquidityWarning,
        estimatedDurationSeconds: response.quote.estimatedDurationSeconds
    })
}

function formatDepositAddressResponse(response){
    const model = JSON.parse(JSON.stringify(response, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));

    return makeSuccess(model);
}

function makeQuoteRequest(request) {
    const fromAsset = getAssetsFrom(request.from);
    const toAsset = getAssetsFrom(request.to);

    if(fromAsset.error || toAsset.error) {
        return makeError(fromAsset.error ?? toAsset.error)
    }

    return {
        srcChain: fromAsset.network,
        destChain: toAsset.network,
        srcAsset: fromAsset.asset,
        destAsset: toAsset.asset,
        amount: request.amount
    };
}

async function getPrice(request){
    const quoteRequest = makeQuoteRequest(request);

    const swapSDK = makeSDK(request.network ?? "mainnet");
    
    return swapSDK.getQuote(quoteRequest)
        .then(res => { return formatQuoteResponse(res); })
        .catch(err => {
            return makeError(err.response.data.message);
        })
}

async function getDepositAddress(request){
    if(!request.destinationAddress){ return makeError(ERROR_UNDEFINED_DESTINATION_ADDRESS); }
    
    const depositAddressRequest = makeQuoteRequest(request);

    depositAddressRequest.destAddress = request.destinationAddress;

    const isCrosschainMessage = request.message && request.gasBudget;

    if(isCrosschainMessage){
        const ccmMetadata = {message: request.message, gasBudget: request.gasBudget};

        depositAddressRequest.ccmMetadata = ccmMetadata
    }

    const swapSDK = makeSDK(request.network ?? "mainnet");

    return swapSDK.requestDepositAddress(depositAddressRequest)
        .then(res => { return formatDepositAddressResponse(res); })
        .catch(err => { return makeError(err.meta); })
}


export const ChainFlipProvider = {
    getPrice,
    getDepositAddress
}