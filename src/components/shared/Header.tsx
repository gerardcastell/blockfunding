import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="topnav">
            <Link to="/" style={{color: "green"}}>BlockFunding</Link>
            <Link to="/projects">Projects</Link> {" "}
            <Link to="/about">About</Link>
        </div>
    );
}