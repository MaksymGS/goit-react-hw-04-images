import { fetchImages } from 'api';
import React, { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import Notiflix from 'notiflix';

export const App = () => {
  const [imageItems, setImageItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    async function images() {
      try {
        setLoading(true);
        const resp = await fetchImages(searchQuery, page);
        if (resp.hits.length === 0) {
          Notiflix.Notify.failure(
            `Nothing was found for this query - "${searchQuery}"`
          );
        }
        setImageItems(prevState => [...prevState, ...resp.hits]);
        setLoadMore(page < Math.ceil(resp.totalHits / 12));
      } catch (error) {
        Notiflix.Report.failure(
          `${error.message}`,
          'Something went wrong, please try reloading this page',
          'Ok',
          {
            titleMaxLength: 50,
          }
        );
      } finally {
        setLoading(false);
      }
    }
    if (searchQuery === '') {
      return;
    }
    images();
  }, [searchQuery, page]);

  const changeQuery = values => {
    window.scrollTo(0, 0);
    setSearchQuery(values.searchQuery);
    setImageItems([]);
    setPage(1);
  };

  const increasePage = () => {
    setPage(prevState => {
      return prevState + 1;
    });
  };

  return (
    <>
      <Searchbar onChangeQuery={changeQuery} />
      {imageItems.length > 0 && <ImageGallery images={imageItems} />}
      {loadMore && !loading && <Button onLoadMore={increasePage} />}
      <Loader isLoading={loading} />
    </>
  );
};
