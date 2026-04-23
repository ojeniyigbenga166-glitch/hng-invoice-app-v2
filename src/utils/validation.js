export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateInvoice(data, items, isDraft = false) {
  const errors = {};

  if (!isDraft) {
    if (!data.clientName || !data.clientName.trim()) {
      errors.clientName = "Client name is required";
    }
    if (!data.clientEmail || !data.clientEmail.trim()) {
      errors.clientEmail = "Client email is required";
    } else if (!validateEmail(data.clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }
    if (!data.description || !data.description.trim()) {
      errors.description = "Project description is required";
    }
    if (!items || items.length === 0) {
      errors.items = "At least one item must be added";
    } else {
      const itemErrors = items.map((item, i) => {
        const e = {};
        if (!item.name || !item.name.trim()) e.name = "Item name is required";
        const qty = parseFloat(item.qty);
        const price = parseFloat(item.price);
        if (isNaN(qty) || qty <= 0) e.qty = "Quantity must be a positive number";
        if (isNaN(price) || price <= 0) e.price = "Price must be a positive number";
        return Object.keys(e).length > 0 ? e : null;
      });
      if (itemErrors.some(Boolean)) {
        errors.itemDetails = itemErrors;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
