/**
 * @package privateTransaction
 * @summary  Exporting the `privateTransaction` module and making it the default export.
 */

import * as PrivateTransaction from './privateTransaction'
import { isTxIndeterminate, isTxPending, isTxSuccessful, txMinutesPending } from './privateTransaction'
export { PrivateTransaction }
export { isTxIndeterminate, isTxPending, isTxSuccessful, txMinutesPending }
