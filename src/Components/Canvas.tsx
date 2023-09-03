import { Layer, Line, Stage, Text } from 'react-konva';
import { useRef, useState } from 'react';

import CanvasSettings from "./CanvasSettings";
import Konva from 'konva';
import type { ReactElement } from "react";

export type LinesT = {
  tool: string
  points: number[],
  stroke: string,
  strokeWidth: number
}

export type SettingsT = {
  tool: string,
  stroke: string,
  strokeWidth: number
}

let history: LinesT[][] = [[]]
let historyStep = 0

const Canvas = (): ReactElement => {
  const [settings, setSettings] = useState<SettingsT>({
    tool: 'pen',
    stroke: "#000000",
    strokeWidth: 5
  })
  const [lines, setLines] = useState<LinesT[]>(history[historyStep]);
  const isDrawing = useRef(false);

  const handleUndo = () => {
    if (historyStep === 0) return 
    historyStep -= 1
    const previous = history[historyStep]
    setLines([...previous])
  }

  const handleRedo = () => {
    if (!history.length || historyStep === history.length - 1) return
    historyStep += 1
    const next = history[historyStep]
    setLines([...next])
  }
  
  const handleClearHistory = () => {
    history = [[]]
    historyStep = 0
  }

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()!.getPointerPosition()!;
    const {tool, stroke, strokeWidth} = settings
    const updatedLines = [...lines, { tool, points: [pos.x, pos.y], stroke, strokeWidth }]
    if(historyStep < history.length){
      history.splice(historyStep + 1, history.length - historyStep - 1)
    }
    history.push(updatedLines)
    historyStep += 1
    
    setLines([...updatedLines]);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage()!;
    const point = stage.getPointerPosition()!;
    let lastLine = lines[lines.length - 1];
    
    const { width, height } = stage.attrs
    const delta = 10
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    
    const updatedLines = lines.concat()
    history[history.length - 1] = updatedLines
    if(point.x <= 0 + delta || point.y <= 0 + delta || point.x >= width - delta || point.y >= height - delta) isDrawing.current = false
    setLines(updatedLines);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleSettingChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.name === 'strokeWidth'? Number(e.target.value): e.target.value
    })
  }

  return (
    <div>
      <CanvasSettings 
        settings={settings} 
        handleSettingChange={handleSettingChange} 
        setSettings={setSettings} 
        setLines={setLines}
        handleRedo={handleRedo}
        handleUndo={handleUndo}
        handleClearHistory={handleClearHistory}
      />
      
      <Stage
        width={window.innerWidth}
        height={Math.min(500, window.innerHeight)}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onContextMenu={handlePointerUp}
        style={{'border': '1px solid black', 'touchAction':'none'}}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas