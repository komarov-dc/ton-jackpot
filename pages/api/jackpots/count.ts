// import { NextApiRequest, NextApiResponse } from 'next';
// import { TonClient, Address, TupleBuilder } from 'ton';

// const client = new TonClient({
//     endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
// });

// let count:string = '';

// const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
//     try {
//         if (count) {
//             res.status(200).json({ count });
//             return;
//         }
//         const response = await client.runMethod(
//             Address.parse('0QCvUQLWQ93l-niyA8u3mggPdeyGPTlyRcbzczCEanYGR6Wj'),
//             'get_next_jackpot_id'
//         );
        
//         count = response.stack.readBigNumber().toString();
//         res.status(200).json({ count });
//     } catch (error) {
//         console.error('Error fetching jackpot count:', error);
//         res.status(500).json({ error: 'Failed to fetch jackpot count' });
//     }
// };

// export default handler;