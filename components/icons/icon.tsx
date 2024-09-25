import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

interface IconProps {
  icon: IconProp; // Font Awesome icon type
  color: string;
  size: SizeProp; // Predefined size strings from Font Awesome
}

export const Icon: React.FC<IconProps> = ({ icon, color, size }) => {
  return (
    <FontAwesomeIcon icon={icon} color={color} size={size} />
  );
};
