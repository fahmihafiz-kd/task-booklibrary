import Link from 'next/link';
import '../styles/Header.css';

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <h1 className="title">
          <Link href="/home">The Book Library</Link>
        </h1>
        <nav className="navigation">
          <Link href="/home">Home</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;