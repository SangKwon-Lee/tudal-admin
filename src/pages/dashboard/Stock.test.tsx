// 1. 리스트 렌더링

import {
  screen,
  render,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';

import Stock from './Stock';

describe('should have stock list and form modal', () => {
  it('should have stock list entity', async () => {
    const { getByText } = render(<Stock />);

    await waitForElementToBeRemoved(() => {
      screen.getByTestId('stock-list-loading');
    });

    expect(getByText('삼성전자')).toBeTruthy();
  });

  // 2. 폼 렌더링
  it('should open stock form dialog', () => {
    // click open stock form dialog
    const { getByText } = render(<Stock />);
    fireEvent.click(getByText('open')); // TODO

    expect(screen.getByTestId('stock-form-modal')).toBeTruthy();
  });
});

describe('should be able to search', () => {
  it('search', async () => {
    const { getByLabelText } = render(<Stock />);

    await waitForElementToBeRemoved(() => {
      screen.getByTestId('stock-list-loading');
    });

    // TODO ADD CHANGE EVENT
    // fireEvent(getByLabelText(/검색/), )

    await waitForElementToBeRemoved(() => {
      screen.getByTestId('stock-list-loading');
    });

    // TODO - check search outcomes
  });
});
// 3. 데이터 fetching

/**
 * 1. 해당 종목에 키워드 최신순 배치 - 클릭 시 가장 최근으로 업데이트
 * 2. 해당 종목에 키워드 추가 / 제거
 * 3. 해당 종목에 코멘트 등록 / 수정
 * 4. 해당 종목에 따른 기사 조회
 * 5. 해당 종목의 커스텀 기사 추가
 */

// 4. 기능 테스트
