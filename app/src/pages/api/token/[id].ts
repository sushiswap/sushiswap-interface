export default function tokenHandler(req, res) {
    const {
        query: { id, name },
        method,
    } = req

    switch (method) {
        case 'GET':
            // Get data from your database
            res.status(200).json({ id, name: `Token ${id}`, chainId: 1 })
            break
        case 'PUT':
            // Update or create data in your database
            res.status(200).json({ id, name: name || `Token ${id}`, chainId: 1 })
            break
        default:
            res.setHeader('Allow', ['GET', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
