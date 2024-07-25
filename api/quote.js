import { SwapSDK } from "@chainflip/sdk/swap";

export async function GET(request) {
    const sdk = new SwapSDK();
    const assets = await sdk.getAssets()
    const network = "mainnet";
    const body = {
        assets,
        network
    }

    return new Response(JSON.stringify(body),  {
		status: 200,
		headers: {
			'content-type': 'application/json'
		}
	});
}