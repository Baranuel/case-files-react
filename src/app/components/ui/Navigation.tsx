import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from './Button';

const Navigation = () => {

  const {isSignedIn} = useAuth();

  const router = useRouterState();
  const showNavigation = router.location.pathname.includes('board')

  return (
    <nav style={{
      viewTransitionName:'navigation'
    }}
     className={ "flex items-center w-full h-16 p-2 text-white  z-50 px-4 "  + (showNavigation ? 'absolute bg-transparent' : 'bg-[#2C2421]')}>
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
          <Button variant='primary' className=''>Lobby</Button>
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