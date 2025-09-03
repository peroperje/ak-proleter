import React, { ReactElement } from 'react';
import Textarea, { Props as TextareaProps } from '@/app/ui/textarea';
import { RenderTextAreaProps } from './AiFormPopulator';

const TextAreaDefault: React.FC<RenderTextAreaProps & TextareaProps> = ({
  prompt,
  setPrompt,
  handleKeyPress,
  isDisabled,
  isProcessing,
  ...props
}): ReactElement => (
  <>
    <div className='min-h-52'>
      <Textarea
        rows={7}
        {...props}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isDisabled || isProcessing}
      />
      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
        Press Ctrl+Enter to extract data
      </p>
    </div>
  </>
);

export default TextAreaDefault;
