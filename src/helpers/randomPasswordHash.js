import { ssPost } from 'Utils/ssNetworkRequests';

async function randomPasswordHash() {
  const { data: passwordHash } = await ssPost('/auth/create-hash', {
    password: Math.random().toString(36).substr(2, 5)
  });
  return passwordHash;
}

export default randomPasswordHash;
