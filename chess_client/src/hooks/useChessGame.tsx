import { BLACK, Color, Move, WHITE } from "chess.js";
import { useContext, useEffect, useState } from "react";
import useUpdateMove from "./useUpdateMove";
import { Winner } from "../types";
import { ChessGameContext } from "../context/ChessGameContext";
export default function useChessGame(){
  const {chess} = useContext(ChessGameContext)
  const [board, setBoard] = useState(chess.board());
  const [turn, setTurn] = useState(chess.turn());
  const { move, setMove, updateMove } = useUpdateMove();
  const [winner, setWinner] = useState<Winner>("d");
  const [isGameOver, setIsGameOver] = useState(false)
  const [isStalemate, setIsStalemate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [inCheck, setInCheck] = useState(false)
  
  //audios
  const [normalMove] = useState(new Audio("/sounds/move-self.mp3"))
  const [capture] = useState(new Audio("/sounds/capture.mp3"))
  const [castle] = useState(new Audio("/sounds/castle.mp3"))
  const [check] = useState(new Audio("/sounds/move-check.mp3"))
  const handleSoundEffects = (flag:string)=>{
    //library flags definition
    // const FLAGS: Record<string, string> = {
    //   NORMAL: 'n',
    //   CAPTURE: 'c',
    //   BIG_PAWN: 'b',
    //   EP_CAPTURE: 'e',
    //   PROMOTION: 'p',
    //   KSIDE_CASTLE: 'k',
    //   QSIDE_CASTLE: 'q',
    // }
    if(flag=="n" || flag=="b" || flag=="p" || flag=="e"){
      normalMove.play();
      return;
    }
    if(flag=="c"){
      capture.play();
      return;
    }
    if(flag=="k" || flag=="q"){
      castle.play();
      return;
    }
  }
  //check if the game is over and update the status based on its result
  const gameOverChecks=()=>{
    if(!chess.isGameOver())
        return
    setIsGameOver(true)
    if(chess.isCheckmate()){
        let wr:Color = chess.turn() == BLACK ? WHITE : BLACK;
        setWinner(wr);
        return;
    }
    if(chess.isStalemate()){
        setIsStalemate(true);
        setIsDraw(true)
        setWinner("d")
        return;
    }
    if(chess.isDraw()){
        //the draw is from three fold repetition or insufficient material or 50 move rule
        setIsDraw(true);
        setWinner("d")
        return;
    }
  }
  useEffect(() => {
    //if player has moved from one position to another, then attempt moving the move
    if (move.from && move.to) {
      try {
        let moveRes = chess.move(move);
        setBoard(chess.board());
        setTurn(chess.turn());
        if(chess.inCheck()){
            check.play()
            setInCheck(true)
        }
        else{
            handleSoundEffects(moveRes.flags)
            setInCheck(false)
        }
        gameOverChecks();
      } catch (e) {
        console.log('Invalid Move');
      } finally {
        setMove({ from: '', to: '' });
      }
    }
  }, [move]);
  return {board, turn, move, updateMove, winner, isGameOver, isStalemate, isDraw, inCheck}
}