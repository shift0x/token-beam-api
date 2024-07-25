import { SwapSDK } from "@chainflip/sdk/swap";

export async function GET(request) {
    const sdk = new SwapSDK();
    const assets = await sdk.getAssets()

    return new Response(JSON.stringify(assets),  {
		status: 200,
		headers: {
			'content-type': 'application/json'
		}
	});
}