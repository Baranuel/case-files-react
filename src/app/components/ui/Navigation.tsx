import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from './Button';
import { ZeroSchema } from '@/schema';
import { useQuery, useZero } from '@rocicorp/zero/react';
const Navigation = () => {

  const {isSignedIn, userId} = useAuth();
  const z = useZero<ZeroSchema>();

  const [pendingCollaborations] = useQuery(
    z.query.collaboration.where(q => q.and(
      q.cmp('status', '=', 'pending'),
      q.cmp('boardCreatorId', '=', userId!),
    ))
  );
  
  const router = useRouterState();
  const showNavigation = router.location.pathname.includes('board')

  return (
    <nav 
     className={ "flex items-center w-full h-16 p-2 text-white  z-50 px-4  bg-[#2C2421] border-b border-[#3C3431]"}
     style={{
      viewTransitionName:'navigation'
     }}
     >
      <ul className='flex gap-4 justify-between w-full'>
        <li className='flex items-center gap-2 text-amber-100 font-bold text-2xl'>
          <Link className='flex items-center gap-3' to="/">
          <img src="/casefiles-logo.png" alt="Casefiles" className='w-8 h-8' />
          <span className='text-2xl'>Casefiles</span>
          </Link>
        </li>
        
        <div className='flex gap-4 items-center'>
        <li>
          <Link to="/lobby">
          <Button variant='primary' className='relative'><span>Lobby</span> 
          {pendingCollaborations && pendingCollaborations.length > 0 && router.location.pathname !== '/lobby' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {pendingCollaborations.length}
                </span>
              </div>
            )}
          </Button>
          </Link>
        </li>
        <hr className='h-[80%] border-l border-white' />
      {!isSignedIn &&  <SignInButton /> }
      <UserButton />
        </div>
      </ul>
    </nav>
  );
};

export default Navigation;