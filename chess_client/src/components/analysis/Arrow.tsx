import { useEffect, useState } from 'react';

interface ArrowProps {
  startCell: HTMLDivElement;
  endCell: HTMLDivElement;
  boardPos: { x: number; y: number };
}
interface NormalArrowProps {
  angleInDeg: number;
  length: number;
  cellWidth: number;
  tailPos: { x: number; y: number };
  tailHeight: number;
  startFrom?: 'center' | 'nearToEdge';
  onlyTail?: boolean;
}
interface KnightArrowProps {
  xLength: number;
  yLength: number;
  cellWidth: number;
  tailPos: { x: number; y: number };
  tailHeight: number;
}
export default function Arrow({ startCell, endCell, boardPos }: ArrowProps) {
  const [angleInDeg, setAngleInDeg] = useState(0);
  const [tailHeight, setTailHeight] = useState(0);
  const [startPos] = useState({
    x: startCell.getBoundingClientRect().left,
    y: startCell.getBoundingClientRect().top,
  });
  const [cellWidth, setCellWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [dimensionLength, setDimensionLength] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const dx =
      endCell.getBoundingClientRect().left -
      startCell.getBoundingClientRect().left;
    const dy =
      endCell.getBoundingClientRect().top -
      startCell.getBoundingClientRect().top;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    setDimensionLength({ x: dx, y: dy });
    setLength(Math.sqrt(dx ** 2 + dy ** 2));
    setAngleInDeg(angle);
    setCellWidth(startCell.clientWidth);
  }, [startCell, endCell, boardPos]);
  useEffect(() => {
    setTailHeight(cellWidth * 0.26);
  }, [cellWidth]);
  const isKnightArrow = () => {
    const startSquare = startCell.dataset.position;
    const endSquare = endCell.dataset.position;
    if (
      !startSquare ||
      !endSquare ||
      startSquare[0] === endSquare[0] ||
      startSquare[1] === endSquare[1]
    )
      return false;
    const cellDiff =
      Math.abs(startSquare.charCodeAt(0) - endSquare.charCodeAt(0)) +
      Math.abs(startSquare.charCodeAt(1) - endSquare.charCodeAt(1));
    return cellDiff == 3;
  };
  const renderArrow = () => {
    if (isKnightArrow())
      return (
        <KnightArrow
          xLength={dimensionLength.x}
          yLength={dimensionLength.y}
          cellWidth={cellWidth}
          tailHeight={tailHeight}
          tailPos={{ x: startPos.x - boardPos.x, y: startPos.y - boardPos.y }}
        />
      );
    return (
      <NormalArrow
        tailHeight={tailHeight}
        angleInDeg={angleInDeg}
        length={length - 0.2 * cellWidth}
        cellWidth={cellWidth}
        tailPos={{ x: startPos.x - boardPos.x, y: startPos.y - boardPos.y }}
      />
    );
  };
  return renderArrow();
}
function NormalArrow({
  angleInDeg,
  length,
  cellWidth,
  tailPos,
  startFrom = 'nearToEdge',
  onlyTail = false,
  tailHeight,
}: NormalArrowProps) {
  return (
    <div
      style={{
        transform: `rotate(${angleInDeg}deg) translateX(${startFrom === 'nearToEdge' ? 0.7 * cellWidth : 0.5 * cellWidth}px) translateY(calc(${0.5 * cellWidth}px - 50%))`,
        width: `${length}px`,
        top: `${tailPos.y}px`,
        left: `${tailPos.x}px`,
        transformOrigin: `${0.5 * cellWidth}px ${0.5 * cellWidth}px `,
      }}
      className={`pointer-events-none absolute  flex items-center z-40`}
    >
      <div
        className='Tail bg-[rgba(255,160,0,0.8)] flex-grow'
        style={{ height: `${tailHeight}px` }}
      ></div>
      {!onlyTail && (
        <div
          style={{
            borderWidth: `${cellWidth * 0.3}px 0 ${cellWidth * 0.3}px ${cellWidth * 0.4}px`,
          }}
          className='Head w-0 h-0 !border-t-transparent !border-b-transparent !border-l-[rgba(255,160,0,0.8)]'
        ></div>
      )}
    </div>
  );
}
function KnightArrow({
  xLength,
  yLength,
  tailPos,
  cellWidth,
  tailHeight,
}: KnightArrowProps) {
  const getFirstPartAngle = () => {
    if (Math.abs(xLength) > Math.abs(yLength)) {
      if (xLength > 0) return 0;
      return 180;
    }
    if (yLength > 0) return 90;
    return 270;
  };
  const getSecondPartAngle = () => {
    if (Math.abs(xLength) < Math.abs(yLength)) {
      if (xLength > 0) return 0;
      return 180;
    }
    if (yLength > 0) return 90;
    return 270;
  };
  const getFirsPartLength = () => {
    if (Math.abs(yLength) > Math.abs(xLength))
      return Math.abs(yLength) + tailHeight / 2 - 0.2 * cellWidth; //0.2 because , for startFrom=="nearToEdge" it has translateX equals 0.7 * cellWidth. So from middle 0.5, got difference 0.2
    return Math.abs(xLength) + tailHeight / 2 - 0.2 * cellWidth;
  };
  const getSecondPartLength = () => {
    if (Math.abs(yLength) < Math.abs(xLength))
      return Math.abs(yLength) - 0.2 * cellWidth;
    return Math.abs(xLength) - 0.2 * cellWidth;
  };
  const getSecondPartTailPos = () => {
    const newTailPos = { x: 0, y: 0 };
    if (Math.abs(xLength) > Math.abs(yLength)) {
      newTailPos.x = tailPos.x + xLength;
      newTailPos.y =
        yLength > 0 ? tailPos.y + tailHeight / 2 : tailPos.y - tailHeight / 2;
    } else {
      newTailPos.y = tailPos.y + yLength;
      newTailPos.x =
        xLength > 0 ? tailPos.x + tailHeight / 2 : tailPos.x - tailHeight / 2;
    }
    return newTailPos;
  };
  return (
    <div className='KnightArrow'>
      <NormalArrow
        tailHeight={tailHeight}
        angleInDeg={getFirstPartAngle()}
        length={getFirsPartLength()}
        cellWidth={cellWidth}
        tailPos={tailPos}
        onlyTail
      />
      <NormalArrow
        tailHeight={tailHeight}
        angleInDeg={getSecondPartAngle()}
        length={getSecondPartLength()}
        cellWidth={cellWidth}
        tailPos={getSecondPartTailPos()}
        startFrom='center'
      />
    </div>
  );
}
