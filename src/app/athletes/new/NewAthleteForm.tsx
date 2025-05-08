'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/ui/button';
import InputField from '@/app/ui/input-field';
import * as yup from 'yup';
import { createAthlete } from './actions';

// Define validation schema using yup
const athleteSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female'], 'Gender must be male or female').required('Gender is required'),
  email: yup.string().email('Invalid email format').optional(),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  emergencyContact: yup.string().optional(),
  categories: yup.array().of(yup.string()).optional(),
  notes: yup.string().optional(),
  photoUrl: yup.string().url('Invalid URL format').optional(),
});

export default function NewAthleteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    categories: [''],
    notes: '',
    photoUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when it's changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCategories = [...formData.categories];
    newCategories[index] = e.target.value;
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, '']
    }));
  };

  const removeCategory = (index: number) => {
    const newCategories = [...formData.categories];
    newCategories.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      categories: newCategories.length ? newCategories : ['']
    }));
  };

  const validateForm = async () => {
    try {
      await athleteSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach(err => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Convert date string to Date object for validation
      const formattedData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth),
        // Filter out empty categories
        categories: formData.categories.filter(cat => cat.trim() !== '')
      };

      // Call server action to create athlete
      const result = await createAthlete(formattedData);

      if (result.error) {
        setServerError(result.error);
      } else {
        // Redirect to athletes page on success
        router.push('/athletes');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {serverError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputField
            type="text"
            name="firstName"
            title="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
        </div>
        <div>
          <InputField
            type="text"
            name="lastName"
            title="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputField
            type="date"
            name="dateOfBirth"
            title="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputField
            type="email"
            name="email"
            title="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        <div>
          <InputField
            type="tel"
            name="phone"
            title="Phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
      </div>

      <InputField
        type="text"
        name="address"
        title="Address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
      />

      <InputField
        type="text"
        name="emergencyContact"
        title="Emergency Contact"
        value={formData.emergencyContact}
        onChange={handleChange}
        error={errors.emergencyContact}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categories
        </label>
        {formData.categories.map((category, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={category}
              onChange={(e) => handleCategoryChange(e, index)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={formData.categories.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Category
        </button>
        {errors.categories && (
          <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
        )}
      </div>

      <InputField
        type="url"
        name="photoUrl"
        title="Photo URL"
        value={formData.photoUrl}
        onChange={handleChange}
        error={errors.photoUrl}
      />

      <div className="flex justify-between mt-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.push('/athletes')}
        >
          Cancel
        </Button>
        <Button
          variant="submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Athlete'}
        </Button>
      </div>
    </form>
  );
}
