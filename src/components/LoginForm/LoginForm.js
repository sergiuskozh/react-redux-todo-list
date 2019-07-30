import React, { useState } from 'react'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { authenticated, unauthenticated } from '../../actions/actionCreators'
import API from '../../utils/API';
import history from '../../history';

import 'bootstrap/dist/css/bootstrap.css';
import './LoginForm.css'
import { UncontrolledAlert, Button, FormGroup, Input, Label } from 'reactstrap';

const LoginForm = () => {
  const dispatch = useDispatch();
  const authError = useSelector(state => state.auth.error, shallowEqual);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const validateForm = () => email.length > 0 && password.length > 0;

  const handleSubmit = (e) => {
      e.preventDefault();
      API.post('users/login', {email: email, password: password})
      .then(response => {
        dispatch(authenticated());
        localStorage.setItem('jwt', response.data.meta.token);
        setPassword('');
        history.push('/');
      })
      .catch(error => {
        dispatch(unauthenticated(error.response.data.errors.slice(-1)[0].detail));
      })
  }

  return (
    <div className="LoginForm">              
      <form onSubmit={handleSubmit}>
        {authError !== undefined && 
          <FormGroup bssize="large">
              <UncontrolledAlert color="danger">
                <strong>{authError}</strong>
              </UncontrolledAlert>                        
          </FormGroup>
        }
        <FormGroup controlid="email" bssize="large">
          <Label>Email</Label>
          <Input
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlid="password" bssize="large">
          <Label>Password</Label>
          <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="true"
          />
        </FormGroup>
        <Button block bssize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
