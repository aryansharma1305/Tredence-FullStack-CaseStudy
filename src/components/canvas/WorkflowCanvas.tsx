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
import CanvasToolbar from './CanvasToolbar'

const staticNodeTypes = workflowNodeTypes
const staticEdgeTypes = {}

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
    <div className="relative h-full animate-pop-in overflow-hidden rounded-none border-x border-slate-200 bg-[#f8f8fa]">
      <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between border-b border-[#e6dac2] bg-[#f4eddf]/95 px-4 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3d5677]">Workflow Canvas</p>
        <p className="text-xs font-medium text-[#5a6471]">Drag from library and connect steps</p>
      </div>
      <CanvasToolbar />
      <ReactFlow
        className="pt-11"
        nodes={nodes.map((node) => ({
          ...node,
          style: {
            ...(node.style ?? {}),
            boxShadow: invalidNodeIds.has(node.id) ? '0 0 0 2px rgba(230, 88, 88, 0.5)' : undefined
          }
        }))}
        edges={edges}
        nodeTypes={staticNodeTypes}
        edgeTypes={staticEdgeTypes}
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d8dce6" />
        <MiniMap
          pannable
          zoomable
          style={{
            borderRadius: 12,
            border: '1px solid #d4d8e1',
            background: '#ffffff'
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
