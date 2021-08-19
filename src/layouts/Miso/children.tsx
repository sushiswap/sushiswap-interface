import React from 'react'

const childrenWithProps = (children: any, props?: any) =>
  React.Children.map(children.props.children, (child) => {
    return React.cloneElement(child, props)
  })
export default childrenWithProps
