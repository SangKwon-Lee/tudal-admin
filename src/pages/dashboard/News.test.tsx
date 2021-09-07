import { render, fireEvent, waitForElementToBeRemoved, screen } from '@testing-library/react';
import { Route, MemoryRouter } from 'react-router-dom';
import NewsComment from './News';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

const scrollIntoViewMock = jest.fn();
HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

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
    await waitForElementToBeRemoved(() => screen.getByTestId('news-list-loading'));
    expect(container).toHaveTextContent('로이터');
  });

  it('changes input of search box', async () => {
    const { getAllByRole } = renderNews();
    await waitForElementToBeRemoved(() => screen.getByTestId('news-list-loading'));

    const searchInput = getAllByRole('textbox').filter((element) => element.id === '_q')[0];

    fireEvent.change(searchInput, {
      target: { value: '검색 테스트' },
    });
    expect(screen.getByDisplayValue('검색 테스트')).toBeTruthy();
  });
});
