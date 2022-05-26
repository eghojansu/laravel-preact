import CrudCompact from '../../../components/crud-compact'

export default () => {
  return (
    <CrudCompact
      pkey="userid"
      title="Users"
      resource="/api/adm/user"
      gridBase={{
        width: 4,
        wrap: true,
      }}
      grid={{
        userid: {
          label: 'ID',
          width: 5,
          input: {
            type: 'cursor',
            required: true,
            minlength: 3,
            maxlength: 8,
          }
        },
        name: {
          input: {
            required: true,
            minlength: 3,
            maxlength: 64,
          }
        },
      }} />
  )
}
