// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  FixtureCategory,
  FixtureNews,
  FixtureStocks,
  FixtureTags,
} from 'src/fixtures';

const handlers = [
  rest.get(
    `${process.env.REACT_APP_API_URL}/stocks/stkNmCd`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureStocks.list));
    },
  ),

  rest.get(
    `${process.env.REACT_APP_CMS_URL}/general-news`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureNews.list));
    },
  ),

  rest.get(
    `${process.env.REACT_APP_CMS_URL}/tags-excluded`,
    (req, res, ctx) => {
      const query = req.url.searchParams;
      const name = query.get('_where[name]');
      if (name === '문재인') {
        return res(
          ctx.status(200),
          ctx.json(FixtureTags.searchResponse),
        );
      }
    },
  ),
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/tags`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureTags.list));
    },
  ),
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/categories`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureCategory.list));
    },
  ),
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/stocks/detail`,
    (req, res, ctx) => {
      const query = req.url.searchParams;
      const start = query.get('_start');

      const response =
        start === '0'
          ? FixtureStocks.summaries
          : FixtureStocks.summary_next;
      return res(ctx.status(200), ctx.json(response));
    },
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
