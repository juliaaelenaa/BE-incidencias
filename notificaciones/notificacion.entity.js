const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Notificacion',
  tableName: 'Notificaciones',
  columns: {
    NotificacionID: {
      type: Number,
      primary: true,
      generated: true,
    },
    UsuarioID: {
      type: Number,
    },
    Mensaje: {
      type: String,
    },
    Fecha: {
      type: 'datetime',
      default: () => 'GETDATE()',
    },
    Leida: {
      type: Boolean,
      default: false,
    },
  },
});
