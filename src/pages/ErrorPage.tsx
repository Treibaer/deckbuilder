import MainNavigation from "../components/Navigation/MainNavigation";

const ErrorPage = () => {
  return (
    <>
      <MainNavigation />
      <main style={{ textAlign: "center" }}>
        <h1>Error</h1>
        <p>An error occurred.</p>
      </main>
    </>
  );
};

export default ErrorPage;
