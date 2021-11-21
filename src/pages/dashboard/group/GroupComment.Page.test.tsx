import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import 'src/setupTest';
import GroupCommentCreatePage from './GroupCommentCreate.page';

jest.mock('react-helmet-async', () => ({
  Helmet: () => <header></header>,
}));

// const scrollIntoViewMock = jest.fn();
// HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

function renderGroupList() {
  return render(
    <MemoryRouter>
      <GroupCommentCreatePage />
    </MemoryRouter>,
  );
}

describe('Group Comment Page render', () => {
  it('Group Detail', async () => {
    const { getByTestId } = renderGroupList();
    console.log('HI');
    // await waitForElementToBeRemoved(() =>
    getByTestId('group-comment-loading');
    // );

    // const test4 = screen.queryByText(/백신/);
    // console.log(test4);
    // expect(test4).toBeTruthy();
  });
});
