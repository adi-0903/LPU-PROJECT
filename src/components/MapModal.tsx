import React from 'react';
import { Place } from '../types';
import { CampusMapNavigator } from './CampusMapNavigator';

interface MapModalProps {
  place: Place | null;
  visible: boolean;
  onClose: () => void;
  onAskSenior?: (message: string) => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  place,
  visible,
  onClose,
  onAskSenior,
}) => {
  return (
    <CampusMapNavigator
      visible={visible}
      initialDestinationId={place ? place.block || place.name : undefined}
      onClose={onClose}
      onAskSenior={onAskSenior}
    />
  );
};
