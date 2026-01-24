import ExcalidrawWrapper from './core/components/ExcalidrawWrapper'
import './core/styles.css'
import '@excalidraw/excalidraw/index.css'

export default function Editor() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)', position: 'relative' }}>
       <ExcalidrawWrapper />
    </div>
  )
}
