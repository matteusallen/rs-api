import { VENUE_ADMIN } from 'Constants';

export default function validateCreateUserInput(input, roleId) {
  const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password'];
  if (roleId === VENUE_ADMIN) requiredFields.pop();
  const missingFields = [];
  requiredFields.forEach(field => {
    if (!input[field]) missingFields.push(field);
  });

  const errorMessage = missingFields.length ? `Missing required field${missingFields.length > 1 ? 's' : ''} ${missingFields.join(', ')}.` : '';
  return errorMessage;
}
