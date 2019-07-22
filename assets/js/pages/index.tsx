import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Main from '../components/Main';

const HomePage: React.FC<RouteComponentProps> = () => (
  <Main>
    Hi HomePage
    <Link to="/counter">Go to Counter</Link>
  </Main>
);

export default HomePage;
