import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from '@/components/CheckBack';
import map from './map';
import MapRouter from './MapRouter';

export default () => (
  <BrowserRouter>
    <Provider>
      <MapRouter routes={map} />
    </Provider>
  </BrowserRouter>
)
