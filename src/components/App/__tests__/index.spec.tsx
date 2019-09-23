import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {App} from '..';

jest.mock('../../Chart', () => ({
  Chart: ({data, maxX, maxY}: {data: number[]; maxX: number; maxY: number}) => (
    <ul id="chart" data-max-x={maxX} data-max-y={maxY}>
      {data.map((dataItem, index) => (
        <li key={index}>{dataItem}</li>
      ))}
    </ul>
  )
}));

const SOURCE_URL = '/api/stream';
const sourceMocks: {[url: string]: MockEventSource} = {};

class MockEventSource {
  public close: jest.Mock;
  public onmessage: ({data}: {data: string}) => void;
  constructor(url: string) {
    sourceMocks[url] = this;
    this.close = jest.fn();
    this.onmessage = () => {};
  }

  public sendMessage(dataItem: number) {
    this.onmessage({data: JSON.stringify({value: dataItem})});
  }
}

Object.defineProperty(window, 'EventSource', {
  value: MockEventSource
});

describe('App', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
    }

    jest.resetAllMocks();
  });

  it('renders chart with data from eventsource', () => {
    const mockData = [123, 456, 789, 345, 675];

    act(() => {
      render(<App />, container);
    });

    act(() => {
      for (const dataItem of mockData) {
        sourceMocks[SOURCE_URL].sendMessage(dataItem);
      }
    });

    const chartElement = document.getElementById('chart');

    expect(chartElement).not.toBe(null);
    expect(
      Array.from((chartElement as HTMLElement).children).map((child) => parseInt(child.textContent as string, 10))
    ).toEqual(mockData);
  });

  it('calls close on eventsource when unmounting', () => {
    act(() => {
      render(<App />, container);
    });

    expect(sourceMocks[SOURCE_URL].close).not.toHaveBeenCalled();

    act(() => {
      unmountComponentAtNode(container);
      container.remove();
    });

    expect(sourceMocks[SOURCE_URL].close).toHaveBeenCalled();
  });
});
