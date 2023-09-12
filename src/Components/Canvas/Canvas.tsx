import { CanvasScreen, StyledStage } from './StyledComponents'
import { Layer, Line } from 'react-konva';
import { LinesT, SettingsT } from './Types';
import { useEffect, useRef, useState } from 'react';

import CanvasSettings from "./CanvasSettings";
import Konva from 'konva';
import type { ReactElement } from "react";
import type { SelectChangeEvent } from '@mui/material/Select';

const ASPECT_RATIO = 16/9

const Canvas = (): ReactElement => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [settings, setSettings] = useState<SettingsT>({
    tool: 'pen',
    stroke: "#000000",
    strokeWidth: '5'
  })
  const history = useRef<LinesT[][]>([[]])
  const historyStep = useRef(0)
  const [lines, setLines] = useState<LinesT[]>(history.current[historyStep.current]);
  const isDrawing = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if(containerRef && containerRef.current){
        const container = containerRef.current
        setDimensions({
          width: container.offsetWidth * .95,
          height: container.offsetWidth * .95 / ASPECT_RATIO
        })
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  const handleUndo = () => {
    if (historyStep.current === 0) return 
    historyStep.current -= 1
    const previous = history.current[historyStep.current]
    setLines([...previous])
  }

  const handleRedo = () => {
    if (!history.current.length || historyStep.current === history.current.length - 1) return
    historyStep.current += 1
    const next = history.current[historyStep.current]
    setLines([...next])
  }
  
  const handleClearHistory = () => {
    if(history.current[historyStep.current].length){
      history.current.push([])
      historyStep.current += 1
    }
  }

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()!.getPointerPosition()!;
    const {tool, stroke, strokeWidth} = settings
    const updatedLines = [...lines, { tool, points: [pos.x, pos.y], stroke, strokeWidth }]
    if(historyStep.current < history.current.length){
      history.current.splice(historyStep.current + 1, history.current.length - historyStep.current - 1)
    }
    history.current.push(updatedLines)
    historyStep.current += 1
    
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
    const delta = 0
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    
    const updatedLines = lines.concat()
    history.current[history.current.length - 1] = updatedLines
    if(point.x <= 0 + delta || point.y <= 0 + delta || point.x >= width - delta || point.y >= height - delta) isDrawing.current = false
    setLines(updatedLines);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleMouseLeave = () => {
    isDrawing.current = false
  }

  const handleSettingChange = (e:SelectChangeEvent<unknown>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    })
  }

  return (
    <CanvasScreen ref={containerRef}>
      <CanvasSettings 
        settings={settings} 
        handleSettingChange={handleSettingChange} 
        setSettings={setSettings} 
        setLines={setLines}
        handleRedo={handleRedo}
        handleUndo={handleUndo}
        handleClearHistory={handleClearHistory}
      />
      <StyledStage
        width={dimensions.width}
        height={dimensions.height}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onContextMenu={handlePointerUp}
        onMouseLeave={handleMouseLeave}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={Number(line.strokeWidth)}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </StyledStage>
    </CanvasScreen>
  );
};

export default Canvas