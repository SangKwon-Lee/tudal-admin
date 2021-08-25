import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Stock from './Stock';
import 'src/setupTest';

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
    const { getByTestId, getByText, debug } = renderStock();

    await waitForElementToBeRemoved(() =>
      getByTestId('stock-list-loading'),
    );

    expect(getByTestId('stock-list-table')).toBeInTheDocument();
  });

  it('should open form modal', async () => {
    const { getByTestId, getAllByText } = renderStock();

    await waitForElementToBeRemoved(() =>
      getByTestId('stock-list-loading'),
    );

    const openDetailButtons = getAllByText(/수정/);

    fireEvent.click(openDetailButtons[0]);

    expect(getByTestId('stock-form-modal')).toBeInTheDocument();
  });
});
