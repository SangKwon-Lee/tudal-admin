import {
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Stock from './Stock';
import { Route, MemoryRouter } from 'react-router-dom';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

function renderStock() {
  return render(
    <MemoryRouter>
      <Stock />
    </MemoryRouter>,
  );
}

describe('should have stock list and form modal', () => {
  it('should have stock list entity', async () => {
    const { getByTestId, debug } = renderStock();

    expect(getByTestId('stock-list-loading')).toBeTruthy();
    await waitForElementToBeRemoved(() =>
      getByTestId('stock-list-loading'),
    );

    expect(getByTestId('stock-list')).toBeTruthy();
  });

  // 2. 폼 렌더링
  //   it('should open stock form dialog', () => {
  //     // click open stock form dialog
  //     const { getByText } = render(<Stock />);
  //     fireEvent.click(getByText('open')); // TODO

  //     expect(screen.getByTestId('stock-form-modal')).toBeTruthy();
  //   });
  // });

  // describe('should be able to search', () => {
  //   it('search', async () => {
  //     const { getByLabelText } = render(<Stock />);

  //     await waitForElementToBeRemoved(() => {
  //       screen.getByTestId('stock-list-loading');
  //     });

  //     // TODO ADD CHANGE EVENT
  //     // fireEvent(getByLabelText(/검색/), )

  //     await waitForElementToBeRemoved(() => {
  //       screen.getByTestId('stock-list-loading');
  //     });

  //     // TODO - check search outcomes
  //   });
});

// 4. 기능 테스트
