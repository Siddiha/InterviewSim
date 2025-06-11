import { useState, useRef, useEffect } from "react";

export const useVideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setVideoBlob(null);
    videoChunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }); // Request video and audio
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        videoChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const videoBlob = new Blob(videoChunks.current, { type: "video/webm" }); // Common video format
        setVideoBlob(videoBlob);
      };

      mediaRecorder.current.onerror = (event: any) => {
        setError(`Video recording error: ${event.error.name}`);
        setRecording(false);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (err: any) {
      setError(`Error accessing camera/microphone: ${err.message}`);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  // Clean up effect
  useEffect(() => {
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
      mediaRecorder.current?.stream
        .getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  return { startRecording, stopRecording, recording, videoBlob, error };
};
