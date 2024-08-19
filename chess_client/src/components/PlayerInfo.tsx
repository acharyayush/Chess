import { BLACK, Color, WHITE } from 'chess.js';
import { v4 as uuidv4 } from 'uuid';
import ProfileImg from './shared/ProfileImg';
import { capturedPiecesAndNumberType } from '../types';
import { twMerge } from 'tailwind-merge';

interface PlayerInfoProps {
  color: Color;
  name: string;
  rating: number;
  capturedPieces: capturedPiecesAndNumberType;
  score: number;
  className?: string;
}
export default function PlayerInfo({
  color,
  name,
  rating,
  capturedPieces,
  score,
  className,
}: PlayerInfoProps) {
  const pieceWidth = 24;

  const renderCapturedPieces = () => {
    //calculate the exact width of each group after overlapping parts of piece in each group,
    //then calculate the total width of groups, (render the pieces in the process)

    const capturedPiecesGroups: JSX.Element[] = [];
    let groupsWidth = 0;
    for (const [piece, count] of Object.entries(capturedPieces)) {
      let numberOfCaptures = count;
      if (numberOfCaptures <= 0) continue;
      const group: JSX.Element[] = [];
      let captureOfSimilarPiece = 0;
      let groupWidth = 0;
      while (numberOfCaptures--) {
        groupWidth = (captureOfSimilarPiece * pieceWidth) / 3;
        const pieceImgElement = (
          <img
            style={{
              width: pieceWidth + 'px',
              left: groupWidth + 'px',
            }}
            key={uuidv4()}
            className={`absolute top-[0]`}
            src={`/pieces/${color === WHITE ? 'b' : 'w'}${piece}.svg`}
            alt=''
          />
        );
        group.push(pieceImgElement);
        captureOfSimilarPiece++;
      }
      groupWidth += pieceWidth;
      groupsWidth += groupWidth;
      capturedPiecesGroups.push(
        <div
          key={uuidv4()}
          style={{
            width: groupWidth + 5 + 'px',
            height: pieceWidth + 'px',
          }}
          className={`group relative left-0`}
        >
          {group}
        </div>
      );
    }
    return (
      <div className='groups flex' style={{ width: groupsWidth + 'px' }}>
        {capturedPiecesGroups}
      </div>
    );
  };
  const renderScore = () => {
    if (score > 0 && color == WHITE) {
      return <>+{score}</>;
    }
    if (score < 0 && color == BLACK) {
      return <>+{-score}</>;
    }
  };
  return (
    <div className={twMerge('flex text-white', className)}>
      <div className='profileImg'>
        <ProfileImg color={color} />
      </div>
      <div className='details px-2'>
        <div className='name font-bold'>
          {name}
          <span className='font-normal'>{` (${rating})`}</span>
        </div>
        <div className='flex' style={{ height: pieceWidth + 'px' }}>
          <div className='capturedPieces'>{renderCapturedPieces()}</div>
          <div className='score ml-2 text-gray-100'>{renderScore()}</div>
        </div>
      </div>
    </div>
  );
}
