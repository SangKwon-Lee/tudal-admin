import React, { useState, useRef, useCallback } from 'react';
import * as _ from 'lodash';

import useAsync from 'src/hooks/useAsync';

import { Category, Tag } from 'src/types/schedule';
import { APICategory } from 'src/lib/api';
import CategoryEditDialogPresenter from './CategoryEditDialog.Presenter';

interface CategoryEditDialogProps {
  category: Category;
  open: boolean;
  setClose: () => void;
  update: (id: number, name: object) => void;
  reload: () => void;
}

const CategoryEditDialogContainer: React.FC<CategoryEditDialogProps> =
  ({ category, open, setClose, update, reload }) => {
    const [input, setInput] = useState<string>(category.name);
    const categoryRef = useRef(null);
    const getTagList = useCallback(() => {
      const value = categoryRef.current
        ? categoryRef.current.value
        : '';
      return APICategory.getList({ _q: value });
    }, [categoryRef]);

    const [{ data: tagList, loading: tagLoading }, refetchTag] =
      useAsync<Tag[]>(getTagList, [categoryRef], []);

    const handleTagChange = _.debounce(refetchTag, 300);

    const onSubmit = async () => {
      update(category.id, { name: input });
    };

    return (
      category && (
        <CategoryEditDialogPresenter
          tagList={tagList}
          tagLoading={tagLoading}
          handleTagChange={handleTagChange}
          onSubmit={onSubmit}
          input={input}
          setInput={setInput}
          categoryRef={categoryRef}
          category={category}
          open={open}
          setClose={setClose}
        />
      )
    );
  };

export default CategoryEditDialogContainer;
