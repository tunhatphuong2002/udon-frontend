import React from 'react';
import { useCounterSelector } from '@/store/selectors/counter.selector';
import { Button } from '@/components/ui/button';

export const Counter: React.FC = () => {
  const { count, increment, decrement, reset, incrementBy } = useCounterSelector();

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Counter: {count}</h2>

      <div className="flex space-x-2">
        <Button onClick={decrement} variant="outline" size="small">
          -
        </Button>
        <Button onClick={increment} variant="primary" size="small">
          +
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button onClick={() => incrementBy(5)} variant="secondary">
          +5
        </Button>
        <Button onClick={reset} variant="outline">
          Reset
        </Button>
      </div>

      <p className="text-sm text-gray-500 mt-2">This counter is persisted in localStorage</p>
    </div>
  );
};

export default Counter;
