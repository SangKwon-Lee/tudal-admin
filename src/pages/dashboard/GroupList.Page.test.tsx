import {
  render,
  waitForElementToBeRemoved,
  screen,
  fireEvent,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import GroupListPage from './GroupList.Page';
import 'src/setupTest';
import { debug } from 'console';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

// const scrollIntoViewMock = jest.fn();
// HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

function renderGroupList() {
  return render(
    <MemoryRouter>
      <GroupListPage />
    </MemoryRouter>,
  );
}

describe('Group List Page', () => {
  it('list rendering - render first element', async () => {
    const { getByTestId, getByText } = renderGroupList();
    await waitForElementToBeRemoved(() =>
      getByTestId('group-list-loading'),
    );
    expect(getByText(/목업/)).toBeTruthy();
  });
});

describe('Search Group List', () => {
  it('search rendeirng', async () => {
    // 1. 리스트를 그린다.
    const {
      getByTestId,
      getAllByRole,
      getByText,
      debug,
      findByText,
    } = renderGroupList();

    await waitForElementToBeRemoved(() =>
      getByTestId('group-list-loading'),
    );

    // 2. 그려진 리스트에서 검색 엘리먼트를 찾는다.
    // const searchInput = getByTestId('search-1231231');
    const searchInput = getAllByRole('textbox').filter(
      (element) => element.id === 'search',
    )[0];

    // 2.5 이벤트 체인지 벨류가 되는지 체크한다.
    // 3. 가져온 search 에 value 를 정해준다.
    expect(getByText(/목업/)).toBeTruthy();

    fireEvent.change(searchInput, { target: { value: '목업' } });

    // change 이벤트가 되고 나서 이유는 모르겠지만 dispatch 함수가 실행된다.
    // 증거 1. 일단 search 쪽에 value 가 잘 들어갔따
    // 증거 2. dispatch 가 실행되었다.
    // 증거 3. 결과값 예측이 맞았다.

    const test = await findByText(/목업/);
    const test4 = screen.queryByText(/모멘텀주/);
    const test2 = screen.queryByText(/기업실적 기대주/);
    const test3 = screen.queryByText(/반도체 슈퍼사이클/);

    console.log(test4);
    expect(test).toBeTruthy();
    expect(test2).toBeNull();
    expect(test3).toBeNull();
    expect(test4).toBeTruthy();
  });
});
