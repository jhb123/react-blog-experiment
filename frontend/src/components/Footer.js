
const Footer = ({handleAdminToggle}) => {


    return (
      <>
        <footer className="Footer">
            <p1>Joseph Briggs, 2023</p1>
            <button onClick={handleAdminToggle}>admin</button>
        </footer>
      </>
    );
  };
  
  
  export default Footer;