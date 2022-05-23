import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import googleLogo from "../../../assets/logo/google_logo.svg";

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/feed");
    }
  }, [history]);

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const email = result?.email;
    const password = result?.googleId;
    const config = {
      header: {
        "Content-type": "application/json",
      },
    };

    try {
      try {
        const { data } = await axios.post(
          "/api/auth/login",
          {
            email,
            password,
          },
          config
        );

        localStorage.setItem("authToken", data.token);

        history.push("/feed");
      } catch (error) {
        setError(error.response.data.error);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google sign in was unsuccessful. Try again later");
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        config
      );

      localStorage.setItem("authToken", data.token);

      history.push("/feed");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-main-black">
      <form onSubmit={loginHandler} action="" className="form-auth">
        <h3 className="text-4xl text-center font-bold text-white">Connexion</h3>
        {error && <span className="text-warning font-bold">{error}</span>}
        <div className="form-group">
          <label className="text-xl font-roboto text-white" htmlFor="name">
            Email:
          </label>
          <input
            type="email"
            required
            id="email"
            placeholder="Enter email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label className="text-xl font-roboto text-white" htmlFor="name">
            Password:
          </label>
          <input
            type="password"
            required
            id="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            tabIndex={2}
          />
          <Link
            to="/forgotpassword"
            tabIndex={4}
            style={{
              color: "#5185F3",
              fontSize: "1rem",
              fontStyle: "italic",
              fontFamily: "Roboto",
            }}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" className="white-btn" tabIndex={3}>
          Se connecter
        </button>

        <GoogleLogin
          clientId="438336332878-5mvv1blpb46pomocgddrqqntl4tah20r.apps.googleusercontent.com"
          render={(renderProps) => (
            <button
              className="white-btn"
              tabIndex={4}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={googleLogo} width="25" alt="google logo" />
              Se connecter avec google
            </button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
        />
        <span className="italic font-roboto text-white">
          Nouveau ?{" "}
          <Link style={{ color: "#5185F3" }} to="/register">
            Créer un compte
          </Link>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
