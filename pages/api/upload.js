import formidable from 'formidable';
import { uploadBufferToS3 } from '../../lib/s3';
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' });
    const file = files.file;
    const data = await fs.promises.readFile(file.filepath);
    const key = `uploads/${Date.now()}_${file.originalFilename}`;
    const url = await uploadBufferToS3(data, key, file.mimetype);
    res.json({ url });
  });
}
