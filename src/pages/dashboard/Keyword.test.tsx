import {
  screen,
  fireEvent,
  waitFor,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Keyword from './Keyword';
import 'src/setupTest';
import userEvent from '@testing-library/user-event';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

function renderKeyword() {
  return render(
    <MemoryRouter>
      <Keyword />
    </MemoryRouter>,
  );
}
// mocking scrollintoview
window.HTMLElement.prototype.scrollIntoView = function () {};

describe('should have keyword list and form modal', () => {
  it('should have keyword list entity', async () => {
    const { getByTestId } = renderKeyword();

    await waitForElementToBeRemoved(() =>
      getByTestId('keyword-list-loading'),
    );

    expect(getByTestId('keyword-list-table')).toBeInTheDocument();
  });

  it('search properly', async () => {
    const {
      getAllByRole,
      getByDisplayValue,
      getByTestId,
      getAllByDisplayValue,
      getByLabelText,
    } = renderKeyword();

    await waitForElementToBeRemoved(() =>
      getByTestId('keyword-list-loading'),
    );

    const searchInput = getAllByRole('textbox').filter(
      (element) => element.id === 'search',
    )[0];

    fireEvent.change(searchInput, {
      target: { value: '문재인' },
    });

    await waitFor(() => console.log('debounce'), { timeout: 300 }); // But will get called within 350ms
    const foo = true;
    await new Promise((r) => setTimeout(r, 2000));
    expect(foo).toBeDefined();

    await expect(
      waitFor(() => getByTestId('keyword-list-loading')),
    ).toBeTruthy();

    expect(screen.getByDisplayValue('문재인')).toBeTruthy();

    // await waitForElementToBeRemoved(() =>
    //   getByTestId('keyword-list-loading'),
    // );
  });
});
