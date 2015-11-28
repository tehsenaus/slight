import React from 'react';

export function renderDevTools(store) {
  if (__DEV__) {
    let {DevTools, DebugPanel, LogMonitor} = require('redux-devtools/lib/react');
    let SliderMonitor = require('redux-slider-monitor');

    return (
      <DebugPanel left right bottom>
        <DevTools store={store} monitor={SliderMonitor} />
      </DebugPanel>
    );
  }

  return null;
}
