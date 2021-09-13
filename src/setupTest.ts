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

const stockHandlers = [
  rest.get(
    `${process.env.REACT_APP_API_URL}/stocks/stkNmCd`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureStocks.list));
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
  rest.post(
    `${process.env.REACT_APP_CMS_URL}/stocks/code/:stockcode/tag`,
    (req, res, ctx) => {
      const tagName = req.body['tagName'];
      const code = req.params.stockcode;
      const result = tagName && code ? 'true' : 'false';
      return res(ctx.status(200), ctx.text(result));
    },
  ),

  rest.delete(
    `${process.env.REACT_APP_CMS_URL}/stocks/code/:code/tag/:tagId`,
    (req, res, ctx) => {
      const { code, tagId } = req.params;
      const result = tagId && code ? 'true' : 'false';
      return res(ctx.status(200), ctx.text(result));
    },
  ),
];

const newHandler = [
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/general-news`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureNews.list));
    },
  ),
  rest.post(
    `${process.env.REACT_APP_CMS_URL}/general-news`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ news: { id: 1 } }));
    },
  ),

  rest.post(
    `${process.env.REACT_APP_CMS_URL}/stock-news-original`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    },
  ),

  rest.post(
    `${process.env.REACT_APP_CMS_URL}/general-news/custom`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    },
  ),
];

const tagHandler = [
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/tags-excluded`,
    (req, res, ctx) => {
      const query = req.url.searchParams;
      const name = query.get('_where[name]');
      if (name) {
        return res(
          ctx.status(200),
          ctx.json(FixtureTags.searchResponse(name)),
        );
      }
    },
  ),

  rest.get(
    `${process.env.REACT_APP_CMS_URL}/tags`,
    (req, res, ctx) => {
      const search = req.url.searchParams.get('_q');
      if (search) {
        const result = FixtureTags.list.filter((tag) =>
          tag.name.includes(search),
        );
        return res(ctx.status(200), ctx.json(result));
      }

      return res(ctx.status(200), ctx.json(FixtureTags.list));
    },
  ),
];

const categoryHandler = [
  rest.get(
    `${process.env.REACT_APP_CMS_URL}/categories`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(FixtureCategory.list));
    },
  ),
];

const server = setupServer(
  ...stockHandlers,
  ...newHandler,
  ...tagHandler,
  ...categoryHandler,
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
