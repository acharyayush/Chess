import { useNavigate } from 'react-router-dom';
import Card from '../components/shared/Card';
import { useDispatch } from 'react-redux';
import { setPlayers, setPlayersLogoUrl } from '../state/players/playerSlice';
import { setBotDepth } from '../state/chess/chessSlice';

export default function AILevelSelect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className='bg-slate-400 min-h-screen flex justify-center items-center'>
      <div className='container select-none'>
        <h1
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
          className='text-5xl lg:text-4xl xsm:text-3xl font-bold leading-[60px] text-white text-center mb-16'
        >
          Choose Difficulty Level
        </h1>
        <div className='CardContainer container flex justify-evenly gap-4 flex-wrap mb-10'>
          <Card
            className='Bob'
            imgUrl='/images/bots/bob.svg'
            textOnImg='Bob'
            title='Beginner'
            onClick={() => {
              dispatch(setPlayers({ player1: 'White', player2: 'Bob' }));
              dispatch(
                setPlayersLogoUrl({
                  player1LogoUrl: '',
                  player2LogoUrl: '/images/bots/bob.svg',
                })
              );
              dispatch(setBotDepth(2));
              navigate('/play/ai');
            }}
          />
          <Card
            className='kukudo'
            imgUrl='/images/bots/kukudo.svg'
            textOnImg='Kukudo'
            title='Intermediate'
            onClick={() => {
              dispatch(setPlayers({ player1: 'White', player2: 'Kukudo' }));
              dispatch(
                setPlayersLogoUrl({
                  player1LogoUrl: '',
                  player2LogoUrl: '/images/bots/kukudo.svg',
                })
              );
              dispatch(setBotDepth(3));
              navigate('/play/ai');
            }}
          />
          <Card
            className='Professor'
            imgUrl='/images/bots/professor.svg'
            textOnImg='Professor'
            title='Advanced'
            onClick={() => {
              dispatch(setPlayers({ player1: 'White', player2: 'Professor' }));
              dispatch(
                setPlayersLogoUrl({
                  player1LogoUrl: '',
                  player2LogoUrl: '/images/bots/professor.svg',
                })
              );
              dispatch(setBotDepth(4));
              navigate('/play/ai');
            }}
          />
        </div>
      </div>
    </div>
  );
}
