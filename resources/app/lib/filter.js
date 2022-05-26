export const filterUnique = (compare = 'id') => (item, i, items) => (
  i === 0 || i === items.findIndex(it => it[compare] === item[compare])
)
