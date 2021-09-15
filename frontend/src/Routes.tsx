import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { HomePage } from './pages/Home'
import { ProfilePage } from './pages/Profile'

export function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/add-user" component={ProfilePage} />
        <Route path="/:userId" component={ProfilePage} />
      </Switch>
    </Router>
  )
}
