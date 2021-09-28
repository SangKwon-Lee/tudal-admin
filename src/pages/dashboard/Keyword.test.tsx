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

  it('search - find properly', async () => {
    const { getAllByRole, getByTestId, getByDisplayValue } =
      renderKeyword();

    await waitForElementToBeRemoved(() =>
      getByTestId('keyword-list-loading'),
    );

    const searchInput = getAllByRole('textbox').filter(
      (element) => element.id === 'search',
    )[0];

    fireEvent.change(searchInput, {
      target: { value: '문재인' },
    });

    await waitFor(() => getByTestId('keyword-list-loading'));
    await waitForElementToBeRemoved(() =>
      getByTestId('keyword-list-loading'),
    );

    expect(getByDisplayValue('문재인')).toBeTruthy();
  });

  it('search - not exists', async () => {
    const { getAllByRole, getByTestId } = renderKeyword();

    await waitForElementToBeRemoved(() =>
      getByTestId('keyword-list-loading'),
    );

    const searchInput = getAllByRole('textbox').filter(
      (element) => element.id === 'search',
    )[0];

    fireEvent.change(searchInput, {
      target: { value: '레바논이라크' },
    });

    await waitFor(() => getByTestId('keyword-list-loading'));
    await waitForElementToBeRemoved(() =>
      getByTestId('keyword-list-loading'),
    );
  });
});
