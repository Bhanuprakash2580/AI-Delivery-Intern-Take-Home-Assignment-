import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

const CallInterface = ({ status, speaker, volume, onToggleCall }) => {
  const isConnecting = status === 'connecting';
  const isActive = status === 'active';

  const renderVolumeIndicator = () => {
    if (speaker !== 'bot') return null;
    const bars = Array.from({ length: 5 }).map((_, i) => {
      const height = Math.max(4, Math.min(24, (volume * 24) * (0.5 + Math.random() * 0.5)));
      return <div key={i} className="bar" style={{ height: `${height}px` }} />;
    });
    return <div className="volume-indicator">{bars}</div>;
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isActive) {
      if (speaker === 'bot') return 'Maya is speaking...';
      if (speaker === 'user') return 'Listening...';
      return 'Call Active';
    }
    return 'Ready to Call';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div className="status-pill">
        <div className={`status-dot ${isConnecting ? 'connecting' : isActive ? 'active' : ''}`}></div>
        <span>{getStatusText()}</span>
        {renderVolumeIndicator()}
      </div>

      <div className={`call-button-container ${isConnecting ? 'connecting' : isActive ? 'active' : ''}`}>
        <div className="ripple"></div>
        <button 
          className={`call-button ${isActive ? 'active' : ''}`} 
          onClick={onToggleCall}
          disabled={isConnecting}
          aria-label={isActive ? "End Call" : "Start Call"}
        >
          {isActive ? <PhoneOff size={36} strokeWidth={2.5} /> : <Phone size={36} strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
};

export default CallInterface;
