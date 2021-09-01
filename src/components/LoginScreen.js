import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl, { useFormControl } from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginScreen(props) {
  const classes = useStyles();
  const [radiovalue, setRadioValue] = useState('db2/400');
  const [repoValue, setRepoValue] = useState('');
  const [ipValue, setIpValue] = useState('');
  const [portValue, setPortValue] = useState('');
  const [uname, setuname] = useState('');
  const [pswd, setpswd] = useState('');

  //const [allValues, setallValues] = useState(props.authDetails);

  //console.log('All Values', allValues);

  // useEffect(() => {
  //   console.log('login screen use effect', props);
  // });

  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const handleSelectChange = (e) => {
    setRepoValue(e.target.value);
  };

  const handleIpValue = (e) => {
    setIpValue(e.target.value);
  };

  const handlePortValue = (e) => {
    setPortValue(e.target.value);
  };

  const handleunameValue = (e) => {
    setuname(e.target.value);
  };

  const handlepswdValue = (e) => {
    setpswd(e.target.value);
  };

  const loginClick = (e) => {
    // props.setAuthDetails();
   // props.onSubmitHandler([ipValue, portValue, uname, pswd, repoValue]);   
    var object={ipAddr:ipValue,port:portValue,username:uname,password:pswd,dbName:repoValue}
    props.onSubmitHandler(object)
    localStorage.setItem('authDetails',JSON.stringify(object));
    localStorage.setItem("message", "saved in browser storage");
  };

  return (
    <Grid container justify='center'>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Login
          </Typography>
          <form className={classes.form} onSubmit={loginClick} validate='true'>
            <Grid container spacing={2}>
              <FormControl component='fieldset'>
               
                <RadioGroup value={radiovalue} onChange={handleRadioChange} row>
                 
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      value='db2/400'
                      control={<Radio color='primary' />}
                      label='IBM System i'
                    />
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name='ipaddress'
                  required
                  fullWidth
                  id='ipaddress'
                  label='IP Address'
                  onChange={handleIpValue}
                  value={ipValue}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='portno'
                  label='Port No'
                  name='portno'
                  onChange={handlePortValue}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
                onChange={handleunameValue}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                onChange={handlepswdValue}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel>Select Repository</InputLabel>
                {radiovalue == 'localhost' ? (
                <Select
                  value={repoValue}
                  onChange={handleSelectChange}
                  defaultValue=''
                  required
                >
                    <MenuItem value='mvxd008'>
                      MVXD008 : Main Repository
                    </MenuItem>
                  <MenuItem value='custd008'>
                      CUSTD008 : Customer Repository
                  </MenuItem>
                </Select>
                ) : (
                  <Select
                    value={repoValue}
                    onChange={handleSelectChange}
                    defaultValue=''
                    required
                  >
                    <MenuItem value='sphan01'>
                      SPHAN01 : DB2 Repository
                    </MenuItem>
                    <MenuItem value='sphmdna07'>
                      SPHMDNA07 : Demo Repository
                    </MenuItem>
                    <MenuItem value='sphmdna08'>
                      SPHMDNA08 : Demo Repository
                    </MenuItem>
                    <MenuItem value='sphmdna09'>
                      SPHMDNA09 : Demo Repository
                    </MenuItem>
                    <MenuItem value='sphmdna18'>
                      SPHMDNA18 : Demo Repository
                    </MenuItem>
                    <MenuItem value='sphmdna21'>
                      SPHMDNA21 : Demo Repository
                    </MenuItem>
                  </Select>
                )}
              </FormControl>
            </Grid>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              Login
            </Button>
          </form>
        </div>
      </Container>
    </Grid>
  );
}
