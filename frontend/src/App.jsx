import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import CallInterface from './components/CallInterface';

// IMPORTANT: Replace these with your actual Vapi keys
const VAPI_PUBLIC_KEY = 'b11867c2-20b8-4cdf-a9d1-ff3db2eb2ec9'; 
const ASSISTANT_ID = 'f52ce34f-f506-4566-a4cf-f3900ce6e84e'; 

function App() {
  const vapiRef = useRef(null);
  const [callStatus, setCallStatus] = useState('inactive');
  const [activeSpeaker, setActiveSpeaker] = useState('none');
  const [transcript, setTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    // Initialize Vapi instance - handle different export patterns
    const VapiClass = Vapi?.default || Vapi;
    const vapi = new VapiClass(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;
    vapi.on('call-start', () => {
      setCallStatus('active');
      setTranscript('Connected. Say hello to Maya!');
    });

    vapi.on('call-end', () => {
      setCallStatus('inactive');
      setActiveSpeaker('none');
      setTranscript('Call ended.');
      setVolumeLevel(0);
    });

    vapi.on('speech-start', () => setActiveSpeaker('bot'));
    vapi.on('speech-end', () => setActiveSpeaker('none'));
    vapi.on('volume-level', (level) => setVolumeLevel(level));

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
         setTranscript(message.transcript);
      }
    });

    vapi.on('error', (e) => {
      console.error(e);
      setCallStatus('inactive');
      setTranscript('Error connecting to Maya.');
    });

    return () => vapi.removeAllListeners();
  }, []);

  const toggleCall = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    
    if (callStatus === 'active' || callStatus === 'connecting') {
      vapi.stop();
      setCallStatus('inactive');
    } else {
      setCallStatus('connecting');
      setTranscript('Connecting to Maya...');
      try {
        await vapi.start(ASSISTANT_ID);
      } catch (err) {
        console.error("Failed to start call:", err);
        setCallStatus('inactive');
        setTranscript('Failed to connect. Check console.');
      }
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <div className="header">
          <h1>Kapture Finance</h1>
          <p>AI Collections Assistant</p>
        </div>

        <CallInterface 
          status={callStatus} 
          speaker={activeSpeaker}
          volume={volumeLevel}
          onToggleCall={toggleCall} 
        />

        <div className={`transcript-area ${!transcript ? 'placeholder' : ''}`}>
          {transcript || "Ready to connect. Click the button to start."}
        </div>
      </div>
    </div>
  );
}

export default App;
