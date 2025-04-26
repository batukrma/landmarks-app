'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';

interface Landmark {
  id: number;
  is_visited: boolean;
}

interface Plan {
  id: number;
  name: string;
  created_at: string;
  is_completed?: boolean;
}

interface PlansBarProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (planId: number) => void;
}

export default function PlansBar({
  isOpen,
  onClose,
  onPlanSelect,
}: PlansBarProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch plans
        const plansResponse = await fetch('/api/plans');
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch plans');
        }
        const plansData = await plansResponse.json();

        // For each plan, fetch its landmarks and check completion status
        const plansWithStatus = await Promise.all(
          plansData.map(async (plan: Plan) => {
            const landmarksResponse = await fetch(
              `/api/plans/${plan.id}/landmarks`
            );
            if (!landmarksResponse.ok) {
              throw new Error(`Failed to fetch landmarks for plan ${plan.id}`);
            }
            const landmarks = await landmarksResponse.json();
            const isCompleted =
              landmarks.length > 0 &&
              landmarks.every((landmark: Landmark) => landmark.is_visited);
            return { ...plan, is_completed: isCompleted };
          })
        );

        setPlans(plansWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plans');
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-[360px] bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } border-l border-gray-200 flex flex-col z-20`}
    >
      {/* Header */}
      <div className="flex-none px-6 py-6 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0">My Plans</h2>
        <button
          onClick={onClose}
          className="text-2xl text-gray-900 hover:text-gray-600 p-1"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : plans.length === 0 ? (
          <div className="text-gray-500 text-center">No plans found</div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => onPlanSelect(plan.id)}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{plan.name}</h3>
                  {plan.is_completed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg
                        className="mr-1.5 h-2 w-2 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Created on{' '}
                  {new Date(plan.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
