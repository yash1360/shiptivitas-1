import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
    };
  }

  renderTabContent() {
    switch (this.state.selectedTab) {
      case 'shipping-requests':
        return <Board />;
      case 'home':
      default:
        // FIX: Use JSX <HomeTab /> instead of calling the function HomeTab()
        return <HomeTab />; 
    }
  }

  render() {
    return (
      <div className="App">
        <Navigation
          onClick={(tabName) => this.setState({ selectedTab: tabName })}
          selectedTab={this.state.selectedTab}
        />
        <div className="App-body">
          {this.renderTabContent()}
        </div>
      </div>
    );
  }
}

export default App;