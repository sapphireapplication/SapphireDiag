import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@material-ui/core';

export default function CardComponent(props) {
    const {classes} = props;

    /* Rendering sidebar contact card */
    return (
        props.card ? 
            <Card className={classes.contactCard}>
                <CardHeader
                    title={props.card.header}
                    className={classes.contactCardHeader}
                />
                <CardContent
                    className={classes.contactCardContent}
                >
                    <Typography variant="body2" component="p">
                        {props.card.cardContent}
                    </Typography>
                </CardContent>
            </Card>
        : ''
    )
}