import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' }});
  res.json(templates);
}
