"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Check, AlertCircle } from "lucide-react"
import { useContactForm } from "@/lib/webSite/use-contactForm"
import { cn } from "@/lib/utils"

interface ContactFormProps {
  content: {
    title: string;
    fullName: string;
    fullNamePlaceHolder: string;
    email: string;
    emailPlaceHolder: string;
    subjectTitle: string;
    subjectPlaceholder: string;
    subjects: string;
    message: string;
    messagePlaceHolder: string;
    buttonText: string;
  };
  isRTL: boolean;
  direction: "ltr" | "rtl";
}

// Validation rules
const VALIDATION_RULES = {
  fullName: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  message: {
    minLength: 10,
    maxLength: 1000,
  }
};

// Validation error messages
const VALIDATION_MESSAGES = {
  fullName: {
    required: "Full name is required",
    minLength: "Full name must be at least 2 characters",
    maxLength: "Full name must not exceed 50 characters",
  },
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  },
  subject: {
    required: "Please select a subject",
  },
  message: {
    required: "Message is required",
    minLength: "Message must be at least 10 characters",
    maxLength: "Message must not exceed 1000 characters",
  }
};

interface ValidationErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm({ content, isRTL, direction }: ContactFormProps) {
  const { useCreateContactForm } = useContactForm();
  const createContactMutation = useCreateContactForm();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Split the subjects string into an array
  const subjectOptions = content?.subjects.split(",").map((subject) => subject.trim());

  // Validation functions
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return VALIDATION_MESSAGES.fullName.required;
        if (value.trim().length < VALIDATION_RULES.fullName.minLength) 
          return VALIDATION_MESSAGES.fullName.minLength;
        if (value.trim().length > VALIDATION_RULES.fullName.maxLength) 
          return VALIDATION_MESSAGES.fullName.maxLength;
        break;
      
      case 'email':
        if (!value.trim()) return VALIDATION_MESSAGES.email.required;
        if (!VALIDATION_RULES.email.pattern.test(value.trim())) 
          return VALIDATION_MESSAGES.email.invalid;
        break;
      
      case 'subject':
        if (!value.trim()) return VALIDATION_MESSAGES.subject.required;
        break;
      
      case 'message':
        if (!value.trim()) return VALIDATION_MESSAGES.message.required;
        if (value.trim().length < VALIDATION_RULES.message.minLength) 
          return VALIDATION_MESSAGES.message.minLength;
        if (value.trim().length > VALIDATION_RULES.message.maxLength) 
          return VALIDATION_MESSAGES.message.maxLength;
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle blur events to mark fields as touched
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Handle select change
  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }));

    // Clear subject error when selected
    setErrors(prev => ({
      ...prev,
      subject: undefined
    }));
    setTouched(prev => ({ ...prev, subject: true }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      subject: true,
      message: true
    });

    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await createContactMutation.mutateAsync(formData);
      
      if (result.success) {
        // Reset form on success
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset validation state
        setErrors({});
        setTouched({});
        
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Determine button states
  const isSubmitting = createContactMutation.isPending;
  const isSubmitted = createContactMutation.isSuccess;
  const hasErrors = Object.keys(errors).some(key => errors[key as keyof ValidationErrors]);

  // Get message character count
  const messageLength = formData.message.length;
  const isMessageValid = messageLength >= VALIDATION_RULES.message.minLength && 
                        messageLength <= VALIDATION_RULES.message.maxLength;

  return (
    <>
      <h3 className={`text-2xl font-heading font-bold mb-4 text-wtheme-text ${isRTL ? "text-right" : "text-left"}`}>
        {content?.title}
      </h3>
      
      {/* Error message */}
      {createContactMutation.isError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className="h-4 w-4" />
            <span>Error: {createContactMutation.error?.message || 'Failed to send message'}</span>
          </div>
        </div>
      )}

      {/* Success message */}
      {createContactMutation.isSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Check className="h-4 w-4" />
            <span>Message sent successfully! We'll get back to you soon.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="fullName" className={`font-body text-wtheme-text ${isRTL ? "block text-right" : ""}`}>
              {content?.fullName} <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={() => handleBlur('fullName')}
              placeholder={content?.fullNamePlaceHolder}
              required
              className={cn(
                isRTL ? "text-right" : "",
                errors.fullName && touched.fullName ? "border-red-500 focus:border-red-500" : ""
              )}
              dir={direction}
              disabled={isSubmitting}
            />
            {errors.fullName && touched.fullName && (
              <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : ''}`}>
                {errors.fullName}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className={`font-body text-wtheme-text ${isRTL ? "block text-right" : ""}`}>
              {content?.email} <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              placeholder={content?.emailPlaceHolder}
              required
              className={cn(
                isRTL ? "text-right" : "",
                errors.email && touched.email ? "border-red-500 focus:border-red-500" : ""
              )}
              dir={direction}
              disabled={isSubmitting}
            />
            {errors.email && touched.email && (
              <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : ''}`}>
                {errors.email}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-wtheme-text">
          <label htmlFor="subject" className={`font-body text-wtheme-text ${isRTL ? "block text-right" : ""}`}>
            {content?.subjectTitle} <span className="text-red-500">*</span>
          </label>
          <Select 
            required 
            value={formData.subject}
            onValueChange={handleSubjectChange}
            disabled={isSubmitting}
          >
            <SelectTrigger 
              className={cn(
                isRTL ? "text-right" : "",
                errors.subject && touched.subject ? "border-red-500 focus:border-red-500" : ""
              )} 
              dir={direction}
            >
              <SelectValue className="text-wtheme-text" placeholder={content?.subjectPlaceholder} />
            </SelectTrigger>
            <SelectContent className="text-wtheme-text">
              {subjectOptions?.map((subject, index) => (
                <SelectItem className="text-wtheme-text" key={index} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subject && touched.subject && (
            <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : ''}`}>
              {errors.subject}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className={`font-body text-wtheme-text ${isRTL ? "block text-right" : ""}`}>
            {content?.message} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onBlur={() => handleBlur('message')}
              placeholder={content?.messagePlaceHolder}
              className={cn(
                `min-h-[120px] ${isRTL ? "text-right" : ""} text-wtheme-text`,
                errors.message && touched.message ? "border-red-500 focus:border-red-500" : ""
              )}
              required
              dir={direction}
              disabled={isSubmitting}
            />
            {/* Character counter */}
            <div className={`absolute bottom-2 ${isRTL ? 'left-3' : 'right-3'} text-xs ${
              messageLength < VALIDATION_RULES.message.minLength ? 'text-red-500' : 
              messageLength > VALIDATION_RULES.message.maxLength ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {messageLength}/{VALIDATION_RULES.message.maxLength}
            </div>
          </div>
          {errors.message && touched.message && (
            <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : ''}`}>
              {errors.message}
            </p>
          )}
          {/* Helper text for message requirements */}
          {!errors.message && (
            <p className={`text-xs text-gray-500 ${isRTL ? 'text-right' : ''}`}>
              Message must be between {VALIDATION_RULES.message.minLength} and {VALIDATION_RULES.message.maxLength} characters
            </p>
          )}
        </div>
        
        <Button
          type="submit"
          className={cn(
            `w-full bg-primary text-wtheme-text font-accent ${isRTL ? "flex flex-row-reverse justify-center" : ""}`,
            hasErrors ? "opacity-50 cursor-not-allowed" : ""
          )}
          disabled={isSubmitting || hasErrors}
        >
          {isSubmitting ? (
            <>
              <Send className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4 animate-pulse ${isRTL ? "rotate-180" : ""}`} />
              Sending...
            </>
          ) : isSubmitted ? (
            <>
              {content?.buttonText} <Check className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
            </>
          ) : (
            <>
              {content?.buttonText}{" "}
              <Send className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
        </Button>

        {/* Form validation summary */}
        {hasErrors && Object.keys(touched).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className={`text-sm font-medium text-red-800 ${isRTL ? 'text-right' : ''}`}>
                  Please fix the following errors:
                </p>
                <ul className={`text-sm text-red-700 mt-1 ${isRTL ? 'text-right' : ''}`}>
                  {Object.entries(errors).map(([field, error]) => (
                    error && (
                      <li key={field} className="list-disc list-inside">
                        {error}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  )
}