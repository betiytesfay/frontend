import { useNavigate } from 'react-router-dom';

export function BackButton({ to = null, label = '← ', className = '', onClick = null }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      // If the parent sends a custom click (like password check)
      onClick();
      return;
    }

    if (to) {
      navigate(to, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-[#D4AF35] text-black flex items-center justify-center w-18 px-3 py-2 rounded hover:bg-yellow-600 transition ${className}`}
    >
      {label}
    </button>
  );
}
