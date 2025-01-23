import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { Link, useRouterState } from '@tanstack/react-router';

const Navigation = () => {

  const {isSignedIn} = useAuth();

  const router = useRouterState();
  const showNavigation = router.location.pathname.includes('board')

  return (
    <nav style={{
      viewTransitionName:'navigation'
    }}
     className={ "flex items-center w-full h-16 p-2 text-white  z-50 "  + (showNavigation ? 'absolute bg-transparent' : 'bg-[#2C2421]')}>
      <ul className='flex gap-4'>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/lobby">Lobby</Link>
        </li>
      {!isSignedIn &&  <SignInButton /> }
      <UserButton />
      </ul>
    </nav>
  );
};

export default Navigation;