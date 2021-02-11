import React, { useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import avatar from '../images/avatar.png';

export default function AnchorMenu(props) {
    const {classes} = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [badgeContent, setBadgeContent] = React.useState(0);
    const [dialogTitle, setDialogTitle] = React.useState('');
    const [dialogContent, setDialogContent] = React.useState('');

    useEffect(() => {
      setBadgeContent(props.item.value.length)
    }, [])

    const handleAnchorClick = (event) => {
      setAnchorEl(event.currentTarget);
      setBadgeContent(0)
    };

    const handleAnchorClose = () => {
      setAnchorEl(null);
    };
    
    const handleDialogOpen = (e) => {
      setAnchorEl(null);
      if (e.target.id === 'Session Info') {
        setDialogTitle(e.target.id)
        setOpen(true);
      } else if (e.target.id === 'Logoff') {
        props.logoffHandler()
      } else {
        setDialogTitle(e.target.id)
        setDialogContent(props.item.value.find((val) => val.title === e.target.id).content)
        setOpen(true);
      }
    };
    const handleDialogClose = () => {
      setOpen(false);
    };

  /* Rendering right side components of topbar */
  return (
    <div>
      {/* Notification info */}
      {props.item.type === 'notification' ?
        <Badge color="secondary" 
          badgeContent={badgeContent}
          overlap="circle" 
          variant="dot"
          onClick={handleAnchorClick}
        >
          <NotificationsIcon color="inherit"/>
        </Badge>
      : 
      /* Account info */
      <Badge>
        <Avatar alt="image" src={avatar} onClick={handleAnchorClick}/>
      </Badge>
      }

      {/* Rendering dropdown menu for notification/account info click */}
      <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleAnchorClose}
        >
          {props.item.value.map((val) => (
            <MenuItem key={val.title} id={val.title} onClick={(e) => handleDialogOpen(e)}>{val.title}</MenuItem>
          ))}
      </Menu>

      {/* Dialog box rendering for menu options click */}
      <Dialog 
        onClose={handleDialogClose} 
        aria-labelledby="customized-dialog-title" 
        open={open}
      >
        <MuiDialogTitle disableTypography>
          <IconButton 
            aria-label="close" 
            className={classes.closeButton} 
            onClick={handleDialogClose}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>

        <DialogTitle 
          id="customized-dialog-title" 
          onClose={handleDialogClose}
        >
          {dialogTitle}
        </DialogTitle>
        
        <DialogContent dividers>
          {dialogTitle === 'Session Info' ? 
            <List dense>
              {Object.keys(props.sessionInfo).map((key) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={key}
                    secondary={props.sessionInfo[key]}
                  />
                </ListItem>
              ))}
            </List>
          : dialogTitle === 'Profile Info' ?
              <List dense>
              {Object.keys(dialogContent).map((key) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={key}
                    secondary={dialogContent[key]}
                  />
                </ListItem>
              ))}
              </List>
            :
            <Typography gutterBottom>
              {dialogContent}
            </Typography>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
}