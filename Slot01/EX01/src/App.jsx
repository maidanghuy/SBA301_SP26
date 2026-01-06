import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-fill p-4">
        <h2>Welcome to Slot01 - Ex1</h2>
        <p>This is the main content area.</p>
      </main>

      <Footer />
    </div>
  );
}

export default App;
