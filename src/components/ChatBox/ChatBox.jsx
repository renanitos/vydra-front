import React, { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import "./ChatBox.scss";

const ChatBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`chat-box ${isExpanded ? "expanded" : ""}`}>
      <div className="header" onClick={handleToggle}>
        <span className="span" >Consultar IA</span>
        <HiSparkles className="icon" />
      </div>
      {isExpanded && (
        <iframe
          src="https://webchat.botframework.com/embed/vydra-bot?s=rcqQQTq-iEo.qreNH_uPHVKR0hmcNsRwJ0C7Bi3z5aohxnz4hsGLhMY"
          style={{ minWidth: "400px", width: "100%", minHeight: "500px" }}
          title="VydraBot"
        ></iframe>
      )}
    </div>
  );
};

export default ChatBox;
