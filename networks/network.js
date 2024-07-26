import arb from './tokens/arbitrum-one.json' assert { type: "json" };
import avax from './tokens/avalanche.json' assert { type: "json" };
import bsc from './tokens/binance-smart-chain.json' assert { type: "json" };
import eth from './tokens/ethereum.json' assert { type: "json" };
import defaults from './defaults.json' assert { type: "json" };
import { makeSuccess } from '../utils/response.js'

const networks = {};


function createToken(network, token){
    const chain = network.native.id.split(".")[0]
    const id = `${chain}.${token.symbol.toUpperCase()}-${token.address.toUpperCase()}`

    return {
        id: id,
        chain_id: network.chainId,
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        icon: token.image,
        address: token.address,
        external: {
            coingecko: {
                id: token.id,
                market_cap: token.market_cap,
                market_cap_rank: token.market_cap_rank
            }
        },
    }
}


function makeNetwork(base){
    const network = { ...base, ...defaults[base.id]}

    network.tokens = (network.tokens ?? []).map(token => {
        return createToken(network, token);
    })

    // resolve the network base token (gas token)
    //const nativeToken = getNetworkNativeToken(network.chainId);

    //network.tokens = [ nativeToken, ...network.tokens];
    //network.native = nativeToken;

    networks[network.chainId] = network;

    return network;
}

export function networkSupportsProvider(chainId, provider){
    const network = networks[chainId];

    return network != null && network.providers.indexOf(provider) != -1;
}

export function getNetworks(){
    const networks = [
        makeNetwork({id: "bitcoin"}),
        makeNetwork(eth),
        makeNetwork(arb),
        makeNetwork(avax),
        makeNetwork(bsc),
    ]

    return makeSuccess(networks);
}

/*
export function getNetworkNativeToken(chainId) {
    const swapkitNetworkToken = swapkitTokenLookup.gasTokens[chainId]

    const nativeToken = {
        id: swapkitNetworkToken.identifier,
        chainId: chainId,
        image: swapkitNetworkToken.logoURI,
        name: `${swapkitNetworkToken.ticker} (Native)`,
        symbol: swapkitNetworkToken.identifier.split(".")[1],
        meta: {
            swapkit: { id: swapkitNetworkToken.identifier },
            decimals: swapkitNetworkToken.decimals
        },
        isNative: true,
    }

    return  nativeToken
}
    */