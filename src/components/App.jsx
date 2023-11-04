import { fetchImages } from 'api';
import React, { Component, useEffect, useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [imageItems, setImageItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    async function images() {
      try {
        setLoading(true);
        setError(false);
        const resp = await fetchImages(searchQuery, page);
        console.log(resp);
        if (resp.hits.length === 0) {
          alert(`Nothing was found for this query - ${searchQuery}`);
        }
        setImageItems(prevState => [...prevState, ...resp.hits]);
        setLoadMore(page < Math.ceil(resp.totalHits / 12));
      } catch (error) {
        setError(true);
        alert(error.message);
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
      console.log(prevState);
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
