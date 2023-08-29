import { BsEraser, BsPencil } from "react-icons/bs";
import { LinesT, SettingsT } from './Canvas'

//@ts-ignore
import { CompactPicker } from 'react-color';
import { ReactElement } from "react"

type CanvasSettingsT = {
  setSettings: React.Dispatch<React.SetStateAction<SettingsT>>,
  settings: SettingsT,
  handleSettingChange: (e:React.ChangeEvent<HTMLSelectElement>) => void,
  setLines: React.Dispatch<React.SetStateAction<LinesT[]>>,
  handleRedo: () => void,
  handleUndo: () => void,
  handleClearHistory: () => void
}

const CanvasSettings = ({settings, setSettings, handleSettingChange, setLines, handleRedo, handleUndo, handleClearHistory}: CanvasSettingsT): ReactElement => {
  return (
    <>
      <CompactPicker color={settings.stroke} onChange={(color:any) => {setSettings({...settings, stroke:color.hex})}}/>
      <button 
        style={{'border':settings.tool === 'pen'? '1px solid black': ''}}
        onClick={() => {
          setSettings({...settings, tool: 'pen'})
        }}>
        <BsPencil/>
      </button>

      <button 
        style={{'border':settings.tool === 'eraser'? '1px solid black': ''}}
        onClick={() => {
          setSettings({...settings, tool: 'eraser'})
        }}>
        <BsEraser/>
      </button>

      <select
        name={'strokeWidth'}
        value={settings.strokeWidth}
        onChange={handleSettingChange}
      >
        <option value={5}>Small</option>
        <option value={10}>Medium</option>
        <option value={20}>Large</option>
        <option value={50}>Extra-Large</option>
      </select>
      
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
      <button onClick={() => {
        handleClearHistory()
        setLines([])
      }}>Clear</button>
    </>
  )
}

export default CanvasSettings