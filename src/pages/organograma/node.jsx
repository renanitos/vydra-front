import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import React, { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { HiOutlineEllipsisVertical } from 'react-icons/hi2';

import './node.styles.scss';

const Node = ({ label, teamMembers, children, setSelectedTeam, setDialogOpen  }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChildren = () => {
    setIsOpen(!isOpen);
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  return (
    <div className="node">
      <div className="label" onClick={toggleChildren}>
        <div className="team-info">
          <span className="team-name">{label.name}</span>
          <HiChevronDown className={`arrow ${isOpen ? 'open' : ''}`} />
        </div>
        <div className="team-members">
          <AvatarGroup max={3}>
            {teamMembers.map((member) => {
              const initials = `${member.first_name.charAt(0).toUpperCase()}${member.last_name.charAt(0).toUpperCase()}`;
              return (
                <Avatar
                  key={member.id}
                  style={{ width: '30px', height: '30px', backgroundColor: '#5A81FA' }}
                >
                  {initials}
                </Avatar>
              );
            })}
          </AvatarGroup>
          <HiOutlineEllipsisVertical className="ellipsis-icon" onClick={() => handleTeamClick(label)} /> 
        </div>
      </div>
      {isOpen && (
        <>
          <div className="children">{children}</div>
        </>
      )}
    </div>
  );
};

export default Node;