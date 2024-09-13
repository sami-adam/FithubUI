import { toast } from "react-toastify";


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

export const validateInputs = (inputs=[]) => {
    var messages = [];
    inputs.forEach((input) => {
        if(input.type === "name"){
            !validateName(input.value) && messages.push(input.message || "Please enter a valid name!");
        }
        if(input.type === "text"){
            if(!input.value){
                messages.push(input.message || "Please enter a valid value!");
            }
        }
        if(input.type === "email"){
            !validateEmail(input.value) && messages.push(input.message || "Please enter a valid email!");
        }
        if(input.type === "phone"){
            !validatePhone(input.value) && messages.push(input.message || "Please enter a valid phone number!");
        }
        if(input.type === "number"){
            if(!input.value || input.value == 0){
                messages.push(input.message || "Please enter a valid number!");
            }
        }
        if(input.type === "id"){
            !validateIdentificationNumber(input.value) && messages.push(input.message || "Please enter a valid ID number!");
        }
        if(input.type === "other"){
            if(!input.value){
                messages.push(input.message || "Please enter a valid value");
            }
        }
    });
    if (messages.length > 0){
        var duration = 3;
        messages.forEach((msg) => toast.error(msg, {position: "top-center", autoClose: duration++ * 1000}));
        return false;
    }
    return true;
}