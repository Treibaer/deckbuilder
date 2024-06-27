import MainNavigation from "../components/MainNavigation";

export default function ErrorPage() {
  return (
    <>
      <MainNavigation />
      <main style={{ textAlign: "center" }}>
        <h1>Error</h1>
        <p>Sorry, an error occurred.</p>
      </main>
    </>
  );
}
