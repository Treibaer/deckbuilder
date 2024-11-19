import { Helmet } from "react-helmet-async";
import MainNavigation from "../components/Navigation/MainNavigation";

const ErrorPage = () => {
  return (
    <>
      <Helmet title="Error" />
      <MainNavigation />
      <main style={{ textAlign: "center" }}>
        <h1>Error</h1>
        <p>An error occurred.</p>
      </main>
    </>
  );
};

export default ErrorPage;
