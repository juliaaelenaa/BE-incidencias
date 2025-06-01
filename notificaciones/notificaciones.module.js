const { Module } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const NotificacionesService = require('./notificaciones.service');
const NotificacionesController = require('./notificaciones.controller');
const Notificacion = require('./notificacion.entity');

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  controllers: [NotificacionesController],
  providers: [
    {
      provide: NotificacionesService,
      useFactory: (repo) => new NotificacionesService(repo),
      inject: ['NotificacionRepository'],
    },
  ],
})
export class NotificacionesModule {}
