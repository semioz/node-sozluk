import React from 'react';
import {Container, AppBar, Typography, Grow, Grid} from "@material-ui/core";
import node from "./images/node.jpg"
import Form from "./components/Form/Form";
import Entries from "./components/Entries/Entries";

function App() {
    return (
        <div>
            <Container maxWidth="lg">
                <AppBar position="static" color="inherit">
                    <Typography variant="h2" align="center">node sözlük</Typography>
                    <img src={node} alt="node" height="60" />
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