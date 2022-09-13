import React from 'react';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from '../../components/Feed/Feed';
import "./home.css";

const Home = () => {
    return (
        <>
            <Header />
            <div className="homeContainer">
                <Sidebar />
                <Feed />
            </div>
        </>
    );
}
 
export default Home;