import { useState } from 'react';

export default function useSound() {
  //audios
  const [normalMove] = useState(new Audio('/sounds/move-self.mp3'));
  const [capture] = useState(new Audio('/sounds/capture.mp3'));
  const [castle] = useState(new Audio('/sounds/castle.mp3'));
  const [check] = useState(new Audio('/sounds/move-check.mp3'));
  const handleSoundEffects = (flag: string, inCheck: boolean) => {
    if (inCheck) {
      check.play();
      return;
    }
    if (flag == 'n' || flag == 'b' || flag == 'p' || flag == 'e') {
      normalMove.play();
      return;
    }
    if (flag == 'c') {
      capture.play();
      return;
    }
    if (flag == 'k' || flag == 'q') {
      castle.play();
      return;
    }
  };
  return { handleSoundEffects };
}
