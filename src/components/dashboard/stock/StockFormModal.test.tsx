import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { FixtureStocks } from 'src/fixtures';

import 'src/setupTest';
import StockFormModal from './StockFormModal';

const mock = jest.fn();

describe('keyword test', () => {
  it('should have keyword title', async () => {
    const { getAllByText, getByTestId } = render(
      <StockFormModal
        //@ts-ignore
        stock={FixtureStocks.summaries[0]}
        isOpen={true}
        setClose={mock}
        reloadStock={mock}
      />,
    );

    await waitForElementToBeRemoved(getByTestId('tag-loading'));
    expect(getAllByText(/키워드/)).toBeTruthy();
  });
});

describe('Comment test', () => {
  it('should have comment title', async () => {
    const { getAllByText, getByTestId } = render(
      <StockFormModal
        //@ts-ignore
        stock={FixtureStocks.summaries[0]}
        isOpen={true}
        setClose={mock}
        reloadStock={mock}
      />,
    );
    await waitForElementToBeRemoved(getByTestId('tag-loading'));
    expect(getAllByText(/코멘트/)).toBeTruthy();
  });
});

describe('Keywords Test', () => {
  it('should have keyword title', async () => {
    const { getAllByText, getByTestId } = render(
      <StockFormModal
        //@ts-ignore
        stock={FixtureStocks.summaries[0]}
        isOpen={true}
        setClose={mock}
        reloadStock={mock}
      />,
    );

    expect(getAllByText(/키워드/)).toBeTruthy();
  });
});

describe('News test', () => {
  it('should have keyword title', async () => {
    const { getAllByText, getByTestId } = render(
      <StockFormModal
        //@ts-ignore
        stock={FixtureStocks.summaries[0]}
        isOpen={true}
        setClose={mock}
        reloadStock={mock}
      />,
    );
    await waitForElementToBeRemoved(getByTestId('tag-loading'));
    expect(getAllByText(/뉴스/)).toBeTruthy();
  });
});
