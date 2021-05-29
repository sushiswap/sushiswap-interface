import { classNames } from '../functions'

const Container = ({ children, className = 'w-full max-w-2xl', ...rest }) => (
    <div className={classNames(className)} {...rest}>
        {children}
    </div>
)

export default Container
