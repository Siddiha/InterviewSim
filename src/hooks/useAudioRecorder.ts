import { useState, useRef, useEffect } from "react";

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    audioChunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.onerror = (event: any) => {
        setError(`Audio recording error: ${event.error.name}`);
        setRecording(false);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (err: any) {
      setError(`Error accessing microphone: ${err.message}`);
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

  return { startRecording, stopRecording, recording, audioBlob, error };
};
