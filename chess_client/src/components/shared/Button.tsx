import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";
interface ButtonProps{
    children: React.ReactNode,
    isDisable?: boolean,
    className?: string,
    navigateTo?: string,
    onClick?: ()=>void,
    noShadow?: boolean,
    allowModal?: boolean,
    modalTitle?: string,
}

export default function Button({children, isDisable, onClick, className, navigateTo, noShadow, allowModal, modalTitle}: ButtonProps) {
  const [openModal, setOpenModal] = useState(false);
  const handleButtonClick = ()=>{
    if(allowModal)
        setOpenModal(true)
    else
      onClick?.();
  }
  const renderButton = ()=>{
    if (!navigateTo){
      return <button disabled={isDisable} style={!noShadow ? {boxShadow: "0 0.4rem 0.1rem rgba(0, 18, 47, 0.5)"} : {}} onClick={handleButtonClick} className={twMerge(`inline-block bg-blue-500 py-4 px-16 rounded-xl text-3xl font-bold text-white m-2`, className)}>
      {children}
    </button>;
    }
    return <Link style={!noShadow ? {boxShadow: "0 0.4rem 0.1rem rgba(0, 18, 47, 0.5)"} : {}} to={navigateTo} className={twMerge(`inline-block bg-blue-500 py-4 px-16 rounded-xl text-3xl font-bold text-white m-2`, className)}>
      {children}
    </Link>;
  }
  return <>
    {renderButton()}
    {allowModal && <Modal
        isOpen={openModal}
        closeModal={() => {setOpenModal(false)}}
        submitVal={"Resign"}
        onSubmit={()=>{
          onClick?.()
        }}
      >
        <h1 className="mt-4 text-center text-2xl font-bold sm:text-[1.35rem] sm:leading-[1.85rem] xsm:text-xl">
          {modalTitle}
        </h1>
      </Modal>}
  </>
  
}
