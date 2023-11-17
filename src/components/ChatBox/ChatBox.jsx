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
          src="https://webchat.botframework.com/embed/tcc-chat-bot?s=24Pzf1orjYE._2Rne-VzQi1wS2I3whI5Vgy2U1E3UKUbdtamiSnUS00"
          style={{ minWidth: "400px", width: "100%", minHeight: "500px" }}
          title="ChatBot"
        ></iframe>
      )}
    </div>
  );
};

export default ChatBox;
