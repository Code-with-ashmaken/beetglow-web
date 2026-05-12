export const checkoutFormFields = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your first name',
    gridCols: 1
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your last name',
    gridCols: 1
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter your email address',
    gridCols: 2
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    required: true,
    placeholder: 'Enter your phone number',
    gridCols: 2
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'Enter your city',
    gridCols: 2
  },
  {
    name: 'shippingAddress',
    label: 'Shipping Address',
    type: 'textarea',
    required: true,
    placeholder: 'Enter your complete shipping address',
    gridCols: 2,
    rows: 3
  },
  {
    name: 'postalCode',
    label: 'Postal Code',
    type: 'text',
    required: true,
    placeholder: 'Enter your postal code',
    gridCols: 2
  }
];

export const getInitialFormValues = () => {
  const initialValues = {};
  checkoutFormFields.forEach(field => {
    initialValues[field.name] = '';
  });
  return initialValues;
};
