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
} from '@/components/ui/form';
import {
  planFormSchema,
  type PlanFormValues,
  getMinDate,
} from '@/lib/validations/plan';
import { useEffect } from 'react';

interface Location {
  position: [number, number];
  name: string;
  visit_date?: string;
}

interface SidebarProps {
  isOpen: boolean;
  locations: Location[];
  onLocationNameChange: (position: [number, number], name: string) => void;
  onLocationDateChange: (position: [number, number], date: string) => void;
  onFinish: () => void;
  onCancel: () => void;
  planName: string;
  onPlanNameChange: (name: string) => void;
  onLocationDelete: (position: [number, number]) => void;
}

export default function Sidebar({
  isOpen,
  locations,
  onLocationNameChange,
  onLocationDateChange,
  onFinish,
  onCancel,
  planName,
  onPlanNameChange,
  onLocationDelete,
}: SidebarProps) {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      planName: '',
      locations: [],
    },
  });

  // Sync external state with form state
  useEffect(() => {
    form.reset({
      planName,
      locations,
    });
  }, [form, planName, locations]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      for (const location of locations) {
        if (!location.visit_date || location.visit_date === '') {
          alert('Please enter a visit date for all locations');
          return;
        }
      }

      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.planName,
          landmarks: locations.map((loc) => ({
            name: loc.name,
            position: loc.position,
            visit_date: loc.visit_date,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create plan');
      }

      onFinish();
    } catch (error) {
      console.error('Error creating plan:', error);
      // You might want to add error handling UI here
    }
  });

  const minDate = getMinDate();

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-[360px] bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } border-l border-gray-200 flex flex-col z-20`}
    >
      {/* Header */}
      <div className="flex-none px-6 py-6 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0">
          Create New Plan
        </h2>
        <button
          onClick={onCancel}
          className="text-2xl text-gray-900 hover:text-gray-600 p-1"
        >
          ×
        </button>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-[calc(100%-73px)]"
        >
          {/* Plan Name Section */}
          <div className="flex-none px-6 py-6 border-b border-gray-200">
            <FormField
              control={form.control}
              name="planName"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 border border-gray-200">
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Plan Name
                  </FormLabel>
                  <FormInput
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter plan name"
                    onChange={(e) => {
                      field.onChange(e);
                      onPlanNameChange(e.target.value);
                    }}
                    className="mt-2 w-full border border-gray-200 bg-white focus:ring-0 focus:border-gray-400"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Scrollable Locations Section */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Locations
            </div>

            <div className="space-y-4">
              {locations.map((location, index) => (
                <FormField
                  key={`${location.position[0]}-${location.position[1]}`}
                  control={form.control}
                  name={`locations.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="bg-gray-50 p-4 border border-gray-200 relative">
                      <div className="flex justify-between items-start mb-2">
                        <FormInput
                          {...field}
                          value={field.value || ''}
                          placeholder={`Location ${index + 1}`}
                          onChange={(e) => {
                            field.onChange(e);
                            onLocationNameChange(
                              location.position,
                              e.target.value
                            );
                          }}
                          className="w-full border border-gray-200 bg-white focus:ring-0 focus:border-gray-400"
                        />
                      </div>
                      <FormMessage />
                      <div className="mt-2">
                        <FormLabel className="text-sm font-medium text-gray-900">
                          Visit Date
                        </FormLabel>
                        <FormField
                          control={form.control}
                          name={`locations.${index}.visit_date`}
                          render={({ field }) => (
                            <>
                              <FormInput
                                type="date"
                                min={minDate}
                                value={field.value || ''}
                                onChange={(e) => {
                                  field.onChange(e);
                                  onLocationDateChange(
                                    location.position,
                                    e.target.value
                                  );
                                }}
                                className="mt-1 w-full border border-gray-200 bg-white focus:ring-0 focus:border-gray-400"
                              />
                              <FormMessage />
                            </>
                          )}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="mt-2 text-xs text-gray-500 font-mono">
                          {location.position[0].toFixed(6)},{' '}
                          {location.position[1].toFixed(6)}
                        </div>
                        <button
                          type="button"
                          onClick={() => onLocationDelete(location.position)}
                          className="ml-2 text-gray-600 hover:text-gray-800 cursor-pointer active:scale-95 duration-300 transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {locations.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-6">
                Click on the map to add locations
              </p>
            )}
          </div>

          {/* Footer with Button */}
          {locations.length > 0 && (
            <div className="flex-none px-6 py-6 border-t border-gray-200 bg-white">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
              >
                Finish Plan
              </button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
