import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
