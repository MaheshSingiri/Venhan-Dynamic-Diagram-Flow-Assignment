import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

function Diagram({ nodes, edges, setNodes, setEdges, selected, setSelected }) {
  const rfRef = useRef(null);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({ ...connection, id: `e${connection.source}-${connection.target}-${Date.now()}` }, eds));
  }, [setEdges]);

  const onNodeDoubleClick = useCallback((event, node) => {
    setSelected({ type: 'node', id: node.id });
  }, [setSelected]);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    setSelected({ type: 'edge', id: edge.id });
  }, [setSelected]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!selected) return;
        if (selected.type === 'node') {
          setNodes((prev) => prev.filter((n) => n.id !== selected.id));
          setEdges((prev) => prev.filter((ed) => ed.source !== selected.id && ed.target !== selected.id));
        } else if (selected.type === 'edge') {
          setEdges((prev) => prev.filter((ed) => ed.id !== selected.id));
        }
        setSelected(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, setNodes, setEdges, setSelected]);

  return (
    <div className='diagram-wrapper' ref={rfRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onNodeClick={(e, n) => setSelected({ type: 'node', id: n.id })}
        onEdgeClick={(e, ed) => setSelected({ type: 'edge', id: ed.id })}
        fitView
      >
        <Background gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Diagram;