import { CanvasScreen, StyledStage } from './StyledComponents'
import { Layer, Line } from 'react-konva';
import { LinesT, SettingsT } from './Types';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@mui/base';
import CanvasSettings from "./CanvasSettings";
import Konva from 'konva';
import { Phase } from '../Types';
import type { ReactElement } from "react";
import type { SelectChangeEvent } from '@mui/material/Select';
import socket from '../../Websocket/socket';

const ASPECT_RATIO = 16/9

type OwnPropsT = {
  drawerSessionId: string,
  roomName: string | null,
  drawerIdx: number,
  phase: Phase
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

const Canvas = ({ drawerSessionId, roomName, drawerIdx, phase }: OwnPropsT): ReactElement => {
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
  const [lines, setLines] = useState<LinesT[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null)
  const [images, setImages] = useState<{sessionId: string, pictureUrl: string}[]>([])

  useEffect(() => {
    const handleResize = (initialLoad: boolean) => {
      if(containerRef && containerRef.current){
        const container = containerRef.current
        const newWidth = container.offsetWidth * .95
        const newHeight = container.offsetWidth * .95 / ASPECT_RATIO
        setDimensions({
          width: newWidth,
          height: newHeight
        })
        if(initialLoad){
          socket.emit('get_drawing', roomName, (returnedLines:LinesT[]) => {
            if(returnedLines.length) {
              setLines(convertLines(returnedLines, newHeight, newWidth)) 
            }
          })
        }else setLines(prevLines => convertLines(prevLines, newHeight, newWidth))
      }
    }

    const resizeScreen = () => handleResize(false)

    handleResize(true)

    window.addEventListener('resize', resizeScreen)

    socket.on('send_pictures', (pictures) => {
      setImages(pictures)
    })

    return () => {
      window.removeEventListener('resize', resizeScreen)
      socket.off('send_pictures')
    }
  }, [])

  useEffect(() => {
      const handleUpdate = (updatedLines: LinesT[]) => {
          const convertedLines = convertLines(updatedLines, dimensions.height, dimensions.width);
          setLines(convertedLines);
      };

      socket.on('sending_updated_drawing', handleUpdate);

      return () => {
          socket.off('sending_updated_drawing');
      };
  }, [dimensions, socket]);

  useEffect(() => {
    setSettings({
      tool: 'pen',
      stroke: "#000000",
      strokeWidth: '5'
    })
    history.current = [{lines: [], dimensions}]
    historyStep.current = 0
    setLines([])
  }, [drawerIdx])

  useEffect(() => {
    if(phase === 'End_Of_Round') {
      const stage = stageRef.current
      if(!stage) return
      const pictureUrl = stage.toDataURL()
      socket.emit('save_drawing', roomName, pictureUrl)
    }
  }, [phase])
  
  const updateLines = (updatedLines: LinesT[]) => {
    setLines(updatedLines)
    socket.emit('update_drawing', { lines: updatedLines, roomName })
  }
  
  const handleUndo = () => {
    if (historyStep.current === 0) return 
    historyStep.current -= 1
    const previousLines = history.current[historyStep.current].lines
    
    if(history.current[historyStep.current].dimensions.height !== dimensions.height){
      const updatedLines = convertLines(previousLines, dimensions.height, dimensions.width)
      updateLines([...updatedLines])
    }else{
      updateLines([...previousLines])
    }  
  }

  const handleRedo = () => {
    if (!history.current.length || historyStep.current === history.current.length - 1) return
    historyStep.current += 1
    const nextLines = history.current[historyStep.current].lines
    
    if(history.current[historyStep.current].dimensions.height !== dimensions.height){
      const updatedLines = convertLines(nextLines, dimensions.height, dimensions.width)
      updateLines([...updatedLines])
    }else{
      updateLines([...nextLines])
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
    
    updateLines([...updatedLines]);
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
    updateLines([...updatedLines]);
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

  const handleShowPictures = () => {
    socket.emit('get_all_pictures', roomName)
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
        ref={stageRef}
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
        updateLines={updateLines}
        handleRedo={handleRedo}
        handleUndo={handleUndo}
        handleClearHistory={handleClearHistory}
      />}
      <Button onClick={handleShowPictures}>Show all pictures</Button>
      {images.length && images.map((image, idx) => {
        return (
          <img src={image.pictureUrl} key={idx}/>
        )
      })}
    </CanvasScreen>
  );
};

export default Canvas