import Link from 'next/link';
import '../styles/Header.css';

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <h1 className="title">
          <Link href="/">The Book Library</Link>
        </h1>
        <nav className="navigation">
          <Link href="/">Home</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;