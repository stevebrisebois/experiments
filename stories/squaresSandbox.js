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
  ).add(
    '11 squares',
    () => (
      <img
        width={72 * 12}
        height={37 * 12}
        src="https://screenshots.scolab.com/Public/Jing/SB/chrome_2018-12-14_16-08-06.png"
      />
    )
)




