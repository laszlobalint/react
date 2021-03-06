import React from 'react';
import CreateItemForm from './createItem/createItemForm';

class CreateItem extends React.Component {
  submit (inputValue) {
    console.log(inputValue);
    this.props.submit(inputValue);
  }

  render () { // RENDERING COMPONENTS (TodoListWrapper) see also todoitem.jsx
    return (
      <div className='createItemWrapper'>
        <CreateItemForm submit={this.submit.bind(this)} />
      </div>
    );
  }
}
export default CreateItem;
