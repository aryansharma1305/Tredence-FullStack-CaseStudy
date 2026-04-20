import { useEffect } from 'react'
import { useWorkflowStore } from '../store/workflowStore'

export const useKeyboardShortcuts = () => {
  const deleteSelected = useWorkflowStore((state) => state.deleteSelected)
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId)
  const setSelectedEdgeId = useWorkflowStore((state) => state.setSelectedEdgeId)
  const undo = useWorkflowStore((state) => state.undo)
  const redo = useWorkflowStore((state) => state.redo)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement | null)?.tagName === 'INPUT' || (event.target as HTMLElement | null)?.tagName === 'TEXTAREA') {
        return
      }

      if (event.key === 'Escape') {
        setSelectedNodeId(null)
        setSelectedEdgeId(null)
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected()
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()

        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [deleteSelected, redo, setSelectedEdgeId, setSelectedNodeId, undo])
}
