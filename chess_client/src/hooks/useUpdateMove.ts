import { useContext, useState } from 'react';
import { Move, updateMoveType } from '../types';
import { ChessGameContext } from '../context/ChessGameContext';
import { Chess, PAWN, Square, WHITE } from 'chess.js';

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
        let moves = chess.moves({ square: position }).map((move) => {
          if (move[move.length - 1] >= '1' && move[move.length - 1] <= '8') {
            return move.slice(-2) as Square;
          }
          console.log(move);
          //castle moves
          if (move == 'O-O') {
            if (turn == WHITE) return 'g1';
            return 'g8';
          }
          if (move == 'O-O-O') {
            if (turn == WHITE) return 'c1';
            return 'c8';
          }
          //if move is something like d8=Q, d8=R
          if (move.slice(-2, -1) == '=') {
            return move.slice(0, 2) as Square;
          }
          //if move is something like Nf7+ then take f7 only
          return move.slice(-3, -1) as Square;
        });
        console.log(chess.moves({ square: position }));
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
      console.log('promotion: I am here');
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
