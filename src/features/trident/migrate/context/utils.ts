import { v2Migration } from 'app/features/trident/migrate/context/atoms'
import { SetterOrUpdater } from 'recoil'

export const leftToSelect = (migrations: v2Migration[]): number => {
  const selected = migrations.filter((m) => m.poolToCreate || m.matchingTridentPool).length
  return migrations.length - selected
}
export const addOrRemoveFromSelectedList =
  (allSelected: v2Migration[], setter: SetterOrUpdater<v2Migration[]>) =>
  (activate: boolean, migration: v2Migration) => {
    if (activate) {
      setter([...allSelected, migration])
    } else {
      const filtered = allSelected.filter(
        (m) => m.v2Pair.liquidityToken.address !== migration.v2Pair.liquidityToken.address
      )
      setter(filtered)
    }
  }
export const migrationObjUpdater =
  (migrationToUpdate: v2Migration, allMigrations: v2Migration[], setter: SetterOrUpdater<v2Migration[]>) =>
  (editedMigration: v2Migration) => {
    const cloned = [...allMigrations]
    const indexToReplace = allMigrations.indexOf(migrationToUpdate)
    cloned[indexToReplace] = editedMigration
    setter(cloned)
  }
