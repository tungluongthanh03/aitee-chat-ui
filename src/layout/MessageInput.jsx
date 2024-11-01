import React, { useState } from 'react';

function MessageInput({socket}) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    socket.emit('sendMessage', {
      sendFrom: 'user1',
      sendTo: 'user2',
      text: 'Hello!'
    });
    
    // Send message logic
    setMessage('');
  };

  return (
    <div className="message-input">
      <input
        type="text"
        className="input"
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSendMessage}
        className="send-button"
      >
        <img src="/path-to-send-icon" alt="Send" className="send-icon" />
      </button>
    </div>
  );
};

export default MessageInput;