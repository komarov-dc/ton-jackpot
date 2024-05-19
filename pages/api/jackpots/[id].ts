import { NextApiRequest, NextApiResponse } from 'next';
import { Address, TonClient, TupleBuilder } from 'ton';

const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    // endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (method, params, maxRetries, retryDelay) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await method(...params);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error(`Rate limit exceeded. Retry ${attempt}/${maxRetries} in ${retryDelay}ms`);
                if (attempt < maxRetries) {
                    await delay(retryDelay);
                } else {
                    throw new Error('Max retries reached. Rate limit exceeded.');
                }
            } else {
                throw error;
            }
        }
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    if (isNaN(Number(id))) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const args = new TupleBuilder();
    args.writeNumber(BigInt(id as string));

    const maxRetries = 10;
    const retryDelay = 1000;

    try {
        const addressResponse = await fetchWithRetry(
            client.runMethod.bind(client),
            [Address.parse('0QCvUQLWQ93l-niyA8u3mggPdeyGPTlyRcbzczCEanYGR6Wj'), 'get_jackpot_address', args.build()],
            maxRetries,
            retryDelay
        );

        const address = addressResponse.stack.readAddress();
        console.log(address);

        const result = await fetchWithRetry(
            client.runMethod.bind(client),
            [address, 'get_info'],
            maxRetries,
            retryDelay
        );

        const jackpot = {
            id: result.stack.readBigNumber().toString(),
            creator: result.stack.readAddressOpt()?.toString(),
            goalPrice: result.stack.readBigNumber().toString(),
            minBet: result.stack.readBigNumber().toString(),
            nft: result.stack.readAddressOpt()?.toString()
        };

        console.log(jackpot);
        res.status(200).json(jackpot);
    } catch (error) {
        if (error.message.includes('Rate limit exceeded')) {
            res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
        } else {
            console.error('Error fetching jackpot info:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
};

export default handler;
