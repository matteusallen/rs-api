import { User } from 'Models';
const DataLoader = require('dataloader');

const userCache = {
  user: new DataLoader(keys => {
    return Promise.all(
      keys.map(key => {
        const { id } = JSON.parse(key);
        return User.getUser({ id });
      })
    );
  })
};

export default userCache;
