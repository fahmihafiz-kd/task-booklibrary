import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Kidydult @ One2deal</p>
      <p>All rights reserved</p>
    </footer>
  );
};

export default Footer;
