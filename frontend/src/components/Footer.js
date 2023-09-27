
const Footer = ({handleAdminToggle}) => {


    return (
      <>
        <footer className={"Footer background"}>
            <p1>Joseph Briggs, 2023</p1>
            <button className="primary" onClick={handleAdminToggle}>admin</button>
        </footer>
      </>
    );
  };
  
  
  export default Footer;