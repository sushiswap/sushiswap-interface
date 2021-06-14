export default function pairHandler(req, res) {
  const {
    query: { id, name, chainId },
    method,
  } = req;

  switch (method) {
    case "GET":
      // Get data from your database
      res.status(200).json({ id, name: `Pair ${id}`, chainId });
      break;
    case "PUT":
      // Update or create data in your database
      res.status(200).json({ id, name: name || `Pair ${id}`, chainId });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
