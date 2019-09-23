import React from 'react';
import {render} from 'react-dom';

import {App} from './components/App';

const element = document.getElementById('root');

if (element) {
  render(<App />, element);
}
