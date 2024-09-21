import { toast, TypeOptions } from 'react-toastify';
const showToast = (type: TypeOptions, message: string, time?: number) => {
  return toast(message, {
    type,
    position: 'top-right',
    autoClose: time || 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    progressClassName:
      type == 'error' ? 'errorProgressBar' : 'successProgressBar',
    className: type == 'error' ? 'errorToast' : 'successToast',
  });
};
export default showToast;
