import { getAuth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from 'vinxi/http';

export const getSignedInUserId = createServerFn({
  method: 'GET',
}).handler(async () => {
  const user = await getAuth(getWebRequest());
  return user?.userId;
});
