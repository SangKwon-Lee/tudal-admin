import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  getByTestId,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Route, MemoryRouter } from 'react-router-dom';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FixtureNews } from 'src/fixtures';
import NewsComment from './News';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

const handlers = [
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/general-news`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureNews.list));
    },
  ),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderNews() {
  return render(
    <MemoryRouter>
      <NewsComment />
    </MemoryRouter>,
  );
}

describe('news-comment conatiner', () => {
  it('should render data after asynchronous API call', async () => {
    const { container } = renderNews();
    await waitForElementToBeRemoved(() =>
      screen.getByTestId('news-list-loading'),
    );
    expect(container).toHaveTextContent('로이터');
  });

  it('changes input of search box', async () => {
    const { getAllByRole } = renderNews();
    await waitForElementToBeRemoved(() =>
      screen.getByTestId('news-list-loading'),
    );

    const searchInput = getAllByRole('textbox').filter(
      (element) => element.id === '_q',
    )[0];

    fireEvent.change(searchInput, {
      target: { value: '검색 테스트' },
    });
    expect(screen.getByDisplayValue('검색 테스트')).toBeTruthy();
  });
});
