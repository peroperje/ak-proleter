import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});
const preview: Preview = {
  decorators: [
    (Story) => (
      <main className={`${inter.className}`}>
        <Story />
      </main>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
