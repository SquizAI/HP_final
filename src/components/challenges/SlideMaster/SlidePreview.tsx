// Add a better loading indicator for images
const ImageLoading = () => (
  <div className="image-loading-container">
    <div className="image-loading-spinner"></div>
    <p>Generating AI image...</p>
    <style jsx>{`
      .image-loading-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 0.5rem;
        z-index: 5;
      }
      .image-loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #3b82f6;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 0.5rem;
      }
      p {
        font-size: 0.85rem;
        color: #333;
        font-weight: 500;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// In the slide preview component, change the image rendering to include the loading state
// Find where you render the slide image, it might look like:
{slide.generatedImageUrl && (
  <div className="slide-image-container">
    <img src={slide.generatedImageUrl} alt={slide.title} className="slide-image" />
  </div>
)}

// And change it to:
<div className="slide-image-container">
  {slide.generatedImageUrl ? (
    <img src={slide.generatedImageUrl} alt={slide.title} className="slide-image" />
  ) : slide.type !== 'title' && (
    <ImageLoading />
  )}
</div> 