import {makeError, makeSuccess} from '../utils/response.js';
import axios from 'axios';

const ERROR_SENDER_NOT_FOUND = "sender not found"
const ERROR_RECEIVER_NOT_FOUND = "receiver not found"
const BASE_URI = "https://api.thorswap.finance"

async function getPrice(request){
    if(!request.sender) { return makeError(ERROR_SENDER_NOT_FOUND); }
    if(!request.receiver) { return makeError(ERROR_RECEIVER_NOT_FOUND); }

    const url = `${BASE_URI}/aggregator/tokens/quote`

    return axios.get(url, {
        params: {
            sellAsset: request.from,
            buyAsset: request.to,
            sellAmount: request.amount,
            senderAddress: request.sender,
            recipientAddress: request.receiver,
        }
    })
    .then(result => { return makeSuccess(result.data )})
    .catch(err => { return makeError(err)})
}

export const SwapKitProvider = {
    getPrice
}