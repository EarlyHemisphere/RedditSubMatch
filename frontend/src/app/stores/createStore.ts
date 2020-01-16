import { History } from 'history';
import { RouterStore } from './RouterStore';
import { GlobalStateStore } from './GlobalStateStore';
import { STORE_ROUTER, GLOBAL_STATE, AUTH_STORE } from 'app/constants';

import AuthStore from './AuthStore';


/**
 * where stores are created, including the routerStore
 */

export function createStores(history: History) {
  const routerStore = new RouterStore(history);
  const globalStateStore = new GlobalStateStore();
  const authstore = new AuthStore();

  return {
    [STORE_ROUTER]: routerStore,
    [GLOBAL_STATE]: globalStateStore,
    [AUTH_STORE]: authstore,
  };
}
