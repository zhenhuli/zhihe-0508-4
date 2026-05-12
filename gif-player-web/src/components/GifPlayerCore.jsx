import { useEffect, useRef, useCallback } from 'react';

const GifPlayerCore = ({
  frames,
  isPlaying,
  speed,
  loopCount,
  currentFrameIndex,
  onFrameChange,
  onLoopComplete
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const loopCountRef = useRef(0);
  const currentLoopRef = useRef(0);

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas || !frames || frames.length === 0) return;

    const ctx = canvas.getContext('2d');
    const frame = frames[frameIndex];
    
    canvas.width = frame.dims.width;
    canvas.height = frame.dims.height;
    
    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height
    );
    
    ctx.putImageData(imageData, 0, 0);
  }, [frames]);

  useEffect(() => {
    if (frames && frames.length > 0) {
      drawFrame(currentFrameIndex);
    }
  }, [frames, currentFrameIndex, drawFrame]);

  useEffect(() => {
    if (!isPlaying || !frames || frames.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      
      const elapsed = timestamp - lastTimeRef.current;
      const frame = frames[currentFrameIndex];
      const frameDelay = (frame.delay * 10) / speed;

      if (elapsed >= frameDelay) {
        lastTimeRef.current = timestamp;
        let nextFrame = currentFrameIndex + 1;

        if (nextFrame >= frames.length) {
          currentLoopRef.current++;
          
          if (loopCount > 0 && currentLoopRef.current >= loopCount) {
            onLoopComplete?.();
            return;
          }
          
          nextFrame = 0;
          onLoopComplete?.();
        }

        onFrameChange(nextFrame);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frames, speed, loopCount, currentFrameIndex, onFrameChange, onLoopComplete]);

  return (
    <div className="gif-player-core">
      <canvas ref={canvasRef} className="gif-canvas" />
    </div>
  );
};

export default GifPlayerCore;
