import { useState, useRef } from 'react';
import GifPlayerCore from './components/GifPlayerCore';
import PlayerControls from './components/PlayerControls';
import { parseGifFile, saveFrameAsImage, extractFramesFromVideo, saveAsGif } from './utils/gifParser';
import './App.css';

function App() {
  const [frames, setFrames] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loopCount, setLoopCount] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingGif, setIsSavingGif] = useState(false);
  const [fileType, setFileType] = useState('');
  const canvasRef = useRef(null);

  const handleGifUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);
    setFileType('gif');
    
    try {
      const parsedFrames = await parseGifFile(file);
      setFrames(parsedFrames);
      setCurrentFrameIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error parsing GIF:', error);
      alert('解析 GIF 文件失败，请检查文件格式');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);
    setFileType('video');
    
    try {
      const videoFrames = await extractFramesFromVideo(file);
      setFrames(videoFrames);
      setCurrentFrameIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error processing video:', error);
      alert('处理视频文件失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrameChange = (index) => {
    setCurrentFrameIndex(index);
  };

  const handleLoopComplete = () => {
    if (loopCount > 0) {
      setIsPlaying(false);
    }
  };

  const handleSaveFrame = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      saveFrameAsImage(canvas, `${fileName}_frame_${currentFrameIndex + 1}.png`);
    }
  };

  const handleSaveGif = async () => {
    if (frames.length === 0) return;
    
    setIsSavingGif(true);
    try {
      const baseName = fileName.replace(/\.[^/.]+$/, '');
      const delay = 100 / speed;
      await saveAsGif(frames, `${baseName}.gif`, delay);
    } catch (error) {
      console.error('Error saving GIF:', error);
      alert('保存 GIF 失败，请重试');
    } finally {
      setIsSavingGif(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type === 'image/gif') {
      setIsLoading(true);
      setFileName(file.name);
      setFileType('gif');
      try {
        const parsedFrames = await parseGifFile(file);
        setFrames(parsedFrames);
        setCurrentFrameIndex(0);
        setIsPlaying(false);
      } catch (error) {
        console.error('Error parsing GIF:', error);
        alert('解析 GIF 文件失败');
      } finally {
        setIsLoading(false);
      }
    } else if (file.type.startsWith('video/')) {
      setIsLoading(true);
      setFileName(file.name);
      setFileType('video');
      try {
        const videoFrames = await extractFramesFromVideo(file);
        setFrames(videoFrames);
        setCurrentFrameIndex(0);
        setIsPlaying(false);
      } catch (error) {
        console.error('Error processing video:', error);
        alert('处理视频文件失败');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('请上传 GIF 图片或视频文件');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 GIF 播放器</h1>
        <p className="subtitle">上传 GIF 或视频，控制播放、截取帧、导出 GIF</p>
      </header>

      <div className="upload-section">
        <div
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="upload-buttons">
            <label className="upload-button gif-upload">
              <span>📁 上传 GIF</span>
              <input
                type="file"
                accept=".gif,image/gif"
                onChange={handleGifUpload}
                hidden
              />
            </label>
            <label className="upload-button video-upload">
              <span>🎥 上传视频</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                hidden
              />
            </label>
          </div>
          <p className="upload-hint">或拖拽文件到此处</p>
        </div>

        {fileName && (
          <div className="file-info">
            <span className="file-name">📄 {fileName}</span>
            <span className="frame-count">帧数: {frames.length}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>处理中...</p>
        </div>
      ) : frames.length > 0 ? (
        <div className="player-section" ref={canvasRef}>
          <GifPlayerCore
            frames={frames}
            isPlaying={isPlaying}
            speed={speed}
            loopCount={loopCount}
            currentFrameIndex={currentFrameIndex}
            onFrameChange={handleFrameChange}
            onLoopComplete={handleLoopComplete}
          />
          
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            speed={speed}
            onSpeedChange={setSpeed}
            loopCount={loopCount}
            onLoopCountChange={setLoopCount}
            currentFrame={currentFrameIndex}
            totalFrames={frames.length}
            onFrameChange={handleFrameChange}
            onSaveFrame={handleSaveFrame}
            onSaveGif={handleSaveGif}
            isSavingGif={isSavingGif}
            showSaveGif={fileType === 'video'}
            disabled={frames.length === 0 || isSavingGif}
          />
        </div>
      ) : (
        <div className="placeholder">
          <div className="placeholder-icon">🎞️</div>
          <p>上传 GIF 图片或视频开始播放</p>
        </div>
      )}
    </div>
  );
}

export default App;
