import React from 'react'

import { storiesOf } from '@storybook/react'

import BoardStandalone from "../src/components/squaresSandbox/BoardStandalone";

storiesOf('Squares Sandbox', module)
  .add(
    '72 x 37',
    () => (
      <BoardStandalone
        size="12"
        cols="72"
        rows="37"/>
    )
  ).add(
  '37 x 72',
  () => (
    <BoardStandalone
      size="12"
      cols="37"
      rows="72"/>
  )
)
