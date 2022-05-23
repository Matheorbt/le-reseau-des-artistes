import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Routing
import PrivateRoute from "./components/routing/PrivateRoute";

//Screens
import LoginScreen from "./components/screens/auth/LoginScreen";
import RegisterScreen from "./components/screens/auth/RegisterScreen";
import ForgotPasswordScreen from "./components/screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/auth/ResetPasswordScreen";
import NotFound from "./components/screens/misc/NotFound";

import Feed from "./components/screens/feed/Feed";
import LikedPosts from "./components/screens/likedPosts/LikedPosts";
import SavedPosts from "./components/screens/savedPosts/SavedPosts";
import Profile from "./components/screens/profile/Profile";
import CreatePost from "./components/screens/createPost/CreatePost";
import PostOverview from "./components/posts/PostOverview";

const App = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/feed" component={Feed} />
        <PrivateRoute exact path="/likedposts" component={LikedPosts} />
        <PrivateRoute exact path="/savedposts" component={SavedPosts} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/createpost" component={CreatePost} />
        <PrivateRoute path="/post/:postID" component={PostOverview} />
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/register" component={RegisterScreen} />
        <Route exact path="/forgotpassword" component={ForgotPasswordScreen} />
        <Route
          exact
          path="/passwordreset/:resetToken"
          component={ResetPasswordScreen}
        />
        <Route path="/" component={LoginScreen} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
