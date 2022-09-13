import React from "react";
import "./styles.css";
import { Search, Person, ModeComment, MonitorHeart, MoreHoriz } from "@mui/icons-material";
import node from "./node.png"

export default function Header() {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">
        <img className="image" src={node}></img>
        <span>node<span style={{color:"#68a063"}}>sözlük</span></span>
        </span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <input
            placeholder="başlık, #entry, @yazar"
            className="searchInput"
          />
          <Search className="searchIcon" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <a style={{marginBottom:"25px"}} >ben</a>
          </div>
          <div className="topbarIconItem">
            <ModeComment />
            <a>mesaj</a>
          </div>
          <div className="topbarIconItem">
            <MonitorHeart />
            <a>olay</a>
          </div>
          <div className="topbarIconItem">
            <MoreHoriz />
          </div>
        </div>
      </div>
    </div>
  );
};

