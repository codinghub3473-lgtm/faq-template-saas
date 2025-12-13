import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const { templateId, projectJson, thumbnail } = req.body;
  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      templateId,
      json: projectJson,
      thumbnail
    }
  });
  res.json(project);
}
