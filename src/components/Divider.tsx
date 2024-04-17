import React from 'react'

interface DividerProps {
  size: number
  border?: boolean
}

function Divider({ size, border }: DividerProps) {
  return border ? <div className={`border mt-${size} mb-${size}`} /> : <div className={`pt-${size}`} />
}

export default Divider
