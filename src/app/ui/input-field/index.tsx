import React, { ReactElement, InputHTMLAttributes} from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>,'className'>  {
    title: string;
    error?: string;
}
const InputField: React.FC<Props> = ({error, title, ...restProps}): ReactElement=> <>

    <div className="max-w-sm">
        <label
            htmlFor="input-label"
            className="block text-sm font-bold dark:text-white">
            {title}
        </label>
        <input   id="input-label"
               className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
               placeholder="you@site.com"
            {...restProps}
        />
        <p className="text-sm text-red-600 mt-2" id="hs-validation-name-error-helper">Please enter a valid email
            address.</p>
    </div>
</>

export default InputField;
