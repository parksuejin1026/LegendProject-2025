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

        // pveStats와 pvpStats를 모두 포함하여 조회
        const rankings = await User.find({})
            .select('username pveStats pvpStats')
            .sort({ 'pveStats.wins': -1 }) // 기본 정렬은 PvE 승리 순 (클라이언트에서 재정렬 가능)
            .limit(20);

        res.status(200).json(rankings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
