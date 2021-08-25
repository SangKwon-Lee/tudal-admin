import { fireEvent, render } from '@testing-library/react';
import { FixtureStocks } from 'src/fixtures';

import 'src/setupTest';
import StockFormModal from './StockFormModal';

const mock = jest.fn();

const LIMIT = 20;

describe('Stock form Test', () => {});
describe('keyword test', () => {
  it('should have keyword title', () => {
    const { getAllByText } = render(<StockFormModal />);
    expect(getAllByText(/키워드/)).toBeTruthy();
  });
});

describe('Comment test', () => {
  it('should have comment title', () => {
    const { getAllByText } = render(<StockFormModal />);
    expect(getAllByText(/코멘트/)).toBeTruthy();
  });
});

describe('Keywords Test', () => {
  it('should have keyword title', () => {
    const { getAllByText } = render(<StockFormModal />);

    expect(getAllByText(/키워드/)).toBeTruthy();
  });
});

describe('News test', () => {
  it('should have keyword title', () => {
    const { getAllByText } = render(<StockFormModal />);

    expect(getAllByText(/뉴스/)).toBeTruthy();
  });
});
