import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    id: number
}

const tokens = [{ id: 1 }, { id: 2 }, { id: 3 }]

export default (req: NextApiRequest, res: NextApiResponse<Data[]>) => {
    res.status(200).json(tokens)
}
