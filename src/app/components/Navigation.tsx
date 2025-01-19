import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';

const Navigation = () => {

  const {isSignedIn} = useAuth();
  return (
    <nav className="flex items-center w-full h-16 p-2 text-white bg-[#2C2421]">
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