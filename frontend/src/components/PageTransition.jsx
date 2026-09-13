import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-fade-in');

  if (location.pathname !== displayLocation.pathname && transitionStage !== 'page-fade-out') {
    setTransitionStage('page-fade-out');
  }

  const handleAnimationEnd = () => {
    if (transitionStage === 'page-fade-out') {
      setDisplayLocation(location);
      setTransitionStage('page-fade-in');
    }
  };

  return (
    <div
      className={transitionStage}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
