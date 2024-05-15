import { useEffect } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

export default useOutsideAlerter;
