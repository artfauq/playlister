import { useMemo } from 'react';

import useNextTranslate from 'next-translate/useTranslation';

export const useAppTranslation = (defaultNs?: string) => {
  const { lang, t: nextT } = useNextTranslate(defaultNs);

  const t = useMemo(() => nextT, [nextT]);

  return { t, lang };
};
