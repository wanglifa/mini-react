import React from '../core/React'
import {describe, expect, it} from 'vitest'

describe("createElement", () => {
  it("should return vdom for element", () => {
    const el = React.createElement("div", null, 'hi')
    expect(el).toEqual({
      type: 'div',
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: 'hi',
              children: []
            }
          }
        ]
      }
    })
  })
})