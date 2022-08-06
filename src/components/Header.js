import headerLogo from '../images/logo/Vector.svg';

function Header() {
  return (
    <div className="header">
        <img className="header__logo" src={headerLogo} alt="Логотип проекта место" />
    </div>
  );
}

export default Header;