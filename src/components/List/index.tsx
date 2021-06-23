import { classNames } from '../../functions'

interface ItemProps {
  item: unknown
  className?: string
}

export function Item({ item, className }: ItemProps) {
  return (
    <li className={classNames('px-4 py-4 overflow-hidden bg-white shadow sm:px-6 sm:rounded-md', className)}>{item}</li>
  )
}

interface ListProps {
  items: unknown[]
  className?: string
}

function List({ items, className }: ListProps) {
  return (
    <ul className={classNames('space-y-3', className)}>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </ul>
  )
}

List.Item = Item

export default List
