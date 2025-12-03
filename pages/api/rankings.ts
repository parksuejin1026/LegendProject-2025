import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../src/lib/dbConnect';
import User from '../../src/models/User';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // 승리 수(stats.wins) 내림차순으로 상위 10명 조회
        const rankings = await User.find({})
            .select('username stats')
            .sort({ 'stats.wins': -1 })
            .limit(10);

        res.status(200).json(rankings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
