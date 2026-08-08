export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="container">
        <p className="eyebrow">ENGSE203 • LAB 4</p>
        <h1>Campus Service Request</h1>
        <p>React Component-based Application</p>
      </div>
    </header>
  );
}
function AppHeader({ title, subtitle}) {
  return (
    <header className="hero">
      <div className="container">
        <p className="eyebrow">ENGSE203 • PRE-LAB 04</p>
        <h1> {title} </h1>
        <p> {subtitle} </p>
      </div>
    </header>
  );
}

export default AppHeader;

