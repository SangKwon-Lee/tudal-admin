import React, { useState, useRef, useCallback } from 'react';
import * as _ from 'lodash';
import toast from 'react-hot-toast';
import { INews, INewsComment } from 'src/types/news';
import { Category, Stock, Tag } from 'src/types/schedule';

import useAsync from 'src/hooks/useAsync';
import { APICategory, APINews, APIStock, APITag } from 'src/lib/api';
import {
  tokenize,
  extractStocks,
  extractKeywords,
} from 'src/utils/extractKeywords';

import useAuth from 'src/hooks/useAuth';
import NewsCommentFormPresenter from './NewsCommentForm.Presenter';

interface NewsCommentFormProps {
  isOpen: boolean;
  news: INews;
  setOpen: (isOpen) => void;
  setShouldUpdate: (isUpdate) => void;
}

const NewsCommentForm: React.FC<NewsCommentFormProps> = (props) => {
  const { user } = useAuth();
  const { isOpen, setOpen, news, setShouldUpdate } = props;
  const [comment, setComment] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const tagInput = useRef<HTMLInputElement>(null);

  const [{ data: stockList, loading: stockLoading }] = useAsync<
    Stock[]
  >(APIStock.getList, [], []);

  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList({ _q: value });
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput.current], []);

  const [{ data: categoryList, loading: categoryLoading }] = useAsync<
    Category[]
  >(APICategory.getList, [], []);

  const [{ data: commentList }, refetchComment] = useAsync<
    INewsComment[]
  >(() => APINews.getComments(news.id), [], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  const submit = useCallback(async () => {
    const data: any = {
      comment: comment,
      author: user.id,
      general_news: news.id,
    };

    try {
      const { status } = await APINews.createComment(data);
      if (status === 200) {
        refetchComment();
        setShowConfirm(false);
        setComment('');
        toast.success('코멘트가 추가되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, news, comment, refetchComment]);

  const deleteStock = async (stockcode) => {
    try {
      setLoading(true);
      const { data } = await APINews.deleteByStockAndNews(
        stockcode,
        news.id,
      );
      if (data) {
        toast.success('삭제되었습니다.');
        setShouldUpdate(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addStock = useCallback(
    async (stockcode, stockname) => {
      try {
        setLoading(true);
        if (_.find(news.stocks, ['stockcode', String(stockcode)])) {
          toast.success(`종목 '${stockname}' 이미 존재합니다.`);
          return;
        }

        const { status } = await APINews.createStockNews(
          stockcode,
          stockname,
          news.id,
        );
        if (status === 200) {
          toast.success(`${stockname} 이(가) 추가되었습니다.`);
          setShouldUpdate(true);
        }
      } catch (error) {
        toast.error(
          '에러가 발생했습니다. 지속 발생할 시 관리자에게 문의 해주시길 바랍니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [news, setShouldUpdate],
  );

  const addKeyword = useCallback(
    async (tag: Tag) => {
      try {
        // 신규 추가하는 경우
        setLoading(true);
        if (tag.isNew) {
          const { data, status } = await APITag.postItem(tag.name);
          if (status !== 200) {
            toast.error(
              `${tag.name} 등록에 실패하였습니다. 지속 발생 시 관리자에게 문의 바랍니다.`,
            );
            return;
          } else {
            tag = data;
          }
        }
        if (_.find(news.tags, ['id', tag.id])) {
          toast.success(`키워드 '${tag.name}' 이미 존재합니다.`);
          return;
        }

        const { status } = await APINews.addTags(news.id, [tag.id]);

        if (status === 200) {
          toast.success(`${tag.name} 이(가) 추가되었습니다.`);
          setShouldUpdate(true);
        }
      } catch (error) {
        toast.error(
          '에러가 발생했습니다. 지속 발생할 시 관리자에게 문의 해주시길 바랍니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [news, setShouldUpdate],
  );

  const deleteKeyword = useCallback(
    async (tag) => {
      try {
        setLoading(true);
        const { id } = tag;
        const updateTags = news.tags
          .filter((tag) => tag.id !== id)
          .map((tag) => tag.id);

        const { status } = await APINews.update(news.id, {
          tags: updateTags,
        });

        if (status === 200) {
          toast.success('삭제되었습니다.');
          setShouldUpdate(true);
        }
      } catch (error) {
        toast.error(
          '에러가 발생했습니다. 지속 발생할 시 관리자에게 문의 해주시길 바랍니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [news, setShouldUpdate],
  );

  const addCategory = useCallback(
    async (category: Category) => {
      try {
        setLoading(true);
        // 신규 카테고리 추가하는 경우
        if (category.isNew) {
          const { data, status } = await APICategory.postItem(
            category.name,
          );
          if (status !== 200) {
            toast.error(category.name + '등록에 실패하였습니다.');
            return;
          }
          category = data;
        }

        if (_.find(news.categories, ['id', category.id])) {
          toast.success(
            `카테고리 '${category.name}' 이미 존재합니다.`,
          );
          return;
        }

        const { status } = await APINews.addCategories(news.id, [
          category.id,
        ]);

        if (status === 200) {
          toast.success(`${category.name} 이(가) 추가되었습니다.`);
          setShouldUpdate(true);
        }
      } catch (error) {
        toast.error(
          '에러가 발생했습니다. 지속 발생할 시 관리자에게 문의 해주시길 바랍니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [news, setShouldUpdate],
  );

  const deleteCategory = useCallback(
    async (target: Category) => {
      try {
        setLoading(true);

        const newCategories = news.categories
          .filter((category) => category.id !== target.id)
          .map((category) => category.id);

        const { status } = await APINews.update(news.id, {
          categories: newCategories,
        });
        if (status === 200) {
          toast.success('삭제되었습니다.');
          setShouldUpdate(true);
        }
      } catch (error) {
        toast.error(
          '에러가 발생했습니다. 지속 발생할 시 관리자에게 문의 해주시길 바랍니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [news, setShouldUpdate],
  );

  const extractStockAndKeyword = useCallback(
    async (sentence) => {
      setLoading(true);
      try {
        if (!sentence) return;
        const tokens = tokenize(sentence);
        if (!tokens) return;
        const { extractedStocks: stocks, tokenized: afterStock } =
          extractStocks(stockList, tokens);

        const tags = await extractKeywords(afterStock);

        // 종목 등록
        stocks.forEach(async (stock) => {
          await addStock(stock.code, stock.name);
        });

        // 키워드 등록
        if (tags) {
          const tagIds = tags.map((el) => el.id);
          const { status } = await APINews.addTags(news.id, tagIds);
          if (status === 200) {
            toast.success('키워드 추출이 성공적으로 완료되었습니다.');
            setShouldUpdate(true);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [addStock, news.id, setShouldUpdate, stockList],
  );

  return (
    <NewsCommentFormPresenter
      isOpen={isOpen}
      news={news}
      loading={loading}
      showConfirm={showConfirm}
      setShowConfirm={setShowConfirm}
      setOpen={setOpen}
      setShouldUpdate={setShouldUpdate}
      handleTagChange={handleTagChange}
      extractStockAndKeyword={extractStockAndKeyword}
      tagInput={tagInput}
      comment={comment}
      setComment={setComment}
      // data
      stockList={stockList}
      stockLoading={stockLoading}
      tagList={tagList}
      tagLoading={tagLoading}
      categoryList={categoryList}
      categoryLoading={categoryLoading}
      commentList={commentList}
      refetchTag={refetchTag}
      refetchComment={refetchComment}
      // API request
      submit={submit}
      addStock={addStock}
      deleteStock={deleteStock}
      addKeyword={addKeyword}
      deleteKeyword={deleteKeyword}
      addCategory={addCategory}
      deleteCategory={deleteCategory}
    />
  );
};

export default NewsCommentForm;
