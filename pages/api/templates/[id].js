import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const template = await prisma.template.findUnique({ where: { id }});
    if (!template) return res.status(404).json({ error: 'Not found' });
    res.json(template);
  } else {
    res.status(405).end();
  }
}
