import React, { useState, useEffect } from 'react';

function Sidebar({ nodes, edges, setNodes, setEdges, selected, setSelected }) {
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeX, setNodeX] = useState(200);
  const [nodeY, setNodeY] = useState(200);
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [editing, setEditing] = useState(null);
  const [editLabel, setEditLabel] = useState('');

  useEffect(() => {
    setEditing(selected);
    if (selected) {
      if (selected.type === 'node') {
        const node = nodes.find((n) => n.id === selected.id);
        setEditLabel(node?.data?.label || '');
      } else if (selected.type === 'edge') {
        const edge = edges.find((e) => e.id === selected.id);
        setEditLabel(edge?.label || '');
      }
    } else {
      setEditLabel('');
    }
  }, [selected, nodes, edges]);

  const addNode = () => {
    const id = String(Date.now());
    const newNode = { id, type: 'default', position: { x: Number(nodeX), y: Number(nodeY) }, data: { label: nodeLabel || `Node ${id}` } };
    setNodes((prev) => [...prev, newNode]);
    setNodeLabel('');
  };

  const addEdge = () => {
    if (!edgeSource || !edgeTarget) return;
    const id = `e${edgeSource}-${edgeTarget}-${Date.now()}`;
    const newEdge = { id, source: edgeSource, target: edgeTarget, type: 'smoothstep', label: '' };
    setEdges((prev) => [...prev, newEdge]);
    setEdgeSource('');
    setEdgeTarget('');
  };

  const saveEdit = () => {
    if (!editing) return;
    if (editing.type === 'node') {
      setNodes((prev) => prev.map((n) => n.id === editing.id ? { ...n, data: { ...n.data, label: editLabel } } : n));
    } else if (editing.type === 'edge') {
      setEdges((prev) => prev.map((e) => e.id === editing.id ? { ...e, label: editLabel } : e));
    }
    setSelected(null);
  };

  const reset = () => {
    if (window.confirm('Clear all nodes and edges?')) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem('dynamic-diagram-flow');
    }
  };

  return (
    <aside className='sidebar'>
      <h3>Controls</h3>
      <div className='panel'>
        <h4>Add Node</h4>
        <input placeholder='Label' value={nodeLabel} onChange={(e) => setNodeLabel(e.target.value)} />
        <div className='coords'>
          <input type='number' value={nodeX} onChange={(e) => setNodeX(e.target.value)} />
          <input type='number' value={nodeY} onChange={(e) => setNodeY(e.target.value)} />
        </div>
        <button onClick={addNode}>Add Node</button>
      </div>

      <div className='panel'>
        <h4>Add Edge</h4>
        <select value={edgeSource} onChange={(e) => setEdgeSource(e.target.value)}>
          <option value=''>Select source</option>
          {nodes.map((n) => <option key={n.id} value={n.id}>{n.data?.label || n.id}</option>)}
        </select>
        <select value={edgeTarget} onChange={(e) => setEdgeTarget(e.target.value)}>
          <option value=''>Select target</option>
          {nodes.map((n) => <option key={n.id} value={n.id}>{n.data?.label || n.id}</option>)}
        </select>
        <button onClick={addEdge}>Add Edge</button>
      </div>

      {editing && (
        <div className='panel'>
          <h4>Edit {editing.type === 'node' ? 'Node' : 'Edge'}</h4>
          <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setSelected(null)} className='danger'>Cancel</button>
          </div>
        </div>
      )}

      <div className='panel'>
        <button onClick={reset} className='danger'>Reset Diagram</button>
      </div>
    </aside>
  );
}

export default Sidebar;