import { parseGIF, decompressFrames } from 'gifuct-js';

export const parseGifFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const gif = parseGIF(arrayBuffer);
        const frames = decompressFrames(gif, true);
        
        const processedFrames = frames.map((frame) => ({
          patch: frame.patch,
          dims: frame.dims,
          delay: frame.delay,
          disposalType: frame.disposalType
        }));
        
        resolve(processedFrames);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const saveFrameAsImage = (canvas, filename = 'frame.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const extractFramesFromVideo = async (videoFile, frameInterval = 10, maxWidth = 400) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.crossOrigin = 'anonymous';
    
    video.onloadedmetadata = () => {
      video.currentTime = 0;
    };
    
    const frames = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const captureFrame = () => {
      const ratio = video.videoWidth / video.videoHeight;
      const width = Math.min(maxWidth, video.videoWidth);
      const height = width / ratio;
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      frames.push({
        patch: imageData.data,
        dims: { width, height },
        delay: frameInterval,
        imageData: imageData
      });
      
      if (video.currentTime < video.duration) {
        video.currentTime += frameInterval / 100;
      } else {
        URL.revokeObjectURL(video.src);
        resolve(frames);
      }
    };
    
    video.onseeked = captureFrame;
    video.onerror = reject;
  });
};

const lzwEncode = (indices, minCodeSize) => {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  
  let dict = new Map();
  let nextCode = eoiCode + 1;
  let curCodeSize = minCodeSize + 1;
  
  for (let i = 0; i < (1 << minCodeSize); i++) {
    dict.set(String(i), i);
  }
  
  let bitBuffer = 0;
  let bitCount = 0;
  const output = [];
  
  const writeCode = (code, size) => {
    bitBuffer |= code << bitCount;
    bitCount += size;
    
    while (bitCount >= 8) {
      output.push(bitBuffer & 0xff);
      bitBuffer >>= 8;
      bitCount -= 8;
    }
  };
  
  writeCode(clearCode, curCodeSize);
  let curStr = String(indices[0]);
  
  for (let i = 1; i < indices.length; i++) {
    const key = curStr + "," + indices[i];
    if (dict.has(key)) {
      curStr = key;
    } else {
      writeCode(dict.get(curStr), curCodeSize);
      
      if (nextCode < 4096) {
        dict.set(key, nextCode++);
        if (nextCode > (1 << curCodeSize)) {
          curCodeSize++;
        }
      }
      
      curStr = String(indices[i]);
    }
  }
  
  writeCode(dict.get(curStr), curCodeSize);
  writeCode(eoiCode, curCodeSize);
  
  if (bitCount > 0) {
    output.push(bitBuffer & 0xff);
  }
  
  return output;
};

export const saveAsGif = (frames, filename = 'animation.gif', delay = 100) => {
  return new Promise((resolve, reject) => {
    try {
      if (!frames || frames.length === 0) {
        reject(new Error('No frames to create GIF'));
        return;
      }

      const { width, height } = frames[0].dims;
      
      const stream = {
        data: [],
        writeByte: function(b) { this.data.push(b); },
        writeBytes: function(arr) { 
          for (let i = 0; i < arr.length; i++) {
            this.data.push(arr[i]);
          }
        },
        writeShort: function(s) {
          this.data.push(s & 0xff);
          this.data.push((s >> 8) & 0xff);
        }
      };
      
      const colorTable = [];
      
      for (let f = 0; f < Math.min(frames.length, 5); f++) {
        const pixels = frames[f].patch;
        for (let i = 0; i < pixels.length; i += 4 * 10) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const key = (r << 16) | (g << 8) | b;
          if (colorTable.length < 768) {
            let exists = false;
            for (let c = 0; c < colorTable.length; c += 3) {
              if (colorTable[c] === r && colorTable[c + 1] === g && colorTable[c + 2] === b) {
                exists = true;
                break;
              }
            }
            if (!exists) {
              colorTable.push(r, g, b);
            }
          }
        }
      }
      
      while (colorTable.length < 768) {
        colorTable.push(0);
      }
      
      stream.writeBytes([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      stream.writeShort(width);
      stream.writeShort(height);
      stream.writeByte(0xf7);
      stream.writeByte(0);
      stream.writeByte(0);
      
      for (let i = 0; i < colorTable.length; i++) {
        stream.writeByte(colorTable[i]);
      }
      
      stream.writeBytes([0x21, 0xff, 0x0b]);
      stream.writeBytes([0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30]);
      stream.writeBytes([0x03, 0x01, 0x00, 0x00, 0x00]);
      
      for (let frameIdx = 0; frameIdx < frames.length; frameIdx++) {
        const frame = frames[frameIdx];
        
        stream.writeBytes([0x21, 0xf9, 0x04]);
        stream.writeByte(0x04);
        stream.writeShort(Math.round(delay / 10));
        stream.writeByte(0);
        stream.writeByte(0);
        
        stream.writeByte(0x2c);
        stream.writeShort(0);
        stream.writeShort(0);
        stream.writeShort(width);
        stream.writeShort(height);
        stream.writeByte(0);
        
        const pixels = frame.patch;
        const indexedPixels = [];
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const key = (r << 16) | (g << 8) | b;
          
          let bestIdx = 0;
          let bestDist = Infinity;
          
          for (let c = 0; c < 256; c++) {
            const cr = colorTable[c * 3];
            const cg = colorTable[c * 3 + 1];
            const cb = colorTable[c * 3 + 2];
            const dist = (r - cr) * (r - cr) + (g - cg) * (g - cg) + (b - cb) * (b - cb);
            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = c;
            }
          }
          
          indexedPixels.push(bestIdx);
        }
        
        stream.writeByte(8);
        
        const encoded = lzwEncode(indexedPixels, 8);
        
        let pos = 0;
        while (pos < encoded.length) {
          const chunkSize = Math.min(255, encoded.length - pos);
          stream.writeByte(chunkSize);
          for (let i = 0; i < chunkSize; i++) {
            stream.writeByte(encoded[pos + i]);
          }
          pos += chunkSize;
        }
        
        stream.writeByte(0);
      }
      
      stream.writeByte(0x3b);
      
      const uint8Array = new Uint8Array(stream.data);
      const blob = new Blob([uint8Array], { type: 'image/gif' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      resolve();
    } catch (error) {
      console.error('GIF encoding error:', error);
      reject(error);
    }
  });
};
