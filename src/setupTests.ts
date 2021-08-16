// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
// src/setupTests.js
import { rest, setupWorker } from 'msw';
import { setupServer } from 'msw/node';
import {
  FixtureCategory,
  FixtureGeneralNewsComment,
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
    `${process.env.REACT_APP_CMS_URL}/general-news-comments`,
    (req, res, ctx) => {
      const query = req.url.searchParams;
      const news_id = query.get('_where[general_news]');

      const response = FixtureGeneralNewsComment.list.filter(
        (comment) =>
          comment.general_news.id === parseInt(news_id, 10),
      );
      return res(ctx.status(200), ctx.json(response));
    },
  ),
];

const server = setupServer(...handlers);

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
