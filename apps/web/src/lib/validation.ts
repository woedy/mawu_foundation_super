// Form validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone validation (basic international format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phone.trim().length >= 10 && phoneRegex.test(phone);
};

// Name validation
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Amount validation
export const validateAmount = (amount: number | string, min: number = 0): boolean => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > min;
};

// Address validation
export interface AddressFields {
  line1: string;
  city: string;
  country: string;
  postalCode?: string;
  state?: string;
}

export const validateAddress = (address: AddressFields): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!address.line1 || address.line1.trim().length < 5) {
    errors.push({
      field: 'line1',
      message: 'Street address must be at least 5 characters',
    });
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push({
      field: 'city',
      message: 'City is required',
    });
  }

  if (!address.country || address.country.trim().length !== 2) {
    errors.push({
      field: 'country',
      message: 'Valid country code is required',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Checkout form validation
export interface CheckoutFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: AddressFields;
}

export const validateCheckoutForm = (formData: CheckoutFormFields): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateName(formData.firstName)) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters',
    });
  }

  if (!validateName(formData.lastName)) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters',
    });
  }

  if (!validateEmail(formData.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  if (!validatePhone(formData.phone)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number',
    });
  }

  const addressValidation = validateAddress(formData.shippingAddress);
  if (!addressValidation.isValid) {
    errors.push(...addressValidation.errors.map(err => ({
      field: `shippingAddress.${err.field}`,
      message: err.message,
    })));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Donation form validation
export interface DonationFormFields {
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  message?: string;
}

export const validateDonationForm = (formData: DonationFormFields): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateName(formData.firstName)) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters',
    });
  }

  if (!validateName(formData.lastName)) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters',
    });
  }

  if (!validateEmail(formData.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  if (!validateAmount(formData.amount, 1)) {
    errors.push({
      field: 'amount',
      message: 'Donation amount must be at least 1',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Quantity validation
export const validateQuantity = (
  quantity: number,
  maxInventory: number
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (quantity < 1) {
    errors.push({
      field: 'quantity',
      message: 'Quantity must be at least 1',
    });
  }

  if (quantity > maxInventory) {
    errors.push({
      field: 'quantity',
      message: `Only ${maxInventory} items available`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
