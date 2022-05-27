import CrudCompact from '../../../components/crud-compact'

export default () => {
  return (
    <CrudCompact
      pkey="userid"
      title="Users"
      resource="/api/adm/user"
      history={true}
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
          wrap: false,
          input: {
            required: true,
            minlength: 3,
            maxlength: 64,
          }
        },
        email: {
          input: {
            type: 'email',
          }
        },
        password: {
          wrap: false,
          input: {
            type: 'password',
            minlength: 5,
            maxlength: 8,
          }
        },
        joindt: {
          label: 'Join Date',
          input: {
            plain: true,
          }
        },
        active: {
          input: {
            type: 'checkbox',
            value: 1,
          }
        },
      }} />
  )
}
