import { fireEvent, render } from '@testing-library/react';

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

  it('should have list length of limit', () => {
    const { getAllByTestId } = render(
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

    expect(getAllByTestId('stock-list-row').length).toEqual(LIMIT);
  });

  it('should be able to move next and previous page', () => {
    const { getByTestId, getAllByText } = render(
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

    fireEvent.click(getByTestId('KeyboardArrowRightIcon'));
    expect(getAllByText('셀트리온')).toBeTruthy();

    fireEvent.click(getByTestId('KeyboardArrowLeftIcon'));
    expect(getAllByText('삼성전자')).toBeTruthy();
  });
});

describe('ASYNC TEST', () => {
  it('should be able to load more data from API', async () => {
    const { getByTestId, getAllByText } = render(
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

    fireEvent.click(getByTestId('KeyboardArrowRightIcon'));
    expect(getAllByText(/삼성물산/)).toBeTruthy();
  });
});
