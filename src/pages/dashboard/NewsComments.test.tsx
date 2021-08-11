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
import { News } from 'src/fixtures';
import NewsComment from './NewsComments';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

const handlers = [
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/general-news`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(News.list));
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

test('load and display loading', async () => {
  const { container } = renderNews();

  await waitFor(() => screen.getByTestId('news-list-table'));
  expect(container).toHaveTextContent('로이터');
});
