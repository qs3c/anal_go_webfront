import ExcalidrawWrapper from './core/components/ExcalidrawWrapper'
import './core/styles.css'
import '@excalidraw/excalidraw/index.css'

export default function Editor({ analysisId }: { analysisId: number }) {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)', position: 'relative' }}>
       <ExcalidrawWrapper storageKey={`analysis_editor_${analysisId}`} />
    </div>
  )
}
