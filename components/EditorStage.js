import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Image, Rect } from 'react-konva';
import useImage from 'use-image';
import jsPDF from 'jspdf';

function KonvaImage({ shape, isSelected, onSelect, onChange }) {
  const [img] = useImage(shape.url);
  return (
    <Image
      image={img}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={e => {
        onChange({ ...shape, x: e.target.x(), y: e.target.y() });
      }}
    />
  );
}

export default function EditorStage({ template, onSave }) {
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  const [shapes, setShapes] = useState(template.json.shapes || []);
  const [history, setHistory] = useState([template.json.shapes || []]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    // ensure initial history matches
    setHistory([template.json.shapes || []]);
    setHistoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  useEffect(() => {
    // whenever shapes change push to history
    if (history[historyIndex] !== shapes) {
      const newHist = history.slice(0, historyIndex + 1);
      newHist.push(shapes);
      setHistory(newHist);
      setHistoryIndex(newHist.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes]);

  function pushHistory(newShapes) {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newShapes);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setShapes(newShapes);
  }

  function addText() {
    const id = 't' + Date.now();
    const newShape = { id, type: 'text', x: 30, y: 30, text: 'New text', fontSize: 20, fill: '#111' };
    pushHistory([...shapes, newShape]);
  }

  async function addImageFile(file) {
    if (!file) return;
    try {
      setLoadingUpload(true);
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      const url = data.url;
      const id = 'i' + Date.now();
      const newShape = { id, type: 'image', x: 50, y: 50, url, width: 300, height: 180 };
      pushHistory([...shapes, newShape]);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setLoadingUpload(false);
    }
  }

  function updateShape(id, patch) {
    const newShapes = shapes.map(s => s.id === id ? { ...s, ...patch } : s);
    pushHistory(newShapes);
  }

  function deleteSelected() {
    if (!selectedId) return;
    const newShapes = shapes.filter(s => s.id !== selectedId);
    pushHistory(newShapes);
    setSelectedId(null);
  }

  function undo() {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setShapes(history[newIndex]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setShapes(history[newIndex]);
  }

  async function exportPNG() {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = (template.title || 'export') + '.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function exportPDF() {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [stageRef.current.width(), stageRef.current.height()]
    });
    pdf.addImage(dataURL, 'PNG', 0, 0, stageRef.current.width(), stageRef.current.height());
    pdf.save((template.title || 'export') + '.pdf');
  }

  async function handleSaveProject() {
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 1 });
    if (onSave) {
      await onSave({ shapes, thumbnail: dataURL });
      alert('Saved project.');
    }
  }

  return (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <button onClick={addText}>Add Text</button>
        <label style={{display:'inline-block'}}>
          <input disabled={loadingUpload} type="file" accept="image/*" style={{display:'none'}} onChange={e=>addImageFile(e.target.files[0])} />
          <span style={{padding:'6px 8px', border:'1px solid #ccc', borderRadius:4, cursor:'pointer'}}>Add Image</span>
        </label>
        <button onClick={deleteSelected}>Delete</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={exportPNG}>Export PNG</button>
        <button onClick={exportPDF}>Export PDF</button>
        <button onClick={handleSaveProject}>Save</button>
      </div>

      <div style={{border:'1px solid #ddd', background:'#fff', width: '100%', overflow:'auto'}}>
        <Stage
          width={900}
          height={600}
          ref={stageRef}
          onMouseDown={e => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedId(null);
          }}
        >
          <Layer ref={layerRef}>
            {shapes.map(s => {
              if (s.type === 'text') {
                return (
                  <Text
                    key={s.id}
                    x={s.x}
                    y={s.y}
                    text={s.text}
                    fontSize={s.fontSize || 18}
                    fill={s.fill || '#000'}
                    draggable
                    onClick={() => setSelectedId(s.id)}
                    onDragEnd={e => updateShape(s.id, { x: e.target.x(), y: e.target.y() })}
                    onDblClick={() => {
                      const newText = prompt('Edit text', s.text);
                      if (newText !== null) updateShape(s.id, { text: newText });
                    }}
                  />
                );
              } else if (s.type === 'image') {
                return (
                  <KonvaImage key={s.id} shape={s} isSelected={selectedId===s.id} onSelect={()=>setSelectedId(s.id)} onChange={(ns)=>updateShape(s.id, ns)} />
                );
              }
              return null;
            })}
            <Rect x={0} y={0} width={900} height={600} stroke="#eee" />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
