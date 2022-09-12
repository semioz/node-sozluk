import React from 'react';
import {Container, AppBar, Typography, Grow, Grid, Link} from "@material-ui/core";
import node from "./images/node.png";
import useStyles from "./styles";
import Search from "./components/Search/Search";
import PersonIcon from '@mui/icons-material/Person';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

function App() {
    const classes = useStyles();
    return (
        <div>
            <Container>
                <AppBar className={classes.appBar}>
                    <img className={classes.image} src={node} alt="node" height="40" />
                    <Typography className={classes.heading} variant="h5">node<span className={classes.sozluk}>sözlük</span></Typography>
                    <nav className={classes.userMenu}>
                    <ul style={{listStyleType:"none"}}>
                        <li style={{display:"inline-block",margin:"0 16px"}}>
                            <a className={classes.anchorStyle} href='/giris'>giriş</a>
                        </li>
                        <li style={{display:"inline-block"}}>
                            <a className={classes.anchorStyle} href='/kayit'>kayıt ol</a>
                        </li>
                    </ul>
                    </nav>        
                </AppBar>
            </Container>
        </div>
    )
};

export default App;