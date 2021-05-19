import { classNames } from '../functions/styling'

const Box = ({ children, className }) => <div className={classNames('p-4', className)}>{children}</div>

export default Box
