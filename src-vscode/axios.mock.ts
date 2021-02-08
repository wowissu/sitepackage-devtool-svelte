
// import * as mockCommonData from './mock.json';
import MockAdapter from 'axios-mock-adapter';
import type { BackstageApi } from './axios';
import mockCommonData from './mock.json';

export function useMock(api: BackstageApi) {

  const mock = new MockAdapter(api.axios);

  mock.onPost(api.url.GetCommonData).reply(200, mockCommonData);

  mock.onAny().passThrough();
}