import wait from '../../utils/wait';
import { User } from '../../types/user';
import { cmsServer } from '../axios';

class AuthApi {
  async login({ email, password }): Promise<any> {
    await wait(500);

    return new Promise(async (resolve, reject) => {
      try {
        // Find the user

        const response = await cmsServer.post('/auth/local', {
          identifier: email,
          password,
        });
        console.log('Response, ', response);
        const { jwt: accessToken, user } = response.data;
        resolve({ accessToken, user });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(userId): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        // Find the user
        const response = await cmsServer.get<User>(
          `/users/${userId}`,
        );
        const user = response.status === 200 ? response.data : null;

        if (!user) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve(user);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
