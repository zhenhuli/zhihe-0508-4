const PlayerControls = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  loopCount,
  onLoopCountChange,
  currentFrame,
  totalFrames,
  onFrameChange,
  onSaveFrame,
  onSaveGif,
  isSavingGif,
  showSaveGif,
  disabled
}) => {
  return (
    <div className="player-controls">
      <div className="control-group">
        <button
          onClick={onPlayPause}
          disabled={disabled}
          className="control-button play-button"
        >
          {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">速度: {speed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="control-slider"
        />
      </div>

      <div className="control-group">
        <label className="control-label">
          循环次数: {loopCount === 0 ? '无限' : loopCount}
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={loopCount}
          onChange={(e) => onLoopCountChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
          className="control-input"
        />
      </div>

      <div className="control-group">
        <label className="control-label">
          帧: {currentFrame + 1} / {totalFrames}
        </label>
        <input
          type="range"
          min="0"
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => onFrameChange(parseInt(e.target.value))}
          disabled={disabled}
          className="control-slider"
        />
      </div>

      <div className="control-group">
        <button
          onClick={onSaveFrame}
          disabled={disabled}
          className="control-button save-button"
        >
          💾 保存当前帧
        </button>
      </div>

      {showSaveGif && (
        <div className="control-group">
          <button
            onClick={onSaveGif}
            disabled={disabled || isSavingGif}
            className="control-button gif-button"
          >
            {isSavingGif ? '⏳ 生成中...' : '🎬 保存为GIF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerControls;
