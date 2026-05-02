import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'VIVA Connect';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
};

export default usePageTitle;
