import React from 'react'

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(["Warning", "Unrecognized", "Accessing", "MapViewDirections"])

import Map from './components/Map/index';

const App = () => <Map />
    
export default App;
