import { CanvasScreen, StyledStage } from './StyledComponents'
import { Layer, Line } from 'react-konva';
import { LinesT, SettingsT } from './Types';
import { useEffect, useRef, useState } from 'react';

import CanvasSettings from "./CanvasSettings";
import Konva from 'konva';
import type { ReactElement } from "react";
import type { SelectChangeEvent } from '@mui/material/Select';

const ASPECT_RATIO = 16/9

type OwnPropsT = {
  drawerSessionId: string
}

const convertLines = (lines: LinesT[], height: number, width: number) => {
  return lines.map(line => {
    return {
      ...line,
      points: line.ratio.map((number, i) => { 
        if (i % 2 === 0) return number * width;
        else return number * height;
      })
    };
  });
}

const Canvas = ({ drawerSessionId }: OwnPropsT): ReactElement => {
  const sessionId = sessionStorage.getItem('sessionId')
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
  const history = useRef<{ lines: LinesT[], dimensions: {width: number, height: number}}[]>([{lines: [], dimensions}])
  const historyStep = useRef(0)
  const [lines, setLines] = useState<LinesT[]>(history.current[historyStep.current].lines);
  const isDrawing = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if(containerRef && containerRef.current){
        const container = containerRef.current
        const newWidth = container.offsetWidth * .95
        const newHeight = container.offsetWidth * .95 / ASPECT_RATIO
        setDimensions({
          width: newWidth,
          height: newHeight
        })
        setLines(prevLines => convertLines(prevLines, newHeight, newWidth));
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
    const previousLines = history.current[historyStep.current].lines
    
    if(history.current[historyStep.current].dimensions.height !== dimensions.height){
      const updatedLines = convertLines(previousLines, dimensions.height, dimensions.width)
      setLines([...updatedLines])
    }else{
      setLines([...previousLines])
    }  
  }

  const handleRedo = () => {
    if (!history.current.length || historyStep.current === history.current.length - 1) return
    historyStep.current += 1
    const nextLines = history.current[historyStep.current].lines
    
    if(history.current[historyStep.current].dimensions.height !== dimensions.height){
      const updatedLines = convertLines(nextLines, dimensions.height, dimensions.width)
      setLines([...updatedLines])
    }else{
      setLines([...nextLines])
    }  
  }
  
  const handleClearHistory = () => {
    if(Object.keys(history.current[historyStep.current]).length){
      history.current.push({lines: [], dimensions})
      historyStep.current += 1
    }
  }

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if(sessionId !== drawerSessionId) return
    isDrawing.current = true;
    const pos = e.target.getStage()!.getPointerPosition()!;
    const {tool, stroke, strokeWidth} = settings
    const updatedLines = [...lines, { tool, points: [pos.x, pos.y], stroke, strokeWidth, ratio:[pos.x / dimensions.width, pos.y /dimensions.height], width: dimensions.width, height: dimensions.height }]
    if(historyStep.current < history.current.length){
      history.current.splice(historyStep.current + 1, history.current.length - historyStep.current - 1)
    }
    history.current.push({lines: updatedLines, dimensions})
    historyStep.current += 1
    
    setLines([...updatedLines]);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    // no drawing or player isn't the drawer - skipping
    if (!isDrawing.current || sessionId !== drawerSessionId) {
      return;
    }
    const stage = e.target.getStage()!;
    const point = stage.getPointerPosition()!;
    let lastLine = lines[lines.length - 1];
    
    const { width, height } = stage.attrs
    const delta = 0
    
    // add point and ratio
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lastLine.ratio = lastLine.ratio.concat([point.x / dimensions.width, point.y / dimensions.height])
    
    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    
    const updatedLines = lines.concat()
    history.current[history.current.length - 1].lines = updatedLines
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
      {drawerSessionId === sessionId && <CanvasSettings 
        settings={settings} 
        handleSettingChange={handleSettingChange} 
        setSettings={setSettings} 
        setLines={setLines}
        handleRedo={handleRedo}
        handleUndo={handleUndo}
        handleClearHistory={handleClearHistory}
      />}
    </CanvasScreen>
  );
};

export default Canvas