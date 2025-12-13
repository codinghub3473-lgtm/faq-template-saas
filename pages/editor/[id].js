import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
const DynamicStage = dynamic(() => import('../../components/EditorStage'), { ssr: false });

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch('/api/templates/' + id).then(r=>r.json()).then(data=>{
      if (!data.json) data.json = { shapes: [] };
      setTemplate(data);
    }).catch(()=> {
      if (id === 'sample') {
        setTemplate({
          id: 'sample',
          title: 'Sample FAQ Template',
          json: { shapes: [
            { id: 't1', type: 'text', x: 20, y: 20, text: 'Sample FAQ Title', fontSize: 30 },
            { id: 't2', type: 'text', x: 20, y: 80, text: 'Q: How does this work?\nA: Edit in editor.', fontSize: 18 }
          ] }
        });
      }
    });
  }, [id]);

  async function handleSave({ shapes, thumbnail }) {
    const body = { templateId: id || null, projectJson: { shapes }, thumbnail };
    const res = await fetch('/api/save-project', { method: 'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Save failed');
    return res.json();
  }

  if (!template) return <div className="container">Loading editor...</div>;

  return (
    <div className="container">
      <h2>Editor - {template.title}</h2>
      <DynamicStage template={template} onSave={handleSave} />
    </div>
  )
}
