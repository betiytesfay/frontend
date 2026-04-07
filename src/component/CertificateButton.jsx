// src/components/CertificateButton.jsx
import { useNavigate } from 'react-router-dom';

export function CertificateButton({ to = '/certificate-status', className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`bg-[#D4AF35] text-black flex items-center justify-center px-4 py-2 rounded hover:bg-yellow-600 transition ${className}`}
    >
      Certificate Status
    </button>
  );
}