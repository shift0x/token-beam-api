import { Assets, Chains, SwapSDK } from "@chainflip/sdk/swap";

const ERROR_UNKNOWN_NETWORK = "unknown_network"
const ERROR_UNKNOWN_TOKEN = "unknown_token"

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

function formatQuoteResponse(request, response){
    return {
        request: request,
        quote: {
            amountIn: response.amount,
            amountOut: response.quote.egressAmount,
            lowLiquidity: response.quote.lowLiquidityWarning,
            estimatedDurationSeconds: response.quote.estimatedDurationSeconds
        }
    }
}

async function quote(network, request){
    const fromAsset = getAssetsFrom(request.from);
    const toAsset = getAssetsFrom(request.to);

    if(fromAsset.error || toAsset.error) {
        return { 
            request: request,
            error: fromAsset.error ?? toAsset.error 
        }
    }

    const quoteRequest = {
        srcChain: fromAsset.network,
        destChain: toAsset.network,
        srcAsset: fromAsset.asset,
        destAsset: toAsset.asset,
        amount: request.amount
    };

    const swapSDK = makeSDK(network ?? "mainnet");
    
    return swapSDK.getQuote(quoteRequest)
        .then(res => { return formatQuoteResponse(request, res); })
        .catch(err => {
            return {
                request: request,
                error: err.response.data.message
            }
        })
}

export const ChainflipSDK = {
    quote
}