import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import googleLogo from "../../../assets/logo/google_logo.svg";

const RegisterScreen = ({ history }) => {
  //Form step index
  const [formIndex, setFormIndex] = useState(0);

  //Register step One => Next button => Check if email adress already exist in database
  const [email, setEmail] = useState("");

  //Register step Two => Next button => No condition check
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //Register step three final confirmation => Register button
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/feed");
    }
  }, [history]);

  const handleBackAlert = (errorMessage) => {
    setError("");
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const handleBack = () => {
    formIndex !== 0
      ? setFormIndex(formIndex - 1)
      : handleBackAlert("Already at step one");
  };

  const handleNext = () => {
    if (formIndex === 0 && email !== "") {
      setFormIndex(formIndex + 1);
      setError("");
    } else if (formIndex === 1 && firstName !== "" && lastName !== "") {
      setFormIndex(formIndex + 1);
      setError("");
    } else {
      setError("Please fill all the fields");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const email = result?.email;
    const password = result?.googleId;
    const lastName = result?.familyName;
    const firstName = result?.givenName;
    const profilePicture = result?.imageUrl;

    const config = {
      header: {
        "Content-type": "application/json",
      },
    };

    try {
      try {
        const { data } = await axios.post(
          "/api/auth/register",
          {
            email,
            password,
            lastName,
            firstName,
            profilePicture,
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

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-type": "application/json",
      },
    };

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Password do not match");
    }

    try {
      const { data } = await axios.post(
        "/api/auth/register",
        {
          email,
          password,
          lastName,
          firstName,
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
      <form onSubmit={registerHandler} action="" className="form-auth">
        <h3 className="text-white text-center font-poppins text-2xl font-bold">
          Register
        </h3>
        {error && <span className="text-warning font-bold">{error}</span>}
        {formIndex === 0 ? null : (
          <button
            type="button"
            onClick={handleBack}
            className="font-bold flex justify-start items-center gap-2 text-white font-poppins"
          >
            <i className="fa fa-arrow-left text-white" aria-hidden="true"></i>{" "}
            Back
          </button>
        )}

        {formIndex === 0 ? (
          <div className="form-group">
            <label htmlFor="name" className="text-xl font-roboto text-white">
              Email:
            </label>
            <input
              type="email"
              required
              id="email"
              placeholder="Enter email"
              value={email}
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : formIndex === 1 ? (
          <>
            <div className="form-group">
              <label htmlFor="name" className="text-xl font-roboto text-white">
                Last name:
              </label>
              <input
                type="text"
                required
                id="lastName"
                placeholder="Enter last name"
                value={lastName}
                className="input"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="text-xl font-roboto text-white">
                First name:
              </label>
              <input
                type="text"
                required
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                className="input"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="name" className="text-xl font-roboto text-white">
                Password:
              </label>
              <input
                type="password"
                required
                id="password"
                placeholder="Enter password"
                autoComplete="new-password"
                value={password}
                className="input"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="confirmpassword"
                className="text-xl font-roboto text-white"
              >
                Confirm password:
              </label>
              <input
                type="password"
                required
                id="confirmpassword"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                className="input"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}
        {formIndex < 2 ? (
          <button
            type="button"
            className="bg-white w-[50px] h-[50px] flex justify-center items-center ml-auto p-4 rounded-[50%]"
            onClick={() => handleNext()}
          >
            <i
              className="fa fa-arrow-right text-main-black"
              aria-hidden="true"
            ></i>
          </button>
        ) : (
          <button type="submit" className="white-btn" tabIndex={3}>
            Confirmer
          </button>
        )}
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
              S'enregistrer avec Google
            </button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
        />
        <span className="italic font-roboto text-white">
          Déjà un compte ?{" "}
          <Link style={{ color: "#5185F3" }} to="/login">
            Se connecter
          </Link>
        </span>
      </form>
    </div>
  );
};

export default RegisterScreen;
