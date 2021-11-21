import {
  fireEvent,
  within,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { FixtureStocks } from 'src/fixtures';

import 'src/setupTest';
import StockList from './StockList';

const mock = jest.fn();

const LIMIT = 20;
describe('Stock List Test', () => {
  it('should have values from API', () => {
    const { getAllByText } = render(
      <StockList
        //@ts-ignore
        list={FixtureStocks.summaries}
        limit={LIMIT}
        loading={false}
        page={0}
        reload={mock}
        search={''}
        setPage={mock}
        setLimit={mock}
        setSearch={mock}
      />,
    );

    expect(getAllByText('삼성전자')).toBeTruthy();
  });

  it('should have chip. comment, news list length of limit', async () => {
    const { getAllByTestId, getByTestId, debug } = render(
      <StockList
        //@ts-ignore
        list={FixtureStocks.summaries}
        limit={20}
        loading={false}
        page={0}
        reload={mock}
        search={''}
        setPage={mock}
        setLimit={mock}
        setSearch={mock}
      />,
    );

    const Samsung = getByTestId(`stock-list-005930`);

    const comments = within(Samsung).getAllByTestId(
      'stock-list-comment-row',
    );

    const commentsTotalLength =
      FixtureStocks.summaries[0].comments.length;
    const commentMax =
      commentsTotalLength >= 3 ? 3 : commentsTotalLength;

    expect(comments.length).toEqual(commentMax);

    const news = within(Samsung).getAllByTestId(
      'stock-list-comment-row',
    );
    const newsLength = FixtureStocks.summaries[0].news.length;
    const newsMaxLength = newsLength >= 3 ? 3 : newsLength;

    expect(news.length).toEqual(newsMaxLength);

    const keywords = within(Samsung).getAllByTestId(
      'stock-list-keyword',
    );

    expect(keywords.length).toEqual(
      FixtureStocks.summaries[0].tags.length,
    );
  });

  it('should go prev, next page of comment and news', async () => {
    const { getAllByTestId, getByTestId, findAllByText } = render(
      <StockList
        //@ts-ignore
        list={FixtureStocks.summaries}
        limit={20}
        loading={false}
        page={0}
        reload={mock}
        search={''}
        setPage={mock}
        setLimit={mock}
        setSearch={mock}
      />,
    );

    const Samsung = getByTestId(`stock-list-005930`);

    const commentNextButton = within(Samsung).getAllByTestId(
      'KeyboardArrowRightIcon',
    )[0];

    const newsNextButton = within(Samsung).getAllByTestId(
      'KeyboardArrowRightIcon',
    )[1];

    fireEvent.click(commentNextButton);

    const targetComment =
      FixtureStocks.summaries[0].comments[4].message;
    expect(findAllByText(targetComment)).toBeTruthy();

    fireEvent.click(newsNextButton);
    const targetNews = FixtureStocks.summaries[0].news[4].title;
    expect(findAllByText(targetNews)).toBeTruthy();
  });
});
