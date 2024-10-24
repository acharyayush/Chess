import { useDispatch } from 'react-redux';
import { setShowLegalMoves } from '../../state/chess/chessSlice';
import SwitchToggle from '../shared/SwitchToggle';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
interface LocalSettingsProps {
  children?: React.ReactNode;
}
export default function LocalSettings({ children }: LocalSettingsProps) {
  const dispatch = useDispatch();
  const { showLegalMoves } = useSelector((state: RootState) => state.chess);
  return (
    <div className='localSettings text-lg text-white pl-2 pr-8 xsm:pr-2'>
      <div className='showLegalMoves flex items-center justify-between'>
        <span className=''>Show Legal Moves</span>
        <span className='flex items-center'>
          <SwitchToggle
            status={showLegalMoves}
            onToggle={() => dispatch(setShowLegalMoves(!showLegalMoves))}
          />
        </span>
      </div>
      {children}
    </div>
  );
}
