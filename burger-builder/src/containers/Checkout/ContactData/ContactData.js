import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import WithErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../../store/actions';
import axios from '../../../axios';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
  state = {
    orderForm: {
      name: this.createInputConfig('input', 'text', 'Enter your name...'),
      email: this.createInputConfig('input', 'text', 'Enter your email...'),
      street: this.createInputConfig('input', 'text', 'Enter your address...'),
      postalCode: this.createInputConfig('input', 'number', 'Enter your postal code...'),
      country: this.createInputConfig('input', 'text', 'Enter your country...'),
      deliveryMethod: this.createInputConfig('select', null, null, true),
    },
    formIsValid: false,
    loading: false,
    error: false,
  };

  createInputConfig(elementType, type, placeholder, options) {
    if (!options) {
      return {
        elementType,
        elementConfig: {
          type,
          placeholder,
        },
        value: '',
        validation: {
          required: true,
          minLength: 3,
          maxLength: 50,
        },
        valid: false,
        touched: false,
      };
    } else {
      return {
        elementType,
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'later', displayValue: 'Later' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ],
        },
        value: 'fastest',
        validation: {},
        valid: true,
        touched: false,
      };
    }
  }

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let inputId in this.state.orderForm) {
      formData[inputId] = this.state.orderForm[inputId].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      totalPrice: this.props.totalPrice.toFixed(2),
      orderData: formData,
      userId: this.props.userId,
    };
    this.props.onPurchaseBurger(order, this.props.token);
  };

  inputChangedHandler = (event, inputId) => {
    const updatedFormElement = updateObject(this.state.orderForm[inputId], {
      value: event.target.value,
      valid: checkValidity(event.target.value, this.state.orderForm[inputId].validation),
      touched: true,
    });
    const updatedOrderForm = updateObject(this.state.orderForm, {
      [inputId]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;

    this.setState({ orderForm: updatedOrderForm, formIsValid });
  };

  render() {
    const formElements = [];
    for (let key in this.state.orderForm) formElements.push({ id: key, config: this.state.orderForm[key] });

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements.map((element) => (
          <Input
            key={element.id}
            elementType={element.config.elementType}
            elementConfig={element.config.elementConfig}
            value={element.config.value}
            invalid={!element.config.valid}
            shouldValidate={element.config.validation}
            touched={element.config.touched}
            changed={(event) => this.inputChangedHandler(event, element.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.props.loading) form = <Spinner />;
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data:</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.builder.ingredients,
    totalPrice: state.builder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPurchaseBurger: (data, token) => dispatch(actions.purchaseBurger(data, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(ContactData, axios));
