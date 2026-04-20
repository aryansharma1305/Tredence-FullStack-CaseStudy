import { useCallback, useMemo } from 'react'
import type { DragEvent } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow'
import 'reactflow/dist/style.css'
import { workflowNodeTypes } from '../nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { isWorkflowNodeType } from '../../utils/nodeFactory'
import NodePalette from './NodePalette'

const WorkflowCanvasInner = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange)
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange)
  const onConnect = useWorkflowStore((state) => state.onConnect)
  const addNode = useWorkflowStore((state) => state.addNode)
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId)
  const setSelectedEdgeId = useWorkflowStore((state) => state.setSelectedEdgeId)
  const validationIssues = useWorkflowStore((state) => state.validationIssues)

  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const nodeType = event.dataTransfer.getData('application/reactflow')

      if (!isWorkflowNodeType(nodeType)) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      addNode(nodeType, position)
    },
    [addNode, screenToFlowPosition]
  )

  const invalidNodeIds = useMemo(
    () => new Set(validationIssues.filter((issue) => issue.nodeId).map((issue) => issue.nodeId as string)),
    [validationIssues]
  )

  return (
    <div className="relative h-full animate-pop-in rounded-2xl border border-slate-200 bg-white/85 shadow-panel">
      <NodePalette />
      <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-sm">
        Drag from left panel, connect nodes, select to edit
      </div>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          style: {
            ...(node.style ?? {}),
            boxShadow: invalidNodeIds.has(node.id) ? '0 0 0 2px rgba(244, 63, 94, 0.45)' : undefined
          }
        }))}
        edges={edges}
        nodeTypes={workflowNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id)
          setSelectedEdgeId(null)
        }}
        onEdgeClick={(_, edge) => {
          setSelectedNodeId(null)
          setSelectedEdgeId(edge.id)
        }}
        onPaneClick={() => {
          setSelectedNodeId(null)
          setSelectedEdgeId(null)
        }}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.95 }}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        <MiniMap
          pannable
          zoomable
          style={{
            borderRadius: 12,
            border: '1px solid #cbd5e1'
          }}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

const WorkflowCanvas = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  )
}

export default WorkflowCanvas
