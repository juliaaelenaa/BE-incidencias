const { getRepository } = require('typeorm');

class NotificacionesService {
  constructor() {
    this.repo = getRepository('Notificacion');
  }

  async create(data) {
    const nueva = this.repo.create(data);
    return await this.repo.save(nueva);
  }

  async findByUsuario(usuarioId) {
    return await this.repo.find({
      where: { UsuarioID: usuarioId },
      order: { Fecha: 'DESC' },
    });
  }
}

module.exports = new NotificacionesService();
