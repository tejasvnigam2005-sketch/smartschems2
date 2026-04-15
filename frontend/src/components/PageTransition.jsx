import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-fade-in');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('page-fade-out');
    }
  }, [location, displayLocation]);

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
