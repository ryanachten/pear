import { Camera } from "@mediapipe/camera_utils";
import { Results, SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export interface IVideoCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const VideoCanvas = ({ videoRef }: IVideoCanvasProps) => {
  const [selfieSegmentation] = useState(
    new SelfieSegmentation({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
      },
    })
  );
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await selfieSegmentation.send({ image: videoElement });
      },
    });
    camera.start();
  }, [videoRef, selfieSegmentation]);

  const drawCanvasFrame = useCallback(
    (results: Results) => {
      if (!canvasContext || !canvasEl.current) return;
      const canvas = canvasEl.current;

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(
        results.segmentationMask,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvasContext.globalCompositeOperation = "source-out";
      canvasContext.fillStyle = "#00FF00";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      canvasContext.filter = "blur(8px)";

      // Only overwrite missing pixels.
      // canvasContext.globalCompositeOperation = "destination-atop";
      canvasContext.globalCompositeOperation = "darken";
      // canvasContext.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      canvasContext.restore();
    },
    [canvasContext]
  );

  useEffect(() => {
    const context = canvasEl.current?.getContext("2d");
    if (context) {
      setCanvasContext(context);
    }
  }, [canvasEl]);

  useEffect(() => {
    selfieSegmentation.setOptions({
      modelSelection: 1,
    });
    selfieSegmentation.onResults(drawCanvasFrame);
  });

  return <canvas ref={canvasEl} />;
};

export default VideoCanvas;
