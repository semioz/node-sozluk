import React from 'react';
import {Container, AppBar, Typography, Grow, Grid} from "@material-ui/core";
import node from "./images/node.png"
import Form from "./components/Form/Form";
import Entries from "./components/Entries/Entries";
import useStyles from "./styles";

function App() {
    const classes = useStyles();
    return (
        <div>
            <Container>
                <AppBar className={classes.appBar} color="inherit">
                    <img className={classes.image} src={node} alt="node" height="50" />
                    <Typography className={classes.heading} variant="h4" align="center">node<span className={classes.sozluk}>sözlük</span></Typography>
                </AppBar>
                <Grow in>
                    <Container>
                        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
                            <Grid item xs={12} sm={7}>
                                <Entries />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Form />
                            </Grid>
                        </Grid>
                    </Container>
                </Grow>
            </Container>
        </div>
    )
};

export default App;