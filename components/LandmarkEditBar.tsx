'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormInput,
  FormTextarea,
  FormSelect,
} from '@/components/ui/form';
import {
  landmarkSchema,
  type LandmarkFormValues,
} from '../lib/validations/landmark';
import { useEffect } from 'react';

interface Location {
  id: number;
  name: string;
  position: [number, number];
  visit_date?: string;
  category?: string;
  description?: string;
  is_visited?: boolean;
}

interface LandmarkEditBarProps {
  isOpen: boolean;
  onClose: () => void;
  landmark: Location | null;
  onUpdate: (landmarkId: number, data: Partial<Location>) => void;
  onDelete: (landmarkId: number) => void;
  onToggleVisited: (landmarkId: number) => void;
}

const CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'museum', label: 'Museum' },
  { value: 'park', label: 'Park' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'other', label: 'Other' },
];

export default function LandmarkEditBar({
  isOpen,
  onClose,
  landmark,
  onUpdate,
  onDelete,
  onToggleVisited,
}: LandmarkEditBarProps) {
  const form = useForm<LandmarkFormValues>({
    resolver: zodResolver(landmarkSchema),
    defaultValues: {
      name: '',
      visit_date: '',
      category: '',
      description: '',
    },
  });

  useEffect(() => {
    if (landmark) {
      // Adjust for timezone by adding the timezone offset
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toISOString().split('T')[0];
      };

      form.reset({
        name: landmark.name,
        visit_date: landmark.visit_date ? formatDate(landmark.visit_date) : '',
        category: landmark.category || '',
        description: landmark.description || '',
      });
    }
  }, [form, landmark]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!landmark) {
      console.error('No landmark available for update');
      return;
    }
    if (!landmark.id) {
      console.error('No landmark ID available for update');
      return;
    }
    onUpdate(landmark.id, data);
    onClose();
  });

  const handleDelete = () => {
    if (!landmark?.id) {
      console.error('No landmark ID available for deletion');
      return;
    }
    if (window.confirm('Are you sure you want to delete this landmark?')) {
      onDelete(landmark.id);
      onClose();
    }
  };

  const handleToggleVisited = () => {
    if (!landmark?.id) {
      console.error('No landmark ID available for toggling visited status');
      return;
    }
    onToggleVisited(landmark.id);
  };

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-[360px] bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } border-l border-gray-200 flex flex-col z-20`}
    >
      {/* Header */}
      <div className="flex-none px-6 py-6 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0">
          Edit Landmark
        </h2>
        <button
          onClick={onClose}
          className="text-2xl text-gray-900 hover:text-gray-600 p-1"
        >
          ×
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormInput {...field} placeholder="Enter landmark name" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Date</FormLabel>
                  <FormInput
                    type="date"
                    {...field}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormSelect options={CATEGORIES} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormTextarea
                    {...field}
                    placeholder="Add details about this landmark..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-none px-6 py-6 border-t border-gray-200 space-y-4">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleToggleVisited}
              className={`w-full py-3.5 px-4 text-sm font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                landmark?.is_visited
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {landmark?.is_visited ? 'Mark as Not Visited' : 'Mark as Visited'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-3.5 px-4 bg-red-600 text-white text-sm font-medium uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete Landmark
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
