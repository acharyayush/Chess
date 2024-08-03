import { useContext, useState } from 'react';
import { Move, updateMoveType } from '../types';
import { ChessGameContext } from '../context/ChessGameContext';
import { Chess, PAWN, Square} from 'chess.js';
import extractPosition from '../utils/extractPosition';
export default function useUpdateMove() {
  const [move, setMove] = useState<Move>({
    from: '',
    to: '',
  });
  const { chess, showLegalMoves, setLegalMoves } = useContext(ChessGameContext);
  const { promotion, setPromotion, setShowPromotionOption } =
    useContext(ChessGameContext);
  const isValidMove = (move: Move) => {
    let temp = new Chess(chess.fen());
    try {
      //just to check if move is valid, queen is taken as promotion sample
      temp.move({ ...move, promotion: 'q' });
      return true;
    } catch (e) {
      //Tried to promote but move is not valid
      return false;
    }
  };
  const updateMove: updateMoveType = (cell, turn, position) => {
    //to update 'from' the selected piece must belong to active player
    //UPDATE FROM
    if (turn == cell?.color) {
      setMove({ from: cell.square, to: '' });
      if (showLegalMoves) {
        let moves = chess.moves({ square: position }).map((move)=>extractPosition(move, turn));
        setLegalMoves(moves);
      }
      return;
    }

    //UPDATE TO
    setLegalMoves([]);
    let moveToSet = { ...move, to: position };
    //promotion logic
    //if updateMove is called after promotion piece is selected then go for promotion
    if (promotion) {
      setMove({ ...moveToSet, promotion });
      setPromotion(null);
      setShowPromotionOption({ canShow: false });
      return;
    }
    //if promotion piece is yet to select
    if (position[1] == '1' || position[1] == '8') {
      let pieceToMove = chess.get(moveToSet.from as Square).type;
      //if piece to promote is pawn and this move is valid then show promotion option
      if (pieceToMove == PAWN && isValidMove(moveToSet)) {
        setShowPromotionOption({ canShow: true, position: position });
        return;
      }
    }
    //Normal game move
    setMove(moveToSet);
  };
  return { move, setMove, updateMove };
}
