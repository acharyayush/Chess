import { twMerge } from "tailwind-merge"

interface SwitchToggleProps{
    status?: boolean,
    onToggle: React.MouseEventHandler<HTMLElement>
}
//if status is undefined or true then enable it else disable 
export default function SwitchToggle({status, onToggle}:SwitchToggleProps){
    return <div className={twMerge("transition inline-block w-[55px] h-[30px] rounded-full", (status==undefined || status==true) ? "bg-blue-500": "bg-gray-800" )} onClick={onToggle}>
        <div className={twMerge("transition circle w-[30px] h-[30px] bg-white rounded-full shadow-lg", (status==undefined || status==true) ? "translate-x-[25px]": "translate-x-0" )}>
        </div>
    </div>
}