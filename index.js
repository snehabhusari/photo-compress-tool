import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Image Compressor</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          padding: 40px;
        }
        
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        
        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .upload-area {
          border: 2px dashed #667eea;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9ff;
          margin-bottom: 20px;
        }
        
        .upload-area:hover {
          border-color: #764ba2;
          background: #f0f2ff;
        }
        
        .upload-area.dragover {
          border-color: #764ba2;
          background: #e8ebff;
        }
        
        .upload-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }
        
        .upload-text {
          color: #333;
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .upload-hint {
          color: #999;
          font-size: 12px;
        }
        
        input[type="file"] {
          display: none;
        }
        
        .preview-section {
          display: none;
          margin-bottom: 30px;
        }
        
        .preview-section.active {
          display: block;
        }
        
        .image-preview {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 20px;
          background: #f5f5f5;
        }
        
        .size-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .size-box {
          background: #f8f9ff;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .size-label {
          color: #999;
          font-size: 12px;
          margin-bottom: 5px;
        }
        
        .size-value {
          color: #333;
          font-size: 20px;
          font-weight: 600;
        }
        
        .reduction {
          color: #10b981;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .slider-group {
          margin-bottom: 20px;
        }
        
        .slider-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #333;
        }
        
        input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e0e0e0;
          outline: none;
          -webkit-appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .button-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-download {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-reset {
          background: #f0f0f0;
          color: #333;
        }
        
        .btn-reset:hover {
          background: #e0e0e0;
        }
        
        .footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
          margin-top: 30px;
        }
        
        .creator-info {
          text-align: center;
          color: #666;
          font-size: 13px;
          margin-bottom: 15px;
          line-height: 1.6;
        }
        
        .creator-info strong {
          color: #333;
        }
        
        .dh-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .dh-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🖼️ Image Compressor</h1>
        <p class="subtitle">Compress your images for social media, messaging, and more</p>
        
        <div class="upload-area" id="uploadArea">
          <div class="upload-icon">📤</div>
          <div class="upload-text">Click to upload or drag & drop</div>
          <div class="upload-hint">PNG, JPG, WebP (Max 50MB)</div>
          <input type="file" id="fileInput" accept="image/*">
        </div>
        
        <div class="preview-section" id="previewSection">
          <img id="preview" class="image-preview" alt="Preview">
          
          <div class="size-info">
            <div class="size-box">
              <div class="size-label">Original Size</div>
              <div class="size-value" id="originalSize">0 KB</div>
            </div>
            <div class="size-box">
              <div class="size-label">Compressed Size</div>
              <div class="size-value" id="compressedSize">0 KB</div>
              <div class="reduction" id="reduction">0% smaller</div>
            </div>
          </div>
          
          <div class="slider-group">
            <div class="slider-label">
              <span>Compression Quality</span>
              <span id="qualityValue">80%</span>
            </div>
            <input type="range" id="qualitySlider" min="10" max="100" value="80">
          </div>
          
          <div class="button-group">
            <button class="btn-download" id="downloadBtn">⬇️ Download</button>
            <button class="btn-reset" id="resetBtn">↻ Reset</button>
          </div>
        </div>
        
        <div class="footer">
          <div class="creator-info">
            <strong>Sneha Bhusari</strong><br>
            bhusarisneha83@gmail.com
          </div>
          <div style="text-align: center;">
            <a href="https://digitalheroesco.com" class="dh-button">Built for Digital Heroes</a>
          </div>
        </div>
      </div>
      
      <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const previewSection = document.getElementById('previewSection');
        const preview = document.getElementById('preview');
        const originalSizeEl = document.getElementById('originalSize');
        const compressedSizeEl = document.getElementById('compressedSize');
        const reductionEl = document.getElementById('reduction');
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        const downloadBtn = document.getElementById('downloadBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        let originalFile = null;
        let originalSize = 0;
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
          uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
          e.preventDefault();
          uploadArea.classList.remove('dragover');
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
          }
        });
        
        fileInput.addEventListener('change', handleFileSelect);
        
        function handleFileSelect() {
          const file = fileInput.files[0];
          if (!file) return;
          
          originalFile = file;
          originalSize = file.size;
          
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
            previewSection.classList.add('active');
            updateCompression();
          };
          reader.readAsDataURL(file);
        }
        
        qualitySlider.addEventListener('input', (e) => {
          qualityValue.textContent = e.target.value + '%';
          updateCompression();
        });
        
        function updateCompression() {
          const quality = qualitySlider.value / 100;
          const canvas = document.createElement('canvas');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              const compressedSize = blob.size;
              const reduction = Math.round(((originalSize - compressedSize) / originalSize) * 100);
              
              originalSizeEl.textContent = formatSize(originalSize);
              compressedSizeEl.textContent = formatSize(compressedSize);
              reductionEl.textContent = reduction + '% smaller';
              
              downloadBtn.onclick = () => downloadCompressed(blob);
            }, 'image/jpeg', quality);
          };
          
          img.src = preview.src;
        }
        
        function formatSize(bytes) {
          if (bytes === 0) return '0 KB';
          const k = 1024;
          const sizes = ['B', 'KB', 'MB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
        }
        
        function downloadCompressed(blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'compressed-image.jpg';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        resetBtn.addEventListener('click', () => {
          fileInput.value = '';
          originalFile = null;
          previewSection.classList.remove('active');
          qualitySlider.value = 80;
          qualityValue.textContent = '80%';
        });
      </script>
    </body>
    </html>
  `);
});

export default app;
