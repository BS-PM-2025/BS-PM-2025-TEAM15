//layout designed to be in every page.

export default function Navbar(){

    return (
            <nav className="nav">
                <a href="/" className="site-title">Site Name</a>
                <ul>
                    <li >
                        <a className="a" href="/Home">Home</a>
                    </li>
                    <li >
                        <a className="a" href ="/Wel">wel</a>
                    </li>
                    <li>
                    <a className="a" href ="/Requestsubmissions_student">Requestsubmissions_student</a>
                    </li>
                </ul>
            </nav>
        
    )
}