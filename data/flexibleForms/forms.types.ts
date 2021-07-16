import { Resident, User, Worker } from 'types';

export interface Choice {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  question: string;
  type:
    | 'text'
    | 'textarea'
    | 'date'
    | 'radios'
    | 'checkboxes'
    | 'select'
    | 'repeater'
    | 'repeaterGroup'
    | 'timetable'
    | 'Tags'
    | 'combobox'
    | 'file';
  /** Required value is always ignored on fields with a condition */
  required?: boolean;
  hint?: string;
  error?: string;
  choices?: Choice[];
  /** Checkbox, file and repeater fields don't support prefilling */
  prefill?: keyof Resident;
  className?: string;
  /** For file fields only */
  // multiple?: boolean
  condition?: Condition | Condition[];
  subfields?: Field[];
  /** Singular item name for more descriptive buttons and legends  */
  itemName?: string;
  /** Option to start with repeater group not open by default */
  hiddenRepeater?: boolean;
}

interface Condition {
  id: string;
  value: string | boolean;
}

export interface Step {
  id: string;
  name: string;
  intro?: string;
  theme: string;
  fields: Field[];
}

export interface Form {
  id: string;
  name: string;
  steps: Step[];
  approvable?: boolean;
  groupRecordable?: boolean;
  isViewableByChildrens: boolean;
  isViewableByAdults: boolean;
  tags?: string[];
}

export interface RepeaterGroupAnswer {
  [key: string]: string | string[];
}

export interface TimetableAnswer {
  [key: string]: {
    [key: string]: string;
  };
}

export type Answer =
  | string
  | TimetableAnswer
  | (string | RepeaterGroupAnswer)[];

export interface StepAnswers {
  // questions and answers
  [key: string]: Answer;
}

export interface FlexibleAnswers {
  // sections
  [key: string]: StepAnswers;
}

export interface Submission {
  submissionId: string;
  formId: string;
  form?: Form;
  createdBy: Worker;
  createdAt: string;
  submittedBy: Worker | null;
  submittedAt: string | null;
  approvedBy: Worker | null;
  approvedAt: string | null;
  residents: Resident[];
  workers: Worker[];
  editHistory: Revision[];
  submissionState: 'In progress' | 'Approved' | 'Discarded' | 'Submitted';
  formAnswers: FlexibleAnswers;
  tags?: string[];
}

export interface Revision {
  worker: Worker;
  editTime: string;
}
