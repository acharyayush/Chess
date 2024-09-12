import { useState } from 'react';

export default function useSound() {
  //audios
  const [normalMove] = useState(new Audio('/sounds/move-self.mp3'));
  const [promote] = useState(new Audio('/sounds/promote.mp3'));
  const [capture] = useState(new Audio('/sounds/capture.mp3'));
  const [castle] = useState(new Audio('/sounds/castle.mp3'));
  const [check] = useState(new Audio('/sounds/move-check.mp3'));
  const [game_end] = useState(new Audio('/sounds/game-end.mp3'));
  const handleSoundEffects = (
    flag: string,
    inCheck: boolean,
    isGameOver: boolean
  ) => {
    if (isGameOver) game_end.play();
    if (inCheck) check.play();
    else if (flag.includes('p')) promote.play();
    else if (flag == 'n' || flag == 'e' || flag == 'b') normalMove.play();
    else if (flag == 'c') capture.play();
    else if (flag == 'k' || flag == 'q') castle.play();
  };
  return { handleSoundEffects };
}
