import { Form } from 'data/flexibleForms/forms.types';
import { Resident } from 'types';
import {
  truncate,
  groupByTheme,
  pushUnique,
  generateInitialValues,
  getTotalHours,
} from './utils';

describe('truncate', () => {
  it('leaves short text unaltered', () => {
    expect(truncate('Example input', 2)).toBe('Example input');
  });
  it('truncates longer text', () => {
    expect(truncate('Example input example input', 2)).toBe('Example input...');
  });
});

const form: Form = {
  id: '1',
  name: 'Example form',
  isViewableByAdults: true,
  isViewableByChildrens: true,
  steps: [
    {
      id: '1',
      name: 'First example step',
      fields: [],
      theme: 'First theme',
    },
    {
      id: '2',
      name: 'Second example step',
      fields: [],
      theme: 'First theme',
    },
    {
      id: '3',
      name: 'Second example step',
      fields: [],
      theme: 'Second theme',
    },
  ],
};

describe('groupByTheme', () => {
  it('themes things correctly', () => {
    const result = groupByTheme(form);
    expect(result[0].name).toEqual('First theme');
    expect(result[0].steps.length).toEqual(2);
    expect(result[1].name).toEqual('Second theme');
    expect(result[1].steps.length).toEqual(1);
  });
});

describe('pushUnique', () => {
  it('removes duplicates', () => {
    const result = pushUnique(['one', 'two', 'three', 'three'], 'three');
    expect(result).toEqual(['one', 'two', 'three']);
  });

  it('leaves arrays without duplicates alone', () => {
    const result = pushUnique(['one', 'two', 'three', 'four'], 'five');
    expect(result).toEqual(['one', 'two', 'three', 'four', 'five']);
  });
});

describe('generateInitialValues', () => {
  it('correctly handles different field types', () => {
    const result = generateInitialValues(
      [
        {
          id: 'one',
          question: '',
          type: 'text',
        },
        {
          id: 'two',
          question: '',
          type: 'checkboxes',
        },
        {
          id: 'three',
          question: '',
          type: 'repeater',
        },
        {
          id: 'four',
          question: '',
          type: 'file',
        },
        {
          id: 'five',
          question: '',
          type: 'select',
          choices: [
            {
              value: 'blah',
              label: '',
            },
          ],
        },
        {
          id: 'six',
          question: '',
          type: 'timetable',
        },
        {
          id: 'seven',
          question: '',
          type: 'repeaterGroup',
          subfields: [
            {
              id: 'eight',
              question: '',
              type: 'text',
            },
          ],
        },
        {
          id: 'nine',
          question: '',
          type: 'datetime',
        },
      ],
      undefined
    );

    expect(result).toMatchObject({
      one: '',
      two: [],
      three: [],
      four: null,
      five: 'blah',
      six: {},
      seven: [
        {
          eight: '',
        },
      ],
      nine: [],
    });
  });

  it("prefills if there's data available", () => {
    const result = generateInitialValues(
      [
        {
          id: 'foo',
          question: '',
          type: 'text',
          prefill: 'one' as keyof Resident,
        },
        {
          id: 'bar',
          question: '',
          type: 'select',
          prefill: 'one' as keyof Resident,
        },
        {
          id: 'su',
          question: '',
          type: 'text',
          prefill: 'two' as keyof Resident,
        },
      ],
      { one: 'example value' } as unknown as Resident
    );

    expect(result).toMatchObject({
      foo: 'example value',
      bar: 'example value',
      su: '',
    });
  });

  it('generates an empty array if the repeater field is to start hidden', () => {
    const result = generateInitialValues(
      [
        {
          id: 'one',
          question: '',
          type: 'repeaterGroup',
          hiddenRepeater: true,
          subfields: [
            {
              id: 'two',
              question: '',
              type: 'text',
            },
          ],
        },
      ],
      undefined
    );

    expect(result).toMatchObject({ one: [] });
  });

  it('applies a default value to a string-type or a datetime field', () => {
    const result = generateInitialValues([
      {
        id: 'foo',
        question: '',
        type: 'text',
        default: 'bar',
      },
      {
        id: 'one',
        question: '',
        type: 'datetime',
        default: 'two',
      },
    ]);
    expect(result).toMatchObject({ foo: 'bar', one: 'two' });
  });
});

describe('getTotalHours', () => {
  it('correctly calculates hours', () => {
    const result = getTotalHours({
      foo: {
        foo: '1',
        bar: '3',
      },
      bar: {
        foo: '5',
      },
    });
    expect(result).toBe(9);
  });
});
