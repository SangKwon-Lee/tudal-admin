import { rest } from 'msw';
import { News } from '../fixtures/index';

export const handlers = [
  rest.get(
    'http://103.244.108.203:1337/schedules',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ data: News.list }));
    },
  ),
];
