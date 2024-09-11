

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
}

export const validateIdentificationNumber = (id) => {
    const re = /^\d{10}$/;
    return re.test(id);
}

export const validateName = (name) => {
    // Name should not be empty and not contain any numbers or special characters
    const re = /^[a-zA-Z ]+$/;
    return re.test(name);
}