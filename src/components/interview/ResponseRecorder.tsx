import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface ResponseRecorderProps {
  questionId: string;
  onRecordingComplete: (recording: Blob | string) => void; // recording could be a Blob (audio/video) or string (text)
  loading?: boolean; // Added loading prop
  // Add props for recording type (audio, video, text)
}

export default function ResponseRecorder({
  questionId,
  onRecordingComplete,
  loading = false, // Initialize loading prop
}: ResponseRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    // This is a basic example for audio recording. Video would be similar.
    // Text responses would use a different approach (e.g., just manage a textarea's state).
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setRecordingData(audioBlob);
        onRecordingComplete(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // For text-based responses, you would just render a textarea here

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold">Record Response:</h4>
      <div className="mt-2 flex space-x-2">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {" "}
          {/* Assuming 'loading' prop is passed down if needed */}
          {isRecording ? "Stop Recording" : "Start Recording (Audio)"}
        </Button>
        {/* Add buttons for other recording types (video, text input) */}
        {/* {recordingData && ( */}
        {/*   <a href={URL.createObjectURL(recordingData)} download={`response-${questionId}.wav`}> */}
        {/*     Download Recording */}
        {/*   </a> */}
        {/* )} */}
      </div>
    </div>
  );
}
