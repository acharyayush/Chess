import { Color, WHITE } from "chess.js"
import ProfileImg from "./ProfileImg"

interface PlayerInfoProps{
  player: Color,
  name: string,
  rating: number
}
export default function PlayerInfo({player, name, rating}: PlayerInfoProps) {
  return (
    <div className="flex py-2 text-white">
        <div className="profileImg">
            <ProfileImg player={player}/>
        </div>
        <div className="details px-2">
            <div className="name font-bold">{name}<span className="font-normal">{` (${rating})`}</span></div>
            <div className="capturedPieces"></div>
        </div>
    </div>
  )
}