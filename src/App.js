import React, { useEffect, useState } from 'react';
import Diagram from './components/Diagram';
import Sidebar from './components/Sidebar';
import metadata from './metadata.json';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dynamic-diagram-flow');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNodes(parsed.nodes || []);
      setEdges(parsed.edges || []);
    } else {
      setNodes(metadata.nodes || []);
      setEdges(metadata.edges || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dynamic-diagram-flow', JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  return (
    <div className='app-root'>
      <Sidebar
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        selected={selected}
        setSelected={setSelected}
      />
      <Diagram
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}

export default App;