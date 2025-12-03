import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../src/lib/dbConnect';
import User from '../../../src/models/User';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, result, mode } = req.body; // result: 'win' | 'loss' | 'draw', mode: 'pve' | 'pvp'

    if (!userId || !result || !mode) {
        return res.status(400).json({ message: 'Missing userId, result, or mode' });
    }

    try {
        await dbConnect();

        const updateQuery: any = {};
        const statsField = mode === 'pvp' ? 'pvpStats' : 'pveStats';

        if (result === 'win') updateQuery[`${statsField}.wins`] = 1;
        else if (result === 'loss') updateQuery[`${statsField}.losses`] = 1;
        else if (result === 'draw') updateQuery[`${statsField}.draws`] = 1;

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: updateQuery },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Stats updated',
            stats: mode === 'pvp' ? user.pvpStats : user.pveStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
