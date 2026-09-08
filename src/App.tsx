/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FamilyProvider } from './context/FamilyContext';
import { MobileContainer } from './components/MobileContainer';

export default function App() {
  return (
    <FamilyProvider>
      <MobileContainer />
    </FamilyProvider>
  );
}

