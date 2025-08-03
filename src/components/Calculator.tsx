import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <Card className="p-4">
      <div className="w-full max-w-xs mx-auto">
        <div className="bg-muted p-4 rounded-lg mb-4 text-right text-2xl font-mono">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="secondary" onClick={clearAll} className="col-span-2">
            Clear
          </Button>
          <Button variant="secondary" onClick={() => inputOperation('÷')}>÷</Button>
          <Button variant="secondary" onClick={() => inputOperation('×')}>×</Button>
          
          <Button variant="outline" onClick={() => inputNumber('7')}>7</Button>
          <Button variant="outline" onClick={() => inputNumber('8')}>8</Button>
          <Button variant="outline" onClick={() => inputNumber('9')}>9</Button>
          <Button variant="secondary" onClick={() => inputOperation('-')}>-</Button>
          
          <Button variant="outline" onClick={() => inputNumber('4')}>4</Button>
          <Button variant="outline" onClick={() => inputNumber('5')}>5</Button>
          <Button variant="outline" onClick={() => inputNumber('6')}>6</Button>
          <Button variant="secondary" onClick={() => inputOperation('+')} className="row-span-2">+</Button>
          
          <Button variant="outline" onClick={() => inputNumber('1')}>1</Button>
          <Button variant="outline" onClick={() => inputNumber('2')}>2</Button>
          <Button variant="outline" onClick={() => inputNumber('3')}>3</Button>
          
          <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2">0</Button>
          <Button variant="outline" onClick={() => inputNumber('.')}>.</Button>
          <Button variant="default" onClick={performCalculation}>=</Button>
        </div>
      </div>
    </Card>
  );
};

export default Calculator;