import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Eye, EyeOff, Lock } from "react-feather";
import { toast } from "react-toastify";  
import logo from "../../../assets/images/logo.png";
import { axiosPrivetInstance, CHANGE_PASS } from "../../../Services/Urls/Urls";
import { PASSWORD_VALIDATION } from "../../../Services/Valdition";

 

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = PASSWORD_VALIDATION.required;
    } else if (!PASSWORD_VALIDATION.pattern.value.test(formData.newPassword)) {
      newErrors.newPassword = PASSWORD_VALIDATION.pattern.message;
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = "New password must be different from old password";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { oldPassword, newPassword, confirmPassword } = formData;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axiosPrivetInstance.put(CHANGE_PASS, {
        oldPassword,
        newPassword,
        confirmNewPassword: confirmPassword,  
      });

      toast.success(response.data.message || "Password changed successfully");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <div className="w-100">
          {logo && (
            <div className="d-flex justify-content-center mb-3">
              <img src={logo} width={250} alt="Logo" className="img-fluid" />
            </div>
          )}
          <Modal.Title className="h4 mb-2">Change Your Password</Modal.Title>
          <p className="text-muted small">Enter your details below</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit} noValidate>
          {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>
                {field === "oldPassword"
                  ? "Old Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"}
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Lock size={18} />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`${errors[field] ? "is-invalid" : ""} border-start-0`}
                  disabled={isLoading}
                />
                <InputGroup.Text
                  role="button"
                  onClick={() => togglePasswordVisibility(field)}
                  className="bg-white border-start-0"
                >
                  {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                </InputGroup.Text>
                {errors[field] && (
                  <Form.Control.Feedback type="invalid">
                    {errors[field]}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
          ))}

          <div className="d-grid">
            <Button variant="success" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
