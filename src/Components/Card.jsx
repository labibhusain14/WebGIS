function Card({ children, className }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardContent({ children }) {
  return <div className="card-content">{children}</div>;
}

export { Card, CardContent };